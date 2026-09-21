"""Django admin for users + audit logs (secondary tool; the SPA is primary)."""

from __future__ import annotations

import csv

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.http import HttpResponse
from django.utils.html import format_html

from apps.accounts.models import AdminActionLog, LoginAttempt, PasswordResetToken, User

admin.site.site_header = "Ananta Events administration"
admin.site.site_title = "Ananta Events"
admin.site.index_title = "Content & operations"


class CSVExportMixin:
    """Adds an 'Export CSV' action to any ModelAdmin."""

    @admin.action(description="Export selected rows as CSV")
    def export_as_csv(self, request, queryset):
        meta = self.model._meta
        field_names = [field.name for field in meta.fields]
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = f"attachment; filename={meta.model_name}.csv"
        writer = csv.writer(response)
        writer.writerow(field_names)
        for obj in queryset:
            writer.writerow([getattr(obj, field) for field in field_names])
        return response


@admin.register(User)
class UserAdmin(BaseUserAdmin, CSVExportMixin):
    ordering = ["email"]
    list_display = ["email", "full_name", "role", "is_active", "is_staff", "last_login"]
    list_filter = ["role", "is_active", "is_staff", "is_superuser"]
    search_fields = ["email", "full_name"]
    actions = ["export_as_csv", "activate_users", "deactivate_users"]
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Profile", {"fields": ("full_name", "role")}),
        (
            "Permissions",
            {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")},
        ),
        ("Dates", {"fields": ("last_login", "created_at", "updated_at")}),
    )
    readonly_fields = ["created_at", "updated_at", "last_login"]
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "full_name",
                    "role",
                    "password1",
                    "password2",
                    "is_active",
                    "is_staff",
                ),
            },
        ),
    )

    @admin.action(description="Activate selected users")
    def activate_users(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(request, f"{updated} user(s) activated.")

    @admin.action(description="Deactivate selected users")
    def deactivate_users(self, request, queryset):
        # Never lock out the platform.
        guarded = queryset.filter(role=User.Role.SUPER_ADMIN)
        if (
            User.objects.filter(role=User.Role.SUPER_ADMIN, is_active=True).count()
            <= guarded.count()
        ):
            self.message_user(
                request,
                "Refused: that would deactivate the last active super admin.",
                level="error",
            )
            queryset = queryset.exclude(pk__in=guarded.values_list("pk", flat=True))
        queryset = queryset.exclude(pk=request.user.pk)
        updated = queryset.update(is_active=False)
        self.message_user(request, f"{updated} user(s) deactivated.")


@admin.register(AdminActionLog)
class AdminActionLogAdmin(admin.ModelAdmin, CSVExportMixin):
    list_display = [
        "created_at",
        "actor_email",
        "action",
        "model_name",
        "object_repr",
        "ip_address",
    ]
    list_filter = ["action", "model_name", "created_at"]
    search_fields = ["actor_email", "object_repr", "detail", "model_name"]
    date_hierarchy = "created_at"
    actions = ["export_as_csv"]
    readonly_fields = [
        "user",
        "actor_email",
        "action",
        "model_name",
        "object_id",
        "object_repr",
        "detail",
        "ip_address",
        "created_at",
    ]

    def has_add_permission(self, request):  # read-only trail
        return False

    def has_change_permission(self, request, obj=None):
        return False


@admin.register(LoginAttempt)
class LoginAttemptAdmin(admin.ModelAdmin, CSVExportMixin):
    list_display = ["created_at", "email", "success", "ip_address"]
    list_filter = ["success", "created_at"]
    search_fields = ["email", "ip_address"]
    actions = ["export_as_csv"]
    readonly_fields = ["email", "success", "ip_address", "user_agent", "created_at"]

    def has_add_permission(self, request):
        return False


@admin.register(PasswordResetToken)
class PasswordResetTokenAdmin(admin.ModelAdmin):
    list_display = ["user", "created_at", "expires_at", "used_at", "requested_ip", "status_badge"]
    list_filter = ["created_at"]
    search_fields = ["user__email"]
    readonly_fields = ["user", "token_hash", "created_at", "expires_at", "used_at", "requested_ip"]

    @admin.display(description="Status")
    def status_badge(self, obj):
        if obj.used_at:
            return format_html('<span style="color:#888">used</span>')
        if obj.expires_at <= obj.created_at:
            return format_html('<span style="color:#c00">expired</span>')
        return format_html('<span style="color:#080">open</span>')

    def has_add_permission(self, request):
        return False
