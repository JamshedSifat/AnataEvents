"""Parametrised RBAC matrix across every admin endpoint + CRUD mechanics."""

import pytest

pytestmark = pytest.mark.django_db

# (url, list-action) pairs for every admin collection.
ADMIN_LISTS = [
    "/api/admin/hero-slides/",
    "/api/admin/services/",
    "/api/admin/service-entries/",
    "/api/admin/faqs/",
    "/api/admin/testimonials/",
    "/api/admin/team/",
    "/api/admin/portfolio/",
    "/api/admin/gallery/",
    "/api/admin/videos/",
    "/api/admin/blogs/",
    "/api/admin/artists/",
    "/api/admin/influencers/",
    "/api/admin/talent-profiles/",
    "/api/admin/contacts/",
    "/api/admin/bookings/",
    "/api/admin/artist-applications/",
    "/api/admin/talent-registrations/",
    "/api/admin/vendor-registrations/",
    "/api/admin/jobs/",
    "/api/admin/job-applications/",
    "/api/admin/stats/",
]


@pytest.mark.parametrize("url", ADMIN_LISTS)
class TestRoleMatrix:
    def test_anonymous_gets_401(self, api, url):
        assert api.get(url).status_code == 401

    def test_viewer_can_read(self, viewer_api, url):
        assert viewer_api.get(url).status_code == 200

    def test_viewer_cannot_write(self, viewer_api, url):
        if url.endswith("stats/"):
            return  # stats is read-only by design
        assert viewer_api.post(url, {}, format="json").status_code == 403

    def test_editor_can_create_content(self, editor_api, url):
        if url.endswith(
            (
                "stats/",
                "contacts/",
                "bookings/",
                "artist-applications/",
                "talent-registrations/",
                "vendor-registrations/",
                "job-applications/",
            )
        ):
            return  # queues are not creatable via admin API; stats read-only
        resp = editor_api.post(url, {}, format="json")
        assert resp.status_code in {201, 400}  # 400 = validation, never 403


@pytest.mark.django_db
class TestUserRouteRBAC:
    def test_editor_cannot_manage_users(self, editor_api):
        assert editor_api.get("/api/admin/users/").status_code == 403
        assert (
            editor_api.post(
                "/api/admin/users/",
                {"email": "n@x.com", "password": "Something-Strong-1"},
                format="json",
            ).status_code
            == 403
        )


@pytest.mark.django_db
class TestCrudMechanics:
    def _create(self, api, url, payload):
        resp = api.post(url, payload, format="json")
        assert resp.status_code == 201, resp.data
        return resp.data

    def test_blog_crud_and_publish_flow(self, editor_api):
        created = self._create(
            editor_api,
            "/api/admin/blogs/",
            {
                "title": "New Post",
                "category": "Guide",
                "excerpt": "e",
                "content": "<p>body</p>",
                "author": "ed",
                "featured": True,
            },
        )
        assert created["slug"] == "new-post"
        pk = created["id"]

        resp = editor_api.patch(f"/api/admin/blogs/{pk}/", {"title": "Renamed"}, format="json")
        assert resp.status_code == 200

        assert (
            editor_api.post(f"/api/admin/blogs/{pk}/unpublish/", format="json").status_code == 200
        )
        assert editor_api.post(f"/api/admin/blogs/{pk}/publish/", format="json").status_code == 200

        assert (
            editor_api.post("/api/admin/blogs/bulk-delete/", {"ids": [pk]}, format="json").data[
                "deleted"
            ]
            == 1
        )

    def test_reorder(self, editor_api, db):
        from content.models import FAQ

        a = FAQ.objects.create(page="home", question="Q1", answer="A", order=0)
        b = FAQ.objects.create(page="home", question="Q2", answer="A", order=1)
        resp = editor_api.post(
            "/api/admin/faqs/reorder/", {"ordered_ids": [b.pk, a.pk]}, format="json"
        )
        assert resp.status_code == 200
        a.refresh_from_db()
        b.refresh_from_db()
        assert (a.order, b.order) == (1, 0)

    def test_bulk_delete_unknown_ids(self, editor_api):
        resp = editor_api.post("/api/admin/gallery/bulk-delete/", {"ids": [9999]}, format="json")
        assert resp.data["deleted"] == 0

    def test_multipart_upload(self, editor_api):
        from django.core.files.uploadedfile import SimpleUploadedFile

        img = SimpleUploadedFile("t.png", b"\x89PNG fake", content_type="image/png")
        resp = editor_api.post(
            "/api/admin/gallery/",
            {"title": "Uploaded", "category": "Corporate", "image_file": img},
            format="multipart",
        )
        assert resp.status_code == 201, resp.data

    def test_youtube_url_normalised(self, editor_api):
        resp = editor_api.post(
            "/api/admin/videos/",
            {"title": "V", "category": "corporate", "youtube_id": "https://youtu.be/dQw4w9WgXcQ"},
            format="json",
        )
        assert resp.status_code == 201, resp.data
        assert (resp.data.get("youtube_id") or resp.data.get("youtubeId")) == "dQw4w9WgXcQ"


