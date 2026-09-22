"""Public read endpoints: published-only, search, filters, slug lookup."""

import pytest

from content.models import HeroSlide, ServiceEntry

pytestmark = pytest.mark.django_db


class TestHeroSlides:
    def test_list_published_only(self, api, hero_slide):
        HeroSlide.objects.create(subtitle="Hidden", image="x", is_published=False)
        resp = api.get("/api/hero-slides/")
        assert resp.status_code == 200
        assert [s["subtitle"] for s in resp.data] == ["Luxury Events"]


class TestServiceEntries:
    def test_filter_by_type(self, api, corporate_entry):
        ServiceEntry.objects.create(
            entry_type=ServiceEntry.EntryType.SPECIAL_EVENT,
            title="Award Show",
            slug="award-show",
        )
        resp = api.get("/api/service-entries/", {"type": "corporate_event"})
        assert resp.data["count"] == 1
        assert resp.data["results"][0]["slug"] == "top-10-event-companies"

    def test_legacy_id_lookup(self, api, corporate_entry):
        resp = api.get("/api/service-entries/top-10-event-companies/")
        assert resp.status_code == 200
        assert resp.data["content"] == "body"

    def test_search(self, api, corporate_entry):
        resp = api.get("/api/service-entries/", {"search": "Top 10"})
        assert resp.data["count"] == 1

    def test_unpublished_404(self, api, corporate_entry):
        corporate_entry.is_published = False
        corporate_entry.save()
        resp = api.get("/api/service-entries/top-10-event-companies/")
        assert resp.status_code == 404


class TestArtists:
    def test_filter_by_category(self, api, artist):
        from artists.models import Artist

        Artist.objects.create(name="DJ Nacho", category="dj", slug="dj-nacho")
        resp = api.get("/api/artists/", {"category": "singer"})
        assert resp.data["count"] == 1
        assert resp.data["results"][0]["popularSongs"] == ["Krishno"]
        assert resp.data["results"][0]["socialMedia"]["facebook"] == "@habib"

    def test_ordering_by_rating(self, api, artist):
        from artists.models import Artist

        Artist.objects.create(name="Higher", category="singer", slug="higher", rating=5.0)
        resp = api.get("/api/artists/", {"ordering": "-rating"})
        assert resp.data["results"][0]["name"] == "Higher"


class TestBlogs:
    def test_slug_detail_increments_views(self, api, blog_post):
        resp = api.get(f"/api/blogs/{blog_post.slug}/")
        assert resp.status_code == 200
        blog_post.refresh_from_db()
        assert blog_post.views == 1

    def test_list_has_no_content_field(self, api, blog_post):
        resp = api.get("/api/blogs/")
        item = resp.data["results"][0]
        assert "content" not in item
        assert "excerpt" in item


class TestSettings:
    def test_public_settings(self, api):
        from content.models import SiteSettings

        s = SiteSettings.load()
        s.phone = "+8801813340400"
        s.save()
        resp = api.get("/api/settings/")
        assert resp.status_code == 200
        assert resp.data["phone"] == "+8801813340400"


class TestPublicJobs:
    def test_only_active_jobs_listed(self, api, job):
        from engagement.models import JobPosting

        JobPosting.objects.create(title="Closed role", slug="closed", status="closed")
        resp = api.get("/api/jobs/")
        assert [j["slug"] for j in resp.data["results"]] == ["event-manager"]


class TestHealth:
    def test_health_ok(self, api):
        resp = api.get("/api/health/")
        assert resp.status_code == 200
        assert resp.json()["status"] == "ok"
