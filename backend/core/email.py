"""Transactional notification emails for public submissions."""

import logging

from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


def notify_admin(subject: str, body: str, reply_to: str | None = None):
    """Send a notification to the company inbox. Fails silently in dev/CI."""
    try:
        headers = {}
        if reply_to:
            headers["Reply-To"] = reply_to
        send_mail(
            subject=subject,
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.ADMIN_EMAIL],
            fail_silently=True,
            headers=headers,
        )
    except Exception:  # noqa: BLE001 — email must never break a submission
        logger.warning("notify_admin failed", exc_info=True)


def notify_user(to_email: str, subject: str, body: str):
    try:
        send_mail(
            subject=subject,
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[to_email],
            fail_silently=True,
        )
    except Exception:  # noqa: BLE001
        logger.warning("notify_user failed", exc_info=True)
