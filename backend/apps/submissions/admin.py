"""Django admin for the public submissions (review workflow + CSV export)."""

from __future__ import annotations

from django.contrib import admin

from apps.common.admin import BaseAdmin
from apps.submissions.models import (
    ArtistApplication,
    ArtistBookingRequest,
    ContactMessage,
    JobApplication,
    NewsletterSubscriber,
    TalentHuntRegistration,
    VendorRegistration,
)


class ReviewActionsMixin:
    @admin.action(description="Mark selected as approved")
    def approve_selected(self, request, queryset):
        updated = queryset.update(status="approved")
        self.message_user(request, f"Approved {updated} submission(s).")

    @admin.action(description="Mark selected as rejected")
    def reject_selected(self, request, queryset):
        updated = queryset.update(status="rejected")
        self.message_user(request, f"Rejected {updated} submission(s).")


@admin.register(ContactMessage)
class ContactMessageAdmin(ReviewActionsMixin, BaseAdmin):
    list_display = (
        "full_name",
        "email",
        "subject",
        "event_type",
        "status",
        "is_read",
        "created_at",
    )
    list_filter = ("status", "is_read", "event_type")
    search_fields = ("full_name", "email", "phone", "subject", "message")
    readonly_fields = ("created_at", "updated_at", "ip_address", "user_agent", "source_path")
    date_hierarchy = "created_at"
    actions = ("approve_selected", "reject_selected", "mark_read", "mark_unread", "export_as_csv")
    csv_fields = ("id", "full_name", "email", "phone", "subject", "status", "created_at")

    @admin.action(description="Mark selected as read")
    def mark_read(self, request, queryset):
        updated = queryset.update(is_read=True)
        self.message_user(request, f"Marked {updated} message(s) as read.")

    @admin.action(description="Mark selected as unread")
    def mark_unread(self, request, queryset):
        updated = queryset.update(is_read=False)
        self.message_user(request, f"Marked {updated} message(s) as unread.")


@admin.register(ArtistBookingRequest)
class ArtistBookingRequestAdmin(ReviewActionsMixin, BaseAdmin):
    list_display = ("full_name", "artist_name", "event_type", "event_date", "status", "created_at")
    list_filter = ("status", "event_type", "artist_category")
    search_fields = ("full_name", "email", "phone", "artist_name", "venue")
    readonly_fields = ("created_at", "updated_at", "ip_address", "user_agent", "source_path")
    actions = ("approve_selected", "reject_selected", "export_as_csv")
    csv_fields = ("id", "full_name", "email", "phone", "artist_name", "event_date", "status")


@admin.register(ArtistApplication)
class ArtistApplicationAdmin(ReviewActionsMixin, BaseAdmin):
    list_display = (
        "full_name",
        "stage_name",
        "category",
        "city",
        "experience_years",
        "status",
        "created_at",
    )
    list_filter = ("status", "category", "city")
    search_fields = ("full_name", "email", "phone", "stage_name", "bio")
    readonly_fields = ("created_at", "updated_at", "ip_address", "user_agent", "source_path")
    actions = ("approve_selected", "reject_selected", "export_as_csv")
    csv_fields = ("id", "full_name", "stage_name", "category", "city", "status")


@admin.register(TalentHuntRegistration)
class TalentHuntRegistrationAdmin(ReviewActionsMixin, BaseAdmin):
    list_display = ("full_name", "category", "city", "age", "status", "created_at")
    list_filter = ("status", "category", "city")
    search_fields = ("full_name", "email", "phone", "bio")
    readonly_fields = ("created_at", "updated_at", "ip_address", "user_agent", "source_path")
    actions = ("approve_selected", "reject_selected", "export_as_csv")
    csv_fields = ("id", "full_name", "category", "city", "age", "status")


@admin.register(VendorRegistration)
class VendorRegistrationAdmin(ReviewActionsMixin, BaseAdmin):
    list_display = (
        "company_name",
        "contact_person",
        "vendor_category",
        "status",
        "is_preferred",
        "created_at",
    )
    list_filter = ("status", "vendor_category", "is_preferred")
    search_fields = ("company_name", "contact_person", "email", "phone", "services")
    readonly_fields = ("created_at", "updated_at", "ip_address", "user_agent", "source_path")
    actions = ("approve_selected", "reject_selected", "export_as_csv")
    csv_fields = ("id", "company_name", "contact_person", "email", "phone", "status")


@admin.register(JobApplication)
class JobApplicationAdmin(ReviewActionsMixin, BaseAdmin):
    list_display = ("full_name", "position", "job", "status", "created_at")
    list_filter = ("status",)
    search_fields = ("full_name", "email", "phone", "position", "cover_letter")
    readonly_fields = ("created_at", "updated_at", "ip_address", "user_agent", "source_path")
    actions = ("approve_selected", "reject_selected", "export_as_csv")
    csv_fields = ("id", "full_name", "email", "phone", "position", "status")


@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(BaseAdmin):
    list_display = ("email", "is_active", "source_path", "created_at")
    list_filter = ("is_active",)
    search_fields = ("email",)
    actions = ("export_as_csv",)
    csv_fields = ("id", "email", "is_active", "created_at")
