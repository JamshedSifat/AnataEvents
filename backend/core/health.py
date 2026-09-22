from django.db import connections
from django.db.utils import OperationalError
from django.http import JsonResponse
from drf_spectacular.utils import extend_schema
from rest_framework.decorators import api_view, permission_classes


@api_view(["GET"])
@permission_classes([])
@extend_schema(
    summary="Health check",
    description="Returns service + database connectivity status.",
    responses={200: {"type": "object"}},
)
def health(request):
    db_ok, db_error = True, ""
    try:
        with connections["default"].cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
    except OperationalError as exc:
        db_ok, db_error = False, str(exc)[:200]

    body = {
        "status": "ok" if db_ok else "degraded",
        "service": "ananta-events-backend",
        "database": "ok" if db_ok else f"error: {db_error}",
    }
    return JsonResponse(body, status=200 if db_ok else 503)
