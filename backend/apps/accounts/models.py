"""Custom user model (email login) with roles, plus auth audit models."""

from __future__ import annotations

import secrets
from datetime import timedelta

from django.conf import settings
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    """Manager for the email-based custom user."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("An email address is required.")
        email = self.normalize_email(email).lower()
        user = self.model(email=email, **extra_fields)
        user.password = make_password(password)
        user.full_clean(exclude=["password", "last_login"])
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        extra_fields.setdefault("role", User.Role.VIEWER)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", User.Role.SUPER_ADMIN)
        extra_fields.setdefault("is_active", True)
        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        return self._create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """Admin dashboard user. Email is the login identifier; no usernames."""

    class Role(models.TextChoices):
        SUPER_ADMIN = "super_admin", _("Super admin")
        EDITOR = "editor", _("Editor")
        VIEWER = "viewer", _("Viewer")

    email = models.EmailField(_("email address"), unique=True, db_index=True)
    full_name = models.CharField(_("full name"), max_length=150, blank=True)
    role = models.CharField(_("role"), max_length=20, choices=Role.choices, default=Role.VIEWER)
    is_active = models.BooleanField(_("active"), default=True)
    is_staff = models.BooleanField(
        _("staff status"), default=False, help_text=_("Access to /django-admin/.")
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS: list[str] = []

    class Meta:
        verbose_name = _("user")
        verbose_name_plural = _("users")
        ordering = ["email"]
        constraints = [
            models.CheckConstraint(
                condition=models.Q(role__in=["super_admin", "editor", "viewer"]),
                name="user_role_valid",
            )
        ]

    def __str__(self) -> str:
        return self.email

    def save(self, *args, **kwargs):
        self.email = self.email.lower().strip()
        if self.role == self.Role.SUPER_ADMIN:
            # A super admin is always a staff user so /django-admin/ keeps working.
            self.is_staff = True
        super().save(*args, **kwargs)

    # -- convenience predicates -------------------------------------------- #
    @property
    def is_super_admin(self) -> bool:
        return self.role == self.Role.SUPER_ADMIN or self.is_superuser

    @property
    def is_editor(self) -> bool:
        return self.role in {self.Role.EDITOR, self.Role.SUPER_ADMIN} or self.is_superuser

    @property
    def can_write(self) -> bool:
        """Editors and super admins may create/update/delete content."""
        return self.is_editor and self.is_active

    def get_short_name(self) -> str:
        return self.full_name or self.email.split("@")[0]

    def get_full_name(self) -> str:
        return self.full_name or self.email


class PasswordResetToken(models.Model):
    """Single-use, time-limited password reset token (only its hash is stored)."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="reset_tokens",
    )
    token_hash = models.CharField(max_length=128, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used_at = models.DateTimeField(null=True, blank=True)
    requested_ip = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["user", "expires_at"])]

    def __str__(self) -> str:
        return f"reset token for {self.user_id} ({'used' if self.used_at else 'open'})"

    # -- helpers ------------------------------------------------------------ #
    @staticmethod
    def hash_token(raw_token: str) -> str:
        from django.contrib.auth.hashers import make_password

        return make_password(raw_token)

    @classmethod
    def issue(cls, user, *, ip=None, ttl_minutes=60, raw_token=None):
        """Create a fresh token, invalidating previous open ones."""
        cls.objects.filter(user=user, used_at__isnull=True).update(used_at=timezone.now())
        raw_token = raw_token or secrets.token_urlsafe(48)
        token = cls.objects.create(
            user=user,
            token_hash=cls.hash_token(raw_token),
            expires_at=timezone.now() + timedelta(minutes=ttl_minutes),
            requested_ip=ip,
        )
        return token, raw_token

    @property
    def is_valid(self) -> bool:
        return self.used_at is None and self.expires_at > timezone.now()

    def mark_used(self) -> None:
        self.used_at = timezone.now()
        self.save(update_fields=["used_at"])


class AdminActionLog(models.Model):
    """Audit trail written on every create/update/delete through /api/admin/*."""

    class Action(models.TextChoices):
        CREATE = "create", _("Create")
        UPDATE = "update", _("Update")
        DELETE = "delete", _("Delete")
        BULK_DELETE = "bulk_delete", _("Bulk delete")
        REORDER = "reorder", _("Reorder")
        LOGIN = "login", _("Login")
        LOGIN_FAILED = "login_failed", _("Failed login")
        LOGOUT = "logout", _("Logout")
        PASSWORD_CHANGE = "password_change", _("Password change")
        PASSWORD_RESET = "password_reset", _("Password reset")

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="action_logs",
    )
    actor_email = models.CharField(max_length=254, blank=True)
    action = models.CharField(max_length=32, choices=Action.choices)
    model_name = models.CharField(max_length=100, blank=True)
    object_id = models.CharField(max_length=64, blank=True)
    object_repr = models.CharField(max_length=255, blank=True)
    detail = models.CharField(max_length=500, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        verbose_name = _("admin action log")
        verbose_name_plural = _("admin action logs")
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["model_name", "object_id"])]

    def __str__(self) -> str:
        return f"{self.created_at:%Y-%m-%d %H:%M} {self.actor_email or 'anon'} {self.action} {self.model_name}"


class LoginAttempt(models.Model):
    """Lightweight record of login outcomes (in addition to django-axes lockout)."""

    email = models.EmailField(db_index=True)
    success = models.BooleanField(default=False)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.email} {'ok' if self.success else 'fail'} @ {self.created_at:%Y-%m-%d %H:%M}"
