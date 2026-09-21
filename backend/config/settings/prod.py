"""Production settings (secure cookies, HSTS, remote media storage, JSON logs)."""

from __future__ import annotations

import logging

from .base import *
from .base import env

DEBUG = False

# Hosts / proxies -------------------------------------------------------------
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS")
CSRF_TRUSTED_ORIGINS = env.list("CSRF_TRUSTED_ORIGINS")
CORS_ALLOWED_ORIGINS = env.list("CORS_ALLOWED_ORIGINS")
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_X_FORWARDED_HOST = True

# Cookies are always Secure in production (the frontend talks to the API over
# HTTPS, either same-origin through the Vercel rewrite or via api.<domain>).
REFRESH_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_SSL_REDIRECT = env.bool("SECURE_SSL_REDIRECT", default=True)
SECURE_HSTS_SECONDS = env.int("SECURE_HSTS_SECONDS", default=31536000)
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# --------------------------------------------------------------------------- #
# Media storage — local disk is ephemeral on Render/Railway/Fly, so uploads go
# to Cloudinary (default) or any S3-compatible bucket.
# --------------------------------------------------------------------------- #
STORAGE_BACKEND = env("STORAGE_BACKEND", default="cloudinary").lower()

if STORAGE_BACKEND == "cloudinary":
    cloud_name = env("CLOUDINARY_CLOUD_NAME")
    api_key = env("CLOUDINARY_API_KEY")
    api_secret = env("CLOUDINARY_API_SECRET")
    if not (cloud_name and api_key and api_secret):
        raise ImproperlyConfigured(
            "STORAGE_BACKEND=cloudinary requires CLOUDINARY_CLOUD_NAME, "
            "CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET. Set "
            "STORAGE_BACKEND=local only for throw-away environments — local "
            "disk is wiped on every deploy."
        )
    INSTALLED_APPS += ["cloudinary", "cloudinary_storage"]
    CLOUDINARY_STORAGE = {
        "CLOUD_NAME": cloud_name,
        "API_KEY": api_key,
        "API_SECRET": api_secret,
        "SECURE": True,
    }
    STORAGES = {
        "default": {"BACKEND": "cloudinary_storage.storage.MediaCloudinaryStorage"},
        "staticfiles": {"BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage"},
    }
elif STORAGE_BACKEND == "s3":
    bucket = env("AWS_STORAGE_BUCKET_NAME")
    if not bucket:
        raise ImproperlyConfigured(
            "STORAGE_BACKEND=s3 requires AWS_STORAGE_BUCKET_NAME (plus "
            "AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY)."
        )
    STORAGES = {
        "default": {"BACKEND": "storages.backends.s3.S3Storage"},
        "staticfiles": {"BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage"},
    }
    AWS_ACCESS_KEY_ID = env("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = env("AWS_SECRET_ACCESS_KEY")
    AWS_STORAGE_BUCKET_NAME = bucket
    AWS_S3_REGION_NAME = env("AWS_S3_REGION_NAME")
    AWS_S3_ENDPOINT_URL = env("AWS_S3_ENDPOINT_URL") or None
    AWS_DEFAULT_ACL = None
    AWS_QUERYSTRING_AUTH = False
    AWS_S3_FILE_OVERWRITE = False
else:
    import warnings

    warnings.warn(
        "STORAGE_BACKEND=local in production: uploaded media will be lost on "
        "the next deploy/redeploy. Use cloudinary or s3.",
        RuntimeWarning,
        stacklevel=1,
    )

# Shared cache (throttling + lockouts must be shared across workers) ----------
CACHES = {"default": env.cache_url("CACHE_URL", default="locmemcache://ananta?timeout=300")}

# Error reporting ------------------------------------------------------------
ADMINS = (
    [tuple(env.list("DJANGO_ADMINS", default=[]))] if env.list("DJANGO_ADMINS", default=[]) else []
)
sentry_dsn = env("SENTRY_DSN", default="")
if sentry_dsn:  # pragma: no cover - optional integration
    try:
        import sentry_sdk
        from sentry_sdk.integrations.django import DjangoIntegration

        sentry_sdk.init(
            dsn=sentry_dsn,
            integrations=[DjangoIntegration()],
            traces_sample_rate=0.1,
            send_default_pii=False,
        )
    except ImportError:
        logging.getLogger("ananta").warning(
            "SENTRY_DSN set but sentry-sdk is not installed; ignoring."
        )

LOGGING["handlers"]["console"] = {
    "class": "logging.StreamHandler",
    "formatter": "verbose",
}
