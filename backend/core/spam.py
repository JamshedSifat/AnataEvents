"""Anti-spam helpers for public submission endpoints."""

from rest_framework import serializers


def check_honeypot(request, field: str = "website") -> bool:
    """Bots fill hidden fields; humans never see them.

    Returns True when the submission looks like spam.
    """
    if not isinstance(request.data, dict):
        return False
    return bool(str(request.data.get(field, "")).strip())


class HoneypotSerializer(serializers.Serializer):
    """Declares the hidden field so it never leaks into validated_data."""

    website = serializers.CharField(required=False, allow_blank=True, write_only=True)


def sanitize_html(html: str) -> str:
    """Allowlist-based sanitisation for rich text (blog content, answers)."""
    import bleach

    allowed_tags = [
        "p",
        "br",
        "strong",
        "b",
        "em",
        "i",
        "u",
        "ul",
        "ol",
        "li",
        "h2",
        "h3",
        "h4",
        "blockquote",
        "a",
        "img",
        "figure",
        "figcaption",
        "hr",
        "span",
    ]
    allowed_attrs = {
        "a": ["href", "title", "target", "rel"],
        "img": ["src", "alt", "title"],
    }
    return bleach.clean(
        html or "",
        tags=allowed_tags,
        attributes=allowed_attrs,
        protocols=["http", "https", "mailto"],
        strip=True,
    )
