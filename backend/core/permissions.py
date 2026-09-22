"""Role-based permission classes for /api/admin/* endpoints.

Roles:
  super_admin — everything, including user management and settings
  editor      — full content CRUD
  viewer      — read-only
"""

from rest_framework.permissions import SAFE_METHODS, BasePermission


def _role(user):
    return getattr(user, "role", "") if user and user.is_authenticated else ""


class IsAuthenticatedStaffRole(BasePermission):
    """Any active staff user with a valid backend role."""

    message = "Authentication with a valid staff account is required."

    def has_permission(self, request, view):
        user = request.user
        return bool(
            user
            and user.is_authenticated
            and user.is_active
            and _role(user) in {"super_admin", "editor", "viewer"}
        )


class IsEditorOrReadOnly(BasePermission):
    """viewer → GET/HEAD/OPTIONS only; editor/super_admin → full CRUD."""

    message = "Your role does not allow this action (viewer is read-only)."

    def has_permission(self, request, view):
        user = request.user
        if not (user and user.is_authenticated and user.is_active):
            return False
        if request.method in SAFE_METHODS:
            return _role(user) in {"super_admin", "editor", "viewer"}
        return _role(user) in {"super_admin", "editor"}


class IsSuperAdmin(BasePermission):
    message = "Only a super admin may perform this action."

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and _role(user) == "super_admin")


class IsSuperAdminOrReadOnly(IsSuperAdmin):
    message = "Only a super admin may modify this resource."

    def has_permission(self, request, view):
        user = request.user
        if not (user and user.is_authenticated and user.is_active):
            return False
        if request.method in SAFE_METHODS:
            return _role(user) in {"super_admin", "editor", "viewer"}
        return _role(user) == "super_admin"
