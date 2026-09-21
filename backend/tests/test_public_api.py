"""Public API: published-only content, filters, search, pagination, health."""

from __future__ import annotations

import pytest
from django.core.cache import cache

pytestmark = pytest.mark.django_db


class TestHealth:
    def test_health_reports_database_ok(self, api):
        response = api.get("/api/health/")
        assert response.status_code == 200
        assert response.json()["status"] == "ok"
        assert response.json()["database"]["ok"] is True


class TestSiteSettings:
    def test_returns_singleton_settings(self, api, site_settings):
        response = api.get("/api/settings/")
        assert response.status_code == 200
        assert response.data["company_name"] == "Ananta Events"

    def test_public_settings_cannot_be_written(self, api, site_settings):
        assert api.patch(
            "/api/settings/", {"company_name": "Hacked"}, format="json"
        ).status_code in (401, 403, 405)


class TestPublishedOnly:
    def test_draft_blog_is_hidden(self, api, content_fixtures):
        response = api.get("/api/blogs/")
        slugs = [row["slug"] for row in response.data["results"]]
        assert "how-to-plan-an-event" in slugs
        assert "draft-post" not in slugs

    def test_draft_blog_detail_returns_404(self, api, content_fixtures):
        assert api.get("/api/blogs/draft-post/").status_code == 404

    def test_draft_artist_is_hidden(self, api, content_fixtures):
        response = api.get("/api/artists/")
        names = [row["name"] for row in response.data["results"]]
        assert "Habib Wahid" in names
        assert "Hidden Singer" not in names

    def test_blog_detail_increments_views(self, api, content_fixtures):
        blog = content_fixtures["blog"]
        api.get(f"/api/blogs/{blog.slug}/")
        blog.refresh_from_db()
        assert blog.views == 1


class TestFilteringSearchOrdering:
    def test_filter_artists_by_category(self, api, content_fixtures):
        response = api.get("/api/artists/?category=singer")
        assert response.status_code == 200
        assert all(row["category"] == "singer" for row in response.data["results"])

    def test_search_artist_by_name(self, api, content_fixtures):
        response = api.get("/api/artists/?search=Habib")
        assert [row["name"] for row in response.data["results"]] == ["Habib Wahid"]

    def test_ordering(self, api, content_fixtures):
        response = api.get("/api/artists/?ordering=-name")
        assert response.status_code == 200

    def test_faq_section_filter(self, api, content_fixtures):
        response = api.get("/api/faqs/?section=general")
        assert len(response.data["results"]) == 1
        assert api.get("/api/faqs/?section=home").data["count"] == 0

    def test_content_blocks_by_section(self, api, content_fixtures):
        response = api.get("/api/blocks/?section=why_choose_us")
        assert response.data["count"] == 1

    def test_pagination_shape(self, api, content_fixtures):
        response = api.get("/api/gallery/?page_size=1")
        assert set(response.data) >= {
            "count",
            "next",
            "previous",
            "results",
            "page_size",
            "total_pages",
        }


class TestServiceEndpoints:
    def test_service_detail_includes_published_entries(self, api, service_entry):
        response = api.get(f"/api/services/{service_entry.service.slug}/")
        assert response.status_code == 200
        assert [entry["slug"] for entry in response.data["entries"]] == ["annual-gala-night"]
        assert response.data["entries"][0]["title"] == "Annual Gala Night"

    def test_draft_entry_hidden_from_public_detail(self, api, service_entry):
        service_entry.is_published = False
        service_entry.save(update_fields=["is_published"])
        response = api.get(f"/api/services/{service_entry.service.slug}/")
        assert response.data["entries"] == []

    def test_entry_lookup_by_slug(self, api, service_entry):
        response = api.get(f"/api/service-entries/{service_entry.slug}/")
        assert response.status_code == 200
        assert response.data["stats"][0]["number"] == "20+"

    def test_entry_detail_includes_gallery(self, api, service_entry):
        from apps.content.models import ServiceEntryImage

        ServiceEntryImage.objects.create(
            entry=service_entry, image_url="https://x.test/g.jpg", caption="Stage"
        )
        response = api.get(f"/api/service-entries/{service_entry.slug}/")
        assert response.data["gallery"][0]["caption"] == "Stage"
        assert response.data["gallery"][0]["image_src"] == "https://x.test/g.jpg"


class TestVideoAndMedia:
    def test_video_exposes_youtube_helpers(self, api, content_fixtures):
        response = api.get("/api/videos/")
        row = response.data["results"][0]
        assert row["youtube_id"] == "dQw4w9WgXcQ"
        assert row["embed_url"].endswith("/embed/dQw4w9WgXcQ")


class TestPublicWriteProtection:
    @pytest.mark.parametrize(
        "path",
        ["/api/services/", "/api/artists/", "/api/blogs/", "/api/gallery/", "/api/faqs/"],
    )
    def test_public_endpoints_are_read_only(self, api, path):
        assert api.post(path, {"name": "x"}, format="json").status_code in (401, 403, 405)


class TestOpenApiSchema:
    def test_schema_is_generated(self, api):
        response = api.get("/api/schema/")
        assert response.status_code == 200
        assert b"openapi" in response.content

    def test_docs_page_loads(self, api):
        assert api.get("/api/docs/").status_code == 200


class TestThrottling:
    def test_public_read_throttle_rate_is_configured(self):
        from django.conf import settings

        assert "public_read" in settings.REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]
        assert "public_form" in settings.REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]
        assert "login" in settings.REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]

    def test_form_throttle_returns_429(self, api, settings):
        from django.test import override_settings

        settings.REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]["public_form"] = "2/hour"
        cache.clear()
        payload = {
            "full_name": "Spam Bot",
            "email": "spam@x.com",
            "phone": "01712345678",
            "message": "hello there, testing throttle",
        }
        with override_settings(REST_FRAMEWORK=settings.REST_FRAMEWORK):
            codes = [
                api.post("/api/contact/", payload, format="json").status_code for _ in range(3)
            ]
        assert codes[0] == 201
        assert 429 in codes
