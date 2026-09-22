# Ananta Events — Codebase Audit

Date: 2026-09-21 · Scope: `src/`, `public/`, root config files at commit `dae1e13` ("influencer admin").
Severity: 🔴 critical · 🟠 high · 🟡 medium · ⚪ low/info.

---

## 1. Security

| # | Location | Severity | Finding |
|---|----------|----------|---------|
| S-1 | `src/Auth/Pages/AdminLogin.jsx:33-41, 96-98` | 🔴 | Admin credentials **hardcoded in source** (`admin@ananta.com` / `admin123`) and displayed on the login page as "Demo Credentials". Anyone can open `/admin/login`, read the creds from the page itself, and get full dashboard access. |
| S-2 | `src/Auth/Context/AuthContext.jsx:9-19` | 🔴 | "Session" is `localStorage.getItem('admin')`. Any visitor can run `localStorage.setItem('admin','{"role":"Super Admin"}')` in devtools and the client-side `ProtectedRoute` grants the whole dashboard UI. |
| S-3 | `src/Componetns/ProtectedRoute.jsx:11-21` | 🔴 | Route protection is **client-side only**; there is no server, no session check, no role verification. Forging the flag (S-2) grants everything. |
| S-4 | `src/Admin/pages/Services/serviceApi.js:6` (dead file) | 🟠 | Reference to `localStorage.getItem('token')` — a JWT-in-localStorage pattern that must never ship. File is dead code (fully commented). |
| S-5 | `src/Auth/Context/AuthContext.jsx`, `ServiceContext.jsx` | 🔴 | All admin "CRUD" (services, hero, artists, …) persists to `localStorage` only — data is per-browser, invisible to other admins and to the public site, and silently lost. |
| S-6 | `src/Pages/Opportunities/*` (ArtistRegistration 79-96, TalentHunt, VendorRegistration) | 🔴 | Public registration forms write applicant PII into the *submitter's own* localStorage — nothing is transmitted; leads are never received by the company. |
| S-7 | Root: `netlify.toml` **and** `vercel.json` | 🟡 | Two conflicting SPA-rewrite configs; site is deployed on Vercel, so `netlify.toml` is dead config that confuses deploys. Also both only rewrite `/*` → `/index.html`, so `/api/*` cannot be proxied to a backend. |
| S-8 | `index.html:7` | 🟡 | Generic title "Event Management Company"; no meta description, no OG tags, no per-route SEO. |
| S-9 | Repo | 🟠 | No `.env.example`, no secret management; the pattern (hardcoded creds) invites committing secrets. No gitleaks/secret scanning. |

## 2. Data sources per page (before backend)

**Hardcoded sample data seeded into localStorage on first run (admin + public read the same key):**

