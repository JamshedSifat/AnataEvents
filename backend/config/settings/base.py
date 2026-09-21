"""
Django settings — base (shared by dev and prod).

Everything is read from the environment. See `backend/.env.example`.
"""

from __future__ import annotations

import os
from datetime import timedelta
from pathlib import Path

import environ
from django.core.exceptions import ImproperlyConfigured

BASE_DIR = Path(__file__).resolve().parent.parent.parent  # backend/

env = environ.Env(
    DEBUG=(bool, False),
    DJANGO_SECRET_KEY=(str, ""),
    ALLOWED_HOSTS=(list, ["localhost", "127.0.0.1"]),
    CORS_ALLOWED_ORIGINS=(list, []),
    CSRF_TRUSTED_ORIGINS=(list, []),
    DATABASE_URL=(str, ""),
    DB_CONN_MAX_AGE=(int, 60),
    ACCESS_TOKEN_LIFETIME_MINUTES=(int, 12),
    REFRESH_TOKEN_LIFETIME_DAYS=(int, 7),
    REFRESH_COOKIE_NAME=(str, "ananta_refresh"),
    REFRESH_COOKIE_DOMAIN=(str, ""),
    REFRESH_COOKIE_SAMESITE=(str, "Lax"),
    REFRESH_COOKIE_SECURE=(bool, True),
    AUTH_COOKIE_PATH=(str, "/api/auth/"),
    LOGIN_THROTTLE_RATE=(str, "5/min"),
    PASSWORD_RESET_THROTTLE_RATE=(str, "5/hour"),
    LOGIN_LOCKOUT_LIMIT=(int, 5),
    LOGIN_LOCKOUT_HOURS=(int, 1),
    EMAIL_HOST=(str, ""),
    EMAIL_PORT=(int, 587),
    EMAIL_HOST_USER=(str, ""),
    EMAIL_HOST_PASSWORD=(str, ""),
    EMAIL_USE_TLS=(bool, True),
    DEFAULT_FROM_EMAIL=(str, "Ananta Events <no-reply@ananta-events.com>"),
    SERVER_EMAIL=(str, "Ananta Events <no-reply@ananta-events.com>"),
    SITE_URL=(str, "http://localhost:5173"),
    API_BASE_URL=(str, "http://localhost:8000"),
    SECURE_SSL_REDIRECT=(bool, False),
    SECURE_HSTS_SECONDS=(int, 0),
    FILE_UPLOAD_MAX_MB=(int, 10),
    THROTTLE_RATE_PUBLIC_FORM=(str, "10/hour"),
    THROTTLE_RATE_PUBLIC_READ=(str, "240/min"),
    STORAGE_BACKEND=(str, "local"),  # local | cloudinary | s3
    CLOUDINARY_CLOUD_NAME=(str, ""),
    CLOUDINARY_API_KEY=(str, ""),
    CLOUDINARY_API_SECRET=(str, ""),
    AWS_ACCESS_KEY_ID=(str, ""),
    AWS_SECRET_ACCESS_KEY=(str, ""),
    AWS_STORAGE_BUCKET_NAME=(str, ""),
    AWS_S3_REGION_NAME=(str, ""),
    AWS_S3_ENDPOINT_URL=(str, ""),
    SENTRY_DSN=(str, ""),
)

# Load backend/.env if present (never committed).
_env_file = Path(os.environ.get("DJANGO_ENV_FILE", BASE_DIR / ".env"))
if _env_file.exists():
    environ.Env.read_env(str(_env_file))

# --------------------------------------------------------------------------- #
# Core
# --------------------------------------------------------------------------- #
DEBUG = env.bool("DEBUG")
SECRET_KEY = env("DJANGO_SECRET_KEY")
if not SECRET_KEY:
    if DEBUG:
        SECRET_KEY = "django-insecure-dev-only-key-not-for-production"
    else:
        raise ImproperlyConfigured(
            "DJANGO_SECRET_KEY is not set. Generate one with:\n"
            '  python -c "import secrets; print(secrets.token_urlsafe(64))"\n'
            "and put it in backend/.env (never commit it)."
        )

ALLOWED_HOSTS = env.list("ALLOWED_HOSTS")
if DEBUG and not ALLOWED_HOSTS:
    ALLOWED_HOSTS = ["*"]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.postgres",
    # third-party
    "rest_framework",
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",
    "django_filters",
    "drf_spectacular",
    "axes",
    # local
    "apps.accounts",
    "apps.content",
    "apps.submissions",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "axes.middleware.AxesMiddleware",
]

ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


