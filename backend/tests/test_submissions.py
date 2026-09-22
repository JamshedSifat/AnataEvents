"""Public submission endpoints: validation, honeypot, workflows."""

import pytest

pytestmark = pytest.mark.django_db

VALID_CONTACT = {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "01712345678",
    "event_type": "Wedding",
    "message": "We would love help planning our December wedding event!",
}


class TestContact:
    def test_create(self, api):
        resp = api.post("/api/contact/", VALID_CONTACT, format="json")
        assert resp.status_code == 201
        from engagement.models import ContactMessage

        msg = ContactMessage.objects.get(email="jane@example.com")
        assert msg.status == "new"

    def test_honeypot_rejected(self, api):
        payload = {**VALID_CONTACT, "website": "http://spam.example"}
        resp = api.post("/api/contact/", payload, format="json")
        assert resp.status_code == 400

    def test_short_message_rejected(self, api):
        resp = api.post("/api/contact/", {**VALID_CONTACT, "message": "hi"}, format="json")
        assert resp.status_code == 400

    def test_bad_phone_rejected(self, api):
        resp = api.post("/api/contact/", {**VALID_CONTACT, "phone": "123"}, format="json")
        assert resp.status_code == 400

    def test_anonymous_only(self, api):
        """Endpoint works without any auth header."""
        resp = api.post("/api/contact/", VALID_CONTACT, format="json")
        assert resp.status_code == 201


class TestArtistBooking:
    def test_create_with_artist_ref(self, api, artist):
        resp = api.post(
            "/api/bookings/",
            {
                "artist": artist.pk,
                "name": "Client Co",
                "email": "client@x.com",
                "phone": "01812345678",
                "event_type": "Concert",
            },
            format="json",
        )
        assert resp.status_code == 201
        from engagement.models import ArtistBookingRequest

        req = ArtistBookingRequest.objects.get(email="client@x.com")
        assert req.artist == artist
        assert req.artist_name == "Habib Wahid"
        assert req.status == "pending"


class TestRegistrations:
    def test_artist_registration(self, api):
        resp = api.post(
            "/api/registrations/artist/",
            {
                "artist_name": "New Talent",
                "email": "talent@x.com",
                "phone": "01912345678",
                "art_form": "Singing",
            },
            format="json",
        )
        assert resp.status_code == 201

    def test_talent_hunt_registration(self, api):
        resp = api.post(
            "/api/registrations/talent-hunt/",
            {
                "full_name": "Hopeful",
                "email": "hope@x.com",
                "phone": "01612345678",
                "talent_category": "Dancing",
            },
            format="json",
        )
        assert resp.status_code == 201

    def test_vendor_registration(self, api):
        resp = api.post(
            "/api/registrations/vendor/",
            {
                "business_name": "Decor BD",
                "owner_name": "Owner",
                "email": "decor@x.com",
                "phone": "01512345678",
                "service_category": "Decoration",
            },
            format="json",
        )
        assert resp.status_code == 201

    def test_job_application_valid_job(self, api, job):
        resp = api.post(
            "/api/job-applications/",
            {
                "job": job.pk,
                "full_name": "Applicant",
                "email": "apply@x.com",
                "phone": "01711223344",
            },
            format="json",
        )
        assert resp.status_code == 201

    def test_job_application_closed_job_rejected(self, api, job):
        job.status = "closed"
        job.save()
        resp = api.post(
            "/api/job-applications/",
            {
                "job": job.pk,
                "full_name": "Applicant",
                "email": "apply@x.com",
                "phone": "01711223344",
            },
            format="json",
        )
        assert resp.status_code == 400


class TestSubmissionStatusWorkflow:
    def test_admin_updates_status(self, super_api, contact_message):
        resp = super_api.post(
            f"/api/admin/contacts/{contact_message.pk}/status/",
            {"status": "replied"},
            format="json",
        )
        assert resp.status_code == 200
        contact_message.refresh_from_db()
        assert contact_message.status == "replied"

    def test_admin_invalid_status_rejected(self, super_api, contact_message):
        resp = super_api.post(
            f"/api/admin/contacts/{contact_message.pk}/status/",
            {"status": "bogus"},
            format="json",
        )
        assert resp.status_code == 400

    def test_public_cannot_read_submissions(self, api):
        assert api.get("/api/admin/contacts/").status_code == 401
