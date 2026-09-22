"""Uniform DRF error responses (validation errors keep field keys)."""

from rest_framework.views import exception_handler as drf_exception_handler


def exception_handler(exc, context):
    response = drf_exception_handler(exc, context)
    if response is not None and isinstance(response.data, dict):
        # Normalise DRF's non_field_errors key for the frontend.
        response.data = {
            (k if k != "non_field_errors" else "detail"): v for k, v in response.data.items()
        }
    return response
