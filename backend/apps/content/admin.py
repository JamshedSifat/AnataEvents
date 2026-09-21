"""Django admin registrations for all public content models."""

from __future__ import annotations

from django.contrib import admin
from django.utils.html import format_html

from apps.common.admin import BaseAdmin, CSVExportMixin, ImagePreviewMixin, PublishableAdmin
from apps.content.models import (
    FAQ,
    Artist,
    BlogPost,
    ContentBlock,
    Event,
    GalleryImage,
    HeroSlide,
    InfluencerProfile,
    JobPosting,
    PortfolioImage,
    PortfolioItem,
    Service,
    ServiceEntry,
    ServiceEntryImage,
    SiteSettings,
    TeamMember,
    Testimonial,
    Video,
)


class ServiceEntryImageInline(admin.TabularInline):
    model = ServiceEntryImage
    extra = 1
    fields = ("order", "image", "image_url", "image_alt", "caption")


class PortfolioImageInline(admin.TabularInline):
    model = PortfolioImage
    extra = 1
    fields = ("order", "image", "image_url", "image_alt", "caption")


@admin.register(SiteSettings)
class SiteSettingsAdmin(CSVExportMixin, admin.ModelAdmin):
    """Singleton: keep add/delete disabled so there is exactly one row."""

    fieldsets = (
        ("Company", {"fields": ("company_name", "tagline", "about_short", "footer_text")}),
        ("Contact", {"fields": ("phone", "phone_alt", "email", "address", "map_embed_url")}),
        (
            "Social links",
            {
                "fields": (
                    "facebook",
                    "instagram",
                    "youtube",
                    "linkedin",
                    "twitter",
                    "tiktok",
                    "whatsapp",
                )
            },
        ),
        ("SEO defaults", {"fields": ("default_seo_title", "default_seo_description")}),
        ("Meta", {"fields": ("created_at", "updated_at")}),
    )
    readonly_fields = ("created_at", "updated_at")
    csv_fields = ("company_name", "phone", "email", "address")

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(HeroSlide)
class HeroSlideAdmin(ImagePreviewMixin, PublishableAdmin):
    list_display = ("preview", "heading", "subtitle", "order", "is_published")
    list_display_links = ("heading",)
    search_fields = ("heading", "subtitle", "description")
    csv_fields = ("id", "heading", "subtitle", "order", "is_published")
    preview = ImagePreviewMixin.image_preview


@admin.register(Service)
class ServiceAdmin(ImagePreviewMixin, PublishableAdmin):
    list_display = ("preview", "name", "slug", "badge", "show_in_nav", "order", "is_published")
    list_display_links = ("name",)
    list_filter = ("is_published", "show_in_nav")
    search_fields = ("name", "slug", "summary")
    prepopulated_fields = {"slug": ("name",)}
    csv_fields = ("id", "name", "slug", "order", "is_published")
    preview = ImagePreviewMixin.image_preview


@admin.register(ServiceEntry)
class ServiceEntryAdmin(ImagePreviewMixin, PublishableAdmin):
    list_display = (
        "preview",
        "title",
        "service",
        "category",
        "is_featured",
        "order",
        "is_published",
    )
    list_display_links = ("title",)
    list_filter = ("service", "is_featured", "is_published")
    search_fields = ("title", "slug", "summary", "badge")
    inlines = (ServiceEntryImageInline,)
    fieldsets = (
        (None, {"fields": ("service", "title", "slug", "subtitle", "badge", "category")}),
        ("Copy", {"fields": ("summary", "hero_subtitle", "body", "intro_title")}),
        (
            "Repeaters (JSON)",
            {
                "fields": ("features", "stats", "highlights", "extra_sections"),
                "description": "Lists of strings or objects rendered verbatim by the site.",
            },
        ),
        ("Media", {"fields": ("image", "image_url", "image_alt", "video_url")}),
        (
            "Call to action",
            {"fields": ("cta_title", "cta_text", "cta_button_label", "cta_button_url")},
        ),
        ("Extra metadata", {"fields": ("client", "location", "event_date", "is_featured")}),
        ("SEO", {"fields": ("seo_title", "seo_description")}),
        ("Publishing", {"fields": ("order", "is_published", "published_at")}),
    )
    csv_fields = ("id", "service", "title", "slug", "order", "is_published")
    preview = ImagePreviewMixin.image_preview


@admin.register(Artist)
class ArtistAdmin(ImagePreviewMixin, PublishableAdmin):
    list_display = (
        "preview",
        "name",
        "category",
        "city",
        "rating",
        "is_featured",
        "order",
        "is_published",
    )
    list_display_links = ("name",)
    list_filter = ("category", "is_featured", "is_published", "city")
    search_fields = ("name", "slug", "genre", "famous_for")
    prepopulated_fields = {"slug": ("name",)}
    csv_fields = ("id", "name", "category", "city", "rating", "is_published")
    preview = ImagePreviewMixin.image_preview


@admin.register(InfluencerProfile)
class InfluencerProfileAdmin(ImagePreviewMixin, PublishableAdmin):
    list_display = ("preview", "name", "handle", "platform", "followers", "order", "is_published")
    list_display_links = ("name",)
    list_filter = ("platform", "is_published")
    search_fields = ("name", "handle", "niche")
    csv_fields = ("id", "name", "handle", "platform", "followers", "is_published")
    preview = ImagePreviewMixin.image_preview


@admin.register(ContentBlock)
class ContentBlockAdmin(ImagePreviewMixin, PublishableAdmin):
    list_display = ("preview", "section", "title", "subtitle", "order", "is_published")
    list_display_links = ("title",)
    list_filter = ("section", "is_published")
    search_fields = ("section", "title", "description", "value")
    csv_fields = ("id", "section", "title", "value", "order", "is_published")
    preview = ImagePreviewMixin.image_preview


