"""
Django settings for the Ananta Events backend.

Everything deployment-specific is environment-driven (12-factor):
SECRET_KEY, DEBUG, ALLOWED_HOSTS, DATABASE_URL, CORS/CSRF origins, EMAIL_*.

DATABASE_URL is validated at startup: when it is set but unparseable the
process refuses to boot (fail fast) instead of dying on the first query.
"""

import logging
from datetime import timedelta
from pathlib import Path

import environ

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(
    DEBUG=(bool, False),
    SECRET_KEY=(str, ""),
    ALLOWED_HOSTS=(list, []),
    DATABASE_URL=(str, ""),
    CONN_MAX_AGE=(int, 60),
    CORS_ALLOWED_ORIGINS=(list, []),
    CSRF_TRUSTED_ORIGINS=(list, []),
    ACCESS_TOKEN_MINUTES=(int, 12),
    REFRESH_TOKEN_DAYS=(int, 7),
    LOGIN_MAX_ATTEMPTS=(int, 5),
    LOGIN_LOCKOUT_MINUTES=(int, 15),
    ADMIN_EMAIL=(str, ""),
    EMAIL_BACKEND=(str, "django.core.mail.backends.console.EmailBackend"),
    EMAIL_HOST=(str, ""),
    EMAIL_PORT=(int, 587),
    EMAIL_HOST_USER=(str, ""),
    EMAIL_HOST_PASSWORD=(str, ""),
    EMAIL_USE_TLS=(bool, True),
    EMAIL_USE_SSL=(bool, False),
    DEFAULT_FROM_EMAIL=(str, "Ananta Events <no-reply@anantaevents.com>"),
    STORAGE_BACKEND=(str, "auto"),  # auto | cloudinary | s3 | local
    CLOUDINARY_URL=(str, ""),
    AWS_ACCESS_KEY_ID=(str, ""),
    AWS_SECRET_ACCESS_KEY=(str, ""),
    AWS_STORAGE_BUCKET_NAME=(str, ""),
    AWS_S3_REGION_NAME=(str, ""),
    SECURE_SSL_REDIRECT=(bool, False),
    SECURE_COOKIES=(bool, True),
    SEED_SOURCE_DIR=(str, ""),
)

environ.Env.read_env(BASE_DIR / ".env", overwrite=False)


class ConfigError(Exception):
    """Raised when required deployment configuration is missing or invalid."""


SECRET_KEY = env("SECRET_KEY") or "insecure-dev-only-secret-key-do-not-use-in-prod"
DEBUG = env("DEBUG")

# ---------------------------------------------------------------- database --
_raw_db_url = env("DATABASE_URL")
if _raw_db_url:
    try:
        DATABASES = {"default": env.db_url_config(_raw_db_url)}
        DATABASES["default"]["CONN_MAX_AGE"] = env("CONN_MAX_AGE")
        if DATABASES["default"].get("ENGINE") == "django.db.backends.postgresql":
            DATABASES["default"].setdefault(
                "OPTIONS", {"sslmode": env.str("DB_SSLMODE", default="require")}
            )
            if env.str("DB_SSLMODE", default="") == "disable":
                DATABASES["default"]["OPTIONS"] = {"sslmode": "disable"}
    except Exception as exc:  # noqa: BLE001 — fail fast on bad config
        raise ConfigError(f"DATABASE_URL is set but could not be parsed: {exc}") from exc
else:
    # Local development / CI fallback so the project boots without Postgres.
    # Production (DEBUG=False) refuses to start without DATABASE_URL — see the
    # validation block at the bottom of this file.
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ------------------------------------------------------------------- apps --
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # third party
    "rest_framework",
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",
    "django_filters",
    "drf_spectacular",
    # local
    "core",
    "accounts",
    "content",
    "artists",
    "engagement",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

# ------------------------------------------------------------------ i18n --
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Dhaka"
USE_I18N = True
USE_TZ = True

# ------------------------------------------------------- static & media --
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STORAGES = {
    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    "staticfiles": {"BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage"},
}
MEDIA_URL = "/media/"
# Production media lives in Cloudinary/S3 (see storage selection below);
# MEDIA_ROOT is only used when STORAGE_BACKEND=local (development).
MEDIA_ROOT = BASE_DIR / "media"

_storage_backend = env("STORAGE_BACKEND")
if _storage_backend == "auto":
    if env("CLOUDINARY_URL"):
        _storage_backend = "cloudinary"
    elif env("AWS_STORAGE_BUCKET_NAME"):
        _storage_backend = "s3"
    else:
        _storage_backend = "local"

if _storage_backend == "cloudinary":
    import cloudinary  # noqa: F401 — validates the package is installed

    if "cloudinary_storage" not in INSTALLED_APPS:
        INSTALLED_APPS += ["cloudinary_storage", "cloudinary"]
    STORAGES["default"] = {"BACKEND": "cloudinary_storage.storage.MediaCloudinaryStorage"}
