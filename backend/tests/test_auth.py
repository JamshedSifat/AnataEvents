import pytest
from rest_framework import status
from rest_framework.test import APIClient

LOGIN_URL = "/api/auth/login/"
REFRESH_URL = "/api/auth/refresh/"
LOGOUT_URL = "/api/auth/logout/"
ME_URL = "/api/auth/me/"
CHANGE_URL = "/api/auth/change-password/"
FORGOT_URL = "/api/auth/forgot-password/"
RESET_URL = "/api/auth/reset-password/"

PASSWORD = "SuperSecure-Pass-1"


def login(api, email, password=PASSWORD):
    return api.post(LOGIN_URL, {"email": email, "password": password}, format="json")


@pytest.mark.django_db
class TestLogin:
    def test_login_success_sets_httponly_cookie(self, api, super_admin):
        resp = login(api, super_admin.email)
        assert resp.status_code == status.HTTP_200_OK
        assert "accessToken" in resp.data
        assert resp.data["user"]["role"] == "super_admin"
        cookie = resp.cookies["ananta_refresh"]
        assert cookie["httponly"]
        assert cookie["path"] == "/api/auth/"

    def test_wrong_password_generic_error(self, api, super_admin):
        resp = login(api, super_admin.email, "totally-wrong-pass")
        assert resp.status_code == status.HTTP_401_UNAUTHORIZED
        assert resp.data["detail"] == "Invalid email or password."

    def test_unknown_user_same_generic_error(self, api, super_admin):
        resp = login(api, "ghost@test.com", "whatever-pass-123")
        assert resp.status_code == status.HTTP_401_UNAUTHORIZED
        assert resp.data["detail"] == "Invalid email or password."

    def test_lockout_after_failed_attempts(self, api, super_admin):
        for _ in range(5):
            resp = login(api, super_admin.email, "wrong-password-1")
            assert resp.status_code == status.HTTP_401_UNAUTHORIZED
        # correct password is ALSO rejected while locked out
        resp = login(api, super_admin.email)
        assert resp.status_code == status.HTTP_401_UNAUTHORIZED

    def test_deactivated_user_cannot_login(self, api, super_admin):
        super_admin.is_active = False
        super_admin.save()
        assert login(api, super_admin.email).status_code == 401


@pytest.mark.django_db
class TestRefreshRotation:
    def _get_cookie(self, resp, name="ananta_refresh"):
        return resp.cookies[name].value

    def test_refresh_rotates_and_blacklists(self, api, super_admin):
        first = login(api, super_admin.email)
        old_token = self._get_cookie(first)

        api.cookies["ananta_refresh"] = old_token
        resp = api.post(REFRESH_URL, {}, format="json")
        assert resp.status_code == 200
        assert "refresh" not in resp.data  # never exposed to JS
        new_token = resp.cookies["ananta_refresh"].value
        assert new_token != old_token

        # old token is blacklisted — replay fails
        api.cookies["ananta_refresh"] = old_token
        assert api.post(REFRESH_URL, {}, format="json").status_code == 401

        # rotated token still works
        api.cookies["ananta_refresh"] = new_token
        assert api.post(REFRESH_URL, {}, format="json").status_code == 200

    def test_logout_revokes_token(self, api, super_admin):
        first = login(api, super_admin.email)
        token = self._get_cookie(first)
        api.cookies["ananta_refresh"] = token
        assert api.post(LOGOUT_URL, {}, format="json").status_code == 200
        assert api.post(REFRESH_URL, {}, format="json").status_code == 401


@pytest.mark.django_db
class TestMeAndPassword:
    def test_me_returns_role(self, super_api, super_admin):
        resp = super_api.get(ME_URL)
        assert resp.status_code == 200
        assert resp.data["user"]["email"] == super_admin.email

    def test_me_rejects_anonymous(self, api):
        assert api.get(ME_URL).status_code == 401

    def test_change_password(self, super_api, super_admin):
        resp = super_api.post(
            CHANGE_URL,
            {"current_password": PASSWORD, "new_password": "FreshSecure-Pass-2"},
            format="json",
        )
        assert resp.status_code == 200
        super_admin.refresh_from_db()
        assert super_admin.check_password("FreshSecure-Pass-2")

    def test_change_password_rejects_short(self, super_api):
        resp = super_api.post(
            CHANGE_URL, {"current_password": PASSWORD, "new_password": "short12"}, format="json"
        )
        assert resp.status_code == 400

    def test_change_password_wrong_current(self, super_api):
        resp = super_api.post(
            CHANGE_URL,
            {"current_password": "not-my-password", "new_password": "FreshSecure-Pass-2"},
            format="json",
        )
        assert resp.status_code == 400

    def test_forgot_password_never_reveals_account(self, api, super_admin):
        known = api.post(FORGOT_URL, {"email": super_admin.email}, format="json")
        unknown = api.post(FORGOT_URL, {"email": "no@one.com"}, format="json")
        assert known.status_code == unknown.status_code == 200
        assert known.data == unknown.data

    def test_full_reset_flow(self, api, super_admin):
        from django.contrib.auth.tokens import default_token_generator
        from django.utils.encoding import force_bytes
        from django.utils.http import urlsafe_base64_encode

        uid = urlsafe_base64_encode(force_bytes(super_admin.pk))
        token = default_token_generator.make_token(super_admin)
        resp = api.post(
            RESET_URL,
            {"uid": uid, "token": token, "new_password": "ResetSecure-Pass-3"},
            format="json",
        )
        assert resp.status_code == 200
        super_admin.refresh_from_db()
        assert super_admin.check_password("ResetSecure-Pass-3")
        # token is single-use
        again = api.post(
            RESET_URL,
            {"uid": uid, "token": token, "new_password": "AnotherSecure-4x"},
            format="json",
        )
        assert again.status_code == 400

    def test_min_password_length_enforced_on_create(self, super_api):
        resp = super_api.post(
            "/api/admin/users/",
            {"email": "weak@x.com", "password": "short12", "role": "editor"},
            format="json",
        )
        assert resp.status_code == 400


@pytest.mark.django_db
class TestActionLog:
    def test_login_is_audited(self, super_admin):
        from accounts.models import AdminActionLog

        api_client = APIClient()
        login(api_client, super_admin.email)
        assert AdminActionLog.objects.filter(action="login", actor=super_admin).exists()
