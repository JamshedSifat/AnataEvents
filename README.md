# Ananta Events — website + admin dashboard

Full-stack rebuild of the Ananta Events site: the existing React 19 / Vite /
Tailwind frontend (kept at the repository root so the Vercel deployment keeps
working) now talks to a production-ready Django + PostgreSQL API in
[`backend/`](backend/), with a real, server-enforced admin dashboard.

```
AnataEvents/
├── src/                 React 19 SPA (public pages + admin dashboard)
├── public/              static assets (images, legacy JSON, robots.txt, sitemap.xml)
├── backend/             Django 5 + DRF + PostgreSQL API
├── docs/SECURITY.md     compromised-credential history + hardening notes
├── AUDIT.md             Phase 0 audit: every issue found, file:line, severity
└── vercel.json          /api/* proxy (before the SPA fallback) + build config
```

---

## 1. Quick start

### Backend (Docker — recommended)

```bash
cd backend
cp .env.example .env          # set DJANGO_SECRET_KEY, ADMIN_EMAIL, ADMIN_PASSWORD
docker compose up --build     # Django + PostgreSQL
docker compose exec web python manage.py create_initial_admin   # first super admin
docker compose exec web python manage.py seed_demo_data         # optional demo content
```

The API is then on <http://localhost:8000>:

| URL | What |
| --- | --- |
| `/api/health/` | liveness/readiness probe |
| `/api/docs/` | Swagger UI (OpenAPI schema at `/api/schema/`) |
| `/api/services/`, `/api/artists/`, `/api/blogs/`, … | public read-only content |
| `/api/contact/`, `/api/artist-bookings/`, … | throttled public form endpoints |
| `/api/auth/login/`, `/api/auth/refresh/`, … | JWT auth |
| `/api/admin/...` | staff-only CRUD, review workflow, dashboard stats |
| `/django-admin/` | Django's own admin (CSV export + image previews) |

### Backend (without Docker)

```bash
python3.11 -m venv .venv && . .venv/bin/activate
pip install -r backend/requirements-dev.txt
export DATABASE_URL=postgresql://ananta:ananta@localhost:5432/ananta
export DJANGO_SECRET_KEY=dev-secret-change-me
cd backend
python manage.py migrate
python manage.py create_initial_admin --no-input     # ADMIN_EMAIL / ADMIN_PASSWORD env vars
python manage.py seed_demo_data                      # optional
python manage.py runserver 0.0.0.0:8000
```

### Frontend

```bash
cp .env.example .env      # VITE_API_BASE_URL=/api, VITE_DEV_API_TARGET=http://localhost:8000
npm install
npm run dev               # http://localhost:5173 (proxies /api to Django)
npm run build             # production bundle
npm run lint
npm run test              # vitest + testing-library
```

---

## 2. How the pieces fit together

### Authentication (no demo credentials anywhere)

* `POST /api/auth/login/` returns a **10-minute access token** (kept in memory
  only) and sets a **7-day rotating refresh token** in an
  `HttpOnly + Secure + SameSite=Strict` cookie scoped to `/api/auth/`.
* Cookie-based refresh/logout additionally require the `X-Ananta-Client: web`
  header, so a cross-site request cannot rotate the session.
* `vercel.json` proxies `/api/*` to the backend **before** the SPA catch-all, so
  the cookie is first-party in production; the Vite dev server mirrors this.
* `AuthProvider` never trusts client state: it rotates the cookie and calls
  `GET /api/auth/me/` before marking the session authenticated. The old
  `localStorage["admin"]` flag is purged on boot and grants nothing (regression
  test in `src/test/authGuard.test.jsx`).
* Roles: **viewer** (read-only), **editor** (write/publish), **super admin**
  (users + audit log). Enforced by DRF permission classes; the SPA only hides UI.
* `django-axes` locks an IP+username for one hour after 5 failed logins, login is
  throttled per IP *and* per email, and every auth event is logged.
* Password reset issues hashed, single-use, 60-minute tokens and never reveals
  whether an address exists. Password changes revoke all other sessions.
* The SPA signs out after 30 minutes idle. See `docs/SECURITY.md` for the full
  policy, including the history rewrite the repository owner still has to run.

### Data flow

Pages call typed helpers in `src/services/` (`content`, `forms`, `admin`,
`auth`) through one axios instance (`src/services/api.js`) that injects the
access token, refreshes transparently on 401 and normalises errors to
`{detail, errors}`. `useApiResource` (public pages) and `useCrud`
(admin pages) provide loading/error/empty states; `ResourceManager` renders a
full CRUD table (search, filters, pagination, multipart uploads, publish
toggles, reordering, bulk delete) from a field/column config, and
`SubmissionManager` handles the review workflow.

### SEO & routing

Every route is lazy-loaded, has a unique title/description/OG block
(`src/components/Seo.jsx`), admin pages are `noindex`. `robots.txt` and
`sitemap.xml` live in `public/`. All URLs are kebab-case and slug-based; every
URL from the old build redirects (`/About`, `/blog/:id`, `/services/CorporateEvent`,
`/services/Photography&VedioServices/:id`, `/bookAnArtists/*`, `/media/video`, …).

