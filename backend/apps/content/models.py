"""Content models for the public website.

Modelling strategy (documented in README → Assumptions):
* `Service` + `ServiceEntry` cover every "list of things under a service" shape
  the site has (corporate events, exhibition stall design, photography/video,
  special events) instead of one table per page, because the shapes are identical.
* `Artist` is a single table with a `category` discriminator (singer / dj /
  comedian / magician / dancer) because the five admin pages differ only by
  category and JSON shape — the differences are expressed in JSON list fields
  (`styles`, `genres`, `highlights`) instead of five near-identical tables.
* Genuinely different shapes (BlogPost, JobPosting, Testimonial, TeamMember,
  FAQ, Video, GalleryImage, PortfolioItem) get their own tables.
"""

from __future__ import annotations

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _

from apps.common.models import (
    ImageUrlMixin,
    OrderedModel,
    PublishableModel,
    SlugModel,
    TimeStampedModel,
)
from apps.common.validators import (
    validate_youtube_url,
    youtube_video_id,
)


class SingletonModel(models.Model):
    """Only one row may exist (SiteSettings)."""

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class SiteSettings(SingletonModel, TimeStampedModel):
    company_name = models.CharField(max_length=120, default="Ananta Events")
    tagline = models.CharField(max_length=200, blank=True)
    phone = models.CharField(max_length=30, blank=True)
    phone_alt = models.CharField(max_length=30, blank=True)
    email = models.EmailField(blank=True)
    address = models.CharField(max_length=300, blank=True)
    map_embed_url = models.URLField(max_length=600, blank=True)
    facebook = models.URLField(blank=True)
    instagram = models.URLField(blank=True)
    youtube = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)
    twitter = models.URLField(blank=True)
    tiktok = models.URLField(blank=True)
    whatsapp = models.CharField(max_length=30, blank=True)
    about_short = models.TextField(blank=True)
    footer_text = models.CharField(max_length=300, blank=True)
    default_seo_title = models.CharField(max_length=200, blank=True)
    default_seo_description = models.CharField(max_length=320, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _("site settings")
        verbose_name_plural = _("site settings")

    def __str__(self) -> str:
        return self.company_name


class HeroSlide(ImageUrlMixin, OrderedModel, PublishableModel, TimeStampedModel):
    subtitle = models.CharField(max_length=150, blank=True)
    heading = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    stats = models.CharField(max_length=120, blank=True, help_text="e.g. '500+ Events Planned'")
    cta_label = models.CharField(max_length=60, blank=True)
    cta_url = models.CharField(max_length=200, blank=True)

    class Meta(OrderedModel.Meta):
        verbose_name = _("hero slide")
        verbose_name_plural = _("hero slides")

    def __str__(self) -> str:
        return self.subtitle or self.heading or f"Slide {self.pk}"


class Service(SlugModel, ImageUrlMixin, OrderedModel, PublishableModel, TimeStampedModel):
    """Top-level service (Corporate Events, Wedding Planning, …) with rich body."""

    name = models.CharField(max_length=180)
    badge = models.CharField(max_length=80, blank=True, help_text="Small label above the heading.")
    heading = models.CharField(max_length=220, blank=True)
    heading_highlight = models.CharField(max_length=180, blank=True)
    summary = models.TextField(blank=True, help_text="Short card/teaser text.")
    body = models.TextField(blank=True, help_text="Sanitised rich text (HTML).")
    icon = models.CharField(max_length=16, blank=True, help_text="Emoji shown on cards.")
    color_from = models.CharField(max_length=40, blank=True, default="from-red-500")
    color_to = models.CharField(max_length=40, blank=True, default="to-pink-500")
    features = models.JSONField(default=list, blank=True)
    seo_title = models.CharField(max_length=200, blank=True)
    seo_description = models.CharField(max_length=320, blank=True)
    show_in_nav = models.BooleanField(default=True)
    SLUG_SOURCE_FIELD = "name"

    class Meta(OrderedModel.Meta):
        verbose_name = _("service")
        verbose_name_plural = _("services")
        indexes = [models.Index(fields=["is_published", "order"])]

    def __str__(self) -> str:
        return self.name

    @property
    def entries(self):
        return self.serviceentry_set.filter(is_published=True).order_by("order", "id")


class ServiceEntry(SlugModel, ImageUrlMixin, OrderedModel, PublishableModel, TimeStampedModel):
    """A sub-page under a service (corporate event detail, special event, …)."""

    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="serviceentry_set")
    title = models.CharField(max_length=200)
    subtitle = models.CharField(max_length=200, blank=True)
    badge = models.CharField(max_length=120, blank=True, help_text="Hero eyebrow text.")
    hero_subtitle = models.CharField(max_length=220, blank=True)
    category = models.CharField(max_length=120, blank=True)
    summary = models.CharField(max_length=400, blank=True)
    body = models.TextField(blank=True, help_text="Sanitised rich text (HTML).")
    intro_title = models.CharField(max_length=250, blank=True)
    gallery_title = models.CharField(max_length=250, blank=True)
    highlights_title = models.CharField(max_length=250, blank=True)
    features_title = models.CharField(max_length=250, blank=True)
    features = models.JSONField(
        default=list, blank=True, help_text="List of service bullets shown on the detail page."
    )
    stats = models.JSONField(
        default=list, blank=True, help_text="[{'number': '20+', 'label': 'Events'}]"
    )
    highlights = models.JSONField(
        default=list,
        blank=True,
        help_text='Extra cards: [{"icon": "🎯", "title": "...", "description": "..."}]',
    )
    extra_sections = models.JSONField(
        default=list,
        blank=True,
        help_text=(
            'Additional page sections: [{"title": "...", "style": "cards|list|text", '
            '"items": [...]}] — keeps page-specific blocks (packages, tips, steps) in one '
            "generic field instead of one table per layout."
        ),
    )
    cta_title = models.CharField(max_length=250, blank=True)
    cta_text = models.CharField(max_length=400, blank=True)
    cta_button_label = models.CharField(max_length=80, blank=True)
    cta_button_url = models.CharField(max_length=250, blank=True)
    client = models.CharField(max_length=150, blank=True)
    location = models.CharField(max_length=150, blank=True)
    event_date = models.DateField(null=True, blank=True)
    video_url = models.URLField(max_length=400, blank=True, validators=[validate_youtube_url])
    seo_title = models.CharField(max_length=200, blank=True)
    seo_description = models.CharField(max_length=320, blank=True)
    is_featured = models.BooleanField(default=False)

    class Meta(OrderedModel.Meta):
        verbose_name = _("service entry")
        verbose_name_plural = _("service entries")
        constraints = [
            models.UniqueConstraint(fields=["service", "slug"], name="unique_service_entry_slug"),
        ]
        indexes = [
            models.Index(fields=["service", "is_published", "order"]),
        ]

    def __str__(self) -> str:
        return f"{self.service.name} — {self.title}"

    def slug_scope_filter(self) -> dict:
        return {"service": self.service} if self.service_id else {}

    @property
    def gallery(self):
        return self.images.order_by("order", "id")


