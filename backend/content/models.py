"""CMS models: hero, settings, services, entries, media, blog, etc.

Where several legacy admin pages managed near-identical shapes (corporate
events / exhibition stalls / photography services / special events), a single
generic ``ServiceEntry`` model with ``entry_type`` is used.
"""

from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils import timezone

from core.models import OrderedModel, PublishableModel, SluggedModel, TimeStampedModel
from core.utils import validate_image_upload


class SiteSettings(TimeStampedModel):
    """Singleton key store for company-wide info (footer, contact, SEO)."""

    site_name = models.CharField(max_length=120, default="Ananta Events")
    tagline = models.CharField(max_length=200, blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=30, blank=True)
    whatsapp = models.CharField(max_length=30, blank=True)
    address = models.CharField(max_length=300, blank=True)
    facebook = models.URLField(blank=True)
    instagram = models.URLField(blank=True)
    youtube = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)
    pinterest = models.URLField(blank=True)
    about_text = models.TextField(blank=True)
    footer_text = models.TextField(blank=True)
    map_embed_url = models.URLField(blank=True)
    seo_title = models.CharField(max_length=200, blank=True)
    seo_description = models.TextField(blank=True)
    og_image = models.URLField(blank=True)
    about_stats = models.JSONField(
        default=list, blank=True, help_text="About page stats [{number, label, icon}]"
    )
    about_values = models.JSONField(
        default=list, blank=True, help_text="About page core values [{icon, title, description}]"
    )

    class Meta:
        verbose_name = "site settings"
        verbose_name_plural = "site settings"

    def save(self, *args, **kwargs):
        self.pk = 1  # singleton
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return "Site settings"


class HeroSlide(PublishableModel, OrderedModel, TimeStampedModel):
    subtitle = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    image = models.CharField(
        max_length=600,
        help_text="Absolute URL or uploaded image.",
    )
    image_file = models.FileField(
        upload_to="hero/%Y/%m/", blank=True, validators=[validate_image_upload]
    )
    stats = models.CharField(
        max_length=120, blank=True, help_text="Badge text, e.g. '500+ Events Planned'"
    )

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.subtitle

    @property
    def resolved_image(self):
        return (self.image_file.url if self.image_file else self.image) or ""


class Service(PublishableModel, OrderedModel, SluggedModel, TimeStampedModel):
    """One of the company's main service lines shown on /services."""

    name = models.CharField(max_length=150)
    category = models.CharField(max_length=80, blank=True, help_text="Display category label")
    icon = models.CharField(max_length=16, blank=True, help_text="Emoji icon")
    short_description = models.TextField(blank=True)
    description = models.TextField(blank=True)
    image = models.CharField(max_length=600, blank=True)
    price = models.CharField(max_length=60, blank=True, help_text="Display price, e.g. '৳50,000+'")
    features = models.JSONField(default=list, blank=True)
    link = models.CharField(
        max_length=200, blank=True, help_text="Optional page link, e.g. /services/corporate-events"
    )
    status = models.CharField(max_length=20, default="active", editable=False)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.name


class ServiceEntry(PublishableModel, OrderedModel, SluggedModel, TimeStampedModel):
    """Generic content entry for corporate events, exhibition stalls,
    photography services and special events (same legacy shape everywhere:
    title/slug/category/excerpt/content/images/author/date/featured)."""

    class EntryType(models.TextChoices):
        CORPORATE_EVENT = "corporate_event", "Corporate Event"
        EXHIBITION_STALL = "exhibition_stall", "Exhibition Stall"
        PHOTOGRAPHY_SERVICE = "photography_service", "Photography Service"
        SPECIAL_EVENT = "special_event", "Special Event"

    entry_type = models.CharField(max_length=30, choices=EntryType.choices, db_index=True)
    title = models.CharField(max_length=250)
    category = models.CharField(max_length=120, blank=True)
    excerpt = models.TextField(blank=True)
    content = models.TextField(blank=True)
    author = models.CharField(max_length=120, blank=True)
    date = models.DateField(default=timezone.localdate)
    featured = models.BooleanField(default=False)
    cover_image = models.CharField(max_length=600, blank=True)
    images = models.JSONField(default=list, blank=True, help_text="List of image URLs")
    tags = models.JSONField(default=list, blank=True)
    # Special events extras (services list + stats from legacy SpecialEvent.json)
    included_services = models.JSONField(default=list, blank=True)
    stats = models.JSONField(default=list, blank=True, help_text="[{number, label}]")
    legacy_id = models.CharField(
        max_length=220, blank=True, help_text="Original frontend id/slug for redirect mapping"
    )

    class Meta:
        ordering = ["-date", "order", "id"]
        indexes = [models.Index(fields=["entry_type", "is_published"])]

    def __str__(self):
        return f"[{self.entry_type}] {self.title}"

    def clean(self):
        if self.images and not isinstance(self.images, list):
            raise ValidationError({"images": "Must be a list of image URLs."})


