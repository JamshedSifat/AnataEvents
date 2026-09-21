"""Development settings (DEBUG on, permissive hosts, console email)."""

from __future__ import annotations

import os

os.environ.setdefault("DEBUG", "True")
os.environ.setdefault("DATABASE_URL", "postgres://ananta:ananta@localhost:5432/ananta")
os.environ.setdefault("DJANGO_SECRET_KEY", "django-insecure-dev-only-key-not-for-production")
os.environ.setdefault(
    "CORS_ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,"
    "http://localhost:3000,https://anata-events-jet.vercel.app",
)
os.environ.setdefault(
    "CSRF_TRUSTED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173,https://anata-events-jet.vercel.app",
)
os.environ.setdefault("ALLOWED_HOSTS", "*")
os.environ.setdefault("REFRESH_COOKIE_SECURE", "False")
os.environ.setdefault("REFRESH_COOKIE_SAMESITE", "Lax")

from .base import *
from .base import env

DEBUG = env.bool("DEBUG", default=True)

# In development the API and the Vite dev server are on different ports, so the
# SPA is served from the browser's origin. Use the Vite proxy (`VITE_API_BASE_URL`
# = `/api` + `vite.config.js` proxy) for identical behaviour to production.
CORS_ALLOW_ALL_ORIGINS = False

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

INTERNAL_IPS = ["127.0.0.1"]
