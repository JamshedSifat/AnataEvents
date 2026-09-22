"""Serialisation helpers: camelCase JSON out, tolerant (snake or camel) in."""

import re

CAMEL_RE = re.compile(r"(?<!^)(?=[A-Z])")


def snake_to_camel(name: str) -> str:
    parts = name.split("_")
    return parts[0] + "".join(p.title() for p in parts[1:])


def camel_to_snake(name: str) -> str:
    return CAMEL_RE.sub("_", name).lower()


def convert_keys(data, converter):
    """Recursively convert dict keys (incl. inside lists/JSONFields)."""
    if isinstance(data, dict):
        return {converter(k): convert_keys(v, converter) for k, v in data.items()}
    if isinstance(data, list):
        return [convert_keys(v, converter) for v in data]
    return data