class ServiceEntryImage(ImageUrlMixin, OrderedModel, TimeStampedModel):
    entry = models.ForeignKey(ServiceEntry, on_delete=models.CASCADE, related_name="images")
    caption = models.CharField(max_length=250, blank=True)

    class Meta(OrderedModel.Meta):
        verbose_name = _("service entry image")
        verbose_name_plural = _("service entry images")

    def __str__(self) -> str:
        return self.caption or f"Image {self.pk}"


class Artist(SlugModel, ImageUrlMixin, OrderedModel, PublishableModel, TimeStampedModel):
    """Singers, DJs, comedians, magicians and dancers in one table."""

    class Category(models.TextChoices):
        SINGER = "singer", _("Singer")
        DJ = "dj", _("DJ")
        COMEDIAN = "comedian", _("Comedian")
        MAGICIAN = "magician", _("Magician")
        DANCER = "dancer", _("Dancer / Choreographer")

    name = models.CharField(max_length=160)
    category = models.CharField(max_length=20, choices=Category.choices, db_index=True)
    country = models.CharField(max_length=80, blank=True, default="Bangladesh")
    city = models.CharField(max_length=80, blank=True)
    bio = models.TextField(blank=True)
    genre = models.CharField(
        max_length=200, blank=True, help_text="Free text, e.g. 'Pop, Folk Fusion'."
    )
    styles = models.JSONField(default=list, blank=True, help_text="Styles / genres / dance forms.")
    famous_for = models.CharField(max_length=250, blank=True)
    famous_show = models.CharField(max_length=200, blank=True)
    experience_years = models.PositiveSmallIntegerField(null=True, blank=True)
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(10)],
    )
    price = models.CharField(
        max_length=60, blank=True, help_text="Display string, e.g. '৳8,00,000'."
    )
    availability = models.CharField(max_length=60, blank=True, default="Available")
    languages = models.JSONField(default=list, blank=True)
    popular_songs = models.JSONField(default=list, blank=True)
    achievements = models.JSONField(default=list, blank=True)
    media_presence = models.CharField(max_length=250, blank=True)
    social_followers = models.CharField(max_length=60, blank=True)
    contact_email = models.EmailField(blank=True)
    phone = models.CharField(max_length=30, blank=True)
    website = models.URLField(blank=True)
    instagram = models.URLField(blank=True)
    facebook = models.URLField(blank=True)
    youtube = models.URLField(blank=True)
    video_url = models.URLField(max_length=400, blank=True, validators=[validate_youtube_url])
    is_featured = models.BooleanField(default=False)

    class Meta(OrderedModel.Meta):
        verbose_name = _("artist")
        verbose_name_plural = _("artists")
        indexes = [
            models.Index(fields=["category", "is_published", "order"]),
            models.Index(fields=["is_featured"]),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=["name", "category"], name="unique_artist_name_category"
            ),
        ]

    def __str__(self) -> str:
        return f"{self.name} ({self.get_category_display()})"

    def save(self, *args, **kwargs):
        if self.video_url and not self.youtube:
            self.youtube = self.video_url
        super().save(*args, **kwargs)

    @property
    def youtube_embed(self) -> str:
        vid = youtube_video_id(self.video_url or self.youtube)
        return f"https://www.youtube.com/embed/{vid}" if vid else ""