elif _storage_backend == "s3":
    STORAGES["default"] = {
        "BACKEND": "storages.backends.s3.S3Storage",
        "OPTIONS": {
            "access_key": env("AWS_ACCESS_KEY_ID"),
            "secret_key": env("AWS_SECRET_ACCESS_KEY"),
            "bucket_name": env("AWS_STORAGE_BUCKET_NAME"),
            "region_name": env("AWS_S3_REGION_NAME") or None,
            "default_acl": None,
            "querystring_auth": False,
        },
    }
elif _storage_backend == "local" and not DEBUG:
    logging.getLogger(__name__).warning(
        "STORAGE_BACKEND=local while DEBUG=False — uploaded media will not "
        "survive redeploys on PaaS filesystems. Configure Cloudinary or S3."
    )

# ------------------------------------------------------------------ auth --
AUTH_USER_MODEL = "accounts.User"
AUTHENTICATION_BACKENDS = ["django.contrib.auth.backends.ModelBackend"]
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
]
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        "OPTIONS": {"min_length": 12},
    },
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ------------------------------------------------------------------- DRF --
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.AllowAny",),
    "DEFAULT_FILTER_BACKENDS": (
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ),
    "DEFAULT_PAGINATION_CLASS": "core.pagination.DefaultPagination",
    "PAGE_SIZE": 12,
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    # Global rate limits are generous; strict scoped throttles (login,
    # submissions, password reset) are attached to those endpoints directly.
    "DEFAULT_THROTTLE_CLASSES": (
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ),
    "DEFAULT_THROTTLE_RATES": {
        "anon": "600/hour",
        "user": "5000/hour",
        "login": "10/minute",
        "submit": "12/hour",
        "password_reset": "5/hour",
    },
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=env("ACCESS_TOKEN_MINUTES")),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=env("REFRESH_TOKEN_DAYS")),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": True,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "TOKEN_OBTAIN_SERIALIZER": "accounts.serializers.LoginTokenObtainPairSerializer",
}

# HttpOnly refresh-cookie settings used by accounts.views.
JWT_REFRESH_COOKIE = "ananta_refresh"
JWT_REFRESH_COOKIE_MAX_AGE = env("REFRESH_TOKEN_DAYS") * 24 * 3600
JWT_REFRESH_COOKIE_SECURE = (not DEBUG) and env("SECURE_COOKIES")
JWT_REFRESH_COOKIE_SAMESITE = "Lax"
JWT_REFRESH_COOKIE_PATH = "/api/auth/"

SPECTACULAR_SETTINGS = {
    "TITLE": "Ananta Events API",
    "DESCRIPTION": (
        "Public content, public submissions and authenticated admin CRUD " "API for Ananta Events."
    ),
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "COMPONENT_SPLIT_REQUEST": True,
    "SCHEMA_PATH_PREFIX": "/api",
}

# ----------------------------------------------------------------- CORS --
CORS_ALLOWED_ORIGINS = env("CORS_ALLOWED_ORIGINS")
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = env("CSRF_TRUSTED_ORIGINS")

# ------------------------------------------------------------ throttling --
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "ananta-default",
    }
}
LOGIN_MAX_ATTEMPTS = env("LOGIN_MAX_ATTEMPTS")
LOGIN_LOCKOUT_MINUTES = env("LOGIN_LOCKOUT_MINUTES")

# ----------------------------------------------------------------- mail --
ADMIN_EMAIL = env("ADMIN_EMAIL") or "info@anantabd.net"
EMAIL_BACKEND = env("EMAIL_BACKEND")
EMAIL_HOST = env("EMAIL_HOST")
EMAIL_PORT = env("EMAIL_PORT")
EMAIL_HOST_USER = env("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD")
EMAIL_USE_TLS = env("EMAIL_USE_TLS")
EMAIL_USE_SSL = env("EMAIL_USE_SSL")
DEFAULT_FROM_EMAIL = env("DEFAULT_FROM_EMAIL")

# ------------------------------------------------------------- security --
ALLOWED_HOSTS = env("ALLOWED_HOSTS") or (["*"] if DEBUG else [])
SECURE_SSL_REDIRECT = env("SECURE_SSL_REDIRECT") and not DEBUG
SESSION_COOKIE_SECURE = (not DEBUG) and env("SECURE_COOKIES")
CSRF_COOKIE_SECURE = (not DEBUG) and env("SECURE_COOKIES")
CSRF_COOKIE_SAMESITE = "Lax"
SECURE_HSTS_SECONDS = 0 if DEBUG else 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"
SECURE_REFERRER_POLICY = "strict-origin-when-cross-origin"

LOGIN_URL = "/admin/login/"

if not DEBUG:
    if SECRET_KEY.startswith("insecure-dev-only") or len(SECRET_KEY) < 32:
        raise ConfigError("SECRET_KEY must be set to a strong (32+ char) value when DEBUG=False.")
    if not _raw_db_url:
        raise ConfigError(
            "DATABASE_URL is required when DEBUG=False (use the postgres:// "
            "URL of your managed database)."
        )
