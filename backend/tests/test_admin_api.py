"""Admin CRUD behaviour: create/update/delete, reorder, bulk delete, publish,
audit logging, dashboard stats, uploads and user-management guard rails."""

from __future__ import annotations

import io

import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image

from apps.accounts.models import AdminActionLog, User
from apps.content.models import BlogPost, GalleryImage, Service, ServiceEntry
from tests.conftest import STRONG_PASSWORD

pytestmark = pytest.mark.django_db


def png_bytes(size=(10, 10)) -> bytes:
    buffer = io.BytesIO()
    Image.new("RGB", size, (200, 30, 30)).save(buffer, format="PNG")
    return buffer.getvalue()


class TestCrud:
    def test_create_read_update_delete_blog(self, as_editor, editor):
        created = as_editor.post(
            "/api/admin/blogs/",
            {"title": "New post", "content": "<p>Body</p>", "category": "Tips"},
            format="json",
        )
        assert created.status_code == 201
        slug = created.data["slug"]
        assert created.data["author"] == editor.pk
        assert created.data["published_at"] is not None

        updated = as_editor.patch(
            f"/api/admin/blogs/{slug}/", {"title": "Updated title"}, format="json"
        )
        assert updated.status_code == 200
        assert updated.data["title"] == "Updated title"

        assert as_editor.delete(f"/api/admin/blogs/{slug}/").status_code == 204
        assert not BlogPost.objects.filter(slug=slug).exists()

    def test_rich_text_is_sanitised_on_write(self, as_editor):
        response = as_editor.post(
            "/api/admin/blogs/",
            {"title": "XSS attempt", "content": "<p>ok</p><script>alert(1)</script>"},
            format="json",
        )
        assert response.status_code == 201
        assert "<script" not in response.data["content"]

    def test_audit_log_written_for_create_update_delete(self, as_editor):
        created = as_editor.post(
            "/api/admin/faqs/", {"question": "Q", "answer": "A"}, format="json"
        )
        pk = created.data["id"]
        as_editor.patch(f"/api/admin/faqs/{pk}/", {"answer": "B"}, format="json")
        as_editor.delete(f"/api/admin/faqs/{pk}/")
        actions = list(AdminActionLog.objects.values_list("action", flat=True))
        assert {"create", "update", "delete"} <= set(actions)

    def test_bulk_delete(self, as_editor):
        ids = [
            as_editor.post(
                "/api/admin/gallery/",
                {"title": f"p{i}", "image_url": "https://x.test/i.jpg"},
                format="json",
            ).data["id"]
            for i in range(3)
        ]
        response = as_editor.post("/api/admin/gallery/bulk-delete/", {"ids": ids}, format="json")
        assert response.status_code == 200
        assert response.data["deleted"] == 3
        assert GalleryImage.objects.count() == 0

    def test_reorder(self, as_editor):
        a = as_editor.post(
            "/api/admin/gallery/",
            {"title": "a", "image_url": "https://x.test/a.jpg"},
            format="json",
        ).data["id"]
        b = as_editor.post(
            "/api/admin/gallery/",
            {"title": "b", "image_url": "https://x.test/b.jpg"},
            format="json",
        ).data["id"]
        response = as_editor.post(
            "/api/admin/gallery/reorder/",
            {"items": [{"id": a, "order": 5}, {"id": b, "order": 1}]},
            format="json",
        )
        assert response.status_code == 200
        assert GalleryImage.objects.get(pk=a).order == 5
        assert GalleryImage.objects.get(pk=b).order == 1

    def test_publish_toggle(self, as_editor):
        post = BlogPost.objects.create(
            title="Draft", slug="draft", content="<p>x</p>", is_published=False
        )
        published = as_editor.post(f"/api/admin/blogs/{post.slug}/publish/", {}, format="json")
        assert published.status_code == 200
        post.refresh_from_db()
        assert post.is_published and post.published_at is not None
        unpublished = as_editor.post(f"/api/admin/blogs/{post.slug}/unpublish/", {}, format="json")
        assert unpublished.status_code == 200
        post.refresh_from_db()
        assert not post.is_published

    def test_search_and_pagination(self, as_editor):
        for i in range(5):
            BlogPost.objects.create(title=f"Post {i}", slug=f"post-{i}", content="<p>x</p>")
        page = as_editor.get("/api/admin/blogs/?page_size=2")
        assert len(page.data["results"]) == 2
        assert page.data["total_pages"] == 3
        exact = as_editor.get("/api/admin/blogs/?search=Post 3")
        assert exact.data["count"] == 1

    def test_filtering(self, as_editor):
        BlogPost.objects.create(title="A", slug="a", content="<p>x</p>", is_published=False)
        BlogPost.objects.create(title="B", slug="b", content="<p>x</p>", is_published=True)
        response = as_editor.get("/api/admin/blogs/?is_published=false")
        assert response.data["count"] == 1


