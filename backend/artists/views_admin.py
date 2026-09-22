from core.views import AdminCrudViewSet

from .models import Artist, InfluencerProfile, TalentProfile
from .serializers import (
    ArtistSerializer,
    ArtistWriteSerializer,
    InfluencerSerializer,
    InfluencerWriteSerializer,
    TalentProfileSerializer,
)


class AdminArtistViewSet(AdminCrudViewSet):
    queryset = Artist.objects.all()
    filterset_fields = ["category", "availability"]
    search_fields = ["name", "genre", "bio", "location", "city"]
    ordering_fields = ["rating", "name", "order"]
    audit_fields = ("name", "category", "price", "rating", "order", "is_published")

    def get_serializer_class(self):
        if self.action in {"create", "update", "partial_update"}:
            return ArtistWriteSerializer
        return ArtistSerializer


class AdminInfluencerViewSet(AdminCrudViewSet):
    queryset = InfluencerProfile.objects.all()
    filterset_fields = ["category"]
    search_fields = ["name", "category", "bio"]
    audit_fields = ("name", "category", "followers", "order", "is_published")

    def get_serializer_class(self):
        if self.action in {"create", "update", "partial_update"}:
            return InfluencerWriteSerializer
        return InfluencerSerializer


class AdminTalentProfileViewSet(AdminCrudViewSet):
    queryset = TalentProfile.objects.all()
    serializer_class = TalentProfileSerializer
    filterset_fields = ["category"]
    search_fields = ["name", "category", "bio"]
    audit_fields = ("name", "category", "rating", "order", "is_published")
