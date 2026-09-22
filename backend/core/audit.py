"""Central place for audit logging of admin write actions."""

import json

from core.serialization import camel_to_snake

ACTION_CREATE = "create"
ACTION_UPDATE = "update"
ACTION_DELETE = "delete"
ACTION_PUBLISH = "publish"
ACTION_UNPUBLISH = "unpublish"
ACTION_LOGIN = "login"
ACTION_LOGIN_FAILED = "login_failed"
ACTION_LOGOUT = "logout"
ACTION_PASSWORD_CHANGE = "password_change"
ACTION_PASSWORD_RESET = "password_reset"
ACTION_ROLE_CHANGE = "role_change"
ACTION_DEACTIVATE = "deactivate"


def client_ip(request):
    fwd = request.META.get("HTTP_X_FORWARDED_FOR", "")
    if fwd:
        return fwd.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


def log_action(request, action, target=None, model_name="", object_id="", changes=None, actor=None):
    """Record an AdminActionLog. Never raises — auditing must not break writes."""
    from accounts.models import AdminActionLog

    try:
        user = actor or getattr(request, "user", None)
        AdminActionLog.objects.create(
            actor=user if getattr(user, "is_authenticated", False) else None,
            action=action,
            model_name=model_name or (target.__class__.__name__ if target else ""),
            object_id=str(object_id or (getattr(target, "pk", "") or "")),
            object_repr=str(target)[:300] if target else "",
            changes=json.dumps(changes, default=str)[:4000] if changes else "",
            ip_address=client_ip(request) or "",
        )
    except Exception:  # noqa: BLE001 — audit best-effort
        pass


def diff_changes(instance, validated_data, field_names):
    """Best-effort {field: {old, new}} diff for the audit log."""
    changes = {}
    for name in field_names:
        snake = camel_to_snake(name)
        if snake in validated_data:
            old = getattr(instance, snake, None)
            new = validated_data[snake]
            if old != new:
                changes[name] = {
                    "old": str(old)[:200],
                    "new": str(new)[:200],
                }
    return changes
