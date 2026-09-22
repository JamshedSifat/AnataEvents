from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    AdminJobPostingViewSet,
    ArtistApplicationAdminViewSet,
    ArtistBookingAdminViewSet,
    ContactMessageAdminViewSet,
    DashboardStatsView,
    JobApplicationAdminViewSet,
    TalentHuntAdminViewSet,
    VendorAdminViewSet,
)

router = DefaultRouter()
router.register("contacts", ContactMessageAdminViewSet, basename="admin-contacts")
router.register("bookings", ArtistBookingAdminViewSet, basename="admin-bookings")
router.register(
    "artist-applications", ArtistApplicationAdminViewSet, basename="admin-artist-applications"
)
router.register(
    "talent-registrations", TalentHuntAdminViewSet, basename="admin-talent-registrations"
)
router.register("vendor-registrations", VendorAdminViewSet, basename="admin-vendor-registrations")
router.register("jobs", AdminJobPostingViewSet, basename="admin-jobs")
router.register("job-applications", JobApplicationAdminViewSet, basename="admin-job-applications")

urlpatterns = [
    path("stats/", DashboardStatsView.as_view(), name="admin-stats"),
] + router.urls
