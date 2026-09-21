"""Auth routes (mounted at /api/auth/)."""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.accounts.views import (
    AdminActionLogViewSet,
    AdminUserViewSet,
    ChangePasswordView,
    ForgotPasswordView,
    LoginView,
    LogoutView,
    MeView,
    RefreshView,
    ResetPasswordView,
    TokenObtainPairCompatView,
)

urlpatterns = [
    path("login/", LoginView.as_view(), name="auth-login"),
    path("token/", TokenObtainPairCompatView.as_view(), name="auth-token"),
    path("refresh/", RefreshView.as_view(), name="auth-refresh"),
    path("logout/", LogoutView.as_view(), name="auth-logout"),
    path("me/", MeView.as_view(), name="auth-me"),
    path("change-password/", ChangePasswordView.as_view(), name="auth-change-password"),
    path("forgot-password/", ForgotPasswordView.as_view(), name="auth-forgot-password"),
    path("reset-password/", ResetPasswordView.as_view(), name="auth-reset-password"),
]

admin_router = DefaultRouter()
admin_router.register("users", AdminUserViewSet, basename="admin-users")
admin_router.register("action-logs", AdminActionLogViewSet, basename="admin-action-logs")

urlpatterns += [path("", include(admin_router.urls))]
