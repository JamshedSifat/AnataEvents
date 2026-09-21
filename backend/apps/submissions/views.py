"""Public form endpoints (throttled, honeypot, email notification) and the
authenticated review endpoints used by the admin dashboard."""

from __future__ import annotations

from drf_spectacular.utils import extend_schema
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.routers import DefaultRouter

from apps.accounts.models import AdminActionLog
from apps.common.permissions import IsEditorOrReadOnly
from apps.common.throttles import PublicFormThrottle
from apps.common.utils import log_action, notify_admins
from apps.submissions import serializers as s
from apps.submissions.models import (
    ArtistApplication,
    ArtistBookingRequest,
    ContactMessage,
    JobApplication,
    NewsletterSubscriber,
    ReviewStatus,
    TalentHuntRegistration,
    VendorRegistration,
)


class PublicSubmissionView(mixins.CreateModelMixin, viewsets.GenericViewSet):
    """Base for anonymous POST-only form endpoints."""

    permission_classes = [AllowAny]
    throttle_classes = [PublicFormThrottle]
    subject = "New submission"
    email_body_template = "{name} <{email}> {phone}\n\n{extra}"

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        self.notify(instance, request)
        return Response(
            {
                "detail": "Thank you! Your submission has been received — our team will contact you shortly.",
                "id": instance.pk,
            },
            status=status.HTTP_201_CREATED,
        )

    def notify(self, instance, request) -> None:
        extra = self.extra_lines(instance)
        notify_admins(
            self.subject,
            self.email_body_template.format(
                name=instance.full_name,
                email=instance.email,
                phone=instance.phone,
                extra=extra,
            ),
            reply_to=instance.email,
        )

    def extra_lines(self, instance) -> str:
        return ""


@extend_schema(tags=["forms"], summary="Contact / consultation enquiry")
class ContactMessageCreateView(PublicSubmissionView):
    serializer_class = s.ContactMessageWriteSerializer
    queryset = ContactMessage.objects.all()
    subject = "New contact enquiry"

    def extra_lines(self, instance) -> str:
        return (
            f"Subject: {instance.subject or '-'}\n"
            f"Event type: {instance.event_type or '-'}\n"
            f"Event date: {instance.event_date or '-'}\n"
            f"Budget: {instance.budget or '-'}\n\n{instance.message}"
        )


@extend_schema(tags=["forms"], summary="Book an artist")
class ArtistBookingCreateView(PublicSubmissionView):
    serializer_class = s.ArtistBookingRequestWriteSerializer
    queryset = ArtistBookingRequest.objects.all()
    subject = "New artist booking request"

    def extra_lines(self, instance) -> str:
        artist = instance.artist.name if instance.artist_id else instance.artist_name
        return (
            f"Artist: {artist or '-'} ({instance.artist_category or '-'})\n"
            f"Event: {instance.event_type or '-'} on {instance.event_date or '-'}\n"
            f"Venue: {instance.venue or '-'}\nBudget: {instance.budget or '-'}\n\n"
            f"{instance.message}"
        )


@extend_schema(tags=["forms"], summary="Artist registration")
class ArtistApplicationCreateView(PublicSubmissionView):
    serializer_class = s.ArtistApplicationWriteSerializer
    queryset = ArtistApplication.objects.all()
    subject = "New artist registration"

    def extra_lines(self, instance) -> str:
        return (
            f"Stage name: {instance.stage_name or '-'}\n"
            f"Category: {instance.category}\n"
            f"City: {instance.city or '-'}\n"
            f"Experience: {instance.experience_years or '-'} years\n"
            f"Portfolio: {instance.portfolio_url or '-'}\n"
            f"Video: {instance.video_url or '-'}\n\n{instance.bio}"
        )


@extend_schema(tags=["forms"], summary="Talent hunt registration")
class TalentHuntCreateView(PublicSubmissionView):
    serializer_class = s.TalentHuntRegistrationWriteSerializer
    queryset = TalentHuntRegistration.objects.all()
    subject = "New talent hunt registration"

    def extra_lines(self, instance) -> str:
        return (
            f"Category: {instance.category}\n"
            f"City: {instance.city or '-'} · Age: {instance.age or '-'}\n"
            f"Experience: {instance.experience or '-'}\n"
            f"Video: {instance.video_url or '-'}\n\n{instance.bio}"
        )


