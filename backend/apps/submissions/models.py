"""Public form submissions with an admin review workflow.

Every model shares `status` (pending/approved/rejected), `admin_notes`,
request metadata (IP, user agent, source path) and timestamps, so a single
admin API pattern (approve / reject / notes) covers all of them.
"""

from __future__ import annotations

from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.utils.translation import gettext_lazy as _

from apps.common.models import ImageUrlMixin, OrderedModel, PublishableModel, TimeStampedModel
from apps.common.validators import (
    validate_document_upload,
    validate_phone_bd,
    validate_youtube_url,
)


class ReviewStatus(models.TextChoices):
    PENDING = "pending", _("Pending")
    APPROVED = "approved", _("Approved")
    REJECTED = "rejected", _("Rejected")


class SubmissionBase(TimeStampedModel):
    full_name = models.CharField(_("full name"), max_length=160)
    email = models.EmailField()
    phone = models.CharField(max_length=30, validators=[validate_phone_bd])
    status = models.CharField(
        max_length=20, choices=ReviewStatus.choices, default=ReviewStatus.PENDING, db_index=True
    )
    admin_notes = models.TextField(blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    reviewed_by = models.ForeignKey(
        "accounts.User",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=300, blank=True)
    source_path = models.CharField(max_length=300, blank=True)

    class Meta:
        abstract = True
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.full_name} <{self.email}>"

    def mark_reviewed(self, status: str, user=None, notes: str = "") -> None:
        from django.utils import timezone

        self.status = status
        if notes:
            self.admin_notes = notes
        self.reviewed_at = timezone.now()
        self.reviewed_by = user if getattr(user, "is_authenticated", False) else None
        self.save(
            update_fields=["status", "admin_notes", "reviewed_at", "reviewed_by", "updated_at"]
        )


class ContactMessage(SubmissionBase):
    subject = models.CharField(max_length=200, blank=True)
    event_type = models.CharField(max_length=120, blank=True)
    event_date = models.DateField(null=True, blank=True)
    budget = models.CharField(max_length=100, blank=True)
    message = models.TextField()
    is_read = models.BooleanField(default=False)

    class Meta(SubmissionBase.Meta):
        verbose_name = _("contact message")
        verbose_name_plural = _("contact messages")
        indexes = [models.Index(fields=["status", "is_read", "created_at"])]

    def __str__(self) -> str:
        return f"{self.full_name}: {self.subject or self.message[:40]}"


class ArtistBookingRequest(SubmissionBase):
    artist = models.ForeignKey(
        "content.Artist",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="booking_requests",
    )
    artist_name = models.CharField(
        max_length=180, blank=True, help_text="Free text when the artist is not in the DB."
    )
    artist_category = models.CharField(max_length=60, blank=True)
    event_type = models.CharField(max_length=120, blank=True)
    event_date = models.DateField(null=True, blank=True)
    venue = models.CharField(max_length=220, blank=True)
    budget = models.CharField(max_length=100, blank=True)
    message = models.TextField(blank=True)
    organization = models.CharField(max_length=200, blank=True)

    class Meta(SubmissionBase.Meta):
        verbose_name = _("artist booking request")
        verbose_name_plural = _("artist booking requests")
        indexes = [models.Index(fields=["status", "created_at"])]

    def __str__(self) -> str:
        return f"{self.artist_name or (self.artist.name if self.artist_id else 'Artist')} — {self.full_name}"


class ArtistApplication(SubmissionBase):
    """Public 'artist registration' form."""

    stage_name = models.CharField(max_length=180, blank=True)
    category = models.CharField(max_length=60, db_index=True)
    city = models.CharField(max_length=120, blank=True)
    experience_years = models.PositiveSmallIntegerField(null=True, blank=True)
    portfolio_url = models.URLField(max_length=400, blank=True)
    video_url = models.URLField(max_length=400, blank=True, validators=[validate_youtube_url])
    bio = models.TextField(blank=True)
    photo = models.ImageField(upload_to="uploads/applications/", blank=True, null=True)
    cv = models.FileField(
        upload_to="uploads/applications/cv/",
        blank=True,
        null=True,
        validators=[validate_document_upload],
    )

    class Meta(SubmissionBase.Meta):
        verbose_name = _("artist application")
        verbose_name_plural = _("artist applications")
        indexes = [models.Index(fields=["status", "category", "created_at"])]

    def __str__(self) -> str:
        return f"{self.stage_name or self.full_name} ({self.category})"


class TalentHuntRegistration(SubmissionBase):
    category = models.CharField(max_length=80, db_index=True)
    city = models.CharField(max_length=120, blank=True)
    age = models.PositiveSmallIntegerField(
        null=True, blank=True, validators=[MinValueValidator(5), MaxValueValidator(99)]
    )
    experience = models.CharField(max_length=120, blank=True)
    video_url = models.URLField(max_length=400, blank=True, validators=[validate_youtube_url])
    audio_url = models.URLField(max_length=400, blank=True)
    instagram = models.URLField(max_length=400, blank=True)
    portfolio_url = models.URLField(max_length=400, blank=True)
    bio = models.TextField(blank=True)

    class Meta(SubmissionBase.Meta):
        verbose_name = _("talent hunt registration")
        verbose_name_plural = _("talent hunt registrations")
        indexes = [models.Index(fields=["status", "category", "created_at"])]

    def __str__(self) -> str:
        return f"{self.full_name} — {self.category}"


class VendorRegistration(SubmissionBase):
    company_name = models.CharField(max_length=200, blank=True)
    contact_person = models.CharField(max_length=180, blank=True)
    vendor_category = models.CharField(max_length=120, db_index=True)
    address = models.CharField(max_length=300, blank=True)
    website = models.URLField(max_length=400, blank=True)
    trade_license = models.CharField(max_length=120, blank=True)
    services = models.JSONField(default=list, blank=True)
    description = models.TextField(blank=True)
    is_preferred = models.BooleanField(default=False)

    class Meta(SubmissionBase.Meta):
        verbose_name = _("vendor registration")
        verbose_name_plural = _("vendor registrations")
        indexes = [models.Index(fields=["status", "vendor_category", "created_at"])]

    def __str__(self) -> str:
        return f"{self.company_name or self.full_name} — {self.vendor_category}"


class JobApplication(SubmissionBase):
    job = models.ForeignKey(
        "content.JobPosting",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="applications",
    )
    position = models.CharField(max_length=200, blank=True)
    linkedin = models.URLField(max_length=400, blank=True)
    portfolio_url = models.URLField(max_length=400, blank=True)
    cover_letter = models.TextField(blank=True)
    cv = models.FileField(
        upload_to="uploads/cv/%Y/%m/",
        validators=[validate_document_upload],
        help_text="PDF/DOC/DOCX up to the configured upload limit.",
    )

    class Meta(SubmissionBase.Meta):
        verbose_name = _("job application")
        verbose_name_plural = _("job applications")
        indexes = [models.Index(fields=["status", "created_at"])]

    def __str__(self) -> str:
        return f"{self.full_name} → {self.position or (self.job.title if self.job_id else 'role')}"


class NewsletterSubscriber(TimeStampedModel):
    """Small footer signup form."""

    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    source_path = models.CharField(max_length=300, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.email


# Re-exported for convenience in tests / seed commands.
__all__ = [
    "ArtistApplication",
    "ArtistBookingRequest",
    "ContactMessage",
    "ImageUrlMixin",
    "JobApplication",
    "NewsletterSubscriber",
    "OrderedModel",
    "PublishableModel",
    "ReviewStatus",
    "TalentHuntRegistration",
    "VendorRegistration",
]
