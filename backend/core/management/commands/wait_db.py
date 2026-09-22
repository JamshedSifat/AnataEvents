"""Wait until the configured database accepts connections."""

import time

from django.core.management.base import BaseCommand
from django.db import connections


class Command(BaseCommand):
    help = "Wait for the database to become available (used by the Docker entrypoint)."

    def add_arguments(self, parser):
        parser.add_argument("--timeout", type=int, default=60)

    def handle(self, *args, **options):
        timeout = options["timeout"]
        start = time.time()
        while time.time() - start < timeout:
            try:
                for conn in connections.all():
                    conn.ensure_connection()
                self.stdout.write(self.style.SUCCESS("Database available."))
                return
            except Exception as exc:  # noqa: BLE001
                self.stdout.write(f"  waiting for db… ({exc.__class__.__name__})")
                time.sleep(1)
        self.stderr.write("Timed out waiting for the database — continuing anyway.")
