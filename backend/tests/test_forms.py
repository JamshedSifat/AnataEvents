"""Public form endpoints: validation, persistence, honeypot, email, uploads."""

from __future__ import annotations

import io

import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image

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


def pdf_bytes() -> bytes:
    return b"%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer<<>>\n%%EOF"


def png_bytes() -> bytes:
    buffer = io.BytesIO()
    Image.new("RGB", (8, 8), (10, 120, 240)).save(buffer, format="PNG")
    return buffer.getvalue()


CONTACT = {
    "full_name": "Rahim Uddin",
    "email": "rahim@example.com",
    "phone": "01712345678",
    "subject": "Corporate event",
    "message": "We need a conference for 300 guests in Dhaka.",
}


class TestContactForm:
    def test_creates_message_and_emails_admins(self, api, mailoutbox):
        response = api.post("/api/contact/", CONTACT, format="json")
        assert response.status_code == 201
        message = ContactMessage.objects.get()
        assert message.status == "pending"
        assert message.ip_address
        assert len(mailoutbox) >= 1

    def test_accepts_first_and_last_name(self, api):
        payload = {**CONTACT, "first_name": "Rahim", "last_name": "Uddin"}
        payload.pop("full_name")
        response = api.post("/api/contact/", payload, format="json")
        assert response.status_code == 201
        assert ContactMessage.objects.get().full_name == "Rahim Uddin"

    @pytest.mark.parametrize(
        "override",
        [
            {"phone": "12345"},
            {"email": "not-an-email"},
            {"message": "short"},
            {"full_name": ""},
        ],
    )
    def test_validation_errors(self, api, override):
        response = api.post("/api/contact/", {**CONTACT, **override}, format="json")
        assert response.status_code == 400
        assert response.data["detail"]

    def test_honeypot_blocks_spam(self, api):
        response = api.post(
            "/api/contact/", {**CONTACT, "website": "http://spam.io"}, format="json"
        )
        assert response.status_code == 400
        assert ContactMessage.objects.count() == 0

    def test_get_is_not_allowed(self, api):
        assert api.get("/api/contact/").status_code in (405, 401)


class TestArtistBooking:
    def test_booking_without_artist_record(self, api):
        response = api.post(
            "/api/artist-bookings/",
            {
                "full_name": "Nusrat Jahan",
                "email": "nusrat@example.com",
                "phone": "01812345678",
                "artist_name": "Habib Wahid",
                "event_type": "Concert",
                "venue": "Bashundhara",
                "message": "Please quote for a 2 hour show.",
            },
            format="json",
        )
        assert response.status_code == 201
        assert ArtistBookingRequest.objects.get().artist_name == "Habib Wahid"

    def test_booking_with_artist_fk(self, api, content_fixtures):
        artist = content_fixtures["artist"]
        response = api.post(
            "/api/artist-bookings/",
            {
                "full_name": "Client",
                "email": "client@example.com",
                "phone": "01912345678",
                "artist": artist.pk,
                "event_type": "Wedding",
            },
            format="json",
        )
        assert response.status_code == 201
        assert ArtistBookingRequest.objects.get().artist_id == artist.pk