class FAQ(PublishableModel, OrderedModel, TimeStampedModel):
    class Page(models.TextChoices):
        HOME = "home", "Home"
        CORPORATE = "corporate", "Corporate"
        INFLUENCER = "influencer", "Influencer"

    page = models.CharField(max_length=20, choices=Page.choices, default=Page.HOME, db_index=True)
    question = models.CharField(max_length=300)
    answer = models.TextField()

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.question


class Testimonial(PublishableModel, OrderedModel, TimeStampedModel):
    name = models.CharField(max_length=120)
    designation = models.CharField(max_length=150, blank=True)
    company = models.CharField(max_length=150, blank=True)
    image = models.CharField(max_length=600, blank=True)
    rating = models.PositiveSmallIntegerField(
        default=5, validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    review = models.TextField()
    event_type = models.CharField(max_length=80, blank=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.name} ({self.rating}★)"


class TeamMember(PublishableModel, OrderedModel, TimeStampedModel):
    name = models.CharField(max_length=120)
    role = models.CharField(max_length=120)
    image = models.CharField(max_length=600, blank=True)
    description = models.TextField(blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=30, blank=True)
    social = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.name} — {self.role}"


class PortfolioItem(PublishableModel, OrderedModel, SluggedModel, TimeStampedModel):
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=80, blank=True, db_index=True)
    image = models.CharField(max_length=600, blank=True)
    gallery = models.JSONField(default=list, blank=True)
    description = models.TextField(blank=True)
    client = models.CharField(max_length=150, blank=True)
    event_date = models.CharField(
        max_length=60, blank=True, help_text="Display date, e.g. 'June 2023'"
    )
    budget = models.CharField(max_length=60, blank=True)
    video_url = models.URLField(blank=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title


class GalleryImage(PublishableModel, OrderedModel, TimeStampedModel):
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=80, blank=True, db_index=True)
    image = models.CharField(max_length=600, help_text="Image URL or uploaded file")
    image_file = models.FileField(
        upload_to="gallery/%Y/%m/", blank=True, validators=[validate_image_upload]
    )
    description = models.TextField(blank=True)

    class Meta:
        ordering = ["order", "id"]
        verbose_name_plural = "gallery images"

    def __str__(self):
        return self.title

    @property
    def resolved_image(self):
        return (self.image_file.url if self.image_file else self.image) or ""


class Video(PublishableModel, OrderedModel, TimeStampedModel):
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=80, blank=True, db_index=True)
    youtube_id = models.CharField(max_length=20)
    description = models.TextField(blank=True)
    thumbnail = models.CharField(max_length=600, blank=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title


class BlogPost(PublishableModel, OrderedModel, SluggedModel, TimeStampedModel):
    title = models.CharField(max_length=250)
    category = models.CharField(max_length=80, blank=True, db_index=True)
    image = models.CharField(max_length=600, blank=True)
    excerpt = models.TextField(blank=True)
    content = models.TextField(blank=True, help_text="HTML — sanitised server-side")
    author = models.CharField(max_length=120, blank=True)
    published_date = models.DateField(default=timezone.localdate, db_index=True)
    read_time = models.CharField(max_length=40, blank=True)
    tags = models.JSONField(default=list, blank=True)
    featured = models.BooleanField(default=False)
    views = models.PositiveIntegerField(default=0)
    legacy_id = models.CharField(max_length=220, blank=True)

    class Meta:
        ordering = ["-published_date", "id"]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        from core.spam import sanitize_html

        if self.content:
            self.content = sanitize_html(self.content)
        super().save(*args, **kwargs)
