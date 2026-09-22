from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils import timezone

from core.models import TimeStampedModel


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email, password=None, **extra):
        if not email:
            raise ValueError("Email is required.")
        email = self.normalize_email(email).lower()
        user = self.model(email=email, **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra):
        extra.setdefault("role", User.Role.SUPER_ADMIN)
        extra.setdefault("is_staff", True)
        extra.setdefault("is_superuser", True)
        extra.setdefault("is_active", True)
        return self.create_user(email, password, **extra)


class User(AbstractBaseUser, PermissionsMixin, TimeStampedModel):
    """Email-login staff user with a coarse role system.

    Roles: super_admin (everything incl. users & settings), editor (content
    CRUD), viewer (read-only dashboards).
    """

    class Role(models.TextChoices):
        SUPER_ADMIN = "super_admin", "Super Admin"
        EDITOR = "editor", "Editor"
        VIEWER = "viewer", "Viewer"

    email = models.EmailField(unique=True, db_index=True)
    name = models.CharField(max_length=120, blank=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.VIEWER, db_index=True)
    phone = models.CharField(max_length=20, blank=True)
    is_active = models.BooleanField(default=True, help_text="Deactivated users cannot log in.")
    is_staff = models.BooleanField(default=False, help_text="Allows access to Django's admin site.")
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = UserManager()

    class Meta:
        ordering = ["-date_joined"]
        indexes = [models.Index(fields=["role", "is_active"])]

    def __str__(self):
        return f"{self.name or self.email} ({self.role})"

    @property
    def is_super_admin(self):
        return self.role == self.Role.SUPER_ADMIN

    @property
    def is_editor(self):
        return self.role in {self.Role.SUPER_ADMIN, self.Role.EDITOR}

    def get_full_name(self):
        return self.name or self.email

    def get_short_name(self):
        return self.name or self.email.split("@")[0]


class AdminActionLog(TimeStampedModel):
    """Audit trail of every admin write (and auth events)."""

    class Action(models.TextChoices):
        CREATE = "create", "Create"
        UPDATE = "update", "Update"
        DELETE = "delete", "Delete"
        PUBLISH = "publish", "Publish"
        UNPUBLISH = "unpublish", "Unpublish"
        LOGIN = "login", "Login"
        LOGIN_FAILED = "login_failed", "Login failed"
        LOGOUT = "logout", "Logout"
        PASSWORD_CHANGE = "password_change", "Password change"
        PASSWORD_RESET = "password_reset", "Password reset"
        ROLE_CHANGE = "role_change", "Role change"
        DEACTIVATE = "deactivate", "Deactivate"

    actor = models.ForeignKey(
        User, null=True, blank=True, on_delete=models.SET_NULL, related_name="action_logs"
    )
    action = models.CharField(max_length=32, choices=Action.choices, db_index=True)
    model_name = models.CharField(max_length=80, blank=True)
    object_id = models.CharField(max_length=80, blank=True)
    object_repr = models.CharField(max_length=300, blank=True)
    changes = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["actor", "-created_at"])]

    def __str__(self):
        who = self.actor.email if self.actor else "system"
        return f"{who} {self.action} {self.model_name}#{self.object_id}"
