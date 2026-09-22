"""Create the first super admin from environment variables.

Never hardcodes credentials: reads ADMIN_EMAIL / ADMIN_PASSWORD (min 12
chars) from the environment/.env. Idempotent — skips if the email exists or
if any super admin already exists (unless --force-email).
"""

import os

from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = "Create the initial super admin from ADMIN_EMAIL/ADMIN_PASSWORD env vars."

    def add_arguments(self, parser):
        parser.add_argument(
            "--email",
            default=os.environ.get("ADMIN_EMAIL", ""),
            help="Admin email (defaults to $ADMIN_EMAIL).",
        )
        parser.add_argument(
            "--password",
            default=os.environ.get("ADMIN_PASSWORD", ""),
            help="Admin password (defaults to $ADMIN_PASSWORD). Never commit it.",
        )

    def handle(self, *args, **options):
        from django.contrib.auth.password_validation import validate_password
        from django.core.exceptions import ValidationError

        from accounts.models import User

        email = (options["email"] or "").strip().lower()
        password = options["password"] or ""

        if not email or not password:
            raise CommandError(
                "ADMIN_EMAIL and ADMIN_PASSWORD must be set in the "
                "environment (see backend/.env.example)."
            )
        try:
            validate_password(password)
        except ValidationError as exc:
            raise CommandError(f"ADMIN_PASSWORD is too weak: {'; '.join(exc.messages)}") from exc

        if User.objects.filter(email=email).exists():
            self.stdout.write(self.style.WARNING(f"User {email} already exists — nothing to do."))
            return

        user = User.objects.create_superuser(email=email, password=password, name="Super Admin")
        self.stdout.write(
            self.style.SUCCESS(
                f"Created super admin {user.email}. "
                "Sign in at /admin/login and change the password immediately."
            )
        )
