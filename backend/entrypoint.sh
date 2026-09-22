#!/bin/sh
set -e

echo "Waiting for the database…"
python manage.py wait_db --timeout 60 || true

echo "Running migrations…"
python manage.py migrate --noinput

echo "Collecting static files…"
python manage.py collectstatic --noinput

if [ "$SEED_ON_START" = "1" ]; then
  echo "Seeding demo content…"
  python manage.py seed_demo_data || echo "Seed skipped/failed — continuing."
fi

if [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_PASSWORD" ]; then
  echo "Ensuring initial admin exists…"
  python manage.py create_initial_admin || true
fi

echo "Starting gunicorn…"
exec gunicorn config.wsgi:application \
  --bind 0.0.0.0:8000 \
  --workers "${GUNICORN_WORKERS:-3}" \
  --timeout 60 \
  --access-logfile - \
  --error-logfile -
