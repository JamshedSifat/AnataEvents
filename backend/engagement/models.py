"""Public-facing interactions: messages, bookings, registrations, jobs.

Every submission carries a status workflow reviewed by staff in the admin
dashboard. None of these models are writable by the public beyond creation.
"""

from django.db import models

from core.models import SluggedModel, TimeStampedModel
from core.utils import validate_bd_phone, validate_doc_upload, validate_image_upload


class StatusModel(models.Model):
    class Meta:
        abstract = True


class ContactMessage(TimeStampedModel):
    class Status(models.TextChoices):
        NEW = "new", "New"
        READ = "read", "Read"
        REPLIED = "replied", "Replied"
        ARCHIVED = "archived", "Archived"

    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True, validators=[validate_bd_phone])
    event_type = models.CharField(max_length=100, blank=True)
    event_date = models.DateField(null=True, blank=True)
    guests = models.PositiveIntegerField(null=True, blank=True)
    budget = models.CharField(max_length=80, blank=True)
    venue = models.CharField(max_length=150, blank=True)
    message = models.TextField()
    status = models.CharField(
        max_length=12, choices=Status.choices, default=Status.NEW, db_index=True
    )
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=300, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} — {self.event_type or 'general'}"


class ArtistBookingRequest(TimeStampedModel):
    """'Book an Artist' / query-modal / celebrity-booking requests."""

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        CONTACTED = "contacted", "Contacted"
        CONFIRMED = "confirmed", "Confirmed"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"

    artist = models.ForeignKey(
        "artists.Artist",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="booking_requests",
    )
    artist_name = models.CharField(max_length=150, blank=True)
    artist_category = models.CharField(max_length=30, blank=True)
    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=30, validators=[validate_bd_phone])
    event_type = models.CharField(max_length=100, blank=True)
    event_date = models.DateField(null=True, blank=True)
    venue = models.CharField(max_length=200, blank=True)
    budget = models.CharField(max_length=80, blank=True)
    message = models.TextField(blank=True)
    status = models.CharField(
        max_length=12, choices=Status.choices, default=Status.PENDING, db_index=True
    )
    source = models.CharField(
        max_length=40, blank=True, help_text="Which form sent it (query-modal, book-an-artist…)"
    )
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        target = self.artist.name if self.artist else self.artist_name or "any artist"
        return f"{self.name} → {target}"


class ArtistApplication(TimeStampedModel):
    """Public 'Artist Registration' submissions."""

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"

    artist_name = models.CharField(max_length=150)
    stage_name = models.CharField(max_length=150, blank=True)
    email = models.EmailField(db_index=True)
    phone = models.CharField(max_length=30, validators=[validate_bd_phone])
    art_form = models.CharField(max_length=100)
    experience = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    instagram = models.URLField(blank=True)
    facebook = models.URLField(blank=True)
    youtube = models.URLField(blank=True)
    photo = models.FileField(
        upload_to="applications/artists/%Y/%m/", blank=True, validators=[validate_image_upload]
    )
    status = models.CharField(
        max_length=12, choices=Status.choices, default=Status.PENDING, db_index=True
    )
    admin_notes = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.artist_name} ({self.art_form}) — {self.status}"


class TalentHuntRegistration(TimeStampedModel):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        SHORTLISTED = "shortlisted", "Shortlisted"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"

    full_name = models.CharField(max_length=150)
    email = models.EmailField(db_index=True)
    phone = models.CharField(max_length=30, validators=[validate_bd_phone])
    talent_category = models.CharField(max_length=100)
    experience = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True)
    social_media = models.URLField(blank=True)
    portfolio_link = models.URLField(blank=True)
    status = models.CharField(
        max_length=12, choices=Status.choices, default=Status.PENDING, db_index=True
    )
    admin_notes = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.full_name} ({self.talent_category}) — {self.status}"


class VendorRegistration(TimeStampedModel):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        UNDER_REVIEW = "under_review", "Under review"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"

    business_name = models.CharField(max_length=200)
    owner_name = models.CharField(max_length=150)
    email = models.EmailField(db_index=True)
    phone = models.CharField(max_length=30, validators=[validate_bd_phone])
    service_category = models.CharField(max_length=120)
    experience = models.CharField(max_length=100, blank=True)
    business_address = models.CharField(max_length=300, blank=True)
    description = models.TextField(blank=True)
    website_url = models.URLField(blank=True)
    bank_name = models.CharField(max_length=150, blank=True)
    account_number = models.CharField(max_length=60, blank=True)
    document = models.FileField(
        upload_to="vendors/documents/%Y/%m/", blank=True, validators=[validate_doc_upload]
    )
    gallery_images = models.JSONField(default=list, blank=True)
    status = models.CharField(
        max_length=15, choices=Status.choices, default=Status.PENDING, db_index=True
    )
    admin_notes = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.business_name} ({self.service_category}) — {self.status}"


class JobPosting(SluggedModel, TimeStampedModel):
    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        CLOSED = "closed", "Closed"

    title = models.CharField(max_length=200)
    department = models.CharField(max_length=120, blank=True)
    experience = models.CharField(max_length=80, blank=True)
    salary = models.CharField(max_length=120, blank=True)
    description = models.TextField(blank=True)
    requirements = models.JSONField(default=list, blank=True)
    responsibilities = models.JSONField(default=list, blank=True)
    status = models.CharField(
        max_length=10, choices=Status.choices, default=Status.ACTIVE, db_index=True
    )
    posted_at = models.DateTimeField(auto_now_add=True)
    is_published = models.BooleanField(default=True, db_index=True)

    class Meta:
        ordering = ["-posted_at"]

    def __str__(self):
        return f"{self.title} ({self.status})"


class JobApplication(TimeStampedModel):
    class Status(models.TextChoices):
        NEW = "new", "New"
        SHORTLISTED = "shortlisted", "Shortlisted"
        INTERVIEWED = "interviewed", "Interviewed"
        REJECTED = "rejected", "Rejected"
        HIRED = "hired", "Hired"

    job = models.ForeignKey(JobPosting, on_delete=models.CASCADE, related_name="applications")
    full_name = models.CharField(max_length=150)
    email = models.EmailField(db_index=True)
    phone = models.CharField(max_length=30, validators=[validate_bd_phone])
    experience = models.CharField(max_length=100, blank=True)
    skills = models.CharField(max_length=300, blank=True)
    cover_letter = models.TextField(blank=True)
    expected_salary = models.CharField(max_length=80, blank=True)
    join_date = models.CharField(max_length=60, blank=True)
    resume = models.FileField(
        upload_to="applications/jobs/%Y/%m/", blank=True, validators=[validate_doc_upload]
    )
    status = models.CharField(
        max_length=12, choices=Status.choices, default=Status.NEW, db_index=True
    )
    admin_notes = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.full_name} → {self.job.title}"