| localStorage key | Writer (admin) | Readers (public) |
|---|---|---|
| `admin` | AuthContext | ProtectedRoute |
| `anataServices` | ServiceContext | (none — orphaned context) |
| `services` | `Admin/pages/Services/ServiceManagement.jsx` | `Componetns/Services/Services.jsx` (filters `status==='active'` but seed uses `'Active'` → **public /services renders empty**, 🟠 bug) |
| `heroSlides` | `Admin/Components/Home/AdminHero.jsx` | `Componetns/Hero/Hero.jsx` |
| `singers` | `…/SingerManagement.jsx` | `Pages/BookAnArtists/Singers/Singer.jsx` |
| `djs` | `…/DjManagement.jsx` | `Pages/BookAnArtists/Dj/Dj.jsx` |
| `comedians` | `…/ComedianManagement.jsx` | `Pages/BookAnArtists/Comedian/Comedian.jsx` |
| `magicians` | `…/MagicianManagement.jsx` | `Pages/BookAnArtists/Magician/Magician.jsx` |
| `dancers` | `…/DancerManagement.jsx` | `Pages/BookAnArtists/Dancer/Dancer.jsx` |
| `influencers` | `Admin/Components/AdminInfluencer/AdminInfluencers.jsx` | `…/InfluencerList/InfluencerList.jsx` |
| `medias` | `AdminMediaGellary/MediaManagement.jsx` | `Pages/Media/MediaGellary/MediaGellary.jsx` |
| `videos` | `AdminMediaGellary/VideoManagement.jsx` | `Pages/Media/MediaVideo/MediaVideo.jsx` |
| `testimonials` | `Testimonal/TestimonialManagement.jsx` | `Componetns/Testimonials/Testimonials.jsx` |
| `teamMembers` | `Team/TeamManagement.jsx` | `Pages/About/MyTeam/MyTeam.jsx` |
| `careerJobs`, `careerApplications` | `AdminCarearOportunity/CareerManagement.jsx` | `Pages/Opportunities/CareerOpportunities/` (jobs + applications both localStorage) |
| `blogs` | `Blog/BlogManagement.jsx` (seeded from `public/Blog.json` import) | `Pages/BlogItems/PostCard.jsx`, `PostCardDetails.jsx`, `RecentBlogPost.jsx`, `Pages/BlogDetails/` (fetches `/blogs.json`) |
| `portfolios` | `AdminProtfolio/ProtfolioManagement.jsx` | `Pages/Portfolio/Portfolio.jsx` |
| `vendors` | `AdminOpportunity/Vendor/VendorManagement.jsx` | `Pages/Opportunities/VendorRegistration/` (submissions) |
| `artists` | `AdminOpportunity/Artists/AdminArtists.jsx` | `Pages/Opportunities/ArtistRegistration/` (submissions) |
| `talents` | `AdminOpportunity/TalentHunt/AdminTalentHunt.jsx` | `Pages/Opportunities/TalentHunt/` (submissions) |
| `corporateEvents` | `AdminCorporoateEvents/AdminCorporateEvents.jsx` | `Componetns/Services/CorporateEvent/*` |
| `exhibitionStallDesigns`, `exhibitionEvents` | `ExhibitionStall/AdminExhibitionStall.jsx` | `Componetns/Services/BestExhibitionStallDesgin/*` |
| `homeFAQs` / `corporateFAQs` | `AdminFAQ/HomeFAQ.jsx` (storageKey prop) | `Componetns/FAQ/HomeFAQ.jsx`, `CorporateFAQ.jsx` |

**Statically imported JSON (bundled, no admin control):**
- `public/Blog.json` → `Blog/BlogManagement.jsx`, `Pages/BlogItems/PostCard.jsx`, `PostCardDetails.jsx`
- `public/CorporateEvents/CorporateEvents.json` → `CorporateEvent/*`
- `public/ExhibitionStallData/ExhibitionStallData.json` → `ExhibitionStall` admin + `BestExhibitionStallDesgin/*`
- `public/About/About.json` → About stats/team/values

**Runtime `fetch('/…')` of public JSON:** `/blogs.json`, `/gallery.json`, `/Testimonals.json`, `/Services/SpecialEvent.json` (7 detail components + list), `/About/About.json`, `/SingersData/singersData.json`.

**Fully hardcoded UI data:** `Admin/pages/Dashboard.jsx` (fake stats: 125 events, ৳2.5L revenue), `Admin/pages/Users/UsersList.jsx` (3 fake users), `Admin/pages/Events/EventsList.jsx` + `AddEvent.jsx` (fake events, `alert()` on save), `Admin/pages/Media/MediaList.jsx` (fake media, `alert()` upload), `Componetns/WhyChooseUs`, `OurClients`, `About/*` copy, `Footer` (contact info), `QueryModal` (phone/WhatsApp constants).

## 3. Forms

