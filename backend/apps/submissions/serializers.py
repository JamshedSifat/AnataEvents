"""Serializers for public form submissions (write) and admin review (read/write)."""

from __future__ import annotations

from rest_framework import serializers

from apps.common.validators import validate_phone_bd
from apps.submissions.models import (
    ArtistApplication,
    ArtistBookingRequest,
    ContactMessage,
    JobApplication,
    NewsletterSubscriber,
    ReviewStatus,
    TalentHuntRegistration,
    VendorRegistration,
)

HONEYPOT_HELP = "Honeypot field — must stay empty (bots fill it in)."
MAX_JSON_LIST_ITEMS = 30


def _clean_list(value):
    if not isinstance(value, list):
        return []
    return [str(item)[:200] for item in value[:MAX_JSON_LIST_ITEMS] if str(item).strip()]


class HoneypotMixin(serializers.Serializer):
    website = serializers.CharField(
        required=False, allow_blank=True, write_only=True, help_text=HONEYPOT_HELP
    )

    def validate_website(self, value):
        if value:
            raise serializers.ValidationError("Spam detected.")
        return value


class SubmissionWriteMixin(HoneypotMixin):
    """Common validation for anonymous submissions."""

    def validate_phone(self, value):
        validate_phone_bd(value)
        return value

    def create(self, validated_data):
        validated_data.pop("website", None)
        request = self.context.get("request")
        if request is not None:
            validated_data.setdefault("ip_address", _client_ip(request))
            validated_data.setdefault("user_agent", request.META.get("HTTP_USER_AGENT", "")[:300])
            validated_data.setdefault("source_path", request.headers.get("Referer", "")[:300])
        return super().create(validated_data)


def _client_ip(request):
    forwarded = request.META.get("HTTP_X_FORWARDED_FOR", "")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


class ContactMessageWriteSerializer(SubmissionWriteMixin, serializers.ModelSerializer):
    full_name = serializers.CharField(required=False, allow_blank=True)
    first_name = serializers.CharField(required=False, allow_blank=True, write_only=True)
    last_name = serializers.CharField(required=False, allow_blank=True, write_only=True)

    class Meta:
        model = ContactMessage
        fields = [
            "full_name",
            "first_name",
            "last_name",
            "email",
            "phone",
            "subject",
            "event_type",
            "event_date",
            "budget",
            "message",
            "website",
        ]

    def validate(self, attrs):
        first = (attrs.pop("first_name", "") or "").strip()
        last = (attrs.pop("last_name", "") or "").strip()
        if not attrs.get("full_name") and (first or last):
            attrs["full_name"] = f"{first} {last}".strip()
        if not attrs.get("full_name"):
            raise serializers.ValidationError({"full_name": ["This field is required."]})
        if len(attrs.get("message", "")) < 10:
            raise serializers.ValidationError(
                {"message": ["Please describe your requirement (at least 10 characters)."]}
            )
        return attrs


class ArtistBookingRequestWriteSerializer(SubmissionWriteMixin, serializers.ModelSerializer):
    class Meta:
        model = ArtistBookingRequest
        fields = [
            "full_name",
            "email",
            "phone",
            "artist",
            "artist_name",
            "artist_category",
            "event_type",
            "event_date",
            "venue",
            "budget",
            "organization",
            "message",
            "website",
        ]


class ArtistApplicationWriteSerializer(SubmissionWriteMixin, serializers.ModelSerializer):
    class Meta:
        model = ArtistApplication
        fields = [
            "full_name",
            "email",
            "phone",
            "stage_name",
            "category",
            "city",
            "experience_years",
            "portfolio_url",
            "video_url",
            "bio",
            "photo",
            "cv",
            "website",
        ]

    def validate_category(self, value):
        allowed = {"singer", "dj", "comedian", "magician", "dancer", "choreographer", "other"}
        if value.strip().lower() not in allowed:
            raise serializers.ValidationError("Choose one of: " + ", ".join(sorted(allowed)) + ".")
        return value.strip().lower()


class TalentHuntRegistrationWriteSerializer(SubmissionWriteMixin, serializers.ModelSerializer):
    class Meta:
        model = TalentHuntRegistration
        fields = [
            "full_name",
            "email",
            "phone",
            "category",
            "city",
            "age",
            "experience",
            "video_url",
            "audio_url",
            "instagram",
            "portfolio_url",
            "bio",
            "website",
        ]


