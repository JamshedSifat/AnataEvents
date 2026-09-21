"""Authorization matrix for every /api/admin/* endpoint.

Anonymous → 401, viewer → read 200 / write 403, editor → write allowed,
super-admin-only endpoints (users, action logs) → 403 for everybody else.
"""

from __future__ import annotations

import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient

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
    PortfolioItem,
    Service,
    ServiceEntry,
    ServiceEntryImage,
    TeamMember,
    Video,
)
from apps.content.models import Testimonial as TestimonialModel
from apps.submissions.models import (
    ArtistApplication,
    ArtistBookingRequest,
    ContactMessage,
    JobApplication,
    NewsletterSubscriber,
    TalentHuntRegistration,
    VendorRegistration,
)

pytestmark = pytest.mark.django_db


@pytest.fixture
def resource_instances(db):
    """One instance per admin resource so write-permission tests have a target."""
    service = Service.objects.create(name="Corporate", slug="corporate")
    job = JobPosting.objects.create(title="Event Executive", slug="event-executive")
    entry = ServiceEntry.objects.create(service=service, title="Entry", slug="entry")
    return {
        "blocks": ContentBlock.objects.create(title="Block", section="why_choose_us"),
        "hero-slides": HeroSlide.objects.create(subtitle="Hero"),
        "services": service,
        "service-entries": entry,
        "service-entry-images": ServiceEntryImage.objects.create(entry=entry),
        "artists": Artist.objects.create(name="Singer", category="singer"),
        "influencers": InfluencerProfile.objects.create(name="Influencer"),
        "portfolio": PortfolioItem.objects.create(title="Wedding", slug="wedding"),
        "gallery": GalleryImage.objects.create(title="Photo", image_url="https://x.test/a.jpg"),
        "videos": Video.objects.create(title="Live", youtube_url="https://youtu.be/dQw4w9WgXcQ"),
        "blogs": BlogPost.objects.create(title="Post", slug="post", content="<p>x</p>"),
        "testimonials": TestimonialModel.objects.create(name="Client", review="Nice"),
        "team": TeamMember.objects.create(name="Member", role="Planner"),
        "faqs": FAQ.objects.create(question="Q?", answer="A", section="general"),
        "jobs": job,
        "events": Event.objects.create(title="Gala", slug="gala", start_date="2026-12-01"),
        "messages": ContactMessage.objects.create(
            full_name="Visitor", email="v@x.com", phone="01712345678", message="hello there"
        ),
        "bookings": ArtistBookingRequest.objects.create(
            full_name="Client", email="c@x.com", phone="01712345678"
        ),
        "applications": ArtistApplication.objects.create(
            full_name="Artist", email="a@x.com", phone="01712345678", category="singer"
        ),
        "talent-hunt": TalentHuntRegistration.objects.create(
            full_name="Talent", email="t@x.com", phone="01712345678", category="dance"
        ),
        "vendors": VendorRegistration.objects.create(
            full_name="Vendor", email="v2@x.com", phone="01712345678", vendor_category="catering"
        ),
        "job-applications": JobApplication.objects.create(
            full_name="Applicant", email="ja@x.com", phone="01712345678", job=job, cv="cv/x.pdf"
        ),
        "newsletter": NewsletterSubscriber.objects.create(email="sub@x.com"),
    }


RESOURCES = [
    "blocks",
    "hero-slides",
    "services",
    "service-entries",
    "service-entry-images",
    "artists",
    "influencers",
    "portfolio",
    "gallery",
    "videos",
    "blogs",
    "testimonials",
    "team",
    "faqs",
    "jobs",
    "events",
    "messages",
    "bookings",
    "applications",
    "talent-hunt",
    "vendors",
    "job-applications",
    "newsletter",
]

WRITE_PAYLOADS = {
    "blocks": {"title": "New block", "section": "client"},
    "hero-slides": {"subtitle": "New hero"},
    "services": {"name": "New service"},
    "service-entries": {"title": "New entry", "service": 1},
    "service-entry-images": {"caption": "New image", "entry": 1},
    "artists": {"name": "New artist", "category": "dj"},
    "influencers": {"name": "New influencer"},
    "portfolio": {"title": "New project"},
    "gallery": {"title": "New photo", "image_url": "https://x.test/b.jpg"},
    "videos": {"title": "New video", "youtube_url": "https://youtu.be/dQw4w9WgXcQ"},
    "blogs": {"title": "New post", "content": "<p>body</p>"},
    "testimonials": {"name": "New client", "review": "Great"},
    "team": {"name": "New member", "role": "Planner"},
    "faqs": {"question": "New?", "answer": "Answer"},
    "jobs": {"title": "New job"},
    "events": {"title": "New event", "start_date": "2026-11-01"},
    "messages": {
        "full_name": "New Person",
        "email": "new@x.com",
        "phone": "01712345678",
        "message": "A brand new enquiry.",
    },
    "bookings": {
        "full_name": "New Client",
        "email": "c2@x.com",
        "phone": "01812345678",
        "artist_name": "Habib Wahid",
        "event_type": "Concert",
    },
    "applications": {
        "full_name": "New Artist",
        "email": "a2@x.com",
        "phone": "01912345678",
        "category": "singer",
    },
    "talent-hunt": {
        "full_name": "New Talent",
        "email": "t2@x.com",
        "phone": "01612345678",
        "category": "Dance",
    },
    "vendors": {
        "full_name": "New Vendor",
        "email": "v3@x.com",
        "phone": "01512345678",
        "vendor_category": "Catering",
    },
    "job-applications": {
        "full_name": "New Applicant",
        "email": "ja2@x.com",
        "phone": "01712345678",
    },
    "newsletter": {"email": "new-subscriber@x.com"},
}


