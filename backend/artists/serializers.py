from rest_framework import serializers

from core.serializers import CamelCaseMixin

from .models import Artist, InfluencerProfile, TalentProfile


class ArtistSerializer(CamelCaseMixin, serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Artist
        fields = [
            "id",
            "slug",
            "name",
            "category",
            "image",
            "rating",
            "price",
            "description",
            "bio",
            "genre",
            "experience",
            "experience_years",
            "languages",
            "popular_songs",
            "specialties",
            "awards",
            "styles",
            "social_media",
            "availability",
            "location",
            "city",
            "country",
            "contact_email",
            "phone",
            "famous_show",
            "famous_for",
            "media_presence",
            "followers",
            "tour_status",
            "order",
            "is_published",
        ]

    def get_image(self, obj):
        return obj.resolved_image


class ArtistWriteSerializer(CamelCaseMixin, serializers.ModelSerializer):
    image = serializers.CharField(required=False, allow_blank=True)
    image_file = serializers.FileField(required=False, allow_null=True, write_only=True)

    class Meta:
        model = Artist
        fields = ArtistSerializer.Meta.fields + ["image_file"]
        read_only_fields = ["id", "slug"]

    def validate(self, attrs):
        img_file = attrs.get("image_file")
        img_url = attrs.get("image", "")
        if self.instance is None and not img_file and not (img_url or "").strip():
            raise serializers.ValidationError({"image": "Provide an image URL or upload a file."})
        return attrs

    def to_representation(self, instance):
        return ArtistSerializer(instance, context=self.context).to_representation(instance)


class InfluencerSerializer(CamelCaseMixin, serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    avg_reach = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = InfluencerProfile
        fields = [
            "id",
            "slug",
            "name",
            "category",
            "image",
            "followers",
            "engagement",
            "posts",
            "platforms",
            "bio",
            "description",
            "avg_reach",
            "price",
            "order",
            "is_published",
        ]

    def get_image(self, obj):
        return obj.resolved_image


class InfluencerWriteSerializer(InfluencerSerializer):
    image = serializers.CharField(required=False, allow_blank=True)
    image_file = serializers.FileField(required=False, allow_null=True, write_only=True)

    class Meta(InfluencerSerializer.Meta):
        fields = InfluencerSerializer.Meta.fields + ["image_file"]
        read_only_fields = ["id", "slug"]

    def to_representation(self, instance):
        return InfluencerSerializer(instance, context=self.context).to_representation(instance)


class TalentProfileSerializer(CamelCaseMixin, serializers.ModelSerializer):
    class Meta:
        model = TalentProfile
        fields = [
            "id",
            "name",
            "category",
            "image",
            "rating",
            "experience",
            "bio",
            "full_bio",
            "video_url",
            "audio_url",
            "portfolio",
            "instagram",
            "achievements",
            "rates",
            "order",
            "is_published",
        ]
