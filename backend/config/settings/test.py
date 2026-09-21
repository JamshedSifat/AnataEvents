"""Test settings: fast hashers, in-memory cache, local media, console email."""

from __future__ import annotations

import os

os.environ.setdefault("DEBUG", "True")
os.environ.setdefault("DJANGO_SECRET_KEY", "test-secret-key-not-for-production")
os.environ.setdefault("DATABASE_URL", "postgres://ananta:ananta@localhost:5432/ananta")
os.environ.setdefault("ALLOWED_HOSTS", "testserver,localhost")
os.environ.setdefault("REFRESH_COOKIE_SECURE", "False")
os.environ.setdefault("REFRESH_COOKIE_SAMESITE", "Lax")
os.environ.setdefault("CORS_ALLOWED_ORIGINS", "http://localhost:5173")
os.environ.setdefault("CSRF_TRUSTED_ORIGINS", "http://localhost:5173")

from .base import *

DEBUG = False
PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]
EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"
CACHES = {"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}}
MEDIA_ROOT = "/tmp/ananta-test-media"
# Throttling rates must still be enforced in tests, but with head-room so that
# unrelated tests do not trip each other's counters.
REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"] = {
    "public_read": "1000/min",
    "public_form": "1000/hour",
    "login": "5/min",
    "login_email": "5/min",
    "password_reset": "1000/hour",
}
AXES_ENABLED = True
