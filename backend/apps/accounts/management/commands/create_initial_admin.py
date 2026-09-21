"""Create the first super admin from ADMIN_EMAIL/ADMIN_PASSWORD (idempotent).

No credentials are ever hardcoded: they must come from the environment or an
interactive prompt. Weak passwords are refused.
"""

from __future__ import annotations

import getpass
import os

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.management.base import BaseCommand, CommandError

from apps.accounts.models import User

MIN_LENGTH = 12


class Command(BaseCommand):
    help = (
        "Create or update the initial super-admin account. Reads ADMIN_EMAIL and "
        "ADMIN_PASSWORD from the environment, or prompts (no echo) when missing. "
        "Idempotent: re-running promotes/updates the same account."
    )

    def add_arguments(self, parser):
        parser.add_argument("--email", default=os.environ.get("ADMIN_EMAIL", ""))
        parser.add_argument("--full-name", default=os.environ.get("ADMIN_FULL_NAME", ""))
        parser.add_argument(
            "--password",
            default=os.environ.get("ADMIN_PASSWORD", ""),
            help="Prefer ADMIN_PASSWORD in the environment: CLI args leak to `ps`.",
        )
        parser.add_argument(
            "--no-input",
            action="store_true",
            help="Never prompt; fail instead when credentials are missing.",
        )

    def handle(self, *args, **options):
        email = (options["email"] or "").strip().lower()
        password = options["password"] or ""
        no_input = options["no_input"]

        if not email:
            if no_input:
                raise CommandError("ADMIN_EMAIL is required (or pass --email).")
            email = input("Admin email: ").strip().lower()
        if not email or "@" not in email:
            raise CommandError("A valid email address is required.")

        if not password:
            if no_input:
                raise CommandError("ADMIN_PASSWORD is required (or pass --password).")
            password = getpass.getpass("Admin password (min 12 chars, hidden): ")
            confirm = getpass.getpass("Confirm password: ")
            if password != confirm:
                raise CommandError("Passwords did not match.")

        self._validate_password(password, email)

        existing = User.objects.filter(email__iexact=email).first()
        if existing:
            existing.role = User.Role.SUPER_ADMIN
            existing.is_staff = True
            existing.is_active = True
            existing.is_superuser = True
            if options["full_name"]:
                existing.full_name = options["full_name"]
            existing.set_password(password)
            existing.save()
            self.stdout.write(
                self.style.WARNING(f"Updated existing super admin {email} (password rotated).")
            )
            return

        User.objects.create_superuser(
            email=email,
            password=password,
            full_name=options["full_name"] or "Super Admin",
            role=User.Role.SUPER_ADMIN,
        )
        self.stdout.write(self.style.SUCCESS(f"Created super admin {email}."))

    def _validate_password(self, password: str, email: str) -> None:
        if len(password) < MIN_LENGTH:
            raise CommandError(
                f"Password must be at least {MIN_LENGTH} characters (got {len(password)})."
            )
        try:
            validate_password(password, User(email=email))
        except ValidationError as exc:
            raise CommandError("Weak password: " + " ".join(exc.messages)) from exc
