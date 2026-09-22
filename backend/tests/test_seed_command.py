"""seed_demo_data: imports every content source, idempotent."""

import pytest
from django.core.management import call_command

pytestmark = pytest.mark.django_db


@pytest.fixture
def seed():
    call_command("seed_demo_data")


class TestSeedCommand:
    def test_seed_loads_all_content_types(self, seed):
        from accounts.models import User  # noqa
        from artists.models import Artist, InfluencerProfile, TalentProfile
        from content.models import (
            BlogPost,
            FAQ,
            GalleryImage,
            HeroSlide,
            PortfolioItem,
            Service,
            ServiceEntry,
            SiteSettings,
            TeamMember,
            Testimonial,
            Video,
        )
        from engagement.models import JobPosting

        assert HeroSlide.objects.count() >= 2
        assert Service.objects.count() == 8
        assert ServiceEntry.objects.filter(entry_type="corporate_event").count() >= 2
        assert ServiceEntry.objects.filter(entry_type="exhibition_stall").count() >= 2
        assert ServiceEntry.objects.filter(entry_type="special_event").count() == 7
        assert ServiceEntry.objects.filter(entry_type="photography_service").count() == 6
        assert Artist.objects.filter(category="singer").count() >= 5
        assert Artist.objects.filter(category="dj").count() >= 5
        assert Artist.objects.filter(category="comedian").count() >= 3
        assert Artist.objects.filter(category="magician").count() >= 3
        assert Artist.objects.filter(category="dancer").count() >= 3
        assert InfluencerProfile.objects.count() >= 2
        assert TalentProfile.objects.count() == 8
        assert PortfolioItem.objects.count() >= 5
        assert GalleryImage.objects.count() >= 10
        assert Video.objects.count() >= 3
        assert BlogPost.objects.count() >= 3
        assert Testimonial.objects.count() >= 3
        assert TeamMember.objects.count() >= 5
        assert FAQ.objects.count() >= 10
        assert JobPosting.objects.count() >= 2
        assert SiteSettings.objects.filter(pk=1).exists()

    def test_seed_is_idempotent(self, seed):
        from content.models import ServiceEntry

        before = ServiceEntry.objects.count()
        call_command("seed_demo_data")
        assert ServiceEntry.objects.count() == before

    def test_no_credentials_in_seed(self, seed):
        """Seed must never create admin users with hardcoded passwords."""
        from accounts.models import User

        assert not User.objects.filter(is_superuser=True).exists()
