"""Authentication: login, throttling/lockout, refresh rotation, logout, passwords."""

from __future__ import annotations

import pytest
from django.conf import settings
from django.core import mail
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken

from apps.accounts.models import AdminActionLog, LoginAttempt, PasswordResetToken
from apps.common.validators import validate_phone_bd  # noqa: F401  (keeps import groups tidy)
from tests.conftest import STRONG_PASSWORD

pytestmark = pytest.mark.django_db

LOGIN_URL = "/api/auth/login/"
REFRESH_URL = "/api/auth/refresh/"
LOGOUT_URL = "/api/auth/logout/"


def login(api, email="super@ananta-events.com", password=STRONG_PASSWORD, **extra):
    return api.post(LOGIN_URL, {"email": email, "password": password, **extra}, format="json")


class TestLogin:
    def test_login_success_returns_access_and_cookie(self, api, super_admin):
        response = login(api)
        assert response.status_code == 200
        assert response.data["access"]
        assert response.data["user"]["email"] == super_admin.email
        assert response.data["user"]["role"] == "super_admin"
        assert "ananta_refresh" in response.cookies
        cookie = response.cookies["ananta_refresh"]
        assert cookie["httponly"] is True
        assert cookie["path"] == settings.REFRESH_COOKIE_PATH

    def test_login_sets_expiry_and_updates_last_login(self, api, super_admin):
        assert super_admin.last_login is None
        response = login(api)
        assert response.data["expires_in"] <= 15 * 60
        super_admin.refresh_from_db()
        assert super_admin.last_login is not None

    def test_wrong_password_and_unknown_email_are_indistinguishable(self, api, super_admin):
        wrong_password = login(api, password="Definitely-Wrong-1")
        unknown = login(api, email="nobody@ananta-events.com")
        assert wrong_password.status_code == unknown.status_code == 401
        assert (
            wrong_password.data["detail"] == unknown.data["detail"] == "Invalid email or password."
        )

    def test_inactive_user_is_rejected_generically(self, api, inactive_user):
        response = login(api, email=inactive_user.email)
        assert response.status_code == 401
        assert response.data["detail"] == "Invalid email or password."

    def test_login_attempts_are_recorded(self, api, super_admin):
        login(api)
        login(api, password="nope-nope-nope")
        assert LoginAttempt.objects.filter(success=True).count() == 1
        assert LoginAttempt.objects.filter(success=False).count() == 1

    def test_successful_and_failed_logins_are_audited(self, api, super_admin):
        login(api)
        login(api, password="nope-nope-nope")
        actions = set(AdminActionLog.objects.values_list("action", flat=True))
        assert "login" in actions and "login_failed" in actions

    def test_honeypot_field_blocks_bots(self, api, super_admin):
        response = login(api, website="http://spam.example")
        assert response.status_code == 400

    def test_missing_fields_return_validation_errors(self, api):
        response = api.post(LOGIN_URL, {"email": "not-an-email"}, format="json")
        assert response.status_code == 400
        assert "email" in response.data["errors"] or "password" in response.data["errors"]


class TestThrottlingAndLockout:
    def test_login_is_throttled_per_ip(self, api, super_admin):
        codes = [login(api, password="wrong-1").status_code for _ in range(6)]
        assert 429 in codes
        assert codes[0] == 401

    def test_lockout_after_repeated_failures(self, api, super_admin, settings):
        """With throttling disabled, django-axes locks the account after N failures."""
        settings.REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"].update(
            {"login": "1000/min", "login_email": "1000/min"}
        )
        from django.core.cache import cache

        cache.clear()
        from django.test import override_settings

        with override_settings(REST_FRAMEWORK=settings.REST_FRAMEWORK):
            for _ in range(settings.AXES_FAILURE_LIMIT):
                login(api, password="wrong-password")
            locked = login(api, password="wrong-password")
        assert locked.status_code == 429
        assert locked.data.get("locked_out") is True

    def test_lockout_blocks_the_correct_password_too(self, api, super_admin, settings):
        settings.REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"].update(
            {"login": "1000/min", "login_email": "1000/min"}
        )
        from django.core.cache import cache
        from django.test import override_settings

        cache.clear()
        with override_settings(REST_FRAMEWORK=settings.REST_FRAMEWORK):
            for _ in range(settings.AXES_FAILURE_LIMIT):
                login(api, password="wrong-password")
            response = login(api)
        assert response.status_code == 429


