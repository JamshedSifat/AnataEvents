"""Pagination used by every list endpoint (`?page=`, `?page_size=`)."""

from __future__ import annotations

from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class StandardPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "page_size"
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response(
            {
                "count": self.page.paginator.count,
                "total_pages": self.page.paginator.num_pages,
                "page": self.page.number,
                "page_size": self.get_page_size(self.request),
                "next": self.get_next_link(),
                "previous": self.get_previous_link(),
                "results": data,
            }
        )

    def get_paginated_response_schema(self, schema):
        schema = super().get_paginated_response_schema(schema)
        schema["properties"]["page_size"] = {
            "type": "integer",
            "example": self.page_size,
        }
        schema["properties"]["total_pages"] = {"type": "integer", "example": 5}
        return schema


class LargePagination(StandardPagination):
    page_size = 50
    max_page_size = 500
