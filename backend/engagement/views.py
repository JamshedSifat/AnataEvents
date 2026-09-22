"""Public submission endpoints + admin CRUD with status workflows."""

from django.db.models import Count
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.audit import ACTION_CREATE, ACTION_UPDATE, client_ip, log_action
from core.email import notify_admin
from core.throttling import SubmissionThrottle
from core.views import AdminCrudViewSet

from .models import (
    ArtistApplication,
    ArtistBookingRequest,
    ContactMessage,
    JobApplication,
    JobPosting,
    TalentHuntRegistration,
    VendorRegistration,
)
from .serializers import (
    ArtistApplicationAdminSerializer,
    ArtistApplicationSerializer,
    ArtistBookingRequestAdminSerializer,
    ArtistBookingRequestSerializer,
    ContactMessageAdminSerializer,
    ContactMessageSerializer,
    JobApplicationAdminSerializer,
    JobApplicationSerializer,
    JobPostingSerializer,
    JobPostingWriteSerializer,
    TalentHuntRegistrationAdminSerializer,
    TalentHuntRegistrationSerializer,
    VendorRegistrationAdminSerializer,
    VendorRegistrationSerializer,
)


def _client_meta(request, model):
    """IP/UA metadata for whichever fields the model actually has."""
    meta = {"ip_address": client_ip(request) or None}
    fields = {f.name for f in model._meta.fields}
    if "user_agent" in fields:
        meta["user_agent"] = (request.META.get("HTTP_USER_AGENT") or "")[:300]
    return meta


class BaseSubmissionView(APIView):
    """Public POST endpoint: throttled, honeypotted, email-notified."""

    permission_classes = [AllowAny]
    throttle_classes = [SubmissionThrottle]
    serializer_class = None
    subject_prefix = "New submission"

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        # Honeypot: validated but never persisted.
        serializer.validated_data.pop("website", None)
        instance = serializer.save(**_client_meta(request, self.serializer_class.Meta.model))
        log_action(request, ACTION_CREATE, instance, model_name=instance.__class__.__name__)
        self.notify(instance)
        return Response(
            {
                "detail": "Thank you! Your submission has been received — our team will contact you soon.",
                "id": instance.id,
            },
            status=status.HTTP_201_CREATED,
        )

    def notify(self, instance):
        summary = "\n".join(
            f"{f.verbose_name.title()}: {getattr(instance, f.name)}"
            for f in instance._meta.fields
            if f.name not in {"id", "ip_address", "user_agent"}
            and getattr(instance, f.name) not in (None, "")
        )
        notify_admin(
            f"[Ananta Events] {self.subject_prefix} — {str(instance)[:80]}",
            summary,
            reply_to=getattr(instance, "email", None),
        )


class ContactMessageView(BaseSubmissionView):
    serializer_class = ContactMessageSerializer
    subject_prefix = "Contact message"


class ArtistBookingRequestView(BaseSubmissionView):
    serializer_class = ArtistBookingRequestSerializer
    subject_prefix = "Artist booking request"

    def post(self, request):
        # Resolve artist reference by id when provided (book-an-artist pages).
        data = dict(request.data)
        artist_id = data.get("artist") or data.get("artistId")
        if artist_id:
            from artists.models import Artist

            artist = Artist.objects.filter(pk=artist_id, is_published=True).first()
            if artist:
                data["artist"] = artist.pk
                data["artistName"] = artist.name
                data["artistCategory"] = artist.category
            else:
                data.pop("artist", None)
        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.validated_data.pop("website", None)
        # artist_name/category are read-only fields; inject after validation.
        if artist is not None:
            serializer.validated_data["artist_name"] = artist.name
            serializer.validated_data["artist_category"] = artist.category
        instance = serializer.save(**_client_meta(request, self.serializer_class.Meta.model))
        log_action(request, ACTION_CREATE, instance, model_name=instance.__class__.__name__)
        self.notify(instance)
        return Response(
            {
                "detail": "Booking request received! Our team will confirm availability shortly.",
                "id": instance.id,
            },
            status=status.HTTP_201_CREATED,
        )


class ArtistApplicationView(BaseSubmissionView):
    serializer_class = ArtistApplicationSerializer
    subject_prefix = "Artist registration"


