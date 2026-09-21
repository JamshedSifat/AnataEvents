"""GET /api/health/ — liveness + database connectivity check."""

from __future__ import annotations

import time

from django.conf import settings
from django.db import connection
from django.http import JsonResponse
from django.views.decorators.cache import never_cache


@never_cache
def health_check(request):
    started = time.perf_counter()
    db_ok = True
    db_error = None
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
    except Exception as exc:  # pragma: no cover - depends on deployment
        db_ok = False
        db_error = str(exc)[:300]

    payload = {
        "status": "ok" if db_ok else "degraded",
        "database": {"ok": db_ok, "engine": settings.DATABASES["default"]["ENGINE"]},
        "debug": settings.DEBUG,
        "version": "1.0.0",
        "latency_ms": round((time.perf_counter() - started) * 1000, 2),
    }
    if db_error:
        payload["database"]["error"] = db_error
    return JsonResponse(payload, status=200 if db_ok else 503)