class InfluencerProfile(ImageUrlMixin, OrderedModel, PublishableModel, TimeStampedModel):
    name = models.CharField(max_length=160)
    handle = models.CharField(max_length=120, blank=True)
    platform = models.CharField(max_length=60, blank=True, default="Instagram")
    followers = models.CharField(max_length=40, blank=True, help_text="Display string: '1.2M'.")
    engagement_rate = models.CharField(max_length=20, blank=True)
    niche = models.CharField(max_length=120, blank=True)
    country = models.CharField(max_length=80, blank=True, default="Bangladesh")
    city = models.CharField(max_length=80, blank=True)
    bio = models.TextField(blank=True)
    profile_url = models.URLField(blank=True)
    is_featured = models.BooleanField(default=False)

    class Meta(OrderedModel.Meta):
        verbose_name = _("influencer profile")
        verbose_name_plural = _("influencer profiles")

    def __str__(self) -> str:
        return f"{self.name} · {self.platform}"


class ContentBlock(OrderedModel, PublishableModel, TimeStampedModel):
    """
    Generic, admin-managed content block for the small marketing sections that do
    not justify their own table ("Why choose us" cards, client logos, nationwide
    coverage cities, brand values, statistics …).

    One table with a `section` discriminator keeps the admin UI small and lets
    the site render these sections from the API instead of hardcoded JSX.
    """

    class Section(models.TextChoices):
        WHY_CHOOSE_US = "why_choose_us", _("Home — why choose us")
        CLIENT = "client", _("Home — client logo")
        COVERAGE = "coverage", _("Home — coverage city")
        ABOUT_VALUE = "about_value", _("About — core value")
        ABOUT_MILESTONE = "about_milestone", _("About — journey milestone")
        ABOUT_COMMITMENT = "about_commitment", _("About — commitment")
        STATISTIC = "statistic", _("Statistic")
        BOOK_ARTIST = "book_artist", _("Book an artist — category card")
        OPPORTUNITY = "opportunity", _("Opportunities — card")
        VIRTUAL_EVENT = "virtual_event", _("Virtual events — feature")
        PHOTOGRAPHY = "photography", _("Photography — feature")
        INFLUENCER = "influencer", _("Influencer marketing — feature")
        CONTACT = "contact", _("Contact page — info card")
        HOME_CTA = "home_cta", _("Home — call to action")

    section = models.CharField(max_length=32, choices=Section.choices, db_index=True)
    title = models.CharField(max_length=250)
    subtitle = models.CharField(max_length=250, blank=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=16, blank=True)
    value = models.CharField(max_length=120, blank=True, help_text="Badge/stat value, e.g. '500+'.")
    url = models.CharField(max_length=400, blank=True)
    image = models.ImageField(upload_to="uploads/blocks/", blank=True, null=True)
    image_url = models.URLField(max_length=600, blank=True)
    extra = models.JSONField(default=dict, blank=True)

    class Meta(OrderedModel.Meta):
        verbose_name = _("content block")
        verbose_name_plural = _("content blocks")
        indexes = [models.Index(fields=["section", "is_published", "order"])]

    def __str__(self) -> str:
        return f"[{self.get_section_display()}] {self.title}"

    @property
    def image_src(self) -> str:
        try:
            if self.image:
                return self.image.url
        except ValueError:  # pragma: no cover
            pass
        return self.image_url or ""


