"""Normalised API error payloads so the SPA always receives a predictable shape."""

from __future__ import annotations

from rest_framework.views import exception_handler as drf_exception_handler


def api_exception_handler(exc, context):
    response = drf_exception_handler(exc, context)
    if response is None:
        return None

    data = response.data
    payload = {
        "detail": None,
        "errors": {},
        "status_code": response.status_code,
    }
    if isinstance(data, dict):
        if "detail" in data and len(data) == 1:
            payload["detail"] = str(data["detail"])
        else:
            payload["errors"] = {
                key: value if isinstance(value, list) else [str(value)]
                for key, value in data.items()
            }
            payload["detail"] = _first_message(payload["errors"])
    elif isinstance(data, list):
        payload["errors"] = {"non_field_errors": [str(item) for item in data]}
        payload["detail"] = _first_message(payload["errors"])
    else:  # pragma: no cover - defensive
        payload["detail"] = str(data)

    response.data = payload
    return response


def _first_message(errors: dict) -> str:
    for field, messages in errors.items():
        if not messages:
            continue
        prefix = "" if field in {"detail", "non_field_errors"} else f"{field}: "
        return f"{prefix}{messages[0]}"
    return "Request failed."
