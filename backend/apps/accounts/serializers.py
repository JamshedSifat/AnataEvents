"""Auth serializers: login, token, profile, users, password flows."""

from __future__ import annotations

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from apps.accounts.models import PasswordResetToken, User
from apps.common.validators import validate_phone_bd

MIN_PASSWORD_LENGTH = 12


class UserSerializer(serializers.ModelSerializer):
    """Public-ish representation used by /api/auth/me/ and the users admin."""

    role_display = serializers.CharField(source="get_role_display", read_only=True)
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "full_name",
            "role",
            "role_display",
            "is_active",
            "is_staff",
            "last_login",
            "created_at",
            "updated_at",
            "permissions",
        ]
        read_only_fields = ["id", "last_login", "created_at", "updated_at", "permissions"]

    def get_permissions(self, obj) -> dict:
        return {
            "can_read": obj.is_active,
            "can_write": obj.can_write,
            "can_manage_users": obj.is_super_admin,
        }


class MeSerializer(UserSerializer):
    pass


def validate_strong_password(value: str, user=None) -> str:
    if len(value) < MIN_PASSWORD_LENGTH:
        raise serializers.ValidationError(
            f"Password must be at least {MIN_PASSWORD_LENGTH} characters long."
        )
    try:
        validate_password(value, user)
    except DjangoValidationError as exc:
        raise serializers.ValidationError(list(exc.messages)) from exc
    return value


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True, style={"input_type": "password"}, trim_whitespace=False
    )
    # Honeypot: bots fill every field, humans never see this one.
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)

    def validate(self, attrs):
        attrs["email"] = attrs["email"].strip().lower()
        return attrs


class AnantaTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Adds role claims to the access token (used by DRF's TokenObtainPairView)."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["email"] = user.email
        token["role"] = user.role
        token["full_name"] = user.full_name
        return token


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True, trim_whitespace=False)
    new_password = serializers.CharField(write_only=True, trim_whitespace=False)
    confirm_password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate_current_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Current password is incorrect.")
        return value

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {"confirm_password": "The two password fields did not match."}
            )
        if attrs["new_password"] == attrs["current_password"]:
            raise serializers.ValidationError(
                {"new_password": "Choose a password different from the current one."}
            )
        validate_strong_password(attrs["new_password"], self.context["request"].user)
        return attrs


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)

    def validate_email(self, value):
        return value.strip().lower()


class ResetPasswordSerializer(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, trim_whitespace=False)
    confirm_password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError(
                {"confirm_password": "The two password fields did not match."}
            )
        validate_strong_password(attrs["new_password"])
        return attrs


class AdminUserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    class Meta:
        model = User
        fields = ["id", "email", "full_name", "role", "is_active", "is_staff", "password"]

    def validate_email(self, value):
        value = value.strip().lower()
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_password(self, value):
        validate_strong_password(value)
        return value

    def create(self, validated_data):
        password = validated_data.pop("password")
        return User.objects.create_user(password=password, **validated_data)


class AdminUserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email", "full_name", "role", "is_active", "is_staff"]
        read_only_fields = ["id", "email"]

    def validate(self, attrs):
        request = self.context["request"]
        instance = self.instance
        actor = request.user
        # Guard rails: never lock yourself (or the platform) out.
        if instance.pk == actor.pk:
            if attrs.get("is_active") is False:
                raise serializers.ValidationError(
                    {"is_active": "You cannot deactivate your own account."}
                )
            if "role" in attrs and attrs["role"] != instance.role and not actor.is_super_admin:
                raise serializers.ValidationError({"role": "You cannot change your own role."})
        if (
            instance.is_super_admin
            and (
                attrs.get("role") not in (None, User.Role.SUPER_ADMIN)
                or attrs.get("is_active") is False
                or attrs.get("is_staff") is False
            )
            and User.objects.filter(role=User.Role.SUPER_ADMIN, is_active=True).count() <= 1
        ):
            raise serializers.ValidationError(
                {"role": "This is the last active super admin — promote another one first."}
            )
        return attrs


class AdminPasswordResetSerializer(serializers.Serializer):
    """Super-admin initiated password reset: returns a one-time token for delivery."""

    new_password = serializers.CharField(write_only=True, required=False, trim_whitespace=False)

    def validate_new_password(self, value):
        validate_strong_password(value)
        return value


class PasswordResetTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = PasswordResetToken
        fields = ["id", "user", "created_at", "expires_at", "used_at", "requested_ip"]
        read_only_fields = fields


class PhoneValidatedMixin:
    def validate_phone(self, value):
        validate_phone_bd(value)
        return value