class PortfolioItem(SlugModel, ImageUrlMixin, OrderedModel, PublishableModel, TimeStampedModel):
    title = models.CharField(max_length=200)
    client = models.CharField(max_length=160, blank=True)
    category = models.CharField(max_length=120, blank=True, db_index=True)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=150, blank=True)
    event_date = models.DateField(null=True, blank=True)
    is_featured = models.BooleanField(default=False)
    video_url = models.URLField(max_length=400, blank=True, validators=[validate_youtube_url])

    class Meta(OrderedModel.Meta):
        verbose_name = _("portfolio item")
        verbose_name_plural = _("portfolio items")
        indexes = [models.Index(fields=["is_published", "category", "order"])]

    def __str__(self) -> str:
        return self.title

    @property
    def gallery(self):
        return self.images.order_by("order", "id")


class PortfolioImage(ImageUrlMixin, OrderedModel, TimeStampedModel):
    item = models.ForeignKey(PortfolioItem, on_delete=models.CASCADE, related_name="images")
    caption = models.CharField(max_length=250, blank=True)

    class Meta(OrderedModel.Meta):
        verbose_name = _("portfolio image")
        verbose_name_plural = _("portfolio images")

    def __str__(self) -> str:
        return self.caption or f"Image {self.pk}"


class GalleryImage(ImageUrlMixin, OrderedModel, PublishableModel, TimeStampedModel):
    title = models.CharField(max_length=200, blank=True)
    album = models.CharField(max_length=120, blank=True, db_index=True)
    caption = models.CharField(max_length=300, blank=True)

    class Meta(OrderedModel.Meta):
        verbose_name = _("gallery image")
        verbose_name_plural = _("gallery images")
        indexes = [models.Index(fields=["is_published", "album", "order"])]

    def __str__(self) -> str:
        return self.title or f"Gallery image {self.pk}"