class TestUploads:
    def test_gallery_accepts_image_upload(self, as_editor):
        upload = SimpleUploadedFile("photo.png", png_bytes(), content_type="image/png")
        response = as_editor.post(
            "/api/admin/gallery/", {"title": "Upload", "image": upload}, format="multipart"
        )
        assert response.status_code == 201, response.data
        assert response.data["image_src"].endswith(".png")

    def test_gallery_rejects_non_image_upload(self, as_editor):
        upload = SimpleUploadedFile("evil.txt", b"not an image", content_type="text/plain")
        response = as_editor.post(
            "/api/admin/gallery/", {"title": "Bad", "image": upload}, format="multipart"
        )
        assert response.status_code == 400
        assert "image" in response.data["errors"]

    def test_gallery_rejects_oversized_upload(self, as_editor, settings):
        settings.FILE_UPLOAD_MAX_MB = 0
        upload = SimpleUploadedFile("big.png", png_bytes(), content_type="image/png")
        response = as_editor.post(
            "/api/admin/gallery/", {"title": "Big", "image": upload}, format="multipart"
        )
        assert response.status_code == 400


class TestServiceEntryAdmin:
    def test_create_entry_under_service(self, as_editor, service):
        response = as_editor.post(
            "/api/admin/service-entries/",
            {
                "service": service.pk,
                "title": "Award Show",
                "badge": "🏆 AWARDS",
                "features": ["Stage", "Sound"],
                "stats": [{"number": "20+", "label": "Years"}],
            },
            format="json",
        )
        assert response.status_code == 201
        assert response.data["slug"] == "award-show"
        assert response.data["service_slug"] == service.slug

    def test_filter_entries_by_service_slug(self, as_editor, service_entry):
        response = as_editor.get(
            f"/api/admin/service-entries/?service_slug={service_entry.service.slug}"
        )
        assert response.data["count"] == 1


class TestDashboardStats:
    def test_stats_payload(self, as_super, super_admin):
        ServiceEntry.objects.create(service=Service.objects.create(name="S", slug="s"), title="E")
        response = as_super.get("/api/admin/dashboard/stats/")
        assert response.status_code == 200
        assert response.data["content"]["services"] >= 1
        assert "pending" in response.data["submissions"]
        assert response.data["users"]["total"] >= 1
        assert "recent" in response.data