# --------------------------------------------------------------------------- #
# Database — validated at startup with a clear error message
# --------------------------------------------------------------------------- #
def _database_from_env() -> dict:
    url = env.str("DATABASE_URL", default="").strip()
    if not url:
        raise ImproperlyConfigured(
            "DATABASE_URL is not set.\n"
            "PostgreSQL is required. Example:\n"
            "  DATABASE_URL=postgres://ananta:ananta@localhost:5432/ananta\n"
            "With Docker: docker compose up db\n"
            "See backend/.env.example for every supported variable."
        )
    if not url.startswith(("postgres://", "postgresql://", "postgis://")):
        raise ImproperlyConfigured(
            f"DATABASE_URL must be a PostgreSQL URL (got {url.split('://')[0]!r}). "
            "Expected e.g. postgres://USER:PASSWORD@HOST:PORT/NAME"
        )
    try:
        config = env.db_url_config(url)
    except Exception as exc:  # pragma: no cover - defensive
        raise ImproperlyConfigured(f"DATABASE_URL is malformed: {exc}") from exc
    config.setdefault("CONN_MAX_AGE", env.int("DB_CONN_MAX_AGE"))
    config.setdefault("CONN_HEALTH_CHECKS", True)
    config.setdefault("ATOMIC_REQUESTS", False)
    config.setdefault("OPTIONS", {})
    # Connection pooling (psycopg 3 pool is provided by the server for small
    # deployments; CONN_MAX_AGE gives persistent connections per worker).
    if env.bool("DB_USE_POOL", default=False) and "pool" not in config["OPTIONS"]:
        config["OPTIONS"]["pool"] = {"min_size": 1, "max_size": 10}
    return config


DATABASES = {"default": _database_from_env()}
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# --------------------------------------------------------------------------- #
# Auth
# --------------------------------------------------------------------------- #
AUTH_USER_MODEL = "accounts.User"
AUTHENTICATION_BACKENDS = [
    "axes.backends.AxesStandaloneBackend",
    "django.contrib.auth.backends.ModelBackend",
]

PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
    "django.contrib.auth.hashers.BCryptSHA256PasswordHasher",
]

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
        "OPTIONS": {"min_length": 12},
    },
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

AXES_FAILURE_LIMIT = env.int("LOGIN_LOCKOUT_LIMIT")
AXES_COOLOFF_TIME = timedelta(hours=env.int("LOGIN_LOCKOUT_HOURS"))
AXES_RESET_ON_SUCCESS = True
AXES_LOCKOUT_PARAMETERS = [["username", "ip_address"]]
AXES_ENABLE_ACCESS_FAILURE_LOG = True
AXES_LOCKOUT_CALLABLE = None
AXES_VERBOSE = False
AXES_ENABLE_ADMIN = True

# --------------------------------------------------------------------------- #
# DRF
# --------------------------------------------------------------------------- #
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.AllowAny",),
    "DEFAULT_PAGINATION_CLASS": "config.pagination.StandardPagination",
    "PAGE_SIZE": 12,
    "DEFAULT_FILTER_BACKENDS": (
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ),
    "DEFAULT_THROTTLE_CLASSES": ("rest_framework.throttling.ScopedRateThrottle",),
    "DEFAULT_THROTTLE_RATES": {
        "public_read": env("THROTTLE_RATE_PUBLIC_READ"),
        "public_form": env("THROTTLE_RATE_PUBLIC_FORM"),
        "login": env("LOGIN_THROTTLE_RATE"),
        "login_email": env("LOGIN_THROTTLE_RATE"),
        "password_reset": env("PASSWORD_RESET_THROTTLE_RATE", default="5/hour"),
    },
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "EXCEPTION_HANDLER": "config.exceptions.api_exception_handler",
    "DEFAULT_RENDERER_CLASSES": (
        ("rest_framework.renderers.JSONRenderer",)
        if not DEBUG
        else (
            "rest_framework.renderers.JSONRenderer",
            "rest_framework.renderers.BrowsableAPIRenderer",
        )
    ),
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=env.int("ACCESS_TOKEN_LIFETIME_MINUTES")),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=env.int("REFRESH_TOKEN_LIFETIME_DAYS")),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": True,
    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "USER_ID_FIELD": "id",
    "USER_ID_CLAIM": "user_id",
    "TOKEN_OBTAIN_SERIALIZER": "apps.accounts.serializers.AnantaTokenObtainPairSerializer",
}