class TestRefreshAndLogout:
    def test_refresh_requires_cookie(self, api, super_admin):
        # No cookie at all → nothing to refresh.
        response = api.post(REFRESH_URL, {}, format="json", HTTP_X_ANANTA_CLIENT="web")
        assert response.status_code == 401

    def test_refresh_cookie_without_client_header_is_refused(self, api, super_admin):
        login(api)
        response = api.post(REFRESH_URL, {}, format="json")
        assert response.status_code == 403
        assert response.data["code"] == "csrf_guard"

    def test_refresh_rotates_and_blacklists_old_token(self, api, super_admin):
        login_response = login(api)
        old_refresh = login_response.cookies["ananta_refresh"].value
        response = api.post(REFRESH_URL, {}, format="json", HTTP_X_ANANTA_CLIENT="web")
        assert response.status_code == 200
        new_refresh = response.cookies["ananta_refresh"].value
        assert new_refresh != old_refresh
        # The old token must now be blacklisted.
        api.cookies["ananta_refresh"] = old_refresh
        replay = api.post(REFRESH_URL, {}, format="json", HTTP_X_ANANTA_CLIENT="web")
        assert replay.status_code == 401
        assert replay.data["code"] == "token_not_valid"

    def test_refresh_with_expired_token_fails(self, api, super_admin):
        token = RefreshToken.for_user(super_admin)
        token.set_exp(
            from_time=timezone.now() - timezone.timedelta(hours=48),
            lifetime=timezone.timedelta(hours=1),
        )
        response = api.post(REFRESH_URL, {"refresh": str(token)}, format="json")
        assert response.status_code == 401

    def test_refresh_of_inactive_user_is_rejected(self, api, editor):
        login_response = login(api, email=editor.email)
        editor.is_active = False
        editor.save(update_fields=["is_active"])
        api.cookies["ananta_refresh"] = login_response.cookies["ananta_refresh"].value
        response = api.post(REFRESH_URL, {}, format="json", HTTP_X_ANANTA_CLIENT="web")
        assert response.status_code == 401

    def test_logout_revokes_the_refresh_token(self, api, super_admin):
        login_response = login(api)
        refresh = login_response.cookies["ananta_refresh"].value
        logout = api.post(LOGOUT_URL, {}, format="json")
        assert logout.status_code == 200
        assert logout.data["revoked"] is True
        api.cookies["ananta_refresh"] = refresh
        reuse = api.post(REFRESH_URL, {}, format="json", HTTP_X_ANANTA_CLIENT="web")
        assert reuse.status_code == 401

    def test_me_requires_authentication(self, api, super_admin):
        assert api.get("/api/auth/me/").status_code == 401
        login_response = login(api)
        access = login_response.data["access"]
        api.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        me = api.get("/api/auth/me/")
        assert me.status_code == 200
        assert me.data["permissions"]["can_manage_users"] is True

    def test_invalid_access_token_is_rejected(self, api):
        api.credentials(HTTP_AUTHORIZATION="Bearer not-a-real-token")
        assert api.get("/api/auth/me/").status_code == 401