@extend_schema(tags=["forms"], summary="Vendor registration")
class VendorRegistrationCreateView(PublicSubmissionView):
    serializer_class = s.VendorRegistrationWriteSerializer
    queryset = VendorRegistration.objects.all()
    subject = "New vendor registration"

    def extra_lines(self, instance) -> str:
        return (
            f"Company: {instance.company_name or '-'}\n"
            f"Category: {instance.vendor_category}\n"
            f"Address: {instance.address or '-'}\n"
            f"Website: {instance.website or '-'}\n"
            f"Services: {', '.join(instance.services or []) or '-'}\n\n{instance.description}"
        )


@extend_schema(tags=["forms"], summary="Job application (CV upload)")
class JobApplicationCreateView(PublicSubmissionView):
    serializer_class = s.JobApplicationWriteSerializer
    queryset = JobApplication.objects.all()
    subject = "New job application"

    def extra_lines(self, instance) -> str:
        position = instance.position or (instance.job.title if instance.job_id else "-")
        return (
            f"Position: {position}\n"
            f"LinkedIn: {instance.linkedin or '-'}\n"
            f"Portfolio: {instance.portfolio_url or '-'}\n\n{instance.cover_letter}"
        )


@extend_schema(tags=["forms"], summary="Newsletter signup")
class NewsletterSubscribeView(PublicSubmissionView):
    serializer_class = s.NewsletterSubscribeSerializer
    queryset = NewsletterSubscriber.objects.all()
    subject = "New newsletter subscriber"

    def notify(self, instance, request) -> None:  # no e-mail ping for a newsletter
        return None

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "You are subscribed. Thank you!"}, status=201)


public_router = DefaultRouter()
public_router.register("contact", ContactMessageCreateView, basename="contact")
public_router.register("artist-bookings", ArtistBookingCreateView, basename="artist-bookings")
public_router.register(
    "artist-applications", ArtistApplicationCreateView, basename="artist-applications"
)
public_router.register("talent-hunt-registrations", TalentHuntCreateView, basename="talent-hunt")
public_router.register(
    "vendor-registrations", VendorRegistrationCreateView, basename="vendor-registrations"
)
public_router.register("job-applications", JobApplicationCreateView, basename="job-applications")
public_router.register("newsletter", NewsletterSubscribeView, basename="newsletter")


# --------------------------------------------------------------------------- #
# Admin review endpoints
# --------------------------------------------------------------------------- #
class AdminSubmissionViewSet(viewsets.ModelViewSet):
    """Shared review workflow: approve / reject / notes, search, filter, export."""

    permission_classes = [IsEditorOrReadOnly]
    http_method_names = ["get", "patch", "put", "post", "delete", "head", "options"]
    model_label = "submission"

    def perform_destroy(self, instance):
        log_action(
            user=self.request.user,
            action=AdminActionLog.Action.DELETE,
            instance=instance,
            request=self.request,
        )
        instance.delete()

    def _review(self, request, decision: str):
        instance = self.get_object()
        serializer = s.ReviewActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance.mark_reviewed(
            decision,
            user=request.user,
            notes=serializer.validated_data.get("notes", ""),
        )
        log_action(
            user=request.user,
            action=AdminActionLog.Action.UPDATE,
            instance=instance,
            detail=f"{decision}",
            request=request,
        )
        return Response(self.get_serializer(instance).data)

    @extend_schema(tags=["admin"], summary="Approve a submission")
    @action(detail=True, methods=["post"])
    def approve(self, request, **kwargs):
        return self._review(request, ReviewStatus.APPROVED)

    @extend_schema(tags=["admin"], summary="Reject a submission")
    @action(detail=True, methods=["post"])
    def reject(self, request, **kwargs):
        return self._review(request, ReviewStatus.REJECTED)

    @extend_schema(tags=["admin"], summary="Add internal notes / change status")
    @action(detail=True, methods=["post"])
    def review(self, request, **kwargs):
        status_value = request.data.get("status") or ReviewStatus.PENDING
        if status_value not in ReviewStatus.values:
            return Response({"detail": "Invalid status."}, status=400)
        return self._review(request, status_value)

    @extend_schema(tags=["admin"], summary="Delete many submissions")
    @action(detail=False, methods=["post"], url_path="bulk-delete")
    def bulk_delete(self, request, **kwargs):
        ids = request.data.get("ids") or []
        queryset = self.get_queryset().filter(pk__in=ids)
        count = queryset.count()
        log_action(
            user=request.user,
            action=AdminActionLog.Action.BULK_DELETE,
            model_name=self.queryset.model.__name__,
            detail=f"{count} row(s)",
            request=request,
        )
        queryset.delete()
        return Response({"detail": f"Deleted {count} item(s).", "deleted": count})


