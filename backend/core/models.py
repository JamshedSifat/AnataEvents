"""Shared abstract models: timestamps, publishing, ordering, slugs."""

from django.db import models
from django.utils.text import slugify


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class PublishableModel(models.Model):
    is_published = models.BooleanField(
        "published",
        default=True,
        db_index=True,
        help_text="Unpublished items are hidden from all public endpoints.",
    )

    class Meta:
        abstract = True


class OrderedModel(models.Model):
    order = models.PositiveIntegerField(
        default=0, db_index=True, help_text="Lower numbers appear first."
    )

    class Meta:
        abstract = True
        ordering = ["order", "id"]


class SluggedModel(models.Model):
    slug = models.SlugField(max_length=220, unique=True, blank=True)

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        if not self.slug:
            base = getattr(self, "title", None) or getattr(self, "name", "") or "item"
            candidate = slugify(base)[:220] or "item"
            unique, n = candidate, 2
            model = self.__class__
            qs = model.objects.all()
            if self.pk:
                qs = qs.exclude(pk=self.pk)
            while qs.filter(slug=unique).exists():
                unique = f"{candidate}-{n}"
                n += 1
            self.slug = unique
        super().save(*args, **kwargs)
