"""Root URL configuration.

* `/api/...`      — public + auth API
* `/api/admin/...`— authenticated CMS API
* `/api/docs/`    — OpenAPI (Swagger UI) + `/api/schema/`
* `/django-admin/`— Django's own admin (secondary tool)
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path
from django.views.generic import RedirectView
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

from apps.accounts.urls import admin_router as accounts_admin_router
from apps.content.views import admin_router as content_admin_router
from apps.content.views import public_router
from apps.submissions.views import admin_router as submissions_admin_router
from apps.submissions.views import public_router as submissions_public_router
from config.health import health_check


def root(_request):
    return JsonResponse(
        {
            "name": "Ananta Events API",
            "version": "1.0.0",
            "docs": "/api/docs/",
            "health": "/api/health/",
            "endpoints": {
                "public": "/api/",
                "auth": "/api/auth/",
                "admin": "/api/admin/",
            },
        }
    )


api_patterns = [
    path("health/", health_check, name="health"),
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    path("docs/", SpectacularSwaggerView.as_view(url_name="api:schema"), name="swagger-ui"),
    path("redoc/", SpectacularRedocView.as_view(url_name="api:schema"), name="redoc"),
    path("auth/", include("apps.accounts.urls")),
    path("", include(public_router.urls)),
    path("", include(submissions_public_router.urls)),
]

admin_api_patterns = [
    path("", include(content_admin_router.urls)),
    path("", include(submissions_admin_router.urls)),
    path("", include(accounts_admin_router.urls)),
]

urlpatterns = [
    path("", root),
    path("api/", include((api_patterns, "api"))),
    path("api/admin/", include((admin_api_patterns, "admin-api"))),
    path("django-admin/", admin.site.urls),
    path("favicon.ico", RedirectView.as_view(url="/static/favicon.ico", permanent=True)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
