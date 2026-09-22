from django.contrib import admin as django_admin
from django.http import JsonResponse
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

urlpatterns = [
    path("admin/", django_admin.site.urls),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="docs"),
    path(
        "api/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
    path("api/auth/", include("accounts.urls")),
    path("api/", include("content.urls_public")),
    path("api/", include("artists.urls_public")),
    path("api/", include("engagement.urls_public")),
    path("api/admin/", include("content.urls_admin")),
    path("api/admin/", include("artists.urls_admin")),
    path("api/admin/", include("engagement.urls_admin")),
    path("api/admin/", include("accounts.urls_admin")),
    path("api/", include("core.urls")),
]

urlpatterns += [
    # Media only served by Django in local development; production uses
    # Cloudinary/S3 absolute URLs.
]


def handler404(request, exception=None):  # pragma: no cover
    return JsonResponse({"detail": "Not found."}, status=404)


def handler500(request):  # pragma: no cover
    return JsonResponse({"detail": "Server error."}, status=500)
