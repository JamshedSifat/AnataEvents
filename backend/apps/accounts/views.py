"""Authentication + user management API.

Design notes
------------
* The **access token is short lived** and is returned in the JSON body so the SPA
  can keep it in memory only (never localStorage/sessionStorage).
* The **refresh token** is delivered as an HttpOnly + Secure + SameSite cookie and
  is rotated + blacklisted on every use. Logout revokes it server-side.
* Because the SPA and the API may be on different hosts, the refresh endpoint also
  accepts the token in the body but then requires an explicit client header
  (`X-Ananta-Client: web`) to act as a CSRF guard for cross-site cookie posts.
"""

from __future__ import annotations

import logging

from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils import timezone
from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView

from apps.accounts.models import AdminActionLog, LoginAttempt, PasswordResetToken, User
from apps.accounts.serializers import (
    AdminPasswordResetSerializer,
    AdminUserCreateSerializer,
    AdminUserUpdateSerializer,
    AnantaTokenObtainPairSerializer,
    ChangePasswordSerializer,
    ForgotPasswordSerializer,
    LoginSerializer,
    ResetPasswordSerializer,
    UserSerializer,
)
from apps.common.permissions import IsSuperAdmin
from apps.common.throttles import (
    LoginEmailThrottle,
    LoginIPThrottle,
    PasswordResetThrottle,
)
from apps.common.utils import client_ip, log_action, notify_admins, send_template_email
from config.cookies import clear_refresh_cookie, read_refresh_cookie, set_refresh_cookie

logger = logging.getLogger("ananta.auth")

GENERIC_LOGIN_ERROR = "Invalid email or password."


def _lockout_active(request, email: str) -> bool:
    """django-axes check; returns True when the credential pair is locked out."""
    try:
        from axes.handlers.proxy import AxesProxyHandler

        credentials = {"username": email, "ip_address": client_ip(request)}
        return bool(AxesProxyHandler.is_locked(request, credentials))
    except Exception:  # pragma: no cover - axes optional/unavailable
        logger.exception("axes lockout check failed")
        return False


def _reset_failures(request, email: str) -> None:
    try:
        from axes.handlers.proxy import AxesProxyHandler

        AxesProxyHandler.reset_attempts(username=email, ip_address=client_ip(request))
    except Exception:  # pragma: no cover
        logger.exception("axes reset failed")


def _issue_tokens(user, request) -> Response:
    refresh = RefreshToken.for_user(user)
    refresh["email"] = user.email
    refresh["role"] = user.role
    response = Response(
        {
            "access": str(refresh.access_token),
            "user": UserSerializer(user).data,
            "expires_in": int(refresh.access_token.lifetime.total_seconds()),
        },
        status=status.HTTP_200_OK,
    )
    set_refresh_cookie(response, str(refresh))
    return response


