"""Validation + formatting helpers shared across apps."""

import re

from django.core.exceptions import ValidationError
from django.utils.text import slugify

# BD mobile: +8801XXXXXXXXX / 8801XXXXXXXXX / 01XXXXXXXXX (operator 13-19)
BD_PHONE_RE = re.compile(r"^(?:\+?880|0)1[3-9]\d{8}$")
# Relaxed international format for foreign clients (+CC 6-14 digits).
INTL_PHONE_RE = re.compile(r"^\+\d{6,14}$")

YOUTUBE_RE = re.compile(
    r"(?:youtube\.com/(?:watch\?(?:.*&)?v=|embed/|shorts/)|youtu\.be/)" r"([A-Za-z0-9_-]{11})"
)
YOUTUBE_ID_RE = re.compile(r"^[A-Za-z0-9_-]{11}$")

IMAGE_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
DOC_CONTENT_TYPES = {
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}

MAX_IMAGE_MB = 5
MAX_DOC_MB = 5


def validate_bd_phone(value: str) -> str:
    v = re.sub(r"[\s-]", "", value or "")
    if not (BD_PHONE_RE.match(v) or INTL_PHONE_RE.match(v)):
        raise ValidationError(
            "Enter a valid Bangladeshi mobile number (e.g. 01712345678 or " "+8801712345678)."
        )
    return v


def normalize_bd_phone(value: str) -> str:
    """Return +8801XXXXXXXXX form when possible, else the cleaned input."""
    v = re.sub(r"[\s-]", "", value or "")
    if BD_PHONE_RE.match(v):
        if v.startswith("+880"):
            return v
        if v.startswith("880"):
            return f"+{v}"
        return f"+88{v}"
    return v


def extract_youtube_id(url_or_id: str) -> str:
    """Accepts full YouTube URLs (watch/embed/shorts/youtu.be) or a raw ID."""
    v = (url_or_id or "").strip()
    if YOUTUBE_ID_RE.match(v):
        return v
    m = YOUTUBE_RE.search(v)
    if m:
        return m.group(1)
    raise ValidationError("Enter a valid YouTube URL or 11-character video ID.")


def unique_slug(model, value: str, exclude_pk=None) -> str:
    base = slugify(value)[:220] or "item"
    candidate, n = base, 2
    qs = model.objects.all()
    if exclude_pk:
        qs = qs.exclude(pk=exclude_pk)
    while qs.filter(slug=candidate).exists():
        candidate = f"{base}-{n}"
        n += 1
    return candidate


def _check_upload(f, max_mb: float, kinds: set, extensions: list):
    if f and getattr(f, "size", 0) > max_mb * 1024 * 1024:
        raise ValidationError(f"File must be {max_mb:g} MB or smaller.")
    content_type = getattr(f, "content_type", None)
    if f and content_type and content_type not in kinds:
        raise ValidationError("Unsupported file type.")
    ext = getattr(f, "name", "").rsplit(".", 1)[-1].lower() if f else ""
    if f and ext and f".{ext}" not in extensions:
        raise ValidationError(
            f"Allowed file types: {', '.join(e.lstrip('.') for e in extensions)}."
        )


def validate_image_upload(f):
    _check_upload(
        f,
        MAX_IMAGE_MB,
        IMAGE_CONTENT_TYPES,
        [".jpg", ".jpeg", ".png", ".webp", ".gif"],
    )


def validate_doc_upload(f):
    _check_upload(
        f,
        MAX_DOC_MB,
        DOC_CONTENT_TYPES,
        [".pdf", ".doc", ".docx"],
    )
