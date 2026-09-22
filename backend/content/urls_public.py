from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    PublicBlogViewSet,
    PublicFAQViewSet,
    PublicGalleryViewSet,
    PublicHeroSlideViewSet,
    PublicPortfolioViewSet,
    PublicServiceEntryViewSet,
    PublicServiceViewSet,
    PublicTeamViewSet,
    PublicTestimonialViewSet,
    PublicVideoViewSet,
    SiteSettingsView,
)

router = DefaultRouter()
router.register("hero-slides", PublicHeroSlideViewSet, basename="hero-slides")
router.register("services", PublicServiceViewSet, basename="services")
router.register("service-entries", PublicServiceEntryViewSet, basename="service-entries")
router.register("faqs", PublicFAQViewSet, basename="faqs")
router.register("testimonials", PublicTestimonialViewSet, basename="testimonials")
router.register("team", PublicTeamViewSet, basename="team")
router.register("portfolio", PublicPortfolioViewSet, basename="portfolio")
router.register("gallery", PublicGalleryViewSet, basename="gallery")
router.register("videos", PublicVideoViewSet, basename="videos")
router.register("blogs", PublicBlogViewSet, basename="blogs")

urlpatterns = [
    path("settings/", SiteSettingsView.as_view(), name="site-settings"),
] + router.urls
