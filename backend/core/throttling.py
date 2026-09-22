"""Custom DRF throttles for sensitive endpoints."""

from rest_framework.throttling import SimpleRateThrottle


class LoginThrottle(SimpleRateThrottle):
    """Rate-limits login attempts per IP (plus username handled in view)."""

    scope = "login"

    def get_cache_key(self, request, view):
        ident = self.get_ident(request) or "no-ip"
        return self.cache_format % {"scope": self.scope, "ident": ident}


class SubmissionThrottle(SimpleRateThrottle):
    """Public form submissions (contact, bookings, registrations, applications)."""

    scope = "submit"

    def get_cache_key(self, request, view):
        if request.user.is_authenticated:
            return self.cache_format % {
                "scope": self.scope,
                "ident": f"user-{request.user.pk}",
            }
        return self.cache_format % {
            "scope": self.scope,
            "ident": self.get_ident(request) or "anon",
        }


class PasswordResetThrottle(SimpleRateThrottle):
    scope = "password_reset"

    def get_cache_key(self, request, view):
        ident = self.get_ident(request) or "no-ip"
        return self.cache_format % {"scope": self.scope, "ident": ident}
