"""Authentication endpoints and user management."""

import contextlib

from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import status, viewsets
from rest_framework.decorators import action, api_view, permission_classes, throttle_classes
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView  # noqa: F401

from core.audit import (
    ACTION_DEACTIVATE,
    ACTION_LOGOUT,
    ACTION_PASSWORD_CHANGE,
    ACTION_PASSWORD_RESET,
    ACTION_ROLE_CHANGE,
    log_action,
)
from core.email import notify_user
from core.permissions import IsSuperAdmin
from core.throttling import LoginThrottle, PasswordResetThrottle

from .models import AdminActionLog, User
from .serializers import (
    GENERIC_CREDENTIALS_ERROR,
    ChangePasswordSerializer,
    ForgotPasswordSerializer,
    LoginTokenObtainPairSerializer,
    ResetPasswordSerializer,
    UserSerializer,
    UserWriteSerializer,
)

FRONTEND_URL = "https://ananta-events-jet.vercel.app"


def _set_refresh_cookie(response, refresh_token: str):
    from django.conf import settings

    response.set_cookie(
        settings.JWT_REFRESH_COOKIE,
        refresh_token,
        max_age=settings.JWT_REFRESH_COOKIE_MAX_AGE,
        httponly=True,
        secure=settings.JWT_REFRESH_COOKIE_SECURE,
        samesite=settings.JWT_REFRESH_COOKIE_SAMESITE,
        path=settings.JWT_REFRESH_COOKIE_PATH,
    )


def _clear_refresh_cookie(response):
    from django.conf import settings

    response.delete_cookie(settings.JWT_REFRESH_COOKIE, path=settings.JWT_REFRESH_COOKIE_PATH)


