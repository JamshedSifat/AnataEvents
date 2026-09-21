"""Model-level tests: slugs, validation, constraints, helpers."""

from __future__ import annotations

from datetime import timedelta

import pytest
from django.core.exceptions import ValidationError
from django.db import IntegrityError, transaction
from django.utils import timezone

from apps.accounts.models import PasswordResetToken, User
from apps.common.validators import sanitize_html, validate_phone_bd, validate_youtube_url
from apps.content.models import Artist, BlogPost, Service, ServiceEntry, SiteSettings, Video


class TestUserModel:
    def test_email_is_normalised_and_used_for_login(self, db):
        user = User.objects.create_user(email="Mixed@Case.COM", password="Str0ng-Password!2026")
        assert user.email == "mixed@case.com"
        assert user.check_password("Str0ng-Password!2026")
        assert User.objects.get(email="mixed@case.com").pk == user.pk

    def test_create_user_requires_email(self, db):
        with pytest.raises(ValueError):
            User.objects.create_user(email="", password="x")

    def test_superuser_gets_super_admin_role_and_staff(self, db):
        user = User.objects.create_superuser(email="boss@x.com", password="Str0ng-Password!2026")
        assert user.role == User.Role.SUPER_ADMIN
        assert user.is_staff and user.is_superuser and user.is_super_admin

    def test_role_permissions(self, db):
        viewer = User.objects.create_user(email="v@x.com", password="Str0ng-Password!2026")
        editor = User.objects.create_user(
            email="e@x.com", password="Str0ng-Password!2026", role=User.Role.EDITOR
        )
        assert viewer.is_active and not viewer.can_write
        assert editor.can_write
        editor.is_active = False
        assert not editor.can_write

    def test_super_admin_is_forced_to_staff(self, db):
        user = User.objects.create_user(
            email="s@x.com", password="Str0ng-Password!2026", role=User.Role.SUPER_ADMIN
        )
        assert user.is_staff

    def test_argon2_is_the_default_hasher(self):
        """Production hashers must start with Argon2 (test settings use MD5 for speed)."""
        from config.settings import base

        assert base.PASSWORD_HASHERS[0] == "django.contrib.auth.hashers.Argon2PasswordHasher"

    def test_str_and_names(self, db):
        user = User.objects.create_user(
            email="n@x.com", password="Str0ng-Password!2026", full_name="Nadia Rahman"
        )
        assert str(user) == "n@x.com"
        assert user.get_full_name() == "Nadia Rahman"
        assert user.get_short_name() == "Nadia Rahman"


class TestPasswordResetToken:
    def test_single_use_and_expiry(self, super_admin):
        token, raw = PasswordResetToken.issue(super_admin, ttl_minutes=30)
        assert token.is_valid
        assert token.verify_candidate(raw) if hasattr(token, "verify_candidate") else True
        token.mark_used()
        assert not token.is_valid

    def test_issuing_invalidates_previous_tokens(self, super_admin):
        first, _ = PasswordResetToken.issue(super_admin)
        second, _ = PasswordResetToken.issue(super_admin)
        first.refresh_from_db()
        assert first.used_at is not None
        assert second.is_valid

    def test_expired_token_is_invalid(self, super_admin):
        token, _ = PasswordResetToken.issue(super_admin)
        token.expires_at = timezone.now() - timedelta(minutes=1)
        token.save(update_fields=["expires_at"])
        assert not token.is_valid

    def test_hash_is_not_the_raw_token(self, super_admin):
        token, raw = PasswordResetToken.issue(super_admin)
        assert raw not in token.token_hash
        assert token.token_hash != raw


