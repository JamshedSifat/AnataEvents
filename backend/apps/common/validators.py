"""Reusable validators: Bangladeshi phone numbers, YouTube URLs, uploads, rich text."""

from __future__ import annotations

import re

from django.conf import settings
from django.core.exceptions import ValidationError
from django.utils.deconstruct import deconstructible

BD_PHONE_RE = re.compile(r"^(?:\+8801[3-9]\d{8}|8801[3-9]\d{8}|01[3-9]\d{8}|1[3-9]\d{8})$")


def validate_phone_bd(value: str) -> None:
    """Accept +8801XXXXXXXXX / 8801XXXXXXXXX / 01XXXXXXXXX (optionally spaced)."""
    if value in (None, ""):
        return
    cleaned = re.sub(r"[\s\-()]", "", str(value))
    if not BD_PHONE_RE.match(cleaned):
        raise ValidationError(
            "Enter a valid Bangladeshi phone number, e.g. 01712345678 or +8801712345678.",
            code="invalid_phone",
        )


YOUTUBE_HOSTS = {
    "youtube.com",
    "www.youtube.com",
    "m.youtube.com",
    "youtu.be",
    "www.youtu.be",
    "youtube-nocookie.com",
    "www.youtube-nocookie.com",
}


def validate_youtube_url(value: str) -> None:
    """Validate a YouTube watch/short/embed URL (used by Video and Artist)."""
    if value in (None, ""):
        return
    from urllib.parse import urlparse

    parsed = urlparse(str(value))
    if parsed.scheme not in {"http", "https"} or parsed.netloc.lower() not in YOUTUBE_HOSTS:
        raise ValidationError(
            "Enter a YouTube link (https://www.youtube.com/watch?v=... or https://youtu.be/...).",
            code="invalid_youtube_url",
        )


YOUTUBE_ID_RE = re.compile(r"(?:v=|/embed/|/shorts/|/live/|youtu\.be/)([A-Za-z0-9_-]{6,})")


def youtube_video_id(url: str) -> str:
    """Extract the 11-char video id from any common YouTube URL shape."""
    if not url:
        return ""
    match = YOUTUBE_ID_RE.search(str(url))
    return match.group(1) if match else ""


IMAGE_EXTENSIONS = {"jpg", "jpeg", "png", "webp", "gif", "avif", "svg"}
DOCUMENT_EXTENSIONS = {"pdf", "doc", "docx"}


def _extension(name: str) -> str:
    return name.rsplit(".", 1)[-1].lower() if "." in name else ""


def validate_image_upload(file) -> None:
    """Limit uploads to real images of a sane size (content type + extension)."""
    max_mb = getattr(settings, "FILE_UPLOAD_MAX_MB", 10)
    if file.size and file.size > max_mb * 1024 * 1024:
        raise ValidationError(f"Image must be smaller than {max_mb} MB.")
    content_type = getattr(file, "content_type", "") or ""
    if content_type and not content_type.startswith("image/"):
        raise ValidationError("Only image files are allowed.")
    if _extension(getattr(file, "name", "")) not in IMAGE_EXTENSIONS:
        raise ValidationError(
            "Unsupported image format. Allowed: " + ", ".join(sorted(IMAGE_EXTENSIONS))
        )


def validate_document_upload(file) -> None:
    """CV/résumé uploads: pdf/doc/docx up to the configured size."""
    max_mb = getattr(settings, "FILE_UPLOAD_MAX_MB", 10)
    if file.size and file.size > max_mb * 1024 * 1024:
        raise ValidationError(f"File must be smaller than {max_mb} MB.")
    if _extension(getattr(file, "name", "")) not in DOCUMENT_EXTENSIONS:
        raise ValidationError(
            "Unsupported file format. Allowed: " + ", ".join(sorted(DOCUMENT_EXTENSIONS))
        )


@deconstructible
class FileSizeValidator:
    """Validator class usable in model fields (`validators=[FileSizeValidator(5)])`)."""

    def __init__(self, max_mb: int):
        self.max_mb = max_mb

    def __call__(self, file):
        if file.size and file.size > self.max_mb * 1024 * 1024:
            raise ValidationError(f"File must be smaller than {self.max_mb} MB.")

    def __eq__(self, other) -> bool:
        return isinstance(other, FileSizeValidator) and other.max_mb == self.max_mb


ALLOWED_RICH_TEXT_TAGS = [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "ul",
    "ol",
    "li",
    "blockquote",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "a",
    "img",
    "figure",
    "figcaption",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "hr",
    "div",
    "span",
    "small",
    "code",
    "pre",
    "sup",
    "sub",
]
ALLOWED_RICH_TEXT_ATTRS = {
    "a": ["href", "title", "target", "rel"],
    "img": ["src", "alt", "title", "width", "height", "loading"],
    "*": ["class", "style"],
}


def sanitize_html(value: str) -> str:
    """Strip scripts/handlers from admin-provided rich text before storing it."""
    if not value:
        return value
    import bleach
    from bleach.css_sanitizer import CSSSanitizer

    return bleach.clean(
        str(value),
        tags=ALLOWED_RICH_TEXT_TAGS,
        attributes=ALLOWED_RICH_TEXT_ATTRS,
        protocols=["http", "https", "mailto", "tel"],
        css_sanitizer=CSSSanitizer(
            allowed_css_properties=[
                "color",
                "background-color",
                "text-align",
                "font-weight",
                "width",
                "height",
            ]
        ),
        strip=True,
    )