class TestPasswordFlows:
    def test_change_password_requires_current_password(self, api, super_admin):
        access = login(api).data["access"]
        api.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        response = api.post(
            "/api/auth/change-password/",
            {
                "current_password": "wrong",
                "new_password": "A-New-Password!2026",
                "confirm_password": "A-New-Password!2026",
            },
            format="json",
        )
        assert response.status_code == 400
        assert "current_password" in response.data["errors"]

    def test_change_password_rejects_weak_and_mismatched(self, api, super_admin):
        access = login(api).data["access"]
        api.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        weak = api.post(
            "/api/auth/change-password/",
            {
                "current_password": STRONG_PASSWORD,
                "new_password": "short",
                "confirm_password": "short",
            },
            format="json",
        )
        assert weak.status_code == 400
        mismatch = api.post(
            "/api/auth/change-password/",
            {
                "current_password": STRONG_PASSWORD,
                "new_password": "A-New-Password!2026",
                "confirm_password": "Another-Password!2026",
            },
            format="json",
        )
        assert mismatch.status_code == 400

    def test_change_password_success_and_audit(self, api, super_admin):
        access = login(api).data["access"]
        api.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
        response = api.post(
            "/api/auth/change-password/",
            {
                "current_password": STRONG_PASSWORD,
                "new_password": "Fresh-Password!2026",
                "confirm_password": "Fresh-Password!2026",
            },
            format="json",
        )
        assert response.status_code == 200
        super_admin.refresh_from_db()
        assert super_admin.check_password("Fresh-Password!2026")
        assert AdminActionLog.objects.filter(action=AdminActionLog.Action.PASSWORD_CHANGE).exists()

    def test_forgot_password_does_not_reveal_accounts(self, api, super_admin):
        known = api.post("/api/auth/forgot-password/", {"email": super_admin.email}, format="json")
        unknown = api.post("/api/auth/forgot-password/", {"email": "ghost@x.com"}, format="json")
        assert known.status_code == unknown.status_code == 200
        assert known.data == unknown.data

    def test_forgot_password_sends_email_with_single_use_token(self, api, super_admin):
        response = api.post(
            "/api/auth/forgot-password/", {"email": super_admin.email}, format="json"
        )
        assert response.status_code == 200
        assert any("reset" in message.subject.lower() for message in mail.outbox)
        assert PasswordResetToken.objects.filter(user=super_admin, used_at__isnull=True).exists()

    def test_reset_password_with_valid_token(self, api, super_admin):
        _token, raw = PasswordResetToken.issue(super_admin)
        response = api.post(
            "/api/auth/reset-password/",
            {
                "token": raw,
                "new_password": "Reset-Password!2026",
                "confirm_password": "Reset-Password!2026",
            },
            format="json",
        )
        assert response.status_code == 200
        super_admin.refresh_from_db()
        assert super_admin.check_password("Reset-Password!2026")

    def test_reset_token_is_single_use(self, api, super_admin):
        _token, raw = PasswordResetToken.issue(super_admin)
        payload = {
            "token": raw,
            "new_password": "Reset-Password!2026",
            "confirm_password": "Reset-Password!2026",
        }
        assert api.post("/api/auth/reset-password/", payload, format="json").status_code == 200
        second = api.post(
            "/api/auth/reset-password/",
            {
                **payload,
                "new_password": "Another-Password!2026",
                "confirm_password": "Another-Password!2026",
            },
            format="json",
        )
        assert second.status_code == 400
        assert second.data["code"] == "invalid_token"

    def test_expired_reset_token_is_rejected(self, api, super_admin):
        token, raw = PasswordResetToken.issue(super_admin)
        token.expires_at = timezone.now() - timezone.timedelta(minutes=1)
        token.save(update_fields=["expires_at"])
        response = api.post(
            "/api/auth/reset-password/",
            {
                "token": raw,
                "new_password": "Reset-Password!2026",
                "confirm_password": "Reset-Password!2026",
            },
            format="json",
        )
        assert response.status_code == 400

    def test_reset_password_enforces_strength(self, api, super_admin):
        _, raw = PasswordResetToken.issue(super_admin)
        response = api.post(
            "/api/auth/reset-password/",
            {"token": raw, "new_password": "123456789012", "confirm_password": "123456789012"},
            format="json",
        )
        assert response.status_code == 400

    def test_reset_password_unknown_token_is_rejected(self, api, super_admin):
        response = api.post(
            "/api/auth/reset-password/",
            {
                "token": "nope",
                "new_password": "Reset-Password!2026",
                "confirm_password": "Reset-Password!2026",
            },
            format="json",
        )
        assert response.status_code == 400
