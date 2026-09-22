from django.db.models import F
from rest_framework import filters, viewsets
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from core.permissions import IsSuperAdmin
from core.views import AdminCrudViewSet, PublicReadOnlyViewSet

from .models import (
    FAQ,
    BlogPost,
    GalleryImage,
    HeroSlide,
    PortfolioItem,
    Service,
    ServiceEntry,
    SiteSettings,
    TeamMember,
    Testimonial,
    Video,
)
from .serializers import (
    BlogPostDetailSerializer,
    BlogPostListSerializer,
    BlogPostWriteSerializer,
    FAQSerializer,
    GalleryImageSerializer,
    GalleryImageWriteSerializer,
    HeroSlideSerializer,
    HeroSlideWriteSerializer,
    PortfolioItemSerializer,
    ServiceEntryDetailSerializer,
    ServiceEntryListSerializer,
    ServiceEntryWriteSerializer,
    ServiceSerializer,
    SiteSettingsSerializer,
    TeamMemberSerializer,
    TestimonialSerializer,
    VideoSerializer,
)


# ----------------------------------------------------------------- public --
class PublicHeroSlideViewSet(PublicReadOnlyViewSet):
    queryset = HeroSlide.objects.all()
    serializer_class = HeroSlideSerializer
    filter_backends = [filters.OrderingFilter]
    ordering = ["order", "id"]
    pagination_class = None


