from rest_framework import serializers

from core.serializers import CamelCaseMixin
from core.utils import extract_youtube_id

from .models import (
    FAQ,
    BlogPost,
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


class HeroSlideSerializer(CamelCaseMixin, serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = HeroSlide
        fields = ["id", "subtitle", "description", "image", "stats", "order", "is_published"]

    def get_image(self, obj):
        return obj.resolved_image

    def validate_image(self, value):
        # Accept either a URL field value or an uploaded file.
        return value


class HeroSlideWriteSerializer(HeroSlideSerializer):
    image = serializers.CharField(required=False, allow_blank=True)
    image_file = serializers.FileField(required=False, allow_null=True, write_only=True)

    class Meta(HeroSlideSerializer.Meta):
        fields = HeroSlideSerializer.Meta.fields + ["image_file"]

    def validate(self, attrs):
        img_file = attrs.get("image_file")
        img_url = attrs.get("image", "")
        if self.instance is None and not img_file and not (img_url or "").strip():
            raise serializers.ValidationError({"image": "Provide an image URL or upload a file."})
        return attrs


class SiteSettingsSerializer(CamelCaseMixin, serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        exclude = ["created_at", "updated_at"]


class ServiceSerializer(CamelCaseMixin, serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [
            "id",
            "slug",
            "name",
            "category",
            "icon",
            "short_description",
            "description",
            "image",
            "price",
            "features",
            "link",
            "order",
            "is_published",
        ]


class ServiceEntryListSerializer(CamelCaseMixin, serializers.ModelSerializer):
    class Meta:
        model = ServiceEntry
        fields = [
            "id",
            "slug",
            "entry_type",
            "title",
            "category",
            "excerpt",
            "included_services",
            "cover_image",
            "images",
            "author",
            "date",
            "featured",
            "order",
            "is_published",
        ]


class ServiceEntryDetailSerializer(ServiceEntryListSerializer):
    class Meta(ServiceEntryListSerializer.Meta):
        fields = ServiceEntryListSerializer.Meta.fields + [
            "content",
            "tags",
            "included_services",
            "stats",
            "created_at",
        ]


class ServiceEntryWriteSerializer(CamelCaseMixin, serializers.ModelSerializer):
    class Meta:
        model = ServiceEntry
        fields = ServiceEntryDetailSerializer.Meta.fields
        read_only_fields = ["id", "slug", "created_at"]

    def validate_images(self, value):
        if value and not isinstance(value, list):
            raise serializers.ValidationError("Must be a list of image URLs.")
        return value


class FAQSerializer(CamelCaseMixin, serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ["id", "page", "question", "answer", "order", "is_published"]


class TestimonialSerializer(CamelCaseMixin, serializers.ModelSerializer):
    event_type = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Testimonial
        fields = [
            "id",
            "name",
            "designation",
            "company",
            "image",
            "rating",
            "review",
            "event_type",
            "order",
            "is_published",
        ]


class TeamMemberSerializer(CamelCaseMixin, serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = [
            "id",
            "name",
            "role",
            "image",
            "description",
            "email",
            "phone",
            "social",
            "order",
            "is_published",
        ]


class PortfolioItemSerializer(CamelCaseMixin, serializers.ModelSerializer):
    gallery = serializers.JSONField(required=False)
    date = serializers.CharField(source="event_date", required=False, allow_blank=True)

    class Meta:
        model = PortfolioItem
        fields = [
            "id",
            "slug",
            "title",
            "category",
            "image",
            "gallery",
            "description",
            "client",
            "date",
            "budget",
            "video_url",
            "order",
            "is_published",
        ]


class GalleryImageSerializer(CamelCaseMixin, serializers.ModelSerializer):
    src = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = GalleryImage
        fields = [
            "id",
            "title",
            "category",
            "src",
            "image",
            "description",
            "order",
            "is_published",
        ]

    def get_src(self, obj):
        return obj.resolved_image

    def get_image(self, obj):
        return obj.resolved_image


class GalleryImageWriteSerializer(GalleryImageSerializer):
    image = serializers.CharField(required=False, allow_blank=True)
    image_file = serializers.FileField(required=False, allow_null=True, write_only=True)

    class Meta(GalleryImageSerializer.Meta):
        fields = GalleryImageSerializer.Meta.fields + ["image_file"]

    def validate(self, attrs):
        img_file = attrs.get("image_file")
        img_url = attrs.get("image", "")
        if self.instance is None and not img_file and not (img_url or "").strip():
            raise serializers.ValidationError({"image": "Provide an image URL or upload a file."})
        return attrs


class VideoSerializer(CamelCaseMixin, serializers.ModelSerializer):
    # Accepts a full YouTube URL or a raw 11-char ID (normalised on save).
    youtube_id = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Video
        fields = [
            "id",
            "title",
            "category",
            "youtube_id",
            "description",
            "thumbnail",
            "order",
            "is_published",
        ]

    def validate(self, attrs):
        # NOTE: named-field validators must match the *wire* name with
        # CamelCaseMixin ("youtubeId"), so normalisation happens here.
        raw = (attrs.get("youtube_id") or "").strip()
        if raw:
            attrs["youtube_id"] = extract_youtube_id(raw)
        elif self.instance is None:
            raise serializers.ValidationError(
                {"youtube_id": "A YouTube URL or video ID is required."}
            )
        return attrs


class BlogPostListSerializer(CamelCaseMixin, serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = [
            "id",
            "slug",
            "title",
            "category",
            "image",
            "excerpt",
            "author",
            "published_date",
            "read_time",
            "tags",
            "featured",
            "views",
        ]


class BlogPostDetailSerializer(BlogPostListSerializer):
    class Meta(BlogPostListSerializer.Meta):
        fields = BlogPostListSerializer.Meta.fields + ["content", "created_at"]


class BlogPostWriteSerializer(CamelCaseMixin, serializers.ModelSerializer):
    date = serializers.DateField(source="published_date", required=False)

    class Meta:
        model = BlogPost
        fields = [
            "id",
            "slug",
            "title",
            "category",
            "image",
            "excerpt",
            "content",
            "author",
            "date",
            "read_time",
            "tags",
            "featured",
        ]
        read_only_fields = ["id", "slug"]
