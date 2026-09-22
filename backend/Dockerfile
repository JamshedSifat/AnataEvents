# Ananta Events — backend image
# Build from the repository root:
#   docker build -f backend/Dockerfile -t ananta-backend .
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends libpq5 curl \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install -r requirements.txt

# Backend code + the frontend public/ JSON data used by seed_demo_data.
COPY backend/ /app/backend/
COPY public/ /app/public/

WORKDIR /app/backend

RUN chmod +x entrypoint.sh && python manage.py collectstatic --noinput --skip-checks || true

EXPOSE 8000

ENTRYPOINT ["./entrypoint.sh"]
