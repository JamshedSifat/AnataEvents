"""Shared model building blocks: timestamps, publishing, ordering, images, slugs."""

from __future__ import annotations

from django.db import models
from django.utils.text import slugify

from apps.common.validators import validate_image_upload


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class PublishableModel(models.Model):
    is_published = models.BooleanField(
        default=True, db_index=True, help_text="Unpublished items are hidden from the public API."
    )
    published_at = models.DateTimeField(
        null=True, blank=True, help_text="Optional public release timestamp."
    )

    class Meta:
        abstract = True


class OrderedModel(models.Model):
    order = models.PositiveIntegerField(default=0, db_index=True)

    class Meta:
        abstract = True
        ordering = ["order", "-created_at"]


class SlugModel(models.Model):
    """Slug generated from a source field, unique per (optionally) parent scope."""

    slug = models.SlugField(max_length=180, db_index=True)
    SLUG_SOURCE_FIELD = "title"

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        if not self.slug:
            base = self._slug_base()
            candidate = base
            model = type(self)
            queryset = model.objects.exclude(pk=self.pk)
            scope = self.slug_scope_filter()
            if scope:
                queryset = queryset.filter(**scope)
            i = 2
            while queryset.filter(slug=candidate).exists():
                candidate = f"{base}-{i}"
                i += 1
            self.slug = candidate
        super().save(*args, **kwargs)

    def slug_scope_filter(self) -> dict:
        """Override to make slugs unique within a parent (e.g. {service: self.service})."""
        return {}

    def _slug_base(self) -> str:
        source = getattr(self, self.SLUG_SOURCE_FIELD, "") or ""
        if not source and hasattr(self, "name"):
            source = self.name
        return slugify(source)[:160] or "item"


class ImageUrlMixin(models.Model):
    """
    Image fields may be either an upload or a remote URL.

    The site originally hot-linked images from the old WordPress site, so both
    are supported: `image` (validated upload → configured storage) and
    `image_url` (external link). `image_src` returns whichever is set.
    """

    image = models.ImageField(
        upload_to="uploads/%Y/%m/",
        blank=True,
        null=True,
        validators=[validate_image_upload],
    )
    image_url = models.URLField(
        max_length=600,
        blank=True,
        help_text="External image URL (used when no file is uploaded).",
    )
    image_alt = models.CharField(max_length=255, blank=True)

    class Meta:
        abstract = True

    @property
    def image_src(self) -> str:
        try:
            if self.image:
                return self.image.url
        except ValueError:  # pragma: no cover - unset file without name
            pass
        return self.image_url or ""
