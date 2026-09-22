import pytest
from django.core.exceptions import ValidationError

from content.models import BlogPost, SiteSettings
from core.utils import extract_youtube_id, normalize_bd_phone, validate_bd_phone


@pytest.mark.django_db
class TestCoreUtils:
    def test_bd_phone_accepts_local_format(self):
        assert validate_bd_phone("01712345678") == "01712345678"

    def test_bd_phone_accepts_intl_format(self):
        assert validate_bd_phone("+8801712345678")

    def test_bd_phone_rejects_garbage(self):
        with pytest.raises(ValidationError):
            validate_bd_phone("12345")

    def test_normalize_bd_phone(self):
        assert normalize_bd_phone("01712345678") == "+8801712345678"
        assert normalize_bd_phone("8801712345678") == "+8801712345678"

    def test_youtube_full_url(self):
        assert extract_youtube_id("https://www.youtube.com/watch?v=dQw4w9WgXcQ") == "dQw4w9WgXcQ"

    def test_youtube_short_url(self):
        assert extract_youtube_id("https://youtu.be/jNQXAC9IVRw") == "jNQXAC9IVRw"

    def test_youtube_raw_id(self):
        assert extract_youtube_id("aqz-KE-bpKQ") == "aqz-KE-bpKQ"

    def test_youtube_invalid(self):
        with pytest.raises(ValidationError):
            extract_youtube_id("https://vimeo.com/12345")


@pytest.mark.django_db
class TestSlugs:
    def test_slug_auto_generated(self, db):
        from content.models import PortfolioItem

        item = PortfolioItem.objects.create(title="Luxury Garden Wedding!!")
        assert item.slug == "luxury-garden-wedding"

    def test_slug_unique_suffix(self, db):
        from content.models import PortfolioItem

        a = PortfolioItem.objects.create(title="Gala Night")
        b = PortfolioItem.objects.create(title="Gala Night")
        assert a.slug != b.slug


@pytest.mark.django_db
class TestSiteSettings:
    def test_singleton(self):
        s1 = SiteSettings.load()
        s2 = SiteSettings.load()
        assert s1.pk == s2.pk == 1

    def test_save_keeps_single_row(self):
        SiteSettings.load().save()
        SiteSettings.load().save()
        assert SiteSettings.objects.count() == 1


@pytest.mark.django_db
class TestBlogSanitisation:
    def test_script_tags_stripped(self, db):
        post = BlogPost.objects.create(
            title="X",
            content="<p>ok</p><script>alert(1)</script><img src=x onerror=alert(2)>",
        )
        assert "<script" not in post.content
        assert "onerror" not in post.content
        assert "<p>ok</p>" in post.content


@pytest.mark.django_db
class TestArtistModel:
    def test_category_choices(self, artist):
        assert artist.category == "singer"
        assert str(artist) == "Habib Wahid (singer)"

    def test_rating_bounds(self, db):
        from artists.models import Artist

        with pytest.raises(ValidationError):
            a = Artist(name="X", category="dj", rating=9)
            a.full_clean()
