"""Shared serializer mixin: emits camelCase JSON, accepts camel or snake.

Wire format is camelCase end-to-end (matches the original frontend data
shapes, e.g. ``popularSongs``, ``socialMedia``). Input is tolerant: top-level
keys may arrive in either case. Nested JSON payloads (JSONField values) are
stored verbatim; on output they are converted recursively to camelCase.
"""

from rest_framework import serializers

from .serialization import camel_to_snake, convert_keys, snake_to_camel


class CamelCaseMixin(serializers.Serializer):
    def get_fields(self):
        fields = super().get_fields()
        out = {}
        for name, field in fields.items():
            camel = snake_to_camel(name)
            if field.source is None and camel != name:
                # Keep the model attribute lookup on the original name;
                # only the wire format (field_name) becomes camelCase.
                field.source = name
            out[camel] = field
        return out

    def to_internal_value(self, data):
        if isinstance(data, dict):
            data = {snake_to_camel(k): v for k, v in data.items()}
        return super().to_internal_value(data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if isinstance(data, dict):
            data = convert_keys(data, snake_to_camel)
        return data


class InputSnakeCaseMixin(serializers.Serializer):
    """Admin-only convenience: accept either case, keep snake_case output."""

    def to_internal_value(self, data):
        if isinstance(data, dict):
            data = {camel_to_snake(k): v for k, v in data.items()}
        return super().to_internal_value(data)