class VendorRegistrationWriteSerializer(SubmissionWriteMixin, serializers.ModelSerializer):
    class Meta:
        model = VendorRegistration
        fields = [
            "full_name",
            "company_name",
            "contact_person",
            "email",
            "phone",
            "vendor_category",
            "address",
            "website",
            "trade_license",
            "services",
            "description",
            "website_hp",
        ]

    website_hp = serializers.CharField(
        required=False, allow_blank=True, write_only=True, help_text=HONEYPOT_HELP
    )

    def validate_website_hp(self, value):
        if value:
            raise serializers.ValidationError("Spam detected.")
        return value

    def validate_services(self, value):
        return _clean_list(value)

    def create(self, validated_data):
        validated_data.pop("website_hp", None)
        request = self.context.get("request")
        if request is not None:
            validated_data.setdefault("ip_address", _client_ip(request))
            validated_data.setdefault("user_agent", request.META.get("HTTP_USER_AGENT", "")[:300])
        return super(SubmissionWriteMixin, self).create(validated_data)


class JobApplicationWriteSerializer(SubmissionWriteMixin, serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = [
            "full_name",
            "email",
            "phone",
            "job",
            "position",
            "linkedin",
            "portfolio_url",
            "cover_letter",
            "cv",
            "website",
        ]

    def validate_cv(self, value):
        from apps.common.validators import validate_document_upload

        validate_document_upload(value)
        return value


class NewsletterSubscribeSerializer(HoneypotMixin, serializers.ModelSerializer):
    # Uniqueness is resolved in `create()` (idempotent subscribe), so the
    # automatic UniqueValidator must not reject repeat submissions.
    email = serializers.EmailField()

    class Meta:
        model = NewsletterSubscriber
        fields = ["email", "source_path", "website"]

    def create(self, validated_data):
        validated_data.pop("website", None)
        email = validated_data["email"].strip().lower()
        subscriber, _ = NewsletterSubscriber.objects.get_or_create(
            email=email, defaults=validated_data
        )
        subscriber.is_active = True
        subscriber.save(update_fields=["is_active"])
        return subscriber


# --------------------------------------------------------------------------- #
# Admin (read + review)
# --------------------------------------------------------------------------- #
class AdminSubmissionSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    reviewed_by_email = serializers.CharField(source="reviewed_by.email", read_only=True)

    class Meta:
        abstract = True


class AdminContactMessageSerializer(AdminSubmissionSerializer):
    class Meta:
        model = ContactMessage
        fields = "__all__"
        read_only_fields = ["ip_address", "user_agent", "source_path", "created_at", "updated_at"]


class AdminArtistBookingSerializer(AdminSubmissionSerializer):
    artist_display = serializers.CharField(source="artist.name", read_only=True, default="")

    class Meta:
        model = ArtistBookingRequest
        fields = "__all__"
        read_only_fields = ["ip_address", "user_agent", "source_path", "created_at", "updated_at"]


class AdminArtistApplicationSerializer(AdminSubmissionSerializer):
    class Meta:
        model = ArtistApplication
        fields = "__all__"
        read_only_fields = ["ip_address", "user_agent", "source_path", "created_at", "updated_at"]


class AdminTalentHuntSerializer(AdminSubmissionSerializer):
    class Meta:
        model = TalentHuntRegistration
        fields = "__all__"
        read_only_fields = ["ip_address", "user_agent", "source_path", "created_at", "updated_at"]


class AdminVendorSerializer(AdminSubmissionSerializer):
    class Meta:
        model = VendorRegistration
        fields = "__all__"
        read_only_fields = ["ip_address", "user_agent", "source_path", "created_at", "updated_at"]


class AdminJobApplicationSerializer(AdminSubmissionSerializer):
    job_title = serializers.CharField(source="job.title", read_only=True, default="")

    class Meta:
        model = JobApplication
        fields = "__all__"
        read_only_fields = ["ip_address", "user_agent", "source_path", "created_at", "updated_at"]


class ReviewActionSerializer(serializers.Serializer):
    notes = serializers.CharField(required=False, allow_blank=True)
    status = serializers.ChoiceField(
        choices=ReviewStatus.choices, required=False, default=ReviewStatus.APPROVED
    )
