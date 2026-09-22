from rest_framework.routers import DefaultRouter

from .views_public import (
    PublicArtistViewSet,
    PublicInfluencerViewSet,
    PublicTalentProfileViewSet,
)

router = DefaultRouter()
router.register("artists", PublicArtistViewSet, basename="artists")
router.register("influencers", PublicInfluencerViewSet, basename="influencers")
router.register("talent-profiles", PublicTalentProfileViewSet, basename="talent-profiles")

urlpatterns = router.urls