class LoginView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [LoginThrottle]

    def post(self, request):
        serializer = LoginTokenObtainPairSerializer(data=request.data, context={"request": request})
        try:
            serializer.is_valid(raise_exception=True)
        except ValidationError:
            # One generic message for any login failure (incl. throttle).
            return Response(
                {"detail": GENERIC_CREDENTIALS_ERROR},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        data = serializer.validated_data
        access, refresh = data.pop("access"), data.pop("refresh")
        response = Response({"accessToken": access, "user": data["user"]})
        _set_refresh_cookie(response, refresh)
        return response


class CookieTokenRefreshSerializer(TokenRefreshSerializer):
    """Reads the refresh token from the HttpOnly cookie (or body fallback).

    With ROTATE_REFRESH_TOKENS the response contains a new refresh token;
    the view re-issues the cookie and never exposes the token to JS.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # The token comes from the HttpOnly cookie; body fallback optional.
        self.fields["refresh"].required = False

    def validate(self, attrs):
        request = self.context.get("request")
        refresh = (request.COOKIES.get("ananta_refresh") if request else None) or attrs.get(
            "refresh"
        )
        if not refresh:
            raise ValidationError({"detail": "No refresh token present."})
        attrs["refresh"] = refresh
        return super().validate(attrs)


class RefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CookieTokenRefreshSerializer(data={}, context={"request": request})
        try:
            serializer.is_valid(raise_exception=True)
        except (TokenError, ValidationError):
            response = Response({"detail": "Session expired. Please sign in again."}, status=401)
            _clear_refresh_cookie(response)
            return response
        data = dict(serializer.validated_data)
        new_refresh = data.pop("refresh", None)
        response = Response(data)
        if new_refresh:
            # Rotation: replace the HttpOnly cookie with the new token. The
            # rotated token is never exposed to JavaScript.
            _set_refresh_cookie(response, new_refresh)
        return response


class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh = request.COOKIES.get("ananta_refresh") or request.data.get("refresh")
        if refresh:
            # already blacklisted/expired — treat as logged out
            with contextlib.suppress(TokenError):
                RefreshToken(refresh).blacklist()
        if request.user and request.user.is_authenticated:
            log_action(request, ACTION_LOGOUT, request.user)
        response = Response({"detail": "Logged out."})
        _clear_refresh_cookie(response)
        return response


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me(request):
    """Session verification — the frontend calls this on every page load of
    /admin to confirm the access token is still valid and re-hydrate the
    user; role changes take effect immediately."""
    return Response({"user": UserSerializer(request.user).data})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    serializer = ChangePasswordSerializer(data=request.data, context={"request": request})
    serializer.is_valid(raise_exception=True)
    serializer.save()
    log_action(request, ACTION_PASSWORD_CHANGE, request.user)
    # Invalidate every existing refresh token of this user.
    from rest_framework_simplejwt.token_blacklist.models import OutstandingToken

    with contextlib.suppress(Exception):
        for token in OutstandingToken.objects.filter(user=request.user):
            with contextlib.suppress(TokenError):
                RefreshToken(token.token).blacklist()
    return Response({"detail": "Password updated. Please sign in again."})


@api_view(["POST"])
@permission_classes([AllowAny])
@throttle_classes([PasswordResetThrottle])
def forgot_password(request):
    """Always answers 200 — never reveals whether the email exists."""
    serializer = ForgotPasswordSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    email = serializer.validated_data["email"].lower()
    user = User.objects.filter(email=email, is_active=True).first()
    if user:
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        link = f"{FRONTEND_URL}/admin/reset-password?uid={uid}&token={token}"
        notify_user(
            email,
            "Reset your Ananta Events admin password",
            "We received a request to reset your password.\n\n"
            f"Open this link to choose a new password (valid for a short "
            f"time):\n{link}\n\nIf you did not request this, ignore this "
            f"email.",
        )
        log_action(request, ACTION_PASSWORD_RESET, user, model_name="User")
    return Response({"detail": "If that email exists, a reset link has been sent."})


@api_view(["POST"])
@permission_classes([AllowAny])
@throttle_classes([PasswordResetThrottle])
def reset_password(request):
    serializer = ResetPasswordSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    try:
        uid = force_str(urlsafe_base64_decode(serializer.validated_data["uid"]))
        user = User.objects.get(pk=uid, is_active=True)
    except (User.DoesNotExist, ValueError, TypeError) as exc:
        raise ValidationError({"detail": "This reset link is invalid."}) from exc
    if not default_token_generator.check_token(user, serializer.validated_data["token"]):
        raise ValidationError({"detail": "This reset link has expired."})
    user.set_password(serializer.validated_data["new_password"])
    user.save(update_fields=["password"])
    log_action(request, ACTION_PASSWORD_RESET, user, model_name="User")
    # Invalidate all sessions.
    from rest_framework_simplejwt.token_blacklist.models import OutstandingToken

    with contextlib.suppress(Exception):
        for token in OutstandingToken.objects.filter(user=user):
            with contextlib.suppress(TokenError):
                RefreshToken(token.token).blacklist()
    return Response({"detail": "Password reset. You can sign in now."})


class UserViewSet(viewsets.ModelViewSet):
    """User management — super_admin only, with guard-rails."""

    queryset = User.objects.all().order_by("-date_joined")
    permission_classes = [IsAuthenticated, IsSuperAdmin]

    def get_serializer_class(self):
        if self.action in {"create", "update", "partial_update"}:
            return UserWriteSerializer
        return UserSerializer

    def perform_destroy(self, instance):
        _guard_last_super_admin(instance, "delete")
        log_action(self.request, ACTION_DEACTIVATE, instance)
        instance.delete()

    def perform_update(self, serializer):
        instance = self.get_object()
        new_role = serializer.validated_data.get("role", instance.role)
        new_active = serializer.validated_data.get("is_active", instance.is_active)
        if instance.role == User.Role.SUPER_ADMIN and (new_role != instance.role or not new_active):
            _guard_last_super_admin(instance, "demote or deactivate")
        if instance.pk == self.request.user.pk and not new_active:
            raise ValidationError({"detail": "You cannot deactivate yourself."})
        if new_role != instance.role:
            log_action(
                self.request,
                ACTION_ROLE_CHANGE,
                instance,
                changes={"role": {"old": instance.role, "new": new_role}},
            )
        if new_active is False and instance.is_active:
            log_action(self.request, ACTION_DEACTIVATE, instance)
        serializer.save()
        if new_active is False:
            from rest_framework_simplejwt.token_blacklist.models import (
                OutstandingToken,
            )

            for token in OutstandingToken.objects.filter(user=instance):
                with contextlib.suppress(TokenError):
                    RefreshToken(token.token).blacklist()

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated, IsSuperAdmin])
    def logs(self, request):
        """Audit trail (filterable by actor/action)."""
        qs = AdminActionLog.objects.select_related("actor")
        actor = request.query_params.get("actor")
        action = request.query_params.get("action")
        if actor:
            qs = qs.filter(actor__email__icontains=actor)
        if action:
            qs = qs.filter(action=action)
        from core.pagination import LargePagination

        paginator = LargePagination()
        page = paginator.paginate_queryset(qs, request, view=self)
        from .serializers import ActionLogSerializer

        ser = ActionLogSerializer(page, many=True)
        return paginator.get_paginated_response(ser.data)


def _guard_last_super_admin(user: User, verb: str):
    super_admins = User.objects.filter(role=User.Role.SUPER_ADMIN, is_active=True).exclude(
        pk=user.pk
    )
    if not super_admins.exists():
        raise ValidationError({"detail": f"You cannot {verb} the last active super admin."})