class Video(OrderedModel, PublishableModel, TimeStampedModel):
    title = models.CharField(max_length=200)
    youtube_url = models.URLField(max_length=400, validators=[validate_youtube_url])
    description = models.TextField(blank=True)
    category = models.CharField(max_length=120, blank=True, db_index=True)
    duration = models.CharField(max_length=20, blank=True)

    class Meta(OrderedModel.Meta):
        verbose_name = _("video")
        verbose_name_plural = _("videos")
        indexes = [models.Index(fields=["is_published", "order"])]

    def __str__(self) -> str:
        return self.title

    @property
    def youtube_id(self) -> str:
        return youtube_video_id(self.youtube_url)

    @property
    def thumbnail_url(self) -> str:
        vid = self.youtube_id
        return f"https://i.ytimg.com/vi/{vid}/hqdefault.jpg" if vid else ""

    @property
    def embed_url(self) -> str:
        vid = self.youtube_id
        return f"https://www.youtube.com/embed/{vid}" if vid else ""


class BlogPost(SlugModel, ImageUrlMixin, PublishableModel, TimeStampedModel):
    title = models.CharField(max_length=250)
    category = models.CharField(max_length=120, blank=True, db_index=True)
    excerpt = models.CharField(max_length=500, blank=True)
    content = models.TextField(help_text="Sanitised rich text (HTML).")
    author_name = models.CharField(max_length=160, blank=True, default="Ananta Events")
    author = models.ForeignKey(
        "accounts.User",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="blog_posts",
    )
    tags = models.JSONField(default=list, blank=True)
    is_featured = models.BooleanField(default=False)
    views = models.PositiveIntegerField(default=0)
    read_minutes = models.PositiveSmallIntegerField(default=4)

    class Meta:
        verbose_name = _("blog post")
        verbose_name_plural = _("blog posts")
        ordering = ["-published_at", "-created_at"]
        indexes = [
            models.Index(fields=["is_published", "published_at"]),
            models.Index(fields=["is_featured"]),
        ]

    def __str__(self) -> str:
        return self.title

    def save(self, *args, **kwargs):
        if self.is_published and self.published_at is None:
            self.published_at = timezone.now()
        if self.excerpt and len(self.excerpt) > 500:
            self.excerpt = self.excerpt[:500]
        super().save(*args, **kwargs)


class Testimonial(ImageUrlMixin, OrderedModel, PublishableModel, TimeStampedModel):
    name = models.CharField(max_length=160)
    designation = models.CharField(max_length=160, blank=True)
    company = models.CharField(max_length=160, blank=True)
    rating = models.PositiveSmallIntegerField(
        default=5, validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    review = models.TextField()
    event_type = models.CharField(max_length=120, blank=True)
    is_featured = models.BooleanField(default=False)

    class Meta(OrderedModel.Meta):
        verbose_name = _("testimonial")
        verbose_name_plural = _("testimonials")

    def __str__(self) -> str:
        return f"{self.name} — {self.rating}★"


class TeamMember(ImageUrlMixin, OrderedModel, PublishableModel, TimeStampedModel):
    name = models.CharField(max_length=160)
    role = models.CharField(max_length=160)
    description = models.TextField(blank=True)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=30, blank=True)
    linkedin = models.URLField(blank=True)
    facebook = models.URLField(blank=True)
    instagram = models.URLField(blank=True)
    twitter = models.URLField(blank=True)

    class Meta(OrderedModel.Meta):
        verbose_name = _("team member")
        verbose_name_plural = _("team members")

    def __str__(self) -> str:
        return f"{self.name} ({self.role})"


