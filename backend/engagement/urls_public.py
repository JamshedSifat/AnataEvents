from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    ArtistApplicationView,
    ArtistBookingRequestView,
    ContactMessageView,
    JobApplicationView,
    PublicJobPostingListView,
    TalentHuntRegistrationView,
    VendorRegistrationView,
)

router = DefaultRouter()

urlpatterns = [
    path("contact/", ContactMessageView.as_view(), name="contact"),
    path("bookings/", ArtistBookingRequestView.as_view(), name="bookings"),
    path("registrations/artist/", ArtistApplicationView.as_view(), name="register-artist"),
    path(
        "registrations/talent-hunt/", TalentHuntRegistrationView.as_view(), name="register-talent"
    ),
    path("registrations/vendor/", VendorRegistrationView.as_view(), name="register-vendor"),
    path("jobs/", PublicJobPostingListView.as_view(), name="jobs"),
    path("job-applications/", JobApplicationView.as_view(), name="job-applications"),
] + router.urls