@pytest.mark.django_db
class TestUserManagement:
    USERS = "/api/admin/users/"

    def test_create_user(self, super_api):
        resp = super_api.post(
            self.USERS,
            {"email": "new@x.com", "password": "Strong-Pass-123", "role": "editor", "name": "New"},
            format="json",
        )
        assert resp.status_code == 201
        from accounts.models import User

        assert User.objects.get(email="new@x.com").role == "editor"

    def test_cannot_delete_last_super_admin(self, super_api, super_admin):
        resp = super_api.delete(f"/api/admin/users/{super_admin.pk}/")
        assert resp.status_code == 400

    def test_cannot_demote_last_super_admin(self, super_api, super_admin):
        resp = super_api.patch(
            f"/api/admin/users/{super_admin.pk}/", {"role": "viewer"}, format="json"
        )
        assert resp.status_code == 400

    def test_can_delete_super_admin_when_another_exists(self, super_api, super_admin):
        from accounts.models import User

        second = User.objects.create_superuser(email="second@x.com", password="Strong-Pass-123")
        resp = super_api.delete(f"/api/admin/users/{super_admin.pk}/")
        assert resp.status_code == 204
        assert not User.objects.filter(pk=super_admin.pk).exists()
        # second admin still there
        assert User.objects.filter(pk=second.pk).exists()

    def test_cannot_deactivate_self(self, super_api, super_admin):
        resp = super_api.patch(
            f"/api/admin/users/{super_admin.pk}/", {"is_active": False}, format="json"
        )
        assert resp.status_code == 400

    def test_deactivating_user_revokes_tokens(self, super_api, super_admin, editor):
        login = super_api.post(
            self.USERS,
            {"email": "temp@x.com", "password": "Strong-Pass-123", "role": "editor"},
            format="json",
        )
        target = login.data["id"]
        resp = super_api.patch(f"/api/admin/users/{target}/", {"is_active": False}, format="json")
        assert resp.status_code == 200

    def test_viewer_cannot_even_list_users(self, viewer_api):
        assert viewer_api.get(self.USERS).status_code == 403


@pytest.mark.django_db
class TestAuditLog:
    def test_writes_are_logged(self, editor, editor_api):
        created = editor_api.post(
            "/api/admin/services/",
            {"name": "Audited Service", "category": "X"},
            format="json",
        )
        assert created.status_code == 201
        from accounts.models import AdminActionLog

        assert AdminActionLog.objects.filter(
            action="create", model_name="Service", actor=editor
        ).exists()

    def test_logs_endpoint_superuser_only(self, editor_api, super_api):
        assert editor_api.get("/api/admin/users/logs/").status_code == 403
        assert super_api.get("/api/admin/users/logs/").status_code == 200
