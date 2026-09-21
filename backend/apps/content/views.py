"""Public (read-only) and admin (JWT) endpoints for all content models."""

from __future__ import annotations

# --------------------------------------------------------------------------- #
# Mixins
# --------------------------------------------------------------------------- #
import django_filters
from django.db.models import Count, F, Q
from django.utils import timezone
from drf_spectacular.utils import extend_schema
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.routers import DefaultRouter

from apps.accounts.models import AdminActionLog, User
from apps.common.permissions import IsEditorOrReadOnly
from apps.common.throttles import PublicReadThrottle
from apps.common.utils import log_action
from apps.content import serializers as s
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


class ServiceEntryFilter(django_filters.FilterSet):
    """Accept either a numeric service id or its slug (`?service=corporate-events`)."""

    service = django_filters.CharFilter(method="filter_service")

    class Meta:
        from apps.content.models import ServiceEntry as _ServiceEntry

        model = _ServiceEntry
        fields = ["service", "category", "is_featured"]

    def filter_service(self, queryset, name, value):
        value = str(value)
        if value.isdigit():
            return queryset.filter(service_id=value)
        return queryset.filter(service__slug=value)


class PublishedQuerysetMixin:
    """Public endpoints never expose drafts."""

    def get_queryset(self):
        return super().get_queryset().filter(is_published=True)


class AdminCRUDMixin:
    """
    Shared admin behaviour: audit logging, reorder, bulk delete, publish toggles.

    Permissions come from `IsEditorOrReadOnly`: viewers get 200 on reads and
    403 on writes; anonymous callers get 401.
    """

    permission_classes = [IsEditorOrReadOnly]

    def perform_create(self, serializer):
        instance = serializer.save()
        log_action(
            user=self.request.user,
            action=AdminActionLog.Action.CREATE,
            instance=instance,
            request=self.request,
        )

    def perform_update(self, serializer):
        instance = serializer.save()
        log_action(
            user=self.request.user,
            action=AdminActionLog.Action.UPDATE,
            instance=instance,
            request=self.request,
        )

    def perform_destroy(self, instance):
        log_action(
            user=self.request.user,
            action=AdminActionLog.Action.DELETE,
            instance=instance,
            request=self.request,
        )
        instance.delete()

    @extend_schema(
        tags=["admin"],
        summary="Reorder items",
        request={
            "application/json": {
                "type": "object",
                "properties": {
                    "items": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {"id": {"type": "integer"}, "order": {"type": "integer"}},
                        },
                    }
                },
            }
        },
    )
    @action(detail=False, methods=["post"])
    def reorder(self, request, **kwargs):
        items = request.data.get("items") or request.data.get("order") or []
        if not isinstance(items, list):
            return Response({"detail": "`items` must be a list of {id, order}."}, status=400)
        updated = 0
        for index, item in enumerate(items):
            if not isinstance(item, dict):
                continue
            pk = item.get("id")
            order = item.get("order", index)
            if pk is None:
                continue
            updated += self.get_queryset().filter(pk=pk).update(order=order)
        log_action(
            user=request.user,
            action=AdminActionLog.Action.REORDER,
            model_name=self.queryset.model.__name__,
            detail=f"{updated} row(s)",
            request=request,
        )
        return Response({"detail": f"Reordered {updated} item(s).", "updated": updated})

    @extend_schema(tags=["admin"], summary="Delete many items at once")
    @action(detail=False, methods=["post"], url_path="bulk-delete")
    def bulk_delete(self, request, **kwargs):
        ids = request.data.get("ids") or []
        if not isinstance(ids, list) or not ids:
            return Response({"detail": "`ids` must be a non-empty list."}, status=400)
        queryset = self.get_queryset().filter(pk__in=ids)
        count = queryset.count()
        log_action(
            user=request.user,
            action=AdminActionLog.Action.BULK_DELETE,
            model_name=self.queryset.model.__name__,
            detail=f"ids={ids[:50]}",
            request=request,
        )
        queryset.delete()
        return Response({"detail": f"Deleted {count} item(s).", "deleted": count})

    @extend_schema(tags=["admin"], summary="Publish an item")
    @action(detail=True, methods=["post"])
    def publish(self, request, **kwargs):
        instance = self.get_object()
        instance.is_published = True
        fields = ["is_published"]
        if hasattr(instance, "published_at") and not instance.published_at:
            instance.published_at = timezone.now()
            fields.append("published_at")
        instance.save(update_fields=fields)
        log_action(
            user=request.user,
            action=AdminActionLog.Action.UPDATE,
            instance=instance,
            detail="published",
            request=request,
        )
        return Response(self.get_serializer(instance).data)

    @extend_schema(tags=["admin"], summary="Unpublish an item")
    @action(detail=True, methods=["post"])
    def unpublish(self, request, **kwargs):
        instance = self.get_object()
        instance.is_published = False
        instance.save(update_fields=["is_published"])
        log_action(
            user=request.user,
            action=AdminActionLog.Action.UPDATE,
            instance=instance,
            detail="unpublished",
            request=request,
        )
        return Response(self.get_serializer(instance).data)