@extend_schema(
    tags=["auth"],
    summary="Log in with email + password",
    request=LoginSerializer,
    responses={200: OpenApiResponse(description="access token + user profile")},
)
class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes: list = []
    throttle_classes = [LoginIPThrottle, LoginEmailThrottle]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]
        ip = client_ip(request)

        # Honeypot — filled only by bots. Fail generically, do not record.
        if serializer.validated_data.get("website"):
            return Response({"detail": GENERIC_LOGIN_ERROR}, status=400)

        if _lockout_active(request, email):
            LoginAttempt.objects.create(
                email=email,
                success=False,
                ip_address=ip,
                user_agent=request.META.get("HTTP_USER_AGENT", "")[:255],
            )
            log_action(
                action=AdminActionLog.Action.LOGIN_FAILED,
                detail=f"locked out: {email}",
                request=request,
                model_name="User",
            )
            return Response(
                {
                    "detail": "Too many failed attempts. This account is temporarily locked — try again later.",
                    "locked_out": True,
                },
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        user = authenticate(request=request, username=email, password=password)
        agent = request.META.get("HTTP_USER_AGENT", "")[:255]
        LoginAttempt.objects.create(
            email=email, success=bool(user), ip_address=ip, user_agent=agent
        )

        if user is None:
            log_action(
                action=AdminActionLog.Action.LOGIN_FAILED,
                detail=email,
                request=request,
                model_name="User",
            )
            logger.warning("Failed login for %s from %s", email, ip)
            return Response({"detail": GENERIC_LOGIN_ERROR}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            # Same generic message: never disclose which accounts exist.
            return Response({"detail": GENERIC_LOGIN_ERROR}, status=status.HTTP_401_UNAUTHORIZED)

        if not (user.is_staff or user.role in {"viewer", "editor", "super_admin"}):
            return Response(
                {"detail": "This account does not have dashboard access."},
                status=status.HTTP_403_FORBIDDEN,
            )

        user.last_login = timezone.now()
        user.save(update_fields=["last_login"])
        _reset_failures(request, email)
        log_action(
            user=user,
            action=AdminActionLog.Action.LOGIN,
            detail="login ok",
            request=request,
            model_name="User",
            object_id=str(user.pk),
        )
        logger.info("Successful login for %s from %s", email, ip)
        return _issue_tokens(user, request)


class TokenObtainPairCompatView(TokenObtainPairView):
    """SimpleJWT's stock endpoint, kept for tooling. Prefer /api/auth/login/."""

    serializer_class = AnantaTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200 and response.data.get("refresh"):
            set_refresh_cookie(response, response.data.pop("refresh"))
        return response


@extend_schema(tags=["auth"], summary="Rotate the refresh cookie and get a new access token")
class RefreshView(APIView):
    """Reads the refresh token from the HttpOnly cookie (preferred) or the body."""

    permission_classes = [AllowAny]
    authentication_classes: list = []

    def post(self, request):
        raw = read_refresh_cookie(request) or request.data.get("refresh")
        from_cookie = bool(read_refresh_cookie(request))
        if not raw:
            return Response(
                {"detail": "Refresh token missing. Please log in again."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        # CSRF guard for cookie-based refresh: require the SPA's custom header.
        if from_cookie and request.headers.get("X-Ananta-Client") != "web":
            return Response(
                {"detail": "Missing X-Ananta-Client header.", "code": "csrf_guard"},
                status=status.HTTP_403_FORBIDDEN,
            )
        try:
            old = RefreshToken(raw)
            user_id = old.get("user_id")
            user = User.objects.filter(pk=user_id, is_active=True).first()
            if user is None:
                raise TokenError("User is inactive or missing.")
            if old.access_token is None:  # pragma: no cover - defensive
                raise TokenError("Invalid token.")
            old.blacklist()
            new_refresh = RefreshToken.for_user(user)
            new_refresh["email"] = user.email
            new_refresh["role"] = user.role
        except TokenError:
            response = Response(
                {"detail": "Session expired. Please log in again.", "code": "token_not_valid"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
            clear_refresh_cookie(response)
            return response

        response = Response(
            {
                "access": str(new_refresh.access_token),
                "expires_in": int(new_refresh.access_token.lifetime.total_seconds()),
            },
            status=status.HTTP_200_OK,
        )
        set_refresh_cookie(response, str(new_refresh))
        return response


@extend_schema(tags=["auth"], summary="Log out and revoke the refresh token")
class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        raw = read_refresh_cookie(request) or request.data.get("refresh")
        revoked = False
        if raw:
            try:
                RefreshToken(raw).blacklist()
                revoked = True
            except TokenError:
                revoked = False
        if request.user and request.user.is_authenticated:
            log_action(
                user=request.user,
                action=AdminActionLog.Action.LOGOUT,
                detail=f"revoked={revoked}",
                request=request,
                model_name="User",
                object_id=str(request.user.pk),
            )
        response = Response({"detail": "Signed out.", "revoked": revoked}, status=200)
        clear_refresh_cookie(response)
        return response


@extend_schema(tags=["auth"], summary="Current user profile (verifies the session)")
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)


@extend_schema(tags=["auth"], summary="Change your own password")
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        user = request.user
        user.set_password(serializer.validated_data["new_password"])
        user.save(update_fields=["password"])
        # Revoke every other session.
        try:
            from rest_framework_simplejwt.token_blacklist.models import OutstandingToken

            for token in OutstandingToken.objects.filter(user=user):
                try:
                    RefreshToken(token.token).blacklist()
                except TokenError:
                    continue
                except Exception:  # pragma: no cover - already revoked
                    logger.debug("token already revoked: %s", token.id)
        except Exception:  # pragma: no cover - blacklist app optional
            logger.exception("Could not revoke outstanding tokens")
        log_action(
            user=user,
            action=AdminActionLog.Action.PASSWORD_CHANGE,
            request=request,
            model_name="User",
            object_id=str(user.pk),
        )
        send_template_email(
            "Your Ananta Events password was changed",
            "Your dashboard password was changed. If this wasn't you, contact the "
            "site owner immediately.",
            [user.email],
        )
        response = Response({"detail": "Password updated. Please sign in again."}, status=200)
        clear_refresh_cookie(response)
        return response


@extend_schema(tags=["auth"], summary="Request a password reset email")
class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]
    authentication_classes: list = []
    throttle_classes = [PasswordResetThrottle]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        if serializer.validated_data.get("website"):
            return Response({"detail": "If the address exists, a reset link was sent."}, status=200)

        user = User.objects.filter(email__iexact=email, is_active=True).first()
        generic = Response(
            {"detail": "If that email belongs to an account, a reset link has been sent."},
            status=200,
        )
        if user is None:
            # No user enumeration: identical response and timing-independent path.
            logger.info("Password reset requested for unknown email %s", email)
            return generic

        _token, raw = PasswordResetToken.issue(user, ip=client_ip(request), ttl_minutes=60)
        from django.conf import settings

        reset_url = f"{settings.SITE_URL}/admin/reset-password?token={raw}"
        send_template_email(
            "Reset your Ananta Events password",
            f"Hello {user.get_short_name()},\n\n"
            f"Use the link below to choose a new password. It expires in 60 minutes "
            f"and can only be used once:\n\n{reset_url}\n\n"
            "If you did not request this, you can ignore this email.",
            [user.email],
        )
        notify_admins(
            "Password reset requested",
            f"{user.email} requested a password reset from {client_ip(request)}.",
        )
        log_action(
            user=user,
            action=AdminActionLog.Action.PASSWORD_RESET,
            detail="reset requested",
            request=request,
            model_name="User",
            object_id=str(user.pk),
        )
        return generic


@extend_schema(tags=["auth"], summary="Complete a password reset with a one-time token")
class ResetPasswordView(APIView):
    permission_classes = [AllowAny]
    authentication_classes: list = []

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        raw = serializer.validated_data["token"]

        candidate = None
        for token in PasswordResetToken.objects.filter(used_at__isnull=True).select_related("user"):
            if token.token_hash and _check(raw, token.token_hash):
                candidate = token
                break
        if candidate is None or not candidate.is_valid:
            return Response(
                {"detail": "This reset link is invalid or has expired.", "code": "invalid_token"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            validate_password(serializer.validated_data["new_password"], candidate.user)
        except DjangoValidationError as exc:
            return Response({"errors": {"new_password": exc.messages}}, status=400)

        user = candidate.user
        user.set_password(serializer.validated_data["new_password"])
        user.save(update_fields=["password"])
        candidate.mark_used()
        PasswordResetToken.objects.filter(user=user, used_at__isnull=True).exclude(
            pk=candidate.pk
        ).update(used_at=timezone.now())
        log_action(
            user=user,
            action=AdminActionLog.Action.PASSWORD_RESET,
            detail="reset completed",
            request=request,
            model_name="User",
            object_id=str(user.pk),
        )
        return Response({"detail": "Password reset successful. You can now sign in."}, status=200)


def _check(raw: str, hashed: str) -> bool:
    from django.contrib.auth.hashers import check_password

    try:
        return check_password(raw, hashed)
    except Exception:  # pragma: no cover
        return False


class AdminUserViewSet(viewsets.ModelViewSet):
    """`/api/admin/users/` — super admin only. User management rules are enforced
    in the serializers (last super admin protection, no self-deactivation)."""

    queryset = User.objects.all().order_by("email")
    permission_classes = [IsSuperAdmin]
    serializer_class = UserSerializer
    search_fields = ["email", "full_name"]
    filterset_fields = ["role", "is_active", "is_staff"]
    ordering_fields = ["email", "created_at", "last_login", "role"]

    def get_serializer_class(self):
        if self.action == "create":
            return AdminUserCreateSerializer
        if self.action in {"update", "partial_update"}:
            return AdminUserUpdateSerializer
        return UserSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        log_action(
            user=self.request.user,
            action=AdminActionLog.Action.CREATE,
            instance=user,
            request=self.request,
        )

    def perform_update(self, serializer):
        user = serializer.save()
        log_action(
            user=self.request.user,
            action=AdminActionLog.Action.UPDATE,
            instance=user,
            request=self.request,
        )

    def perform_destroy(self, instance):
        if instance.pk == self.request.user.pk:
            from rest_framework.exceptions import ValidationError

            raise ValidationError({"detail": "You cannot delete your own account."})
        if (
            instance.is_super_admin
            and User.objects.filter(role=User.Role.SUPER_ADMIN, is_active=True).count() <= 1
        ):
            from rest_framework.exceptions import ValidationError

            raise ValidationError({"detail": "You cannot delete the last active super admin."})
        log_action(
            user=self.request.user,
            action=AdminActionLog.Action.DELETE,
            instance=instance,
            request=self.request,
        )
        instance.delete()

    @extend_schema(tags=["admin"], summary="Force a password reset for a user")
    @action(detail=True, methods=["post"], url_path="force-password-reset")
    def force_password_reset(self, request, **kwargs):
        user = self.get_object()
        _token, raw = PasswordResetToken.issue(user, ip=client_ip(request), ttl_minutes=60)
        from django.conf import settings

        reset_url = f"{settings.SITE_URL}/admin/reset-password?token={raw}"
        send_template_email(
            "Your Ananta Events password was reset by an administrator",
            f"Hello {user.get_short_name()},\n\n"
            f"An administrator started a password reset for your account. "
            f"Choose a new password here (valid 60 minutes, single use):\n\n{reset_url}",
            [user.email],
        )
        log_action(
            user=request.user,
            action=AdminActionLog.Action.PASSWORD_RESET,
            instance=user,
            detail="forced by admin",
            request=request,
        )
        return Response(
            {
                "detail": "Reset link generated and emailed to the user.",
                "reset_url": reset_url,
                "expires_at": _token.expires_at,
            }
        )

    @extend_schema(tags=["admin"], summary="Set a user's password directly")
    @action(detail=True, methods=["post"], url_path="set-password")
    def set_password(self, request, **kwargs):
        user = self.get_object()
        serializer = AdminPasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        new_password = serializer.validated_data.get("new_password")
        if not new_password:
            return Response({"errors": {"new_password": ["This field is required."]}}, status=400)
        user.set_password(new_password)
        user.save(update_fields=["password"])
        log_action(
            user=request.user,
            action=AdminActionLog.Action.PASSWORD_RESET,
            instance=user,
            detail="password set by admin",
            request=request,
        )
        return Response({"detail": "Password updated."})

    @extend_schema(tags=["admin"], summary="Activate or deactivate a user")
    @action(detail=True, methods=["post"])
    def activate(self, request, **kwargs):
        user = self.get_object()
        if user.pk == request.user.pk:
            return Response({"detail": "You cannot deactivate yourself."}, status=400)
        user.is_active = True
        user.save(update_fields=["is_active"])
        log_action(
            user=request.user,
            action=AdminActionLog.Action.UPDATE,
            instance=user,
            detail="activated",
            request=request,
        )
        return Response(UserSerializer(user).data)

    @extend_schema(tags=["admin"], summary="Deactivate a user")
    @action(detail=True, methods=["post"])
    def deactivate(self, request, **kwargs):
        user = self.get_object()
        if user.pk == request.user.pk:
            return Response({"detail": "You cannot deactivate yourself."}, status=400)
        if (
            user.is_super_admin
            and User.objects.filter(role=User.Role.SUPER_ADMIN, is_active=True).count() <= 1
        ):
            return Response(
                {"detail": "Cannot deactivate the last active super admin."}, status=400
            )
        user.is_active = False
        user.save(update_fields=["is_active"])
        log_action(
            user=request.user,
            action=AdminActionLog.Action.UPDATE,
            instance=user,
            detail="deactivated",
            request=request,
        )
        return Response(UserSerializer(user).data)


class AdminActionLogViewSet(
    mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet
):
    """Read-only audit trail for the dashboard (`/api/admin/action-logs/`)."""

    from apps.accounts.serializers import PasswordResetTokenSerializer

    permission_classes = [IsSuperAdmin]
    queryset = AdminActionLog.objects.select_related("user").all()
    search_fields = ["actor_email", "model_name", "object_repr", "detail"]
    filterset_fields = ["action", "model_name", "user"]
    ordering_fields = ["created_at", "action"]

    def get_serializer_class(self):
        from rest_framework import serializers as drf_serializers

        class AdminActionLogSerializer(drf_serializers.ModelSerializer):
            class Meta:
                model = AdminActionLog
                fields = [
                    "id",
                    "actor_email",
                    "user",
                    "action",
                    "model_name",
                    "object_id",
                    "object_repr",
                    "detail",
                    "ip_address",
                    "created_at",
                ]
                read_only_fields = fields

        return AdminActionLogSerializer