# Refresh-token cookie (HttpOnly) — used by /api/auth/refresh|logout/
REFRESH_COOKIE_NAME = env("REFRESH_COOKIE_NAME")
REFRESH_COOKIE_PATH = env("AUTH_COOKIE_PATH")
REFRESH_COOKIE_DOMAIN = env("REFRESH_COOKIE_DOMAIN") or None
REFRESH_COOKIE_SAMESITE = env("REFRESH_COOKIE_SAMESITE")
REFRESH_COOKIE_SECURE = env.bool("REFRESH_COOKIE_SECURE")
IDLE_TIMEOUT_MINUTES = env.int("IDLE_TIMEOUT_MINUTES", default=30)

SPECTACULAR_SETTINGS = {
    "TITLE": "Ananta Events API",
    "DESCRIPTION": (
        "Backend for the Ananta Events website and admin dashboard. "
        "Public endpoints are read-only (published content only) except the "
        "form-submission endpoints; `/api/admin/*` requires a JWT access token "
        "issued to an active staff user."
    ),
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "COMPONENT_SPLIT_REQUEST": True,
    "SCHEMA_PATH_PREFIX": "/api",
    "SWAGGER_UI_SETTINGS": {"persistAuthorization": True, "displayOperationId": True},
    "TAGS": [
        {"name": "auth", "description": "Login, refresh, logout, profile"},
        {"name": "public", "description": "Published content (read-only)"},
        {"name": "forms", "description": "Public form submissions"},
        {"name": "admin", "description": "Authenticated CMS endpoints"},
    ],
}

# --------------------------------------------------------------------------- #
# CORS / CSRF
# --------------------------------------------------------------------------- #
CORS_ALLOWED_ORIGINS = env.list("CORS_ALLOWED_ORIGINS")
CSRF_TRUSTED_ORIGINS = env.list("CSRF_TRUSTED_ORIGINS")
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_HEADERS = (
    "accept",
    "authorization",
    "content-type",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
    "x-ananta-client",
)
CORS_URLS_REGEX = r"^/api/.*$"

# --------------------------------------------------------------------------- #
# i18n / static / media
# --------------------------------------------------------------------------- #
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Dhaka"
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
STORAGES = {
    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    "staticfiles": {"BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage"},
}

FILE_UPLOAD_MAX_MEMORY_SIZE = env.int("FILE_UPLOAD_MAX_MB") * 1024 * 1024
DATA_UPLOAD_MAX_MEMORY_SIZE = env.int("FILE_UPLOAD_MAX_MB") * 1024 * 1024

# --------------------------------------------------------------------------- #
# Email
# --------------------------------------------------------------------------- #
EMAIL_HOST = env("EMAIL_HOST")
EMAIL_PORT = env.int("EMAIL_PORT")
EMAIL_HOST_USER = env("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD")
EMAIL_USE_TLS = env.bool("EMAIL_USE_TLS")
DEFAULT_FROM_EMAIL = env("DEFAULT_FROM_EMAIL")
SERVER_EMAIL = env("SERVER_EMAIL")
if not EMAIL_HOST:
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

SITE_URL = env("SITE_URL").rstrip("/")
API_BASE_URL = env("API_BASE_URL").rstrip("/")

# --------------------------------------------------------------------------- #
# Security
# --------------------------------------------------------------------------- #
X_FRAME_OPTIONS = "DENY"
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "same-origin"
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SECURE = env.bool("REFRESH_COOKIE_SECURE")
CSRF_COOKIE_HTTPONLY = False  # the SPA reads it for the Django-admin-free flow only
CSRF_COOKIE_SECURE = env.bool("REFRESH_COOKIE_SECURE")
SECURE_SSL_REDIRECT = env.bool("SECURE_SSL_REDIRECT")
SECURE_HSTS_SECONDS = env.int("SECURE_HSTS_SECONDS")
SECURE_HSTS_INCLUDE_SUBDOMAINS = SECURE_HSTS_SECONDS > 0
SECURE_HSTS_PRELOAD = SECURE_HSTS_SECONDS > 0

if DEBUG:
    CACHES = {"default": {"BACKEND": "django.core.cache.backends.locmem.LocMemCache"}}
else:
    CACHES = {"default": env.cache_url("CACHE_URL", default="locmemcache://ananta?timeout=300")}

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {"format": "[{asctime}] {levelname} {name} {message}", "style": "{"},
    },
    "handlers": {
        "console": {"class": "logging.StreamHandler", "formatter": "verbose"},
    },
    "root": {"handlers": ["console"], "level": "INFO"},
    "loggers": {
        "django.security": {"handlers": ["console"], "level": "WARNING", "propagate": False},
        "django.request": {"handlers": ["console"], "level": "ERROR", "propagate": False},
        "ananta.audit": {"handlers": ["console"], "level": "INFO", "propagate": False},
        "ananta.auth": {"handlers": ["console"], "level": "INFO", "propagate": False},
    },
}
