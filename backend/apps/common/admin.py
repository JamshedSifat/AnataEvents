"""Shared Django-admin behaviour: publish toggles, ordering, CSV export previews."""

from __future__ import annotations

import csv

from django.contrib import admin
from django.http import HttpResponse
from django.utils.html import format_html


class ImagePreviewMixin:
    """Show a thumbnail for the model's resolved image (if it has one)."""

    @admin.display(description="Preview")
    def image_preview(self, obj):
        src = getattr(obj, "image_src", "") or ""
        if not src:
            return "—"
        return format_html(
            '<img src="{}" alt="{}" style="height:48px;width:auto;border-radius:4px;" />',
            src,
            getattr(obj, "image_alt", "") or getattr(obj, "title", "") or "preview",
        )


class CSVExportMixin:
    """Adds an ``export_as_csv`` admin action for the configured columns."""

    csv_fields: tuple[str, ...] = ("pk",)
    csv_filename = "export.csv"

    @admin.action(description="Export selected rows as CSV")
    def export_as_csv(self, request, queryset):
        meta = self.model._meta
        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = f"attachment; filename={self.csv_filename}"
        writer = csv.writer(response)
        writer.writerow(self.csv_fields)
        for obj in queryset:
            writer.writerow([getattr(obj, field, "") for field in self.csv_fields])
        self.message_user(request, f"Exported {queryset.count()} {meta.verbose_name_plural}.")
        return response


class BaseAdmin(CSVExportMixin, admin.ModelAdmin):
    save_on_top = True
    list_per_page = 50


class PublishableAdmin(BaseAdmin):
    list_editable = ("is_published",)
    ordering = ("order", "-id")

    @admin.action(description="Publish selected items")
    def publish(self, request, queryset):
        updated = queryset.update(is_published=True)
        self.message_user(request, f"Published {updated} item(s).")

    @admin.action(description="Unpublish selected items")
    def unpublish(self, request, queryset):
        updated = queryset.update(is_published=False)
        self.message_user(request, f"Unpublished {updated} item(s).")

    actions = ("publish", "unpublish", "export_as_csv")