@admin.register(PortfolioItem)
class PortfolioItemAdmin(ImagePreviewMixin, PublishableAdmin):
    list_display = (
        "preview",
        "title",
        "client",
        "category",
        "event_date",
        "is_featured",
        "is_published",
    )
    list_display_links = ("title",)
    list_filter = ("category", "is_featured", "is_published")
    search_fields = ("title", "client", "location", "description")
    inlines = (PortfolioImageInline,)
    prepopulated_fields = {"slug": ("title",)}
    csv_fields = ("id", "title", "client", "category", "is_published")
    preview = ImagePreviewMixin.image_preview


@admin.register(GalleryImage)
class GalleryImageAdmin(ImagePreviewMixin, PublishableAdmin):
    list_display = ("preview", "title", "album", "order", "is_published")
    list_display_links = ("title",)
    list_filter = ("album", "is_published")
    search_fields = ("title", "caption", "album")
    csv_fields = ("id", "title", "album", "order", "is_published")
    preview = ImagePreviewMixin.image_preview


@admin.register(Video)
class VideoAdmin(PublishableAdmin):
    list_display = ("title", "category", "duration", "order", "is_published")
    list_display_links = ("title",)
    list_filter = ("category", "is_published")
    search_fields = ("title", "description", "youtube_url")
    csv_fields = ("id", "title", "youtube_url", "category", "is_published")

    @admin.display(description="Link")
    def link(self, obj):
        return format_html('<a href="{}" target="_blank" rel="noopener">watch</a>', obj.youtube_url)


@admin.register(BlogPost)
class BlogPostAdmin(ImagePreviewMixin, BaseAdmin):
    list_display = (
        "preview",
        "title",
        "category",
        "author_name",
        "read_minutes",
        "is_featured",
        "is_published",
        "published_at",
    )
    list_display_links = ("title",)
    list_filter = ("category", "is_featured", "is_published")
    search_fields = ("title", "slug", "excerpt", "content", "author_name")
    prepopulated_fields = {"slug": ("title",)}
    date_hierarchy = "published_at"
    csv_fields = ("id", "title", "slug", "category", "author_name", "is_published")
    actions = ("publish_posts", "unpublish_posts", "export_as_csv")
    preview = ImagePreviewMixin.image_preview

    @admin.action(description="Publish selected posts")
    def publish_posts(self, request, queryset):
        updated = queryset.update(is_published=True)
        self.message_user(request, f"Published {updated} post(s).")

    @admin.action(description="Unpublish selected posts")
    def unpublish_posts(self, request, queryset):
        updated = queryset.update(is_published=False)
        self.message_user(request, f"Unpublished {updated} post(s).")


@admin.register(Testimonial)
class TestimonialAdmin(ImagePreviewMixin, PublishableAdmin):
    list_display = (
        "preview",
        "name",
        "designation",
        "company",
        "rating",
        "is_featured",
        "is_published",
    )
    list_display_links = ("name",)
    list_filter = ("rating", "is_featured", "is_published")
    search_fields = ("name", "company", "review")
    csv_fields = ("id", "name", "company", "rating", "is_published")
    preview = ImagePreviewMixin.image_preview


@admin.register(TeamMember)
class TeamMemberAdmin(ImagePreviewMixin, PublishableAdmin):
    list_display = ("preview", "name", "role", "email", "order", "is_published")
    list_display_links = ("name",)
    list_filter = ("is_published",)
    search_fields = ("name", "role", "description")
    csv_fields = ("id", "name", "role", "email", "is_published")
    preview = ImagePreviewMixin.image_preview


@admin.register(FAQ)
class FAQAdmin(PublishableAdmin):
    list_display = ("question", "section", "order", "is_published")
    list_display_links = ("question",)
    list_filter = ("section", "is_published")
    search_fields = ("question", "answer")
    csv_fields = ("id", "section", "question", "order", "is_published")


@admin.register(JobPosting)
class JobPostingAdmin(BaseAdmin):
    list_display = (
        "title",
        "department",
        "location",
        "employment_type",
        "deadline",
        "vacancies",
        "is_published",
    )
    list_display_links = ("title",)
    list_filter = ("department", "employment_type", "is_published")
    search_fields = ("title", "slug", "description")
    prepopulated_fields = {"slug": ("title",)}
    csv_fields = ("id", "title", "department", "location", "deadline", "is_published")
    actions = ("publish_jobs", "unpublish_jobs", "export_as_csv")

    @admin.action(description="Publish selected job postings")
    def publish_jobs(self, request, queryset):
        updated = queryset.update(is_published=True)
        self.message_user(request, f"Published {updated} job posting(s).")

    @admin.action(description="Unpublish selected job postings")
    def unpublish_jobs(self, request, queryset):
        updated = queryset.update(is_published=False)
        self.message_user(request, f"Unpublished {updated} job posting(s).")


@admin.register(Event)
class EventAdmin(ImagePreviewMixin, BaseAdmin):
    list_display = (
        "preview",
        "title",
        "city",
        "start_date",
        "status",
        "is_featured",
        "is_published",
    )
    list_display_links = ("title",)
    list_filter = ("status", "city", "is_featured", "is_published")
    search_fields = ("title", "slug", "venue", "client")
    prepopulated_fields = {"slug": ("title",)}
    csv_fields = ("id", "title", "city", "start_date", "status", "is_published")
    preview = ImagePreviewMixin.image_preview