class SlugLookupMixin:
    lookup_field = "slug"


# --------------------------------------------------------------------------- #
# Public endpoints
# --------------------------------------------------------------------------- #
@extend_schema(tags=["public"])
class PublicServiceViewSet(PublishedQuerysetMixin, viewsets.ReadOnlyModelViewSet):
    queryset = Service.objects.all()
    serializer_class = s.ServiceDetailSerializer
    lookup_field = "slug"
    throttle_classes = [PublicReadThrottle]
    search_fields = ["name", "summary", "body"]
    filterset_fields = ["show_in_nav", "is_published"]
    ordering_fields = ["order", "name", "created_at"]

    def get_serializer_class(self):
        if self.action == "list":
            return s.ServiceListSerializer
        return s.ServiceDetailSerializer


@extend_schema(tags=["public"])
class PublicServiceEntryViewSet(PublishedQuerysetMixin, viewsets.ReadOnlyModelViewSet):
    """`/api/service-entries/` — flat lookup by slug, optionally filtered by service."""

    queryset = ServiceEntry.objects.select_related("service").prefetch_related("images")
    serializer_class = s.ServiceEntrySerializer
    lookup_field = "slug"
    throttle_classes = [PublicReadThrottle]
    search_fields = ["title", "summary", "body", "category"]
    filterset_class = ServiceEntryFilter
    ordering_fields = ["order", "title", "event_date"]

    def get_queryset(self):
        return super().get_queryset().filter(is_published=True)


@extend_schema(tags=["public"])
class PublicContentBlockViewSet(PublishedQuerysetMixin, viewsets.ReadOnlyModelViewSet):
    """`/api/blocks/?section=why_choose_us` — small marketing sections."""

    queryset = ContentBlock.objects.all()
    serializer_class = s.ContentBlockSerializer
    throttle_classes = [PublicReadThrottle]
    search_fields = ["title", "subtitle", "description"]
    filterset_fields = ["section"]
    ordering_fields = ["order", "created_at"]


@extend_schema(tags=["public"])
class PublicArtistViewSet(PublishedQuerysetMixin, viewsets.ReadOnlyModelViewSet):
    queryset = Artist.objects.all()
    serializer_class = s.ArtistSerializer
    lookup_field = "slug"
    throttle_classes = [PublicReadThrottle]
    search_fields = ["name", "bio", "genre", "city", "styles"]
    filterset_fields = ["category", "is_featured", "city", "availability"]
    ordering_fields = ["order", "name", "rating", "experience_years", "created_at"]


@extend_schema(tags=["public"])
class PublicInfluencerViewSet(PublishedQuerysetMixin, viewsets.ReadOnlyModelViewSet):
    queryset = InfluencerProfile.objects.all()
    serializer_class = s.InfluencerProfileSerializer
    throttle_classes = [PublicReadThrottle]
    search_fields = ["name", "handle", "niche", "city"]
    filterset_fields = ["platform", "is_featured", "niche"]
    ordering_fields = ["order", "name", "created_at"]