@pytest.mark.parametrize("resource", RESOURCES)
def test_anonymous_gets_401(resource, resource_instances):
    client = APIClient()
    assert client.get(f"/api/admin/{resource}/").status_code == 401
    assert client.post(f"/api/admin/{resource}/", {}, format="json").status_code == 401


@pytest.mark.parametrize("resource", RESOURCES)
def test_viewer_can_read_but_not_write(resource, resource_instances, as_viewer):
    assert as_viewer.get(f"/api/admin/{resource}/").status_code == 200
    response = as_viewer.post(f"/api/admin/{resource}/", WRITE_PAYLOADS[resource], format="json")
    assert response.status_code == 403
    assert "read-only" in str(response.data).lower()


@pytest.mark.parametrize("resource", RESOURCES)
def test_editor_can_write(resource, resource_instances, as_editor):
    payload = dict(WRITE_PAYLOADS[resource])
    if payload.get("service") == 1:
        payload["service"] = resource_instances["services"].pk
    if payload.get("entry") == 1:
        payload["entry"] = resource_instances["service-entries"].pk
    if resource == "job-applications":
        payload["cv"] = SimpleUploadedFile(
            "cv.pdf", b"%PDF-1.4\n%%EOF", content_type="application/pdf"
        )
        response = as_editor.post(f"/api/admin/{resource}/", payload, format="multipart")
    else:
        response = as_editor.post(f"/api/admin/{resource}/", payload, format="json")
    assert response.status_code == 201, response.data


@pytest.mark.parametrize("resource", RESOURCES)
def test_editor_can_read_detail(resource, resource_instances, as_editor):
    instance = resource_instances[resource]
    slug_lookups = {"services", "artists", "portfolio", "blogs", "jobs", "events"}
    key = instance.slug if resource in slug_lookups else instance.pk
    response = as_editor.get(f"/api/admin/{resource}/{key}/")
    assert response.status_code == 200


@pytest.mark.parametrize("resource", RESOURCES)
def test_inactive_user_is_rejected(resource, resource_instances, inactive_user):
    client = APIClient()
    client.force_authenticate(user=inactive_user)
    assert client.get(f"/api/admin/{resource}/").status_code in (401, 403)


@pytest.mark.parametrize("resource", RESOURCES)
def test_garbage_token_is_rejected(resource, resource_instances):
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION="Bearer 12345.abcdef.ghijk")
    assert client.get(f"/api/admin/{resource}/").status_code == 401


class TestSuperAdminOnlyEndpoints:
    USERS_URL = "/api/admin/users/"

    def test_anonymous_gets_401(self, api):
        assert api.get(self.USERS_URL).status_code == 401

    def test_viewer_and_editor_get_403(self, as_viewer, as_editor):
        assert as_viewer.get(self.USERS_URL).status_code == 403
        assert as_editor.get(self.USERS_URL).status_code == 403

    def test_super_admin_can_list(self, as_super, super_admin):
        response = as_super.get(self.USERS_URL)
        assert response.status_code == 200
        assert any(row["email"] == super_admin.email for row in response.data["results"])

    def test_action_log_is_super_admin_only(self, as_viewer, as_super):
        assert as_viewer.get("/api/admin/action-logs/").status_code == 403
        assert as_super.get("/api/admin/action-logs/").status_code == 200


class TestSubmissionReviewPermissions:
    def test_viewer_cannot_approve(self, resource_instances, as_viewer):
        message = resource_instances["messages"]
        response = as_viewer.post(f"/api/admin/messages/{message.pk}/approve/", {}, format="json")
        assert response.status_code == 403

    def test_editor_can_approve(self, resource_instances, as_editor):
        message = resource_instances["messages"]
        response = as_editor.post(
            f"/api/admin/messages/{message.pk}/approve/", {"notes": "ok"}, format="json"
        )
        assert response.status_code == 200
        message.refresh_from_db()
        assert message.status == "approved"
        assert message.reviewed_by is not None
