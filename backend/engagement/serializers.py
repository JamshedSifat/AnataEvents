from rest_framework import serializers

from core.serializers import CamelCaseMixin
from core.utils import validate_bd_phone

from .models import (
    ArtistApplication,
    ArtistBookingRequest,
    ContactMessage,
    JobApplication,
    JobPosting,
    TalentHuntRegistration,
    VendorRegistration,
)


class ContactMessageSerializer(CamelCaseMixin, serializers.ModelSerializer):
    """Public POST (contact form) — honeypot field, status is server-set."""

    website = serializers.CharField(required=False, allow_blank=True, write_only=True)
    eventDate = serializers.DateField(required=False, allow_null=True)

    class Meta:
        model = ContactMessage
        fields = [
            "id",
            "name",
            "email",
            "phone",
            "event_type",
            "event_date",
            "guests",
            "budget",
            "venue",
            "message",
            "website",
            "eventDate",
            "created_at",
            "status",
        ]
        read_only_fields = ["id", "status", "created_at", "event_date"]

    def validate_name(self, value):
        if not (value or "").strip():
            raise serializers.ValidationError("Name is required.")
        return value.strip()

    def validate_message(self, value):
        if len((value or "").strip()) < 10:
            raise serializers.ValidationError("Please describe your event (min 10 characters).")
        return value.strip()

    def validate_website(self, value):
        if (value or "").strip():
            raise serializers.ValidationError("Spam detected.")
        return value


class ContactMessageAdminSerializer(CamelCaseMixin, serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = "__all__"
        read_only_fields = ["ip_address", "user_agent"]


class ArtistBookingRequestSerializer(CamelCaseMixin, serializers.ModelSerializer):
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)
    eventDate = serializers.DateField(required=False, allow_null=True)

    class Meta:
        model = ArtistBookingRequest
        fields = [
            "id",
            "artist",
            "artist_name",
            "artist_category",
            "name",
            "email",
            "phone",
            "event_type",
            "event_date",
            "venue",
            "budget",
            "message",
            "source",
            "website",
            "eventDate",
            "created_at",
            "status",
        ]
        read_only_fields = [
            "id",
            "status",
            "created_at",
            "event_date",
            "artist_name",
            "artist_category",
        ]

    def validate_phone(self, value):
        validate_bd_phone(value)
        return value

    def validate_website(self, value):
        if (value or "").strip():
            raise serializers.ValidationError("Spam detected.")
        return value


class ArtistBookingRequestAdminSerializer(CamelCaseMixin, serializers.ModelSerializer):
    class Meta:
        model = ArtistBookingRequest
        fields = "__all__"
        read_only_fields = ["ip_address"]


class ArtistApplicationSerializer(CamelCaseMixin, serializers.ModelSerializer):
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = ArtistApplication
        fields = [
            "id",
            "artist_name",
            "stage_name",
            "email",
            "phone",
            "art_form",
            "experience",
            "bio",
            "instagram",
            "facebook",
            "youtube",
            "photo",
            "website",
            "created_at",
            "status",
        ]
        read_only_fields = ["id", "status", "created_at"]

    def validate_phone(self, value):
        validate_bd_phone(value)
        return value

    def validate_website(self, value):
        if (value or "").strip():
            raise serializers.ValidationError("Spam detected.")
        return value


class ArtistApplicationAdminSerializer(CamelCaseMixin, serializers.ModelSerializer):
    class Meta:
        model = ArtistApplication
        fields = "__all__"
        read_only_fields = ["ip_address"]


class TalentHuntRegistrationSerializer(CamelCaseMixin, serializers.ModelSerializer):
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = TalentHuntRegistration
        fields = [
            "id",
            "full_name",
            "email",
            "phone",
            "talent_category",
            "experience",
            "bio",
            "social_media",
            "portfolio_link",
            "website",
            "created_at",
            "status",
        ]
        read_only_fields = ["id", "status", "created_at"]

    def validate_phone(self, value):
        validate_bd_phone(value)
        return value

    def validate_website(self, value):
        if (value or "").strip():
            raise serializers.ValidationError("Spam detected.")
        return value


class TalentHuntRegistrationAdminSerializer(CamelCaseMixin, serializers.ModelSerializer):
    class Meta:
        model = TalentHuntRegistration
        fields = "__all__"
        read_only_fields = ["ip_address"]


class VendorRegistrationSerializer(CamelCaseMixin, serializers.ModelSerializer):
    website = serializers.CharField(
        required=False, allow_blank=True, write_only=True, help_text="Honeypot — must stay empty."
    )

    class Meta:
        model = VendorRegistration
        fields = [
            "id",
            "business_name",
            "owner_name",
            "email",
            "phone",
            "service_category",
            "experience",
            "business_address",
            "description",
            "website_url",
            "bank_name",
            "account_number",
            "document",
            "gallery_images",
            "website",
            "created_at",
            "status",
        ]
        read_only_fields = ["id", "status", "created_at"]
        extra_kwargs = {
            "document": {"required": False, "allow_null": True},
            "website_url": {"required": False, "allow_blank": True},
        }

    def validate_phone(self, value):
        validate_bd_phone(value)
        return value

    def validate_website(self, value):
        if (value or "").strip():
            raise serializers.ValidationError("Spam detected.")
        return value


class VendorRegistrationAdminSerializer(CamelCaseMixin, serializers.ModelSerializer):
    class Meta:
        model = VendorRegistration
        fields = "__all__"
        read_only_fields = ["ip_address"]


class JobPostingSerializer(CamelCaseMixin, serializers.ModelSerializer):
    class Meta:
        model = JobPosting
        fields = [
            "id",
            "slug",
            "title",
            "department",
            "experience",
            "salary",
            "description",
            "requirements",
            "responsibilities",
            "status",
            "posted_at",
            "is_published",
        ]


class JobPostingWriteSerializer(JobPostingSerializer):
    class Meta(JobPostingSerializer.Meta):
        read_only_fields = ["id", "slug", "posted_at"]


class JobApplicationSerializer(CamelCaseMixin, serializers.ModelSerializer):
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = JobApplication
        fields = [
            "id",
            "job",
            "full_name",
            "email",
            "phone",
            "experience",
            "skills",
            "cover_letter",
            "expected_salary",
            "join_date",
            "resume",
            "website",
            "created_at",
            "status",
        ]
        read_only_fields = ["id", "status", "created_at"]
        extra_kwargs = {"resume": {"required": False, "allow_null": True}}

    def validate_phone(self, value):
        validate_bd_phone(value)
        return value

    def validate_website(self, value):
        if (value or "").strip():
            raise serializers.ValidationError("Spam detected.")
        return value

    def validate(self, attrs):
        job = attrs.get("job")
        if job is not None and job.status != JobPosting.Status.ACTIVE:
            raise serializers.ValidationError(
                {"job": "This position is no longer accepting applications."}
            )
        return attrs


class JobApplicationAdminSerializer(CamelCaseMixin, serializers.ModelSerializer):
    job_title = serializers.CharField(source="job.title", read_only=True)

    class Meta:
        model = JobApplication
        fields = "__all__"
        read_only_fields = ["ip_address"]
