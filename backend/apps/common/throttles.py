"""Throttles: per-IP for anonymous traffic and per-email for the login endpoint."""

from __future__ import annotations

from rest_framework.throttling import AnonRateThrottle, SimpleRateThrottle


class PublicReadThrottle(AnonRateThrottle):
    scope = "public_read"


class PublicFormThrottle(AnonRateThrottle):
    """Anonymous form submissions (contact, bookings, registrations)."""

    scope = "public_form"


class LoginIPThrottle(SimpleRateThrottle):
    scope = "login"

    def get_cache_key(self, request, view):
        return self.cache_format % {
            "scope": self.scope,
            "ident": self.get_ident(request),
        }


class LoginEmailThrottle(LoginIPThrottle):
    """Second key for the login endpoint: the submitted email address."""

    scope = "login_email"

    def get_cache_key(self, request, view):
        email = ""
        if hasattr(request, "data") and isinstance(request.data, dict):
            email = str(request.data.get("email", "")).strip().lower()
        if not email:
            return None
        return self.cache_format % {"scope": self.scope, "ident": email}


class PasswordResetThrottle(SimpleRateThrottle):
    scope = "password_reset"

    def get_cache_key(self, request, view):
        email = ""
        if hasattr(request, "data") and isinstance(request.data, dict):
            email = str(request.data.get("email", "")).strip().lower()
        ident = f"{self.get_ident(request)}:{email}"
        return self.cache_format % {"scope": self.scope, "ident": ident}