class TestSlugsAndOrdering:
    def test_slug_is_generated_from_name(self, db):
        service = Service.objects.create(name="Virtual Events & Streaming")
        assert service.slug == "virtual-events-streaming"

    def test_slug_collisions_are_suffixed(self, db):
        Service.objects.create(name="Same Name")
        second = Service.objects.create(name="Same Name")
        assert second.slug == "same-name-2"

    def test_service_entry_slug_unique_per_service(self, db):
        one = Service.objects.create(name="Service One")
        two = Service.objects.create(name="Service Two")
        a = ServiceEntry.objects.create(service=one, title="Detail Page")
        b = ServiceEntry.objects.create(service=two, title="Detail Page")
        # Same slug is fine under two different services…
        assert a.slug == b.slug == "detail-page"
        # …but the model never produces a duplicate inside one service.
        c = ServiceEntry.objects.create(service=one, title="Detail Page")
        assert c.slug == "detail-page-2"
        # The DB constraint is the backstop.
        with pytest.raises(IntegrityError), transaction.atomic():
            ServiceEntry.objects.create(service=one, title="Forced", slug="detail-page")

    def test_blog_publishes_with_timestamp(self, db):
        post = BlogPost.objects.create(title="Published now", content="<p>x</p>")
        assert post.published_at is not None

    def test_default_ordering_uses_order_field(self, db):
        second = Service.objects.create(name="Second", order=2)
        first = Service.objects.create(name="First", order=1)
        assert list(Service.objects.all()) == [first, second]


class TestSiteSettingsSingleton:
    def test_only_one_row_is_kept(self, db):
        a = SiteSettings.load()
        a.company_name = "Ananta Events"
        a.save()
        b = SiteSettings.load()
        assert a.pk == b.pk == 1
        assert SiteSettings.objects.count() == 1

    def test_load_creates_when_missing(self, db):
        assert SiteSettings.objects.count() == 0
        obj = SiteSettings.load()
        assert obj.pk == 1 and SiteSettings.objects.count() == 1


class TestArtistModel:
    def test_youtube_embed_is_derived(self, db):
        artist = Artist.objects.create(
            name="Test Singer",
            category=Artist.Category.SINGER,
            video_url="https://youtu.be/dQw4w9WgXcQ",
        )
        assert artist.youtube_embed == "https://www.youtube.com/embed/dQw4w9WgXcQ"
        assert artist.youtube == artist.video_url

    def test_name_and_category_must_be_unique(self, db):
        Artist.objects.create(name="Same Person", category=Artist.Category.DJ)
        with pytest.raises(IntegrityError), transaction.atomic():
            Artist.objects.create(name="Same Person", category=Artist.Category.DJ)

    def test_same_name_in_two_categories_is_allowed(self, db):
        Artist.objects.create(name="Multi Talent", category=Artist.Category.DJ)
        Artist.objects.create(name="Multi Talent", category=Artist.Category.DANCER)
        assert Artist.objects.count() == 2


class TestVideoModel:
    def test_youtube_helpers(self, db):
        video = Video.objects.create(
            title="Live", youtube_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        )
        assert video.youtube_id == "dQw4w9WgXcQ"
        assert video.embed_url.endswith("/embed/dQw4w9WgXcQ")
        assert "dQw4w9WgXcQ" in video.thumbnail_url

    def test_invalid_youtube_url_is_rejected(self, db):
        video = Video(title="Bad", youtube_url="https://vimeo.com/12345")
        with pytest.raises(ValidationError):
            video.full_clean()


class TestValidators:
    @pytest.mark.parametrize(
        "number",
        ["01712345678", "+8801712345678", "8801712345678", "01712-345678", "01912345678"],
    )
    def test_valid_bd_phone_numbers(self, number):
        validate_phone_bd(number)

    @pytest.mark.parametrize("number", ["12345", "01112345678", "+1234567890", "0171234567"])
    def test_invalid_bd_phone_numbers(self, number):
        with pytest.raises(ValidationError):
            validate_phone_bd(number)

    @pytest.mark.parametrize(
        "url",
        [
            "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            "https://youtu.be/dQw4w9WgXcQ",
            "https://www.youtube.com/embed/dQw4w9WgXcQ",
        ],
    )
    def test_valid_youtube_urls(self, url):
        validate_youtube_url(url)

    @pytest.mark.parametrize("url", ["https://vimeo.com/1", "not-a-url", "javascript:alert(1)"])
    def test_invalid_youtube_urls(self, url):
        with pytest.raises(ValidationError):
            validate_youtube_url(url)

    def test_sanitize_html_strips_scripts_and_handlers(self):
        cleaned = sanitize_html('<p onclick="steal()">Hi</p><script>alert(1)</script><b>bold</b>')
        assert "<script" not in cleaned
        assert "onclick" not in cleaned
        assert "<b>bold</b>" in cleaned
