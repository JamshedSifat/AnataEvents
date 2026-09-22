from core.views import PublicReadOnlyViewSet

from .models import Artist, InfluencerProfile, TalentProfile
from .serializers import (
    ArtistSerializer,
    InfluencerSerializer,
    TalentProfileSerializer,
)


class PublicArtistViewSet(PublicReadOnlyViewSet):
    queryset = Artist.objects.all()
    serializer_class = ArtistSerializer
    filterset_fields = ["category", "city", "availability"]
    search_fields = ["name", "genre", "description", "bio", "specialties", "location"]
    ordering_fields = ["rating", "name", "order", "price"]
    ordering = ["order", "name"]


class PublicInfluencerViewSet(PublicReadOnlyViewSet):
    queryset = InfluencerProfile.objects.all()
    serializer_class = InfluencerSerializer
    filterset_fields = ["category"]
    search_fields = ["name", "category", "bio", "description"]
    ordering = ["order", "name"]


class PublicTalentProfileViewSet(PublicReadOnlyViewSet):
    queryset = TalentProfile.objects.all()
    serializer_class = TalentProfileSerializer
    filterset_fields = ["category"]
    search_fields = ["name", "category", "bio"]
    ordering = ["order", "name"]
    pagination_class = None