@extend_schema(tags=["admin"])
class AdminContactMessageViewSet(AdminSubmissionViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = s.AdminContactMessageSerializer
    search_fields = ["full_name", "email", "phone", "subject", "message"]
    filterset_fields = ["status", "is_read", "event_type"]
    ordering_fields = ["created_at", "status"]

    @action(detail=True, methods=["post"], url_path="mark-read")
    def mark_read(self, request, **kwargs):
        instance = self.get_object()
        instance.is_read = True
        instance.save(update_fields=["is_read"])
        return Response(self.get_serializer(instance).data)


@extend_schema(tags=["admin"])
class AdminArtistBookingViewSet(AdminSubmissionViewSet):
    queryset = ArtistBookingRequest.objects.select_related("artist")
    serializer_class = s.AdminArtistBookingSerializer
    search_fields = ["full_name", "email", "artist_name", "venue", "event_type"]
    filterset_fields = ["status", "artist", "artist_category"]
    ordering_fields = ["created_at", "event_date", "status"]


@extend_schema(tags=["admin"])
class AdminArtistApplicationViewSet(AdminSubmissionViewSet):
    queryset = ArtistApplication.objects.all()
    serializer_class = s.AdminArtistApplicationSerializer
    search_fields = ["full_name", "stage_name", "email", "city", "category"]
    filterset_fields = ["status", "category"]
    ordering_fields = ["created_at", "status"]


@extend_schema(tags=["admin"])
class AdminTalentHuntViewSet(AdminSubmissionViewSet):
    queryset = TalentHuntRegistration.objects.all()
    serializer_class = s.AdminTalentHuntSerializer
    search_fields = ["full_name", "email", "city", "category"]
    filterset_fields = ["status", "category", "city"]
    ordering_fields = ["created_at", "status"]


@extend_schema(tags=["admin"])
class AdminVendorViewSet(AdminSubmissionViewSet):
    queryset = VendorRegistration.objects.all()
    serializer_class = s.AdminVendorSerializer
    search_fields = ["company_name", "full_name", "email", "vendor_category", "address"]
    filterset_fields = ["status", "vendor_category", "is_preferred"]
    ordering_fields = ["created_at", "status"]


@extend_schema(tags=["admin"])
class AdminJobApplicationViewSet(AdminSubmissionViewSet):
    queryset = JobApplication.objects.select_related("job")
    serializer_class = s.AdminJobApplicationSerializer
    search_fields = ["full_name", "email", "position", "job__title"]
    filterset_fields = ["status", "job"]
    ordering_fields = ["created_at", "status"]


@extend_schema(tags=["admin"])
class AdminNewsletterViewSet(viewsets.ModelViewSet):
    queryset = NewsletterSubscriber.objects.all()
    permission_classes = [IsEditorOrReadOnly]
    serializer_class = s.NewsletterSubscribeSerializer
    search_fields = ["email"]
    filterset_fields = ["is_active"]
    ordering_fields = ["created_at"]


admin_router = DefaultRouter()
admin_router.register("messages", AdminContactMessageViewSet, basename="admin-messages")
admin_router.register("bookings", AdminArtistBookingViewSet, basename="admin-bookings")
admin_router.register("applications", AdminArtistApplicationViewSet, basename="admin-applications")
admin_router.register("talent-hunt", AdminTalentHuntViewSet, basename="admin-talent-hunt")
admin_router.register("vendors", AdminVendorViewSet, basename="admin-vendors")
admin_router.register(
    "job-applications", AdminJobApplicationViewSet, basename="admin-job-applications"
)
admin_router.register("newsletter", AdminNewsletterViewSet, basename="admin-newsletter")