class TestArtistApplication:
    def test_registration_with_photo_and_cv(self, api):
        response = api.post(
            "/api/artist-applications/",
            {
                "full_name": "New Artist",
                "email": "artist@example.com",
                "phone": "01712345678",
                "category": "singer",
                "city": "Dhaka",
                "experience_years": 4,
                "video_url": "https://youtu.be/dQw4w9WgXcQ",
                "bio": "Pop and folk singer.",
                "photo": SimpleUploadedFile("me.png", png_bytes(), content_type="image/png"),
                "cv": SimpleUploadedFile("cv.pdf", pdf_bytes(), content_type="application/pdf"),
            },
            format="multipart",
        )
        assert response.status_code == 201, response.data
        application = ArtistApplication.objects.get()
        assert application.status == "pending"
        assert application.photo and application.cv

    def test_invalid_category_is_rejected(self, api):
        response = api.post(
            "/api/artist-applications/",
            {
                "full_name": "X",
                "email": "x@example.com",
                "phone": "01712345678",
                "category": "astronaut",
            },
            format="json",
        )
        assert response.status_code == 400
        assert "category" in response.data["errors"]

    def test_invalid_youtube_link_is_rejected(self, api):
        response = api.post(
            "/api/artist-applications/",
            {
                "full_name": "X",
                "email": "x@example.com",
                "phone": "01712345678",
                "category": "singer",
                "video_url": "https://vimeo.com/1",
            },
            format="json",
        )
        assert response.status_code == 400

    def test_wrong_cv_type_is_rejected(self, api):
        response = api.post(
            "/api/artist-applications/",
            {
                "full_name": "X",
                "email": "x@example.com",
                "phone": "01712345678",
                "category": "singer",
                "cv": SimpleUploadedFile(
                    "evil.exe", b"binary", content_type="application/octet-stream"
                ),
            },
            format="multipart",
        )
        assert response.status_code == 400


class TestTalentHunt:
    def test_registration(self, api):
        response = api.post(
            "/api/talent-hunt-registrations/",
            {
                "full_name": "Tania Akter",
                "email": "tania@example.com",
                "phone": "01612345678",
                "category": "Dance",
                "city": "Chattogram",
                "age": 21,
                "video_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            },
            format="json",
        )
        assert response.status_code == 201
        assert TalentHuntRegistration.objects.get().category == "Dance"

    def test_age_bounds(self, api):
        response = api.post(
            "/api/talent-hunt-registrations/",
            {
                "full_name": "Too Old",
                "email": "o@example.com",
                "phone": "01612345678",
                "category": "Dance",
                "age": 130,
            },
            format="json",
        )
        assert response.status_code == 400


class TestVendorRegistration:
    def test_registration_with_services(self, api):
        response = api.post(
            "/api/vendor-registrations/",
            {
                "full_name": "Sourcing Manager",
                "company_name": "Dhaka Lighting Ltd",
                "email": "vendor@example.com",
                "phone": "01712345678",
                "vendor_category": "Lighting",
                "services": ["Stage lighting", "Truss", "Generators"],
                "description": "We supply stage lighting across Bangladesh.",
            },
            format="json",
        )
        assert response.status_code == 201
        vendor = VendorRegistration.objects.get()
        assert len(vendor.services) == 3

    def test_honeypot(self, api):
        response = api.post(
            "/api/vendor-registrations/",
            {
                "full_name": "Bot",
                "email": "bot@example.com",
                "phone": "01712345678",
                "vendor_category": "Lighting",
                "website_hp": "http://spam",
            },
            format="json",
        )
        assert response.status_code == 400


class TestJobApplication:
    def test_application_with_cv(self, api, content_fixtures):
        job = content_fixtures["job"]
        response = api.post(
            "/api/job-applications/",
            {
                "full_name": "Applicant",
                "email": "applicant@example.com",
                "phone": "01512345678",
                "job": job.pk,
                "position": job.title,
                "cover_letter": "I have five years of event experience.",
                "cv": SimpleUploadedFile("cv.pdf", pdf_bytes(), content_type="application/pdf"),
            },
            format="multipart",
        )
        assert response.status_code == 201, response.data
        assert JobApplication.objects.get().job_id == job.pk

    def test_cv_is_required(self, api):
        response = api.post(
            "/api/job-applications/",
            {"full_name": "A", "email": "a@example.com", "phone": "01512345678", "position": "X"},
            format="json",
        )
        assert response.status_code == 400
        assert "cv" in response.data["errors"]


class TestNewsletter:
    def test_subscribe_is_idempotent(self, api):
        first = api.post("/api/newsletter/", {"email": "news@example.com"}, format="json")
        second = api.post("/api/newsletter/", {"email": "news@example.com"}, format="json")
        assert first.status_code == second.status_code == 201
        assert NewsletterSubscriber.objects.count() == 1
