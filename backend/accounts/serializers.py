from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from core.audit import ACTION_LOGIN, ACTION_LOGIN_FAILED, log_action
from core.serializers import CamelCaseMixin
from core.utils import validate_bd_phone

from .models import AdminActionLog, User

GENERIC_CREDENTIALS_ERROR = "Invalid email or password."


class LoginTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Login with email + password; enforces lockout; audits attempts.

    Emits ONE generic error for wrong credentials / unknown user / locked
    account so attackers cannot enumerate accounts.
    """

    default_error_messages = {"no_active_account": GENERIC_CREDENTIALS_ERROR}

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        token["name"] = user.name
        token["email"] = user.email
        return token

    def validate(self, attrs):
        request = self.context.get("request")
        email = (attrs.get("email") or "").strip().lower()
        password = attrs.get("password") or ""

        from django.conf import settings
        from django.core.cache import cache

        lock_key = f"login-lock:{email}"
        if cache.get(lock_key):
            raise serializers.ValidationError({"detail": GENERIC_CREDENTIALS_ERROR})

        user = authenticate(request, username=email, password=password)
        if user is None:
            failures = cache.get(f"login-fails:{email}", 0) + 1
            if failures >= settings.LOGIN_MAX_ATTEMPTS:
                cache.set(lock_key, 1, timeout=settings.LOGIN_LOCKOUT_MINUTES * 60)
                cache.delete(f"login-fails:{email}")
            else:
                cache.set(
                    f"login-fails:{email}",
                    failures,
                    timeout=settings.LOGIN_LOCKOUT_MINUTES * 60,
                )
            if request:
                log_action(request, ACTION_LOGIN_FAILED, model_name="User", object_id=email)
            self.fail("no_active_account")

        if not user.is_active:
            self.fail("no_active_account")

        cache.delete(f"login-fails:{email}")
        cache.delete(lock_key)
        if request:
            log_action(request, ACTION_LOGIN, user, actor=user)
        data = super().validate({User.USERNAME_FIELD: user.email, "password": password})
        data["user"] = UserSerializer(user).data
        return data


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "name",
            "role",
            "phone",
            "is_active",
            "date_joined",
        ]
        read_only_fields = ["id", "date_joined"]


class UserWriteSerializer(serializers.ModelSerializer):
    """Creating/updating staff users (super_admin only)."""

    password = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True,
        style={"input_type": "password"},
        help_text="Required on create; min 12 chars. Optional on update "
        "(omit to keep the current password).",
    )

    class Meta:
        model = User
        fields = ["id", "email", "name", "role", "phone", "is_active", "password"]
        read_only_fields = ["id"]

    def validate_email(self, value):
        return value.strip().lower()

    def validate_phone(self, value):
        if value:
            validate_bd_phone(value)
        return value

    def validate(self, attrs):
        if self.instance is None and not attrs.get("password"):
            raise serializers.ValidationError(
                {"password": "Password is required when creating a user."}
            )
        if attrs.get("password"):
            validate_password(attrs["password"], self.instance)
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")
        return User.objects.create_user(password=password, **validated_data)

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)
            user.save(update_fields=["password"])
        return user


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)

    def validate_current_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value

    def validate_new_password(self, value):
        validate_password(value, self.context["request"].user)
        return value

    def save(self, **kwargs):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save(update_fields=["password"])
        return user


class ActionLogSerializer(CamelCaseMixin, serializers.ModelSerializer):
    actor_email = serializers.EmailField(source="actor.email", read_only=True, default=None)

    class Meta:
        model = AdminActionLog
        fields = [
            "id",
            "actor",
            "actor_email",
            "action",
            "model_name",
            "object_id",
            "object_repr",
            "changes",
            "ip_address",
            "created_at",
        ]


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ResetPasswordSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True)

    def validate_new_password(self, value):
        validate_password(value)
        return value
