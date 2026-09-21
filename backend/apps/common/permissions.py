"""DRF permission classes — server-side authorization for every admin route."""

from __future__ import annotations

from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsActiveUser(BasePermission):
    message = "Authentication credentials were not provided or the account is inactive."

    def has_permission(self, request, view) -> bool:
        user = request.user
        return bool(user and user.is_authenticated and user.is_active)


class IsAdminUser(IsActiveUser):
    """Any role (viewer/editor/super_admin) — read-only for viewers."""

    def has_permission(self, request, view) -> bool:
        if not super().has_permission(request, view):
            return False
        return request.user.role in {"viewer", "editor", "super_admin"} or request.user.is_staff


class IsEditorOrReadOnly(IsAdminUser):
    """Safe methods for every admin role, writes only for editors/super admins."""

    message = "Your role has read-only access. Ask a super admin for editor rights."

    def has_permission(self, request, view) -> bool:
        if not super().has_permission(request, view):
            return False
        if request.method in SAFE_METHODS:
            return True
        return request.user.can_write


class IsSuperAdmin(IsAdminUser):
    message = "Only a super admin can perform this action."

    def has_permission(self, request, view) -> bool:
        return super().has_permission(request, view) and request.user.is_super_admin