@extend_schema(tags=["public"])
class PublicPortfolioViewSet(PublishedQuerysetMixin, viewsets.ReadOnlyModelViewSet):
    queryset = PortfolioItem.objects.prefetch_related("images")
    serializer_class = s.PortfolioItemSerializer
    lookup_field = "slug"
    throttle_classes = [PublicReadThrottle]
    search_fields = ["title", "client", "description", "category"]
    filterset_fields = ["category", "is_featured"]
    ordering_fields = ["order", "title", "event_date", "created_at"]


@extend_schema(tags=["public"])
class PublicGalleryViewSet(PublishedQuerysetMixin, viewsets.ReadOnlyModelViewSet):
    queryset = GalleryImage.objects.all()
    serializer_class = s.GalleryImageSerializer
    throttle_classes = [PublicReadThrottle]
    search_fields = ["title", "album", "caption"]
    filterset_fields = ["album"]
    ordering_fields = ["order", "created_at"]


@extend_schema(tags=["public"])
class PublicVideoViewSet(PublishedQuerysetMixin, viewsets.ReadOnlyModelViewSet):
    queryset = Video.objects.all()
    serializer_class = s.VideoSerializer
    throttle_classes = [PublicReadThrottle]
    search_fields = ["title", "description", "category"]
    filterset_fields = ["category"]
    ordering_fields = ["order", "created_at"]


@extend_schema(tags=["public"])
class PublicBlogViewSet(PublishedQuerysetMixin, viewsets.ReadOnlyModelViewSet):
    queryset = BlogPost.objects.select_related("author")
    serializer_class = s.BlogPostSerializer
    lookup_field = "slug"
    throttle_classes = [PublicReadThrottle]
    search_fields = ["title", "excerpt", "content", "category"]
    filterset_fields = ["category", "is_featured"]
    ordering_fields = ["published_at", "created_at", "title", "views"]

    def get_serializer_class(self):
        return s.BlogPostListSerializer if self.action == "list" else s.BlogPostSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        BlogPost.objects.filter(pk=instance.pk).update(views=F("views") + 1)
        instance.refresh_from_db(fields=["views"])
        return Response(self.get_serializer(instance).data)


