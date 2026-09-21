"""Audit logging helpers and request metadata utilities."""

from __future__ import annotations

import logging

from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger("ananta.audit")


def client_ip(request) -> str | None:
    """Best-effort client IP behind a proxy (Render/Railway/Vercel)."""
    if request is None:
        return None
    forwarded = request.META.get("HTTP_X_FORWARDED_FOR", "")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


def log_action(
    *,
    user=None,
    action: str,
    instance=None,
    model_name: str = "",
    object_id: str = "",
    detail: str = "",
    request=None,
):
    """Write an AdminActionLog row; never raises into the request path."""
    from apps.accounts.models import AdminActionLog

    try:
        if instance is not None:
            model_name = model_name or instance.__class__.__name__
            object_id = object_id or str(getattr(instance, "pk", ""))
            object_repr = str(instance)[:255]
        else:
            object_repr = ""
        AdminActionLog.objects.create(
            user=user if getattr(user, "is_authenticated", False) else None,
            actor_email=getattr(user, "email", "") if user else "",
            action=action,
            model_name=model_name[:100],
            object_id=str(object_id)[:64],
            object_repr=object_repr,
            detail=detail[:500],
            ip_address=client_ip(request) if request is not None else None,
        )
    except Exception:  # pragma: no cover - audit must never break a request
        logger.exception("Failed to write AdminActionLog")


def notify_admins(subject: str, body: str, reply_to: str | None = None) -> None:
    """Email staff about a new public submission (console backend in dev)."""
    recipients = list(
        getattr(settings, "ADMIN_NOTIFICATION_EMAILS", [])
        or [email for _, email in getattr(settings, "ADMINS", [])]
    )
    if not recipients:
        recipients = [settings.DEFAULT_FROM_EMAIL]
    try:
        send_mail(
            subject=f"[Ananta Events] {subject}",
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipients,
            fail_silently=True,
        )
    except Exception:  # pragma: no cover - notification is best effort
        logger.exception("Failed to send admin notification email")


def send_template_email(subject: str, body: str, to: list[str]) -> None:
    from django.core.mail import send_mail

    try:
        send_mail(
            subject=subject,
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=to,
            fail_silently=True,
        )
    except Exception:  # pragma: no cover
        logger.exception("Failed to send email to %s", to)
