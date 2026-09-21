"""Management commands: create_initial_admin and seed_demo_data."""

from __future__ import annotations

import pytest
from django.core.management import call_command
from django.core.management.base import CommandError

from apps.accounts.models import User
from apps.content.models import FAQ, Artist, Service, ServiceEntry, SiteSettings

pytestmark = pytest.mark.django_db

STRONG = "Str0ng-Admin-Password!2026"


class TestCreateInitialAdmin:
    def test_creates_super_admin_from_env(self, monkeypatch):
        monkeypatch.setenv("ADMIN_EMAIL", "owner@ananta-events.com")
        monkeypatch.setenv("ADMIN_PASSWORD", STRONG)
        call_command("create_initial_admin", "--no-input")
        user = User.objects.get(email="owner@ananta-events.com")
        assert user.role == User.Role.SUPER_ADMIN
        assert user.is_staff and user.is_superuser
        assert user.check_password(STRONG)

    def test_command_is_idempotent_and_rotates_password(self, monkeypatch):
        monkeypatch.setenv("ADMIN_EMAIL", "owner@ananta-events.com")
        monkeypatch.setenv("ADMIN_PASSWORD", STRONG)
        call_command("create_initial_admin", "--no-input")
        monkeypatch.setenv("ADMIN_PASSWORD", "Rotated-Password!2026")
        call_command("create_initial_admin", "--no-input")
        assert User.objects.filter(email="owner@ananta-events.com").count() == 1
        assert User.objects.get(email="owner@ananta-events.com").check_password(
            "Rotated-Password!2026"
        )

    def test_requires_credentials_with_no_input(self):
        with pytest.raises(CommandError):
            call_command("create_initial_admin", "--no-input", email="")

    def test_refuses_weak_password(self, monkeypatch):
        monkeypatch.setenv("ADMIN_EMAIL", "weak@ananta-events.com")
        monkeypatch.setenv("ADMIN_PASSWORD", "password")
        with pytest.raises(CommandError):
            call_command("create_initial_admin", "--no-input")

    def test_refuses_invalid_email(self, monkeypatch):
        monkeypatch.setenv("ADMIN_EMAIL", "not-an-email")
        monkeypatch.setenv("ADMIN_PASSWORD", STRONG)
        with pytest.raises(CommandError):
            call_command("create_initial_admin", "--no-input")

    def test_promotes_an_existing_account(self, monkeypatch):
        User.objects.create_user(email="existing@ananta-events.com", password="Old-Password!2026")
        monkeypatch.setenv("ADMIN_EMAIL", "existing@ananta-events.com")
        monkeypatch.setenv("ADMIN_PASSWORD", STRONG)
        call_command("create_initial_admin", "--no-input")
        user = User.objects.get(email="existing@ananta-events.com")
        assert user.is_super_admin and user.is_active


class TestSeedDemoData:
    def test_seeds_all_content(self):
        call_command("seed_demo_data")
        assert SiteSettings.objects.count() == 1
        assert Service.objects.filter(slug="special-events").exists()
        assert ServiceEntry.objects.filter(slug="award-show").exists()
        assert Artist.objects.count() > 20
        assert FAQ.objects.count() >= 5

    def test_special_event_entries_keep_their_content(self):
        call_command("seed_demo_data")
        entry = ServiceEntry.objects.get(slug="award-show")
        assert entry.stats and entry.features and entry.highlights
        assert entry.gallery.count() >= 4
        assert entry.cta_button_label

    def test_is_idempotent(self):
        call_command("seed_demo_data")
        counts = (Service.objects.count(), Artist.objects.count(), ServiceEntry.objects.count())
        call_command("seed_demo_data")
        assert (
            Service.objects.count(),
            Artist.objects.count(),
            ServiceEntry.objects.count(),
        ) == counts

    def test_skip_existing_does_not_overwrite(self):
        call_command("seed_demo_data")
        service = Service.objects.get(slug="special-events")
        service.name = "Renamed by admin"
        service.save(update_fields=["name"])
        call_command("seed_demo_data", "--skip-existing")
        service.refresh_from_db()
        assert service.name == "Renamed by admin"

    def test_reset_rebuilds_content(self):
        call_command("seed_demo_data")
        call_command("seed_demo_data", "--reset")
        assert Service.objects.count() == 8