class SiteSettingsView(RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = SiteSettingsSerializer

    def get_object(self):
        return SiteSettings.load()


class PublicServiceViewSet(PublicReadOnlyViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    search_fields = ["name", "category", "short_description"]
    filterset_fields = ["category"]
    pagination_class = None


class PublicServiceEntryViewSet(PublicReadOnlyViewSet):
    queryset = ServiceEntry.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "excerpt", "category", "content"]
    ordering = ["-date", "order", "id"]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ServiceEntryDetailSerializer
        return ServiceEntryListSerializer

    def filter_queryset(self, queryset):
        qs = super().filter_queryset(queryset)
        entry_type = self.request.query_params.get("type")
        if entry_type:
            qs = qs.filter(entry_type=entry_type)
        return qs


class PublicFAQViewSet(PublicReadOnlyViewSet):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    filterset_fields = ["page"]
    ordering = ["order", "id"]
    pagination_class = None


class PublicTestimonialViewSet(PublicReadOnlyViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    search_fields = ["name", "company", "review"]
    ordering = ["order", "id"]
    pagination_class = None


class PublicTeamViewSet(PublicReadOnlyViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    ordering = ["order", "id"]
    pagination_class = None


class PublicPortfolioViewSet(PublicReadOnlyViewSet):
    queryset = PortfolioItem.objects.all()
    serializer_class = PortfolioItemSerializer
    filterset_fields = ["category"]
    search_fields = ["title", "description", "client"]
    ordering = ["order", "id"]


class PublicGalleryViewSet(PublicReadOnlyViewSet):
    queryset = GalleryImage.objects.all()
    serializer_class = GalleryImageSerializer
    filterset_fields = ["category"]
    search_fields = ["title", "description"]
    ordering = ["order", "id"]
    pagination_class = None


class PublicVideoViewSet(PublicReadOnlyViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    filterset_fields = ["category"]
    search_fields = ["title", "description"]
    ordering = ["order", "id"]
    pagination_class = None


class PublicBlogViewSet(PublicReadOnlyViewSet):
    queryset = BlogPost.objects.all()
    filterset_fields = ["category", "featured"]
    search_fields = ["title", "excerpt", "content", "author"]
    ordering = ["-published_date", "id"]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return BlogPostDetailSerializer
        return BlogPostListSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        BlogPost.objects.filter(pk=instance.pk).update(views=F("views") + 1)
        instance.refresh_from_db(fields=["views"])
        return Response(self.get_serializer(instance).data)


# ------------------------------------------------------------------ admin --
class AdminHeroSlideViewSet(AdminCrudViewSet):
    queryset = HeroSlide.objects.all()
    audit_fields = ("subtitle", "description", "stats", "order", "is_published")

    def get_serializer_class(self):
        if self.action in {"create", "update", "partial_update"}:
            return HeroSlideWriteSerializer
        return HeroSlideSerializer


class AdminServiceViewSet(AdminCrudViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    search_fields = ["name", "category"]
    audit_fields = ("name", "category", "price", "order", "is_published")


class AdminServiceEntryViewSet(AdminCrudViewSet):
    queryset = ServiceEntry.objects.all()
    filterset_fields = ["entry_type", "featured"]
    search_fields = ["title", "excerpt", "content", "author"]
    ordering_fields = ["date", "order", "title"]
    audit_fields = ("title", "category", "excerpt", "featured", "is_published")

    def get_serializer_class(self):
        if self.action in {"create", "update", "partial_update"}:
            return ServiceEntryWriteSerializer
        if self.action == "retrieve":
            return ServiceEntryDetailSerializer
        return ServiceEntryListSerializer

    def filter_queryset(self, queryset):
        qs = super().filter_queryset(queryset)
        entry_type = self.request.query_params.get("entry_type") or self.request.query_params.get(
            "type"
        )
        if entry_type:
            qs = qs.filter(entry_type=entry_type)
        return qs

    def get_object(self):
        """Admin detail also resolves legacy ids (slug OR legacy_id)."""
        from django.shortcuts import get_object_or_404

        ident = self.kwargs[self.lookup_field]
        qs = self.filter_queryset(self.get_queryset())
        obj = qs.filter(slug=ident).first() or qs.filter(legacy_id=ident).first()
        return get_object_or_404(qs, pk=(obj.pk if obj else -1))


class AdminFAQViewSet(AdminCrudViewSet):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer
    filterset_fields = ["page"]
    search_fields = ["question", "answer"]
    audit_fields = ("question", "answer", "page", "order", "is_published")


class AdminTestimonialViewSet(AdminCrudViewSet):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    search_fields = ["name", "company", "review"]
    audit_fields = ("name", "rating", "review", "order", "is_published")


class AdminTeamViewSet(AdminCrudViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    search_fields = ["name", "role"]
    audit_fields = ("name", "role", "order", "is_published")


class AdminPortfolioViewSet(AdminCrudViewSet):
    queryset = PortfolioItem.objects.all()
    serializer_class = PortfolioItemSerializer
    filterset_fields = ["category"]
    search_fields = ["title", "client", "description"]
    audit_fields = ("title", "category", "client", "order", "is_published")


class AdminGalleryViewSet(AdminCrudViewSet):
    queryset = GalleryImage.objects.all()
    filterset_fields = ["category"]
    search_fields = ["title", "description"]
    audit_fields = ("title", "category", "order", "is_published")

    def get_serializer_class(self):
        if self.action in {"create", "update", "partial_update"}:
            return GalleryImageWriteSerializer
        return GalleryImageSerializer


class AdminVideoViewSet(AdminCrudViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    filterset_fields = ["category"]
    search_fields = ["title", "description"]
    audit_fields = ("title", "category", "youtube_id", "order", "is_published")


class AdminBlogViewSet(AdminCrudViewSet):
    queryset = BlogPost.objects.all()
    filterset_fields = ["category", "featured"]
    search_fields = ["title", "excerpt", "content", "author"]
    ordering_fields = ["published_date", "views", "order"]
    audit_fields = ("title", "category", "author", "featured", "is_published")

    def get_serializer_class(self):
        if self.action in {"create", "update", "partial_update"}:
            return BlogPostWriteSerializer
        if self.action == "retrieve":
            return BlogPostDetailSerializer
        return BlogPostListSerializer


class AdminSiteSettingsView(viewsets.GenericViewSet, RetrieveAPIView):
    """Singleton settings — read for staff, write for super_admin."""

    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer
    permission_classes = []

    def get_permissions(self):
        from rest_framework.permissions import IsAuthenticated

        if self.request.method == "GET":
            return [IsAuthenticated()]
        return [IsAuthenticated(), IsSuperAdmin()]

    def get_object(self):
        return SiteSettings.load()

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        from core.audit import ACTION_UPDATE, log_action

        log_action(request, ACTION_UPDATE, instance, model_name="SiteSettings")
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)
