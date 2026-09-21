#!/usr/bin/env bash
# Applies migrations (and optionally seeds content) before starting the API.
set -euo pipefail

echo "==> Waiting for PostgreSQL"
python - <<'PY'
import os, time, sys
import psycopg
url = os.environ["DATABASE_URL"]
for attempt in range(30):
    try:
        psycopg.connect(url, connect_timeout=3).close()
        print("    database reachable")
        break
    except Exception as exc:  # noqa: BLE001
        print(f"    attempt {attempt + 1}/30: {exc}")
        time.sleep(2)
else:
    sys.exit("Database never became reachable — check DATABASE_URL and the db service.")
PY

echo "==> Applying migrations"
python manage.py migrate --noinput

echo "==> Collecting static files"
python manage.py collectstatic --noinput >/dev/null

if [ "${SEED_DEMO_DATA:-False}" = "True" ]; then
  echo "==> Seeding demo content (idempotent)"
  python manage.py seed_demo_data --skip-existing
fi

if [ -n "${ADMIN_EMAIL:-}" ] && [ -n "${ADMIN_PASSWORD:-}" ]; then
  echo "==> Ensuring initial super admin exists"
  python manage.py create_initial_admin --no-input || true
fi

echo "==> Starting gunicorn"
exec gunicorn config.wsgi:application \
  --bind 0.0.0.0:8000 \
  --workers "${GUNICORN_WORKERS:-3}" \
  --timeout 60 \
  --access-logfile -