class TalentHuntRegistrationView(BaseSubmissionView):
    serializer_class = TalentHuntRegistrationSerializer
    subject_prefix = "Talent hunt registration"


class VendorRegistrationView(BaseSubmissionView):
    serializer_class = VendorRegistrationSerializer
    subject_prefix = "Vendor registration"


class PublicJobPostingListView(ListAPIView):
    """Public job board (active postings only)."""

    serializer_class = JobPostingSerializer
    permission_classes = [AllowAny]
    filterset_fields = ["department"]
    search_fields = ["title", "department", "description"]
    ordering = ["-posted_at"]

    def get_queryset(self):
        return JobPosting.objects.filter(is_published=True, status=JobPosting.Status.ACTIVE)


class JobApplicationView(BaseSubmissionView):
    serializer_class = JobApplicationSerializer
    subject_prefix = "Job application"

    def post(self, request):
        data = dict(request.data)
        if "job" not in data and request.data.get("jobSlug"):
            from django.shortcuts import get_object_or_404

            job = get_object_or_404(
                JobPosting,
                slug=request.data["jobSlug"],
                is_published=True,
                status=JobPosting.Status.ACTIVE,
            )
            data["job"] = job.pk
        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save(**_client_meta(request, self.serializer_class.Meta.model))
        log_action(request, ACTION_CREATE, instance, model_name=instance.__class__.__name__)
        self.notify(instance)
        return Response(
            {
                "detail": "Application received! If your profile matches, we will reach out.",
                "id": instance.id,
            },
            status=status.HTTP_201_CREATED,
        )