@extend_schema(tags=["public"])
class PublicTestimonialViewSet(PublishedQuerysetMixin, viewsets.ReadOnlyModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = s.TestimonialSerializer
    throttle_classes = [PublicReadThrottle]
    search_fields = ["name", "company", "review", "designation"]
    filterset_fields = ["event_type", "rating", "is_featured"]
    ordering_fields = ["order", "created_at", "rating"]


@extend_schema(tags=["public"])
class PublicTeamViewSet(PublishedQuerysetMixin, viewsets.ReadOnlyModelViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = s.TeamMemberSerializer
    throttle_classes = [PublicReadThrottle]
    search_fields = ["name", "role", "description"]
    ordering_fields = ["order", "name", "created_at"]


@extend_schema(tags=["public"])
class PublicFAQViewSet(PublishedQuerysetMixin, viewsets.ReadOnlyModelViewSet):
    queryset = FAQ.objects.all()
    serializer_class = s.FAQSerializer
    throttle_classes = [PublicReadThrottle]
    search_fields = ["question", "answer"]
    filterset_fields = ["section"]
    ordering_fields = ["order", "created_at"]


@extend_schema(tags=["public"])
class PublicJobViewSet(PublishedQuerysetMixin, viewsets.ReadOnlyModelViewSet):
    queryset = JobPosting.objects.all()
    serializer_class = s.JobPostingSerializer
    lookup_field = "slug"
    throttle_classes = [PublicReadThrottle]
    search_fields = ["title", "department", "description", "location"]
    filterset_fields = ["employment_type", "department", "location"]
    ordering_fields = ["order", "created_at", "deadline"]

    def get_queryset(self):
        return super().get_queryset().annotate(application_count=Count("applications"))


@extend_schema(tags=["public"])
class PublicHeroSlideViewSet(PublishedQuerysetMixin, viewsets.ReadOnlyModelViewSet):
    queryset = HeroSlide.objects.all()
    serializer_class = s.HeroSlideSerializer
    throttle_classes = [PublicReadThrottle]
    ordering_fields = ["order", "created_at"]


@extend_schema(tags=["public"])
class PublicEventViewSet(PublishedQuerysetMixin, viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.all()
    serializer_class = s.EventSerializer
    lookup_field = "slug"
    throttle_classes = [PublicReadThrottle]
    search_fields = ["title", "venue", "city", "client"]
    filterset_fields = ["status", "city", "is_featured"]
    ordering_fields = ["start_date", "title", "created_at"]


@extend_schema(
    tags=["public"],
    summary="Site settings (contact details, socials, footer)",
    responses=s.SiteSettingsSerializer,
)
class SiteSettingsView(viewsets.ViewSet):
    permission_classes: list = []
    throttle_classes = [PublicReadThrottle]

    def list(self, request, **kwargs):
        return Response(s.SiteSettingsSerializer(SiteSettings.load()).data)


# --------------------------------------------------------------------------- #
# Admin endpoints
# --------------------------------------------------------------------------- #
@extend_schema(tags=["admin"])
class AdminServiceViewSet(AdminCRUDMixin, viewsets.ModelViewSet):
    queryset = Service.objects.prefetch_related("serviceentry_set").all()
    serializer_class = s.ServiceAdminSerializer
    lookup_field = "slug"
    search_fields = ["name", "summary", "body"]
    filterset_fields = ["is_published", "show_in_nav"]
    ordering_fields = ["order", "name", "created_at", "updated_at"]


@extend_schema(tags=["admin"])
class AdminServiceEntryViewSet(AdminCRUDMixin, viewsets.ModelViewSet):
    queryset = ServiceEntry.objects.select_related("service").prefetch_related("images")
    serializer_class = s.ServiceEntrySerializer
    search_fields = ["title", "summary", "body", "category", "service__name"]
    filterset_fields = ["service", "service__slug", "category", "is_published", "is_featured"]
    ordering_fields = ["order", "title", "created_at", "event_date"]

    def get_queryset(self):
        qs = super().get_queryset()
        service_slug = self.request.query_params.get("service_slug")
        if service_slug:
            qs = qs.filter(service__slug=service_slug)
        return qs


@extend_schema(tags=["admin"])
class AdminServiceEntryImageViewSet(AdminCRUDMixin, viewsets.ModelViewSet):
    queryset = ServiceEntryImage.objects.select_related("entry")
    serializer_class = s.ServiceEntryImageSerializer
    filterset_fields = ["entry"]
    ordering_fields = ["order", "created_at"]


@extend_schema(tags=["admin"])
class AdminHeroSlideViewSet(AdminCRUDMixin, viewsets.ModelViewSet):
    queryset = HeroSlide.objects.all()
    serializer_class = s.HeroSlideSerializer
    search_fields = ["subtitle", "heading", "description"]
    filterset_fields = ["is_published"]
    ordering_fields = ["order", "created_at"]


@extend_schema(tags=["admin"])
class AdminContentBlockViewSet(AdminCRUDMixin, viewsets.ModelViewSet):
    queryset = ContentBlock.objects.all()
    serializer_class = s.ContentBlockSerializer
    search_fields = ["title", "subtitle", "description"]
    filterset_fields = ["section", "is_published"]
    ordering_fields = ["order", "created_at"]


@extend_schema(tags=["admin"])
class AdminArtistViewSet(AdminCRUDMixin, viewsets.ModelViewSet):
    queryset = Artist.objects.all()
    serializer_class = s.ArtistSerializer
    lookup_field = "slug"
    search_fields = ["name", "bio", "genre", "city", "category"]
    filterset_fields = ["category", "is_featured", "is_published", "city"]
    ordering_fields = ["order", "name", "rating", "created_at", "updated_at"]


@extend_schema(tags=["admin"])
class AdminInfluencerViewSet(AdminCRUDMixin, viewsets.ModelViewSet):
    queryset = InfluencerProfile.objects.all()
    serializer_class = s.InfluencerProfileSerializer
    search_fields = ["name", "handle", "niche", "platform"]
    filterset_fields = ["platform", "is_featured", "is_published"]
    ordering_fields = ["order", "name", "created_at"]


@extend_schema(tags=["admin"])
class AdminPortfolioViewSet(AdminCRUDMixin, viewsets.ModelViewSet):
    queryset = PortfolioItem.objects.prefetch_related("images")
    serializer_class = s.PortfolioItemSerializer
    lookup_field = "slug"
    search_fields = ["title", "client", "description", "category"]
    filterset_fields = ["category", "is_featured", "is_published"]
    ordering_fields = ["order", "title", "event_date", "created_at"]

    @action(detail=True, methods=["post"], url_path="images")
    def add_image(self, request, **kwargs):
        item = self.get_object()
        serializer = s.PortfolioImageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(item=item)
        log_action(
            user=request.user,
            action=AdminActionLog.Action.CREATE,
            instance=item,
            detail="portfolio image added",
            request=request,
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)


@extend_schema(tags=["admin"])
class AdminPortfolioImageViewSet(AdminCRUDMixin, viewsets.ModelViewSet):
    queryset = PortfolioImage.objects.select_related("item")
    serializer_class = s.PortfolioImageSerializer
    filterset_fields = ["item"]
    ordering_fields = ["order"]


@extend_schema(tags=["admin"])
class AdminGalleryViewSet(AdminCRUDMixin, viewsets.ModelViewSet):
    queryset = GalleryImage.objects.all()
    serializer_class = s.GalleryImageSerializer
    search_fields = ["title", "caption", "album"]
    filterset_fields = ["album", "is_published"]
    ordering_fields = ["order", "created_at"]


@extend_schema(tags=["admin"])
class AdminVideoViewSet(AdminCRUDMixin, viewsets.ModelViewSet):
    queryset = Video.objects.all()
    serializer_class = s.VideoSerializer
    search_fields = ["title", "description", "category"]
    filterset_fields = ["category", "is_published"]
    ordering_fields = ["order", "created_at"]


@extend_schema(tags=["admin"])
class AdminBlogViewSet(AdminCRUDMixin, viewsets.ModelViewSet):
    queryset = BlogPost.objects.select_related("author")
    serializer_class = s.BlogPostSerializer
    lookup_field = "slug"
    search_fields = ["title", "excerpt", "content", "category", "author_name"]
    filterset_fields = ["category", "is_published", "is_featured"]
    ordering_fields = ["published_at", "created_at", "title", "views"]

    def perform_create(self, serializer):
        instance = serializer.save(author=self.request.user)
        log_action(
            user=self.request.user,
            action=AdminActionLog.Action.CREATE,
            instance=instance,
            request=self.request,
        )


@extend_schema(tags=["admin"])
class AdminTestimonialViewSet(AdminCRUDMixin, viewsets.ModelViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = s.TestimonialSerializer
    search_fields = ["name", "company", "review", "designation"]
    filterset_fields = ["rating", "event_type", "is_published", "is_featured"]
    ordering_fields = ["order", "created_at", "rating"]


@extend_schema(tags=["admin"])
class AdminTeamViewSet(AdminCRUDMixin, viewsets.ModelViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = s.TeamMemberSerializer
    search_fields = ["name", "role", "description", "email"]
    filterset_fields = ["is_published"]
    ordering_fields = ["order", "name", "created_at"]


@extend_schema(tags=["admin"])
class AdminFAQViewSet(AdminCRUDMixin, viewsets.ModelViewSet):
    queryset = FAQ.objects.all()
    serializer_class = s.FAQSerializer
    search_fields = ["question", "answer"]
    filterset_fields = ["section", "is_published"]
    ordering_fields = ["order", "created_at"]


@extend_schema(tags=["admin"])
class AdminJobViewSet(AdminCRUDMixin, viewsets.ModelViewSet):
    queryset = JobPosting.objects.annotate(application_count=Count("applications"))
    serializer_class = s.JobPostingSerializer
    lookup_field = "slug"
    search_fields = ["title", "department", "location", "description"]
    filterset_fields = ["employment_type", "department", "is_published"]
    ordering_fields = ["order", "created_at", "deadline", "title"]


@extend_schema(tags=["admin"])
class AdminEventViewSet(AdminCRUDMixin, viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = s.EventSerializer
    lookup_field = "slug"
    search_fields = ["title", "venue", "city", "client", "description"]
    filterset_fields = ["status", "city", "is_featured", "is_published"]
    ordering_fields = ["start_date", "created_at", "title"]


@extend_schema(tags=["admin"])
class AdminSiteSettingsView(viewsets.ViewSet):
    """`/api/admin/settings/` — site-wide settings (editors may update)."""

    permission_classes = [IsEditorOrReadOnly]

    def _obj(self):
        return SiteSettings.load()

    def list(self, request):
        return Response(s.SiteSettingsSerializer(self._obj()).data)

    def create(self, request):
        serializer = s.SiteSettingsSerializer(self._obj(), data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        log_action(
            user=request.user,
            action=AdminActionLog.Action.UPDATE,
            instance=self._obj(),
            request=request,
        )
        return Response(serializer.data)

    @action(detail=False, methods=["patch"], url_path="update")
    def update_settings(self, request, **kwargs):
        serializer = s.SiteSettingsSerializer(self._obj(), data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        log_action(
            user=request.user,
            action=AdminActionLog.Action.UPDATE,
            instance=self._obj(),
            detail="site settings",
            request=request,
        )
        return Response(serializer.data)


# --------------------------------------------------------------------------- #
# Routers
# --------------------------------------------------------------------------- #
public_router = DefaultRouter()
public_router.register("settings", SiteSettingsView, basename="settings")
public_router.register("hero-slides", PublicHeroSlideViewSet, basename="hero-slides")
public_router.register("services", PublicServiceViewSet, basename="services")
public_router.register("service-entries", PublicServiceEntryViewSet, basename="service-entries")
public_router.register("blocks", PublicContentBlockViewSet, basename="blocks")
public_router.register("artists", PublicArtistViewSet, basename="artists")
public_router.register("influencers", PublicInfluencerViewSet, basename="influencers")
public_router.register("portfolio", PublicPortfolioViewSet, basename="portfolio")
public_router.register("gallery", PublicGalleryViewSet, basename="gallery")
public_router.register("videos", PublicVideoViewSet, basename="videos")
public_router.register("blogs", PublicBlogViewSet, basename="blogs")
public_router.register("testimonials", PublicTestimonialViewSet, basename="testimonials")
public_router.register("team", PublicTeamViewSet, basename="team")
public_router.register("faqs", PublicFAQViewSet, basename="faqs")
public_router.register("jobs", PublicJobViewSet, basename="jobs")
public_router.register("events", PublicEventViewSet, basename="events")

admin_router = DefaultRouter()
admin_router.register("services", AdminServiceViewSet, basename="admin-services")
admin_router.register("service-entries", AdminServiceEntryViewSet, basename="admin-service-entries")
admin_router.register(
    "service-entry-images", AdminServiceEntryImageViewSet, basename="admin-service-entry-images"
)
admin_router.register("hero-slides", AdminHeroSlideViewSet, basename="admin-hero-slides")
admin_router.register("blocks", AdminContentBlockViewSet, basename="admin-blocks")
admin_router.register("artists", AdminArtistViewSet, basename="admin-artists")
admin_router.register("influencers", AdminInfluencerViewSet, basename="admin-influencers")
admin_router.register("portfolio", AdminPortfolioViewSet, basename="admin-portfolio")
admin_router.register(
    "portfolio-images", AdminPortfolioImageViewSet, basename="admin-portfolio-images"
)
admin_router.register("gallery", AdminGalleryViewSet, basename="admin-gallery")
admin_router.register("videos", AdminVideoViewSet, basename="admin-videos")
admin_router.register("blogs", AdminBlogViewSet, basename="admin-blogs")
admin_router.register("testimonials", AdminTestimonialViewSet, basename="admin-testimonials")
admin_router.register("team", AdminTeamViewSet, basename="admin-team")
admin_router.register("faqs", AdminFAQViewSet, basename="admin-faqs")
admin_router.register("jobs", AdminJobViewSet, basename="admin-jobs")
admin_router.register("events", AdminEventViewSet, basename="admin-events")
admin_router.register("settings", AdminSiteSettingsView, basename="admin-settings")


@extend_schema(tags=["admin"], summary="Dashboard statistics")
class DashboardStatsView(viewsets.ViewSet):
    permission_classes = [IsEditorOrReadOnly]

    def list(self, request):
        from apps.submissions.models import (
            ArtistApplication,
            ArtistBookingRequest,
            ContactMessage,
            JobApplication,
            TalentHuntRegistration,
            VendorRegistration,
        )

        pending = {
            "contact_messages": ContactMessage.objects.filter(status="pending").count(),
            "booking_requests": ArtistBookingRequest.objects.filter(status="pending").count(),
            "artist_applications": ArtistApplication.objects.filter(status="pending").count(),
            "talent_hunt": TalentHuntRegistration.objects.filter(status="pending").count(),
            "vendors": VendorRegistration.objects.filter(status="pending").count(),
            "job_applications": JobApplication.objects.filter(status="pending").count(),
        }
        data = {
            "content": {
                "services": Service.objects.count(),
                "service_entries": ServiceEntry.objects.count(),
                "artists": Artist.objects.count(),
                "artists_by_category": {
                    row["category"]: row["total"]
                    for row in Artist.objects.values("category").annotate(total=Count("id"))
                },
                "influencers": InfluencerProfile.objects.count(),
                "portfolio": PortfolioItem.objects.count(),
                "gallery": GalleryImage.objects.count(),
                "videos": Video.objects.count(),
                "blogs": BlogPost.objects.count(),
                "published_blogs": BlogPost.objects.filter(is_published=True).count(),
                "testimonials": Testimonial.objects.count(),
                "team": TeamMember.objects.count(),
                "faqs": FAQ.objects.count(),
                "jobs": JobPosting.objects.count(),
                "open_jobs": JobPosting.objects.filter(
                    Q(deadline__isnull=True) | Q(deadline__gte=timezone.localdate()),
                    is_published=True,
                ).count(),
                "upcoming_events": Event.objects.filter(
                    start_date__gte=timezone.localdate()
                ).count(),
            },
            "submissions": {
                "pending": pending,
                "total_pending": sum(pending.values()),
                "contact_messages_total": ContactMessage.objects.count(),
                "bookings_total": ArtistBookingRequest.objects.count(),
                "applications_total": (
                    ArtistApplication.objects.count()
                    + TalentHuntRegistration.objects.count()
                    + VendorRegistration.objects.count()
                    + JobApplication.objects.count()
                ),
            },
            "recent": {
                "contact_messages": list(
                    ContactMessage.objects.order_by("-created_at").values(
                        "id", "full_name", "subject", "status", "created_at"
                    )[:5]
                ),
                "bookings": list(
                    ArtistBookingRequest.objects.order_by("-created_at").values(
                        "id", "full_name", "artist_name", "event_date", "status", "created_at"
                    )[:5]
                ),
                "events": list(
                    Event.objects.order_by("-start_date").values(
                        "id", "title", "start_date", "status", "capacity"
                    )[:5]
                ),
            },
            "users": {
                "total": User.objects.count(),
                "active": User.objects.filter(is_active=True).count(),
            },
        }
        return Response(data)


admin_router.register("dashboard/stats", DashboardStatsView, basename="admin-dashboard-stats")
