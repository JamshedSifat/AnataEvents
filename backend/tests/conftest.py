import pytest
from django.core.cache import cache
from rest_framework.test import APIClient

from accounts.models import User


@pytest.fixture(autouse=True)
def _clean_caches():
    """Lockout + throttle counters live in the shared locmem cache."""
    cache.clear()
    yield
    cache.clear()


def _make_user(email, password, role):
    return User.objects.create_user(
        email=email, password=password, role=role, name=email.split("@")[0]
    )


@pytest.fixture
def super_admin(db):
    return _make_user("root@test.com", "SuperSecure-Pass-1", User.Role.SUPER_ADMIN)


@pytest.fixture
def editor(db):
    return _make_user("editor@test.com", "EditorSecure-Pass-1", User.Role.EDITOR)


@pytest.fixture
def viewer(db):
    return _make_user("viewer@test.com", "ViewerSecure-Pass-1", User.Role.VIEWER)


@pytest.fixture
def api():
    return APIClient()


def auth_client(user):
    client = APIClient()
    client.force_authenticate(user=user)
    return client


@pytest.fixture
def super_api(super_admin):
    return auth_client(super_admin)


@pytest.fixture
def editor_api(editor):
    return auth_client(editor)


@pytest.fixture
def viewer_api(viewer):
    return auth_client(viewer)


@pytest.fixture
def hero_slide(db):
    from content.models import HeroSlide

    return HeroSlide.objects.create(
        subtitle="Luxury Events",
        description="d",
        image="https://x/img.jpg",
        stats="500+ Events",
        order=0,
    )


@pytest.fixture
def service(db):
    from content.models import Service

    return Service.objects.create(
        name="Corporate Event Management",
        category="Corporate",
        icon="🏢",
        short_description="Corporate events",
        order=0,
    )


@pytest.fixture
def corporate_entry(db):
    from content.models import ServiceEntry

    return ServiceEntry.objects.create(
        entry_type=ServiceEntry.EntryType.CORPORATE_EVENT,
        title="Top 10 Event Companies",
        slug="top-10-event-companies",
        excerpt="ex",
        content="body",
        legacy_id="top-10-event-companies",
    )


@pytest.fixture
def artist(db):
    from artists.models import Artist

    return Artist.objects.create(
        name="Habib Wahid",
        category=Artist.Category.SINGER,
        slug="singer-habib-wahid",
        genre="Folk Fusion",
        rating=4.9,
        popular_songs=["Krishno"],
        social_media={"facebook": "@habib"},
    )


@pytest.fixture
def blog_post(db):
    from content.models import BlogPost

    return BlogPost.objects.create(
        title="Wedding Trends",
        slug="wedding-trends",
        category="Wedding",
        excerpt="ex",
        content="<p>Fresh ideas</p>",
        author="webadmin",
    )


@pytest.fixture
def job(db):
    from engagement.models import JobPosting

    return JobPosting.objects.create(
        title="Event Manager",
        slug="event-manager",
        department="Events",
        salary="৳30,000",
    )


@pytest.fixture
def contact_message(db):
    from engagement.models import ContactMessage

    return ContactMessage.objects.create(
        name="Jane", email="jane@x.com", message="Please plan my wedding event."
    )


@pytest.fixture
def disable_email_send(monkeypatch):
    from core import email

    monkeypatch.setattr(email, "send_mail", lambda *a, **kw: 1)
