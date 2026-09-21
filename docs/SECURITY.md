# Security notes — Ananta Events

## 1. Compromised credentials inherited from the previous build

The pre-rewrite admin page (`src/Auth/Pages/AdminLogin.jsx`) shipped a **hardcoded
demo login**:

| What | Value |
| --- | --- |
| Email | `admin@ananta.com` |
| Password | `admin123` |
| Storage | `localStorage["admin"]` (forgeable, no server check) |

Anybody who read the source could sign in to the admin UI, and anybody could
manually set that localStorage key. It is treated as **compromised and public**.

### What we changed in code (done)

* The hardcoded credentials and the fake `login()` were deleted.
* `AuthProvider` only marks a session authenticated after
  `GET /api/auth/me/` succeeds against the API; `localStorage` is never trusted.
* `purgeLegacyStorage()` deletes the old keys (`admin`, `token`, `services`, …)
  on every app start so a previously poisoned browser grants nothing.
* `ProtectedRoute` requires a server-verified session and, where relevant, the
  `super_admin` role; the API enforces it independently (viewer/editor/super_admin).
* Accounts come from `python manage.py create_initial_admin` (env vars) or from a
  super admin in the dashboard — there are **no seeded credentials** anywhere.

### What the repository owner must still do (we did **not** rewrite history)

The old password is in the public git history (commit `dae1e13`, file
`src/Auth/Pages/AdminLogin.jsx`). Rotating the value is not enough — it must be
removed from history by the owner:

```bash
# 1. Install a history rewriter
pipx install git-filter-repo        # or: brew install git-filter-repo

# 2. Back up first (filter-repo rewrites every commit hash)
git clone --mirror git@github.com:<owner>/AnataEvents.git AnataEvents-backup.git

# 3. Remove the file's old content from all history
git filter-repo --path src/Auth/Pages/AdminLogin.jsx --invert-paths   # oldest path
git filter-repo --path src/Admin/Pages/AdminLogin.jsx --invert-paths
git filter-repo --replace-text <(echo 'admin123==>REDACTED')

# 4. Force-push, then ask GitHub support to drop cached views
git push --force --all && git push --force --tags
```

Alternative: BFG (`bfg --replace-text passwords.txt`). Either way:

* **Rotate every secret that ever touched the repo** (any real SMTP password,
  API key, database password, JWT `DJANGO_SECRET_KEY`).
* Invalidate the account: create the first admin with a new address, and never
  reuse `admin@ananta.com`.
* Announce in the PR that history rewriting is pending so no one rebases on it.

## 2. How authentication works now

* **Access token**: JWT, 10 minutes, held **in memory only** (`tokenStore`).
  A page reload discards it.
* **Refresh token**: 7 days, HttpOnly + Secure (production) + SameSite=Strict
  cookie scoped to `/api/auth/`. Rotated and blacklisted on every refresh
  (`ROTATE_REFRESH_TOKENS`, `BLACKLIST_AFTER_ROTATION`).
* **CSRF guard**: cookie-based refresh/logout additionally require the
  `X-Ananta-Client: web` header, so a cross-site form post cannot rotate a
  session. Django's own CSRF middleware protects the Django admin.
* **Cookies stay first-party**: `vercel.json` rewrites `/api/:path*` to the
  backend **before** the SPA catch-all, so the browser sends the cookie to the
  same origin in production, and the Vite dev proxy mirrors that locally.
* **Lockout & throttling**: `django-axes` locks an IP+username pair for one hour
  after 5 failed logins; DRF throttles login to 5/min per IP and per email,
  public forms to 10/hour per IP, password reset to 5/hour.
* **Passwords**: Argon2 hasher, 12-character minimum, Django's common-password
  and similarity validators, and a check that the new password differs.
* **Reset flow**: single-use tokens stored **hashed** (`make_password`) with a
  60-minute expiry and a constant response ("if the account exists…") so the
  endpoint cannot be used to enumerate users.
* **Session hygiene**: changing a password blacklists every outstanding refresh
  token; logging out blacklists the current one; the SPA signs out after 30
  minutes idle.
* **Audit trail**: logins, failed logins, logouts, password changes, content
  create/update/delete/bulk-delete/reorder and user administration are written
  to `AdminActionLog` (readable at `/admin/dashboard/action-logs`, super admins only).

## 3. Other hardening

* Uploads validated by extension **and** size (images ≤ 5 MB, documents ≤ 10 MB);
  text fields are sanitised with `bleach` (rich text) before storage.
* SQL injection is handled by the ORM; `DATABASE_URL` is the only DB config.
* Production refuses to boot without `DJANGO_SECRET_KEY` and `DJANGO_ALLOWED_HOSTS`,
  and refuses to start with `STORAGE_BACKEND=cloudinary|s3` unless the credentials
  are present.
* Secrets live in environment variables only (`backend/.env` is git-ignored);
  `gitleaks` runs as a pre-commit hook (`.pre-commit-config.yaml`) and in CI.
* Security headers: HSTS (1 year, preload-ready), `nosniff`, `X-Frame-Options: DENY`,
  `Referrer-Policy: same-origin`, SSL redirect and secure cookies in production.

## 4. Reporting

Email `info@ananta-events.com` (or open a private security advisory on GitHub).
Please do not open a public issue for security reports.