---

## 3. Commands reference

| Command | Purpose |
| --- | --- |
| `python manage.py create_initial_admin` | idempotent first super admin (env vars or hidden prompt; refuses passwords < 12 chars) |
| `python manage.py seed_demo_data [--reset] [--skip-existing]` | imports all original site content (services, 7 special events, 52 artists, blogs, gallery, videos, FAQs, jobs, …) |
| `pytest --cov` | backend test suite (>80% gate, currently 93.8%) |
| `ruff check .` / `black .` | backend lint/format |
| `python manage.py export_*` | not used — CSV export lives in the Django admin actions |
| `npm run test` | frontend unit tests (vitest) |

---

## 4. Deployment

1. **Backend** (Render/Railway/Fly): build `backend/Dockerfile`, start
   `backend/docker-entrypoint.sh` (migrate → collectstatic → gunicorn), set
   `DATABASE_URL`, `DJANGO_SECRET_KEY`, `DJANGO_ALLOWED_HOSTS`,
   `CORS_ALLOWED_ORIGINS`/`DJANGO_CSRF_TRUSTED_ORIGINS` (the Vercel domain),
   `ADMIN_EMAIL`/`ADMIN_PASSWORD` (first boot only), SMTP settings, and
   `STORAGE_BACKEND=cloudinary` (or `s3`) for media.
2. **Frontend** (Vercel): keeps its root build. Update the `destination` in
   `vercel.json` to the real API host. Do not remove the `/api/:path*` rewrite
   and keep it **above** the catch-all.
3. Run `create_initial_admin` on the deployed instance, then delete
   `ADMIN_PASSWORD` from the environment.
4. CI (`.github/workflows/ci.yml`) runs lint/build/tests for the frontend, the
   Django test suite with coverage against PostgreSQL, and a gitleaks scan.

---

## 5. Assumptions (decisions taken where the brief was ambiguous)

1. **Brand name.** The repository is `AnataEvents`, but every user-facing string
   says **“Ananta Events”** (matching the existing content and `anantabd.net`);
   only infrastructure identifiers keep the old spelling.
2. **Frontend stays at the root.** The backend lives in `/backend` so the
   existing Vercel project (root directory, `npm run build`) keeps deploying.
3. **Same-origin API proxy.** `/api/*` is proxied through the frontend host
   rather than calling the backend origin directly, because that is the only way
   to keep the HttpOnly refresh cookie first-party without a custom domain.
4. **`react-helmet-async` replaced by `src/components/Seo.jsx`.** Helmet v2 does
   not support React 19 without `--legacy-peer-deps`; the equivalent behaviour is
   implemented with ~60 lines and no dependency.
5. **Special-event detail pages.** The seven `SpecialEvent*Detail` components
   render the same design they did before, now dispatched by the dynamic
   `:slug` route. Their page copy has **not** been moved into the database yet:
   an automated comparison showed the API payload covers only part of each page's
   text, and replacing them would therefore have changed the visible content
   (the brief requires identical rendering). Moving that copy into `ServiceEntry`
   records is the documented follow-up in `AUDIT.md` (H1).
6. **Admin UI is config-driven.** Bespoke per-page tables/forms were replaced by
   `ResourceManager`/`SubmissionManager` with the same Tailwind/daisyUI look;
   this is what makes every admin screen a real, server-enforced CRUD screen.
7. **Django admin is secondary.** The SPA is the primary admin tool; Django's
   admin remains available for bulk operations, CSV export and emergency edits.
8. **Demo data.** `seed_demo_data` imports the content that used to live in
   components/localStorage so the site looks identical after the switch; it is
   optional and idempotent, and it is never run automatically in production.
9. **Uploads.** Images accept a file upload *or* a URL, because the original
   content references remote CDN URLs that were never in the repository.
10. **`vercel.json` API host.** The rewrite target is a placeholder
    (`ananta-events-api.onrender.com`) until the backend has a production host.
11. **Known gaps.** `npm run lint` still reports 87 errors / 23 warnings in
    legacy presentational files (unused imports, index keys, console statements)
    — see the TODO list below and `AUDIT.md`.

---

## 6. TODO / next steps

* Move the special-event page copy into `ServiceEntry` records, verify the render
  diff, then delete the seven static components (AUDIT H1).
* Burn down the ESLint backlog (unused vars, `key={index}`, `console.*`).
* Point `vercel.json` at the real API host and add the production domain to
  `DJANGO_ALLOWED_HOSTS` / `DJANGO_CSRF_TRUSTED_ORIGINS`.
* Rewrite git history for the leaked demo credentials (`docs/SECURITY.md`) and
  rotate any secret that ever touched the repository.
* Add e2e coverage (Playwright) for the booking and contact flows.

## 7. License

Private project — © Ananta Events. All rights reserved.