class FAQ(OrderedModel, PublishableModel, TimeStampedModel):
    class Section(models.TextChoices):
        HOME = "home", _("Home")
        CORPORATE = "corporate", _("Corporate events")
        EXHIBITION = "exhibition", _("Exhibition stall design")
        INFLUENCER = "influencer", _("Influencer marketing")
        BOOKING = "booking", _("Artist booking")
        ABOUT = "about", _("About")
        GENERAL = "general", _("General")

    question = models.CharField(max_length=300)
    answer = models.TextField()
    section = models.CharField(
        max_length=20, choices=Section.choices, default=Section.GENERAL, db_index=True
    )

    class Meta(OrderedModel.Meta):
        verbose_name = _("FAQ")
        verbose_name_plural = _("FAQs")
        indexes = [models.Index(fields=["section", "is_published", "order"])]

    def __str__(self) -> str:
        return self.question


class JobPosting(SlugModel, PublishableModel, TimeStampedModel):
    class EmploymentType(models.TextChoices):
        FULL_TIME = "full_time", _("Full time")
        PART_TIME = "part_time", _("Part time")
        CONTRACT = "contract", _("Contract")
        INTERNSHIP = "internship", _("Internship")
        FREELANCE = "freelance", _("Freelance")

    title = models.CharField(max_length=200)
    department = models.CharField(max_length=120, blank=True)
    location = models.CharField(max_length=150, blank=True, default="Dhaka, Bangladesh")
    employment_type = models.CharField(
        max_length=20, choices=EmploymentType.choices, default=EmploymentType.FULL_TIME
    )
    experience = models.CharField(max_length=100, blank=True)
    salary = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True, help_text="Sanitised rich text (HTML).")
    requirements = models.JSONField(default=list, blank=True)
    responsibilities = models.JSONField(default=list, blank=True)
    deadline = models.DateField(null=True, blank=True)
    vacancies = models.PositiveSmallIntegerField(default=1)
    order = models.PositiveIntegerField(default=0, db_index=True)

    class Meta:
        verbose_name = _("job posting")
        verbose_name_plural = _("job postings")
        ordering = ["order", "-created_at"]
        indexes = [models.Index(fields=["is_published", "order"])]

    def __str__(self) -> str:
        return self.title

    @property
    def is_open(self) -> bool:
        return self.is_published and (
            self.deadline is None or self.deadline >= timezone.localdate()
        )


class Event(SlugModel, ImageUrlMixin, PublishableModel, TimeStampedModel):
    """Admin-managed events (used for the dashboard events list + upcoming events)."""

    class Status(models.TextChoices):
        DRAFT = "draft", _("Draft")
        PUBLISHED = "published", _("Published")
        ONGOING = "ongoing", _("Ongoing")
        COMPLETED = "completed", _("Completed")
        CANCELLED = "cancelled", _("Cancelled")

    title = models.CharField(max_length=220)
    description = models.TextField(blank=True)
    venue = models.CharField(max_length=220, blank=True)
    city = models.CharField(max_length=120, blank=True, default="Dhaka")
    start_date = models.DateField(db_index=True)
    end_date = models.DateField(null=True, blank=True)
    start_time = models.TimeField(null=True, blank=True)
    capacity = models.PositiveIntegerField(null=True, blank=True)
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.PUBLISHED, db_index=True
    )
    client = models.CharField(max_length=180, blank=True)
    is_featured = models.BooleanField(default=False)

    class Meta:
        verbose_name = _("event")
        verbose_name_plural = _("events")
        ordering = ["-start_date", "-id"]
        indexes = [models.Index(fields=["status", "start_date"])]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(end_date__isnull=True)
                | models.Q(end_date__gte=models.F("start_date")),
                name="event_end_after_start",
            )
        ]

    def __str__(self) -> str:
        return self.title

    @property
    def attendee_count(self) -> int:
        return self.capacity or 0

    @property
    def is_upcoming(self) -> bool:
        return (self.end_date or self.start_date) >= timezone.localdate()


def upload_to_media(instance, filename: str) -> str:  # pragma: no cover - helper
    return f"uploads/{slugify(instance.__class__.__name__)}/{filename}"
