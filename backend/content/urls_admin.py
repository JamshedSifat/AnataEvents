from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    AdminBlogViewSet,
    AdminFAQViewSet,
    AdminGalleryViewSet,
    AdminHeroSlideViewSet,
    AdminPortfolioViewSet,
    AdminServiceEntryViewSet,
    AdminServiceViewSet,
    AdminSiteSettingsView,
    AdminTeamViewSet,
    AdminTestimonialViewSet,
    AdminVideoViewSet,
)

router = DefaultRouter()
router.register("hero-slides", AdminHeroSlideViewSet, basename="admin-hero-slides")
router.register("services", AdminServiceViewSet, basename="admin-services")
router.register("service-entries", AdminServiceEntryViewSet, basename="admin-service-entries")
router.register("faqs", AdminFAQViewSet, basename="admin-faqs")
router.register("testimonials", AdminTestimonialViewSet, basename="admin-testimonials")
router.register("team", AdminTeamViewSet, basename="admin-team")
router.register("portfolio", AdminPortfolioViewSet, basename="admin-portfolio")
router.register("gallery", AdminGalleryViewSet, basename="admin-gallery")
router.register("videos", AdminVideoViewSet, basename="admin-videos")
router.register("blogs", AdminBlogViewSet, basename="admin-blogs")

urlpatterns = [
    path(
        "settings/",
        AdminSiteSettingsView.as_view(
            {"get": "retrieve", "put": "update", "patch": "partial_update"}
        ),
        name="admin-site-settings",
    ),
] + router.urls
