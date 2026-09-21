"""Shared pytest fixtures."""

from __future__ import annotations

import pytest
from django.core.cache import cache
from django.utils import timezone
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.content.models import (
    FAQ,
    Artist,
    BlogPost,
    ContentBlock,
    GalleryImage,
    HeroSlide,
    JobPosting,
    Service,
    ServiceEntry,
    SiteSettings,
    Testimonial,
    Video,
)

STRONG_PASSWORD = "Str0ng-Password!2026"


@pytest.fixture(autouse=True)
def _clear_state():
    """Throttle counters and axes lockouts must not leak between tests."""
    cache.clear()
    yield
    cache.clear()


@pytest.fixture
def api() -> APIClient:
    return APIClient()


@pytest.fixture
def super_admin(db) -> User:
    return User.objects.create_superuser(
        email="super@ananta-events.com",
        password=STRONG_PASSWORD,
        full_name="Super Admin",
        role=User.Role.SUPER_ADMIN,
    )


@pytest.fixture
def editor(db) -> User:
    return User.objects.create_user(
        email="editor@ananta-events.com",
        password=STRONG_PASSWORD,
        full_name="Content Editor",
        role=User.Role.EDITOR,
    )


@pytest.fixture
def viewer(db) -> User:
    return User.objects.create_user(
        email="viewer@ananta-events.com",
        password=STRONG_PASSWORD,
        full_name="Read Only",
        role=User.Role.VIEWER,
    )


@pytest.fixture
def inactive_user(db) -> User:
    user = User.objects.create_user(
        email="inactive@ananta-events.com", password=STRONG_PASSWORD, role=User.Role.EDITOR
    )
    user.is_active = False
    user.save(update_fields=["is_active"])
    return user


@pytest.fixture
def as_super(api, super_admin) -> APIClient:
    api.force_authenticate(user=super_admin)
    return api


@pytest.fixture
def as_editor(editor) -> APIClient:
    client = APIClient()
    client.force_authenticate(user=editor)
    return client


@pytest.fixture
def as_viewer(viewer) -> APIClient:
    client = APIClient()
    client.force_authenticate(user=viewer)
    return client


@pytest.fixture
def site_settings(db) -> SiteSettings:
    return SiteSettings.load()


@pytest.fixture
def service(db) -> Service:
    return Service.objects.create(
        name="Corporate Event Management",
        slug="corporate-events",
        summary="Corporate events",
        body="<p>Body</p>",
        order=1,
    )


@pytest.fixture
def service_entry(db, service) -> ServiceEntry:
    return ServiceEntry.objects.create(
        service=service,
        title="Annual Gala Night",
        slug="annual-gala-night",
        summary="A gala night",
        body="<p>Details</p>",
        stats=[{"number": "20+", "label": "Years"}],
        features=["Stage", "Sound"],
        order=1,
    )


@pytest.fixture
def content_fixtures(db) -> dict:
    """A small, representative slice of every content model."""
    return {
        "hero": HeroSlide.objects.create(subtitle="Luxury Events", order=1),
        "service": Service.objects.create(name="Wedding Planner", slug="wedding-planner", order=2),
        "blog": BlogPost.objects.create(
            title="How to plan an event",
            slug="how-to-plan-an-event",
            content="<p>Steps</p>",
            category="Guide",
            is_published=True,
            published_at=timezone.now(),
        ),
        "draft_blog": BlogPost.objects.create(
            title="Draft post", slug="draft-post", content="<p>hidden</p>", is_published=False
        ),
        "artist": Artist.objects.create(
            name="Habib Wahid", category=Artist.Category.SINGER, slug="habib-wahid", order=1
        ),
        "draft_artist": Artist.objects.create(
            name="Hidden Singer", category=Artist.Category.SINGER, is_published=False
        ),
        "testimonial": Testimonial.objects.create(name="A Client", review="Great work", rating=5),
        "gallery": GalleryImage.objects.create(title="Photo", image_url="https://x.test/a.jpg"),
        "video": Video.objects.create(
            title="Concert highlight", youtube_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        ),
        "faq": FAQ.objects.create(question="Do you cover Sylhet?", answer="Yes", section="general"),
        "job": JobPosting.objects.create(title="Event Executive", slug="event-executive"),
        "block": ContentBlock.objects.create(
            section=ContentBlock.Section.WHY_CHOOSE_US, title="16+ years experience", order=1
        ),
    }
