"""Artist directory: bookable artists, influencers, talent-hunt profiles."""

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from core.models import OrderedModel, PublishableModel, SluggedModel, TimeStampedModel
from core.utils import validate_bd_phone, validate_image_upload


class Artist(PublishableModel, OrderedModel, SluggedModel, TimeStampedModel):
    """ONE model for all bookable performers (singer/dj/comedian/magician/dancer).

    Superset of the five legacy per-type shapes; optional fields stay blank
    when irrelevant for the category.
    """

    class Category(models.TextChoices):
        SINGER = "singer", "Singer"
        DJ = "dj", "DJ"
        COMEDIAN = "comedian", "Comedian"
        MAGICIAN = "magician", "Magician"
        DANCER = "dancer", "Dancer"

    name = models.CharField(max_length=150, db_index=True)
    category = models.CharField(max_length=20, choices=Category.choices, db_index=True)
    image = models.CharField(max_length=600, blank=True)
    image_file = models.FileField(
        upload_to="artists/%Y/%m/", blank=True, validators=[validate_image_upload]
    )
    rating = models.DecimalField(
        max_digits=2,
        decimal_places=1,
        default=4.5,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
    )
    price = models.CharField(max_length=80, blank=True, help_text="Display price, e.g. '৳8,00,000'")
    description = models.TextField(blank=True, help_text="Short card description")
    bio = models.TextField(blank=True, help_text="Longer bio for detail views")
    genre = models.CharField(max_length=200, blank=True, help_text="e.g. 'Pop, Romantic'")
    experience = models.CharField(
        max_length=80, blank=True, help_text="Display text, e.g. '20+ years'"
    )
    experience_years = models.PositiveIntegerField(null=True, blank=True)
    languages = models.JSONField(default=list, blank=True)
    popular_songs = models.JSONField(default=list, blank=True)
    specialties = models.JSONField(default=list, blank=True)
    awards = models.JSONField(default=list, blank=True)
    styles = models.JSONField(default=list, blank=True, help_text="Dance styles")
    social_media = models.JSONField(
        default=dict, blank=True, help_text="{facebook, instagram, youtube, twitter}"
    )
    availability = models.CharField(max_length=60, blank=True, default="Available")
    location = models.CharField(max_length=150, blank=True)
    city = models.CharField(max_length=80, blank=True)
    country = models.CharField(max_length=80, blank=True)
    contact_email = models.EmailField(blank=True)
    phone = models.CharField(max_length=30, blank=True, validators=[validate_bd_phone])
    famous_show = models.CharField(max_length=200, blank=True)
    famous_for = models.CharField(max_length=250, blank=True)
    media_presence = models.CharField(max_length=200, blank=True)
    followers = models.CharField(max_length=60, blank=True, help_text="Display text, e.g. '2.5M'")
    tour_status = models.CharField(max_length=60, blank=True, default="Active")

    class Meta:
        ordering = ["order", "name"]
        indexes = [models.Index(fields=["category", "is_published"])]

    def __str__(self):
        return f"{self.name} ({self.category})"

    @property
    def resolved_image(self):
        return (self.image_file.url if self.image_file else self.image) or ""


class InfluencerProfile(PublishableModel, OrderedModel, SluggedModel, TimeStampedModel):
    name = models.CharField(max_length=150, db_index=True)
    category = models.CharField(max_length=100, blank=True, help_text="Niche, e.g. 'Fashion'")
    image = models.CharField(max_length=600, blank=True)
    image_file = models.FileField(
        upload_to="influencers/%Y/%m/", blank=True, validators=[validate_image_upload]
    )
    followers = models.CharField(max_length=60, blank=True)
    engagement = models.CharField(max_length=30, blank=True, help_text="e.g. '4.2%'")
    posts = models.CharField(max_length=30, blank=True)
    platforms = models.JSONField(default=list, blank=True)
    bio = models.TextField(blank=True)
    description = models.TextField(blank=True)
    avg_reach = models.CharField(max_length=80, blank=True)
    price = models.CharField(max_length=80, blank=True)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return f"{self.name} ({self.category or 'influencer'})"

    @property
    def resolved_image(self):
        return (self.image_file.url if self.image_file else self.image) or ""


class TalentProfile(PublishableModel, OrderedModel, TimeStampedModel):
    """Demo talent shown on the public talent-hunt page (legacy TalentHunt.json)."""

    name = models.CharField(max_length=150)
    category = models.CharField(max_length=100, db_index=True)
    image = models.CharField(max_length=300, blank=True, help_text="URL or emoji")
    rating = models.DecimalField(
        max_digits=2,
        decimal_places=1,
        default=4.5,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
    )
    experience = models.CharField(max_length=80, blank=True)
    bio = models.TextField(blank=True)
    full_bio = models.TextField(blank=True)
    video_url = models.URLField(blank=True)
    audio_url = models.URLField(blank=True)
    portfolio = models.URLField(blank=True)
    instagram = models.URLField(blank=True)
    achievements = models.JSONField(default=list, blank=True)
    rates = models.CharField(max_length=150, blank=True)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return f"{self.name} ({self.category})"
