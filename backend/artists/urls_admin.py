from rest_framework.routers import DefaultRouter

from .views_admin import (
    AdminArtistViewSet,
    AdminInfluencerViewSet,
    AdminTalentProfileViewSet,
)

router = DefaultRouter()
router.register("artists", AdminArtistViewSet, basename="admin-artists")
router.register("influencers", AdminInfluencerViewSet, basename="admin-influencers")
router.register("talent-profiles", AdminTalentProfileViewSet, basename="admin-talent-profiles")

urlpatterns = router.urls