# ------------------------------------------------------------------ admin --
class _SubmissionAdminViewSet(AdminCrudViewSet):
    """Admin viewset for submission queues: edit-status + bulk delete.

    POST on the collection stays 405 — the public creates submissions; staff
    only review them (status endpoint) or delete.
    """

    http_method_names = ["get", "post", "patch", "delete", "head", "options"]

    def create(self, request, *args, **kwargs):
        return Response(
            {"detail": "Submissions are created via the public endpoints."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    @action(detail=True, methods=["post"], url_path="status")
    def set_status(self, request, pk=None):
        obj = self.get_object()
        new_status = (request.data or {}).get("status", "")
        valid = {c for c, _ in obj.__class__._meta.get_field("status").choices}
        if new_status not in valid:
            return Response(
                {"status": f"Must be one of: {', '.join(sorted(valid))}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        old = obj.status
        obj.status = new_status
        obj.save(update_fields=["status"])
        log_action(request, ACTION_UPDATE, obj, changes={"status": {"old": old, "new": new_status}})
        return Response(self.get_serializer(obj).data)


class ContactMessageAdminViewSet(_SubmissionAdminViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageAdminSerializer
    search_fields = ["name", "email", "message"]
    filterset_fields = ["status"]
    ordering_fields = ["created_at"]


class ArtistBookingAdminViewSet(_SubmissionAdminViewSet):
    queryset = ArtistBookingRequest.objects.select_related("artist")
    serializer_class = ArtistBookingRequestAdminSerializer
    search_fields = ["name", "email", "artist_name"]
    filterset_fields = ["status", "artist_category"]
    ordering_fields = ["created_at"]


class ArtistApplicationAdminViewSet(_SubmissionAdminViewSet):
    queryset = ArtistApplication.objects.all()
    serializer_class = ArtistApplicationAdminSerializer
    search_fields = ["artist_name", "email", "art_form"]
    filterset_fields = ["status", "art_form"]
    ordering_fields = ["created_at"]


class TalentHuntAdminViewSet(_SubmissionAdminViewSet):
    queryset = TalentHuntRegistration.objects.all()
    serializer_class = TalentHuntRegistrationAdminSerializer
    search_fields = ["full_name", "email", "talent_category"]
    filterset_fields = ["status", "talent_category"]
    ordering_fields = ["created_at"]


class VendorAdminViewSet(_SubmissionAdminViewSet):
    queryset = VendorRegistration.objects.all()
    serializer_class = VendorRegistrationAdminSerializer
    search_fields = ["business_name", "owner_name", "email"]
    filterset_fields = ["status", "service_category"]
    ordering_fields = ["created_at"]


class AdminJobPostingViewSet(AdminCrudViewSet):
    queryset = JobPosting.objects.all()
    filterset_fields = ["status", "department"]
    search_fields = ["title", "department", "description"]
    audit_fields = ("title", "department", "salary", "status", "is_published")

    def get_serializer_class(self):
        if self.action in {"create", "update", "partial_update"}:
            return JobPostingWriteSerializer
        return JobPostingSerializer


class JobApplicationAdminViewSet(_SubmissionAdminViewSet):
    queryset = JobApplication.objects.select_related("job")
    serializer_class = JobApplicationAdminSerializer
    search_fields = ["full_name", "email", "job__title"]
    filterset_fields = ["status", "job"]
    ordering_fields = ["created_at"]


class DashboardStatsView(APIView):
    """Aggregated counters + recent items for the admin dashboard."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        def count(model, **filters):
            return model.objects.filter(**filters).count()

        stats = {
            "contact_messages": {
                "total": ContactMessage.objects.count(),
                "new": count(ContactMessage, status=ContactMessage.Status.NEW),
            },
            "booking_requests": {
                "total": ArtistBookingRequest.objects.count(),
                "pending": count(ArtistBookingRequest, status=ArtistBookingRequest.Status.PENDING),
            },
            "artist_applications": {
                "total": ArtistApplication.objects.count(),
                "pending": count(ArtistApplication, status=ArtistApplication.Status.PENDING),
            },
            "talent_registrations": {
                "total": TalentHuntRegistration.objects.count(),
                "pending": count(
                    TalentHuntRegistration, status=TalentHuntRegistration.Status.PENDING
                ),
            },
            "vendor_registrations": {
                "total": VendorRegistration.objects.count(),
                "pending": count(VendorRegistration, status=VendorRegistration.Status.PENDING),
            },
            "job_applications": {
                "total": JobApplication.objects.count(),
                "new": count(JobApplication, status=JobApplication.Status.NEW),
            },
            "job_postings": {
                "total": JobPosting.objects.count(),
                "active": count(JobPosting, status=JobPosting.Status.ACTIVE),
            },
            "artists": {
                "total": 0,
                "by_category": {},
            },
            "content": {
                "blogs": 0,
                "portfolio": 0,
                "gallery": 0,
                "videos": 0,
                "testimonials": 0,
                "team": 0,
                "faqs": 0,
                "services": 0,
                "hero_slides": 0,
            },
        }
        from artists.models import Artist, InfluencerProfile
        from content.models import (
            FAQ,
            BlogPost,
            GalleryImage,
            HeroSlide,
            PortfolioItem,
            Service,
            ServiceEntry,
            TeamMember,
            Testimonial,
            Video,
        )

        stats["artists"]["total"] = Artist.objects.count()
        stats["artists"]["by_category"] = {
            row["category"]: row["n"]
            for row in Artist.objects.values("category").annotate(n=Count("id"))
        }
        stats["influencers"] = {"total": InfluencerProfile.objects.count()}
        stats["content"] = {
            "blogs": BlogPost.objects.count(),
            "portfolio": PortfolioItem.objects.count(),
            "gallery": GalleryImage.objects.count(),
            "videos": Video.objects.count(),
            "testimonials": Testimonial.objects.count(),
            "team": TeamMember.objects.count(),
            "faqs": FAQ.objects.count(),
            "services": Service.objects.count(),
            "hero_slides": HeroSlide.objects.count(),
            "corporate_events": ServiceEntry.objects.filter(
                entry_type=ServiceEntry.EntryType.CORPORATE_EVENT
            ).count(),
            "exhibition_stalls": ServiceEntry.objects.filter(
                entry_type=ServiceEntry.EntryType.EXHIBITION_STALL
            ).count(),
        }
        recent = {
            "messages": ContactMessageAdminSerializer(
                ContactMessage.objects.order_by("-created_at")[:5], many=True
            ).data,
            "bookings": ArtistBookingRequestAdminSerializer(
                ArtistBookingRequest.objects.order_by("-created_at")[:5], many=True
            ).data,
            "artist_applications": ArtistApplicationAdminSerializer(
                ArtistApplication.objects.order_by("-created_at")[:5], many=True
            ).data,
        }
        return Response({"stats": stats, "recent": recent})