| Form | File | Current behaviour |
|---|---|---|
| Admin login | `Auth/Pages/AdminLogin.jsx` | Hardcoded check + 500 ms fake delay |
| Contact | `Componetns/Contacts/ContactForm.jsx` | `console.log` only — message lost |
| Query modal | `Componetns/QueryModal/QueryModal.jsx` | Toast "submitted" but sends nothing |
| Artist registration | `Pages/Opportunities/ArtistRegistration/` | localStorage only |
| Talent hunt | `Pages/Opportunities/TalentHunt/` | localStorage only |
| Vendor registration | `Pages/Opportunities/VendorRegistration/` | localStorage only (files base64'd) |
| Job application | `Pages/Opportunities/CareerOpportunities/` | localStorage only |
| Newsletter | `Componetns/Footer/Footer.jsx` | No handler |
| Add event | `Admin/pages/Events/AddEvent.jsx` | `alert()` + fake navigate |
| All admin CRUD forms | `src/Admin/**` | localStorage read/write |

## 4. Router / UX

- 🔴 No `errorElement` anywhere; `createBrowserRouter` without a catch-all `*` → **unknown URLs render a blank page** (no 404).
- 🔴 `/admin` (exact) has no index route → **blank screen**; only `/admin/login` and `/admin/dashboard/*` exist.
- 🟠 Mixed-case / inconsistent URLs: `/About`, `/bookAnArtists`, `/services/CorporateEvent`, `/services/BestExhibitionStallDesgin` (typo "Desgin"), `/services/InfluencerMarketingAgency`, `/services/SingerAndCelebrityBooking`, `/services/WeddingPlanner&Management` (**raw `&` in path**), `/services/Photography&VedioServices` (**`&` + "Vedio" typo**).
- 🟠 Inconsistent id strategy: `/services/corporate-events/:id` and `/services/exhibition-events/:id` are documented as numeric but the seeded data uses **slugs** (`_id: "top-10-event-management-companies…"`); `/media/blog/:id` likewise receives slugs.
- 🟠 7 static special-event routes (`/services/SpecialEvent/award-show` … `-sports-management`) duplicate the dynamic `/services/SpecialEvent/:eventId` route; each static page re-fetches the same JSON.
- 🟡 Titles set via `loader` functions returning `null` — works, but no meta description/OG, and admin pages have no `noindex`.
- 🟡 ~90 static route imports, zero `React.lazy` → **single 1.1 MB JS chunk** (build warning >500 kB).
- 🟡 `Media.jsx` lazy-imports `Gallary`, `BlogCardItem`, `MediaVideo` while they are also statically imported elsewhere (chunking defeated, build warnings).
- ⚪ Dead commented code: `Router/Route.jsx` (blog routes, CorporateFAQ import), `Admin/pages/Services/serviceApi.js` (whole file), `App.jsx` (entire Vite starter component unused by router), `src/assets/react.svg`, `public/vite.svg`.

## 5. Code quality / structure

- 🟠 Typo'd folders: `Componetns` (Components), `MediaGellary` (Gallery), `AdminProtfolio/ProtfolioManagement` (Portfolio), `PhotographyVedioServices`/`MarketingVedio` (Video), `BestExhibitionStallDesgin` (Design), `AdminCarearOportunity` (CareerOpportunity), `AdminCorporoateEvents` (CorporateEvents), `Testimonal` (Testimonial).
- 🟠 Duplicate data key `corporateEvents` reused for **exhibition stalls** (`ExhibitionStall/AdminExhibitionStall.jsx`) — cross-contamination of content types.
- 🟡 `console.log` noise in ~30 files; `window.confirm` for destructive actions with no undo.
- 🟡 Lint baseline: **73 errors, 8 warnings** (`npm run lint`), mostly `react-hooks/exhaustive-deps`, unused vars, `react-refresh/only-export-components`.
- 🟡 Build baseline: succeeds; bundle 1,098.85 kB (255 kB gzip) — single chunk.
- ⚪ Duplicated CRUD boilerplate ×22 admin pages (copy-pasted load/save/handlers) instead of shared abstraction.
- ⚪ `public/public/_redirects` nested duplicate; `public/_redirects` is a Netlify artifact on a Vercel deployment.
- ⚪ `index.html` favicon points at `/src/assets/Ananta_Logo.png` (works in dev, removed in build — Vite copies imported assets, not `src/`-referenced strings; should live in `public/`).
- ⚪ Several `via.placeholder.com` images (service down at times) and external hotlinks; no `alt` on a handful of decorative imgs (most have alt).
- ⚪ Admin pages hard-code `ml-64` etc. that assume a fixed sidebar; responsiveness of admin tables is weak on mobile.

## 6. Top risks if shipped as-is

1. Anyone can "log in" with printed-on-the-page credentials and the full dashboard is forgeable via localStorage (no server at all).
2. Every lead/registration/application submitted by the public is **stored only in the visitor's browser** — the business never receives it.
3. Public `/services` shows an empty grid due to `Active` vs `active` mismatch.
4. No 404: any typo'd URL silently renders a blank page.

## 7. Remediation plan (implemented in this branch)

Backend (Django 5 + DRF + PostgreSQL) in `/backend` with JWT-in-memory + rotating HttpOnly refresh cookie, role-based admin APIs, public read APIs, throttled/honeypotted submission endpoints, seed command importing all current content, Docker, tests, CI. Frontend rewired to the API: real auth (`/me` session verification, 403 page), loading/empty/error states everywhere, forms POST to the API with server field errors, 404 + errorElement, lowercase-kebab URLs with redirects from all legacy URLs, lazy-loaded routes, helmet SEO, robots/sitemap, folder renames, dead code removal, `netlify.toml` removal, `/api` Vercel rewrite before the SPA catch-all. Details and assumptions: `README.md`.