class TestUserManagement:
    def test_create_user(self, as_super):
        response = as_super.post(
            "/api/admin/users/",
            {
                "email": "new@ananta-events.com",
                "full_name": "New Person",
                "role": "editor",
                "password": "Another-Str0ng!Pass",
            },
            format="json",
        )
        assert response.status_code == 201, response.data
        assert User.objects.filter(email="new@ananta-events.com").exists()

    def test_create_user_rejects_duplicate_and_weak_password(self, as_super, editor):
        duplicate = as_super.post(
            "/api/admin/users/",
            {"email": editor.email, "role": "viewer", "password": "Another-Str0ng!Pass"},
            format="json",
        )
        assert duplicate.status_code == 400
        weak = as_super.post(
            "/api/admin/users/",
            {"email": "weak@x.com", "role": "viewer", "password": "password"},
            format="json",
        )
        assert weak.status_code == 400

    def test_update_role(self, as_super, viewer):
        response = as_super.patch(
            f"/api/admin/users/{viewer.pk}/", {"role": "editor"}, format="json"
        )
        assert response.status_code == 200
        viewer.refresh_from_db()
        assert viewer.role == "editor"

    def test_cannot_deactivate_self(self, as_super, super_admin):
        response = as_super.post(
            f"/api/admin/users/{super_admin.pk}/deactivate/", {}, format="json"
        )
        assert response.status_code == 400
        response = as_super.patch(
            f"/api/admin/users/{super_admin.pk}/", {"is_active": False}, format="json"
        )
        assert response.status_code == 400

    def test_cannot_delete_self(self, as_super, super_admin):
        assert as_super.delete(f"/api/admin/users/{super_admin.pk}/").status_code == 400

    def test_last_super_admin_cannot_be_demoted(self, as_super, super_admin):
        response = as_super.patch(
            f"/api/admin/users/{super_admin.pk}/", {"role": "viewer"}, format="json"
        )
        assert response.status_code == 400
        super_admin.refresh_from_db()
        assert super_admin.role == "super_admin"

    def test_last_super_admin_cannot_be_deleted(self, as_super, super_admin):
        other = User.objects.create_user(
            email="second@x.com", password=STRONG_PASSWORD, role=User.Role.EDITOR
        )
        # Deleting a *different* user is fine…
        assert as_super.delete(f"/api/admin/users/{other.pk}/").status_code == 204
        # …but the only super admin cannot be deleted by anyone else either.
        viewer_client = as_super
        response = viewer_client.delete(f"/api/admin/users/{super_admin.pk}/")
        assert response.status_code == 400

    def test_super_admin_can_be_demoted_when_another_exists(self, as_super, super_admin):
        User.objects.create_superuser(email="second-super@x.com", password=STRONG_PASSWORD)
        response = as_super.patch(
            f"/api/admin/users/{super_admin.pk}/", {"role": "editor"}, format="json"
        )
        assert response.status_code == 200

    def test_activate_and_deactivate(self, as_super, editor):
        assert (
            as_super.post(
                f"/api/admin/users/{editor.pk}/deactivate/", {}, format="json"
            ).status_code
            == 200
        )
        editor.refresh_from_db()
        assert editor.is_active is False
        assert (
            as_super.post(f"/api/admin/users/{editor.pk}/activate/", {}, format="json").status_code
            == 200
        )
        editor.refresh_from_db()
        assert editor.is_active is True

    def test_force_password_reset_returns_link(self, as_super, editor, mailoutbox):
        response = as_super.post(
            f"/api/admin/users/{editor.pk}/force-password-reset/", {}, format="json"
        )
        assert response.status_code == 200
        assert "reset-password?token=" in response.data["reset_url"]
        assert len(mailoutbox) == 1

    def test_set_password_directly(self, as_super, editor):
        response = as_super.post(
            f"/api/admin/users/{editor.pk}/set-password/",
            {"new_password": "Set-By-Admin!2026"},
            format="json",
        )
        assert response.status_code == 200
        editor.refresh_from_db()
        assert editor.check_password("Set-By-Admin!2026")


class TestReviewWorkflow:
    def test_approve_and_reject_submissions(self, as_editor, resource_instances=None):
        from apps.submissions.models import ContactMessage

        message = ContactMessage.objects.create(
            full_name="Visitor", email="v@x.com", phone="01712345678", message="Hello"
        )
        approved = as_editor.post(
            f"/api/admin/messages/{message.pk}/approve/", {"notes": "handled"}, format="json"
        )
        assert approved.status_code == 200
        message.refresh_from_db()
        assert message.status == "approved"
        assert message.admin_notes == "handled"
        assert message.reviewed_at is not None

        rejected = as_editor.post(f"/api/admin/messages/{message.pk}/reject/", {}, format="json")
        assert rejected.status_code == 200
        message.refresh_from_db()
        assert message.status == "rejected"

    def test_mark_message_read(self, as_editor):
        from apps.submissions.models import ContactMessage

        message = ContactMessage.objects.create(
            full_name="Visitor", email="v@x.com", phone="01712345678", message="Hello"
        )
        assert (
            as_editor.post(
                f"/api/admin/messages/{message.pk}/mark-read/", {}, format="json"
            ).status_code
            == 200
        )
        message.refresh_from_db()
        assert message.is_read is True

    def test_invalid_status_is_rejected(self, as_editor):
        from apps.submissions.models import ContactMessage

        message = ContactMessage.objects.create(
            full_name="Visitor", email="v@x.com", phone="01712345678", message="Hello"
        )
        response = as_editor.post(
            f"/api/admin/messages/{message.pk}/review/", {"status": "banana"}, format="json"
        )
        assert response.status_code == 400
