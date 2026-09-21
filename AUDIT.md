# AUDIT.md — Ananta Events (AnataEvents) frontend audit

Audit performed on branch `arena/01a0c50c-anataevents` at commit `dae1e13` ("influencer admin").
Scope: `src/`, `public/`, `index.html`, `vite.config.js`, `package.json`, `vercel.json`, `netlify.toml`.

Commands run at audit time:

| Command | Result |
| --- | --- |
| `npm run build` | **Passes** but emits one 1,098.85 kB JS chunk (255 kB gzip) and two "dynamically imported but also statically imported" warnings (`BlogCardItem.jsx`, `MediaVideo.jsx`). |
| `npm run lint` | **Fails**: 81 problems (73 errors, 8 warnings) — mostly `react-hooks/purity` (`Math.random()` during render), `react-hooks/immutability` (functions used before declaration), and unused variables. |

Legend: **Critical** = security/data-loss/hard break · **High** = feature broken or wrong for real users · **Medium** = quality/SEO/perf · **Low** = cosmetic/maintainability.

Status column is filled at the end of the project: Fixed / Won't fix (reason) / Partially fixed.

---

## 1. Security

| # | Severity | File:line | Issue | Status |
| --- | --- | --- | --- | --- |
| S1 | **Critical** | `src/Auth/Pages/AdminLogin.jsx:34` | Admin login compares against **hardcoded credentials** `admin@ananta.com` / `admin123`. Anyone reading the JS bundle or the public GitHub repo has the credentials. This value is also rendered on screen at lines 103–104. | Fixed — real JWT login against Django; see `docs/SECURITY.md` for rotation/history purge (the old password must be treated as leaked). |
| S2 | **Critical** | `src/Auth/Context/AuthContext.jsx:11,21,26` | Auth state is a **localStorage flag** (`localStorage.getItem('admin')`). `localStorage.setItem('admin', '{}')` in devtools grants full admin UI access — no server check exists because there is no server. | Fixed — in-memory access token + HttpOnly refresh cookie; every admin request is authorised server-side. |
| S3 | **Critical** | `src/Componetns/ProtectedRoute.jsx:7,24` | `ProtectedRoute` is a client-only gate; there is nothing behind it. Direct rendering of any admin route bypasses nothing *because the "protection" is the only control* — any API-less build exposes all admin functionality and data. | Fixed — `ProtectedRoute` calls `GET /api/auth/me/`, checks role, shows 403 page; the API is the real gate. |
| S4 | **High** | `src/Admin/pages/Services/serviceApi.js:1-31` | Commented-out API client containing `localStorage.getItem('token')` and `http://your-backend/api/admin` — a leftover blueprint of an insecure token-in-localStorage design. | Fixed — deleted; replaced by `src/services/api.js`. |
| S5 | **Medium** | `index.html:6` | Generic `<title>Event Management Company</title>`, no description, no Open Graph, no canonical, favicon points at a 27 kB PNG inside `/src/assets` (works only because Vite rewrites it). | Fixed — real metadata + `public/favicon.png` + `robots.txt`. |
| S6 | **Medium** | repo-wide | No `.env` handling anywhere (`import.meta.env` never used), so there is currently no place to put an API URL or any secret; the first API URL added will inevitably be hardcoded. | Fixed — `import.meta.env.VITE_API_BASE_URL` with `.env.example`. |
| S7 | **Low** | `public/_redirects`, `netlify.toml` | Netlify config (`netlify.toml` + `public/_redirects`) contradicts the Vercel deployment (`vercel.json`). `public/public/_redirects` is a duplicate stray file. | Fixed — `netlify.toml` and `public/_redirects` removed, `vercel.json` rewritten. |

## 2. Data / architecture

| # | Severity | File:line | Issue | Status |
| --- | --- | --- | --- | --- |
| D1 | **High** | 50 files (187 matches, 28 distinct keys) | Every admin page persists its content in **`localStorage`** (keys: `admin`, `services`, `heroSlides`, `singers`, `djs`, `comedians`, `magicians`, `dancers`, `medias`, `videos`, `testimonials`, `teamMembers`, `careerJobs`, `careerApplications`, `blogs`, `portfolios`, `vendors`, `corporateEvents`, `exhibitionEvents`, `homeFAQs`, `corporateFAQs`, `artists`, `talents`, `influencers`, `anataServices`, `token`…). Content is per-browser, invisible to other visitors, wiped when the user clears storage. | Fixed — all content lives in PostgreSQL and is read/written through the API. Legacy keys are actively removed on app start (`src/utils/legacyStorage.js`). |
| D2 | **High** | `src/Componetns/Hero/Hero.jsx:34-52`, `src/Componetns/Services/Services.jsx:18-25`, `src/Componetns/Testimonials/Testimonials.jsx:16-23` | **Public** pages read the same `localStorage` keys as the admin, i.e. the public site shows whatever the visitor's own browser has. A visitor's "admin edits" only change their own view; real content changes never reach anyone. | Fixed — public pages read `GET /api/...`. |
| D3 | **High** | `src/Componetns/Services/Services.jsx:18-25` | The Services page renders `[]` for every first-time visitor (no `localStorage` entry, no fallback array) — the page is silently empty. | Fixed — seeded `Service` rows; page has loading/empty/error states. |
| D4 | **Medium** | `public/*.json` (17 files, including `Blog.json`, `blogs.json`, `blog-1.json`, `blog-2.json`, `CorporateEvents/CorporateEvents.json` and `ExhibitionStallData/ExhibitionStallData.json` which are byte-identical) | Content duplicated across JSON files in `public/`; three competing blog data files. | Fixed — one canonical source in DB (seeded from these files), duplicates removed from `public/`. |
| D5 | **High** | `src/App.jsx:1-30`, `src/App.css` | The Vite starter app (`count`, react.svg, `read-the-docs`) is still shipped; `App.jsx` is not even routed. | Fixed — deleted. |
| D6 | **Medium** | `src/Admin/pages/Dashboard.jsx:4-9,24-60`, `src/Admin/pages/Users/UsersList.jsx:4-8`, `src/Admin/pages/Events/EventsList.jsx:5-8`, `src/Admin/pages/Media/MediaList.jsx:4-8` | Dashboard/KPIs, Users, Events and Media admin pages are **hardcoded mock arrays** with buttons that do nothing (`alert('Upload functionality would be implemented here')` at `MediaList.jsx:13`). `UsersList` shows fake users; there is no password reset, no role editing, no deactivate. | Fixed — `GET /api/admin/dashboard/stats/`, real user management with role change/activate/deactivate/force-reset rules, Events and Media CRUD. |
| D7 | **Medium** | 21 files use `fetch()` for static JSON (`/blogs.json`, `/gallery.json`, `/About/About.json`, `/Services/SpecialEvent.json`, `/*Data/*.json`) | Content is baked into the deploy; every change needs a code deploy and `npm run build`. | Fixed — API-driven. |
| D8 | **Medium** | `src/Auth/Context/ServiceContext.jsx:1-125` | A second service "store" (localStorage + hardcoded placeholder items using `https://via.placeholder.com`) that shadows the admin one. | Fixed — removed; contexts replaced by `AuthContext` + React Query-free service modules. |

## 3. Routing

| # | Severity | File:line | Issue | Status |
| --- | --- | --- | --- | --- |
| R1 | **High** | `src/Router/Route.jsx:105-140` vs `:143-200` | `/services/SpecialEvent/:eventId` (dynamic) is declared **before** 7 hardcoded detail routes (`award-show`, `convocation-event`, `reunion-event`, `fashion-show`, `music-concert`, `laser-show`, `sports-management`). The 7 hardcoded components are large static pages (`Details/*.jsx`, up to 445 lines) that re-fetch `/Services/SpecialEvent.json` and duplicate the generic `SpecialEventDetail`. Two implementations of the same page can drift. | Fixed — single dynamic `/services/special-events/:slug`; all 8 entries seeded; old URLs 301/302-redirect. |
| R2 | **High** | `src/Router/Route.jsx:427-450` | **No 404 route** (`errorElement` / catch-all `*`). Any unknown URL renders a blank white page. | Fixed — `<NotFound>` catch-all + `errorElement`. |
| R3 | **High** | `src/Router/Route.jsx:405-411` | `/admin` alone matches no child route → blank page; no redirect to login/dashboard. | Fixed — `/admin` redirects to dashboard, `/admin/*` unknown paths fall through to 404. |
| R4 | **High** | `src/Router/Route.jsx` (whole file) | Mixed-case and typo'd URLs, some containing a literal `&` (invalid in a path without encoding): `/About`, `/bookAnArtists`, `/services/CorporateEvent`, `/services/BestExhibitionStallDesgin`, `/services/WeddingPlanner&Management`, `/services/Photography&VedioServices`, `/services/SpecialEvent/...`. | Fixed — kebab-case slug routes + permanent redirects. |
| R5 | **Medium** | `src/Router/Route.jsx:44-47, 92-96` | List/detail naming mismatch: `/services/CorporateEvent` vs `/services/corporate-events/:id`, `/services/BestExhibitionStallDesgin` vs `/services/exhibition-events/:id`, `/services/Photography&VedioServices/:id`. Detail routes use **numeric `:id`** while some data files expose slugs (`_id: "top-10-event-management-companies-in-bangladesh-2025"`). | Fixed — every detail route is slug-based. |
| R6 | **Medium** | `src/Router/Route.jsx:24-25, 178-181` | Duplicate/competing blog implementations: `/blog` + `/blog/:id` are commented out while `/media/blog` + `/media/blog/:id` are live; `BlogCard.jsx`, `BlogDetails.jsx`, `BlogCardItem.jsx` are only reachable from those dead routes. | Fixed — one blog implementation at `/media/blog` and `/media/blog/:slug`; dead files deleted; `/blog*` redirects. |
| R7 | **Medium** | `src/Router/Route.jsx` | Mixed router styles: `element={<X/>}` everywhere but `Component: Home` for the index route, and `loader:` only used for titles. | Fixed — consistent `element:` + `lazy` route modules. |
| R8 | **Medium** | `src/Router/Route.jsx` | ~90 **static imports** including the whole admin area, so every public visitor downloads admin (and Swiper/lucide) code. | Fixed — `React.lazy` per route; admin in its own chunk. |
| R9 | **Low** | `src/Componetns/Services/SpecialEvent/Details/*.jsx` | Seven near-identical copies of the same page shell (hero + stats + services + CTA), differing only in fetched JSON keys. | Fixed — one `SpecialEventDetail` + DB rows. |

## 4. SEO / metadata

| # | Severity | File:line | Issue | Status |
| --- | --- | --- | --- | --- |
| M1 | **Medium** | `src/Router/Route.jsx:78-86` | `document.title` is set from a router **loader** (`setTitle`) — a data-loading API abused for a side effect; with React 19 + StrictMode the behaviour is ordering-dependent, and titles are not restored on unmount. | Fixed — `<Seo>` component (title/description/OG/canonical/robots) per route. |
| M2 | **Medium** | `src/Router/Route.jsx` (`/media`, `/media/gallery`, `/media/video`, `/opportunities*`, `/admin/*` children) | **12+ routes have no title at all**, so the tab keeps the previous page's title after client-side navigation. | Fixed — every route sets a unique title. |
| M3 | **Medium** | `src/Admin/**` | Admin pages have no `noindex` and are crawlable (`/admin/login` is linked nowhere, but `/robots.txt` does not exist). | Fixed — `noindex,nofollow` on all `/admin/*`, `robots.txt` disallows `/admin`. |
| M4 | **Low** | repo-wide | Brand inconsistency: repo/`package.json` name `client`, `src/assets/Ananta_Logo.png` (file name), admin sidebar "Anata Admin", titles "Ananta Events", live domain `anantabd.net`. | Fixed for user-facing text (all "Ananta Events"); the repo name itself is left unchanged (out of scope). |
| M5 | **Low** | repo-wide | No `sitemap.xml`, no canonical URLs, no OG image. | Fixed — `robots.txt`, API-driven sitemap page/route, canonical + OG per route. |

## 5. Code quality

| # | Severity | File:line | Issue | Status |
| --- | --- | --- | --- | --- |
| Q1 | **High** | `npm run lint` → 81 problems | **73 lint errors** block CI: `react-hooks/purity` (e.g. `TalentHuntFeature.jsx:153` `key={talent._id \|\| Math.random()}` calls an impure function during render), `react-hooks/immutability` (`useEffect` calling a function declared later, e.g. `Portfolio.jsx:34` + `loadPortfolios` used before declaration in 12 files), unused vars. | Fixed — 0 errors, 0 warnings. |
| Q2 | **Medium** | 185 matches across 25 files | `console.log`/`console.error` left in shipped code (10 per admin management page, including `console.log('Services saved to localStorage:', …)`). | Fixed — removed. |
| Q3 | **Medium** | 105 matches | `key={index}` / `key={i}` used for list rendering in dynamic lists; `Math.random()` as a fallback key causes full remounts on every render. | Fixed — stable ids from the API. |
| Q4 | **Medium** | `src/Componetns/AnimatedBackground/AnimatedBackground.jsx:23-26` | `Math.random()` executed during render (impure) — hydration/animation jitter and a lint error. | Fixed — computed once in `useMemo`/state. |
| Q5 | **Medium** | 10 files (`AdminInfluencers.jsx:287,379,644`, `AdminHero.jsx:261,346,460`, …) | `<img>` without `alt` (10 in admin, more in public markup), no `width`/`height`, no `loading="lazy"` consistency. | Fixed — `alt` on every `<img>`, `loading="lazy"` + `decoding="async"` for below-the-fold media. |
| Q6 | **Medium** | `src/assets/Ananta_Logo.png` (27 kB), remote `wp-content` images served at full size (e.g. `IMG_0386.jpg`, `SPG01829-768x512.jpg` used as full-width hero) | Oversized/unoptimised images, hotlinked from `anantabd.net` (no caching control, will break if the old site changes), no `srcset`. | Partially fixed — images are now changeable/uploadable through the API and stored via configurable storage (Cloudinary/S3 or local in dev); `<img loading="lazy">`; a TODO notes migrating the legacy `anantabd.net` URLs into storage. |
| Q7 | **Low** | 236 commented-out lines; `src/Componetns/BlogCard/BlogCard.jsx`, `src/Pages/BlogDetails/BlogDetails.jsx`, `src/Componetns/FAQ/CorporateFAQ.jsx`, `src/Admin/pages/AdminFAQ/CorporateFAQ.jsx`, `src/Admin/pages/AdminBookAnArtists/*/{SingerForm,...}` remnants | Dead/commented code kept "just in case" — e.g. router lines 24-25, 178-181, 226, and `CorporateFAQ` which is used only by the corporate page while an admin `CorporateFAQ` variant exists for the same data. | Fixed — deleted. |
| Q8 | **Low** | `eslint.config.js` | `no-unused-vars` with `varsIgnorePattern: '^[A-Z_]'` hides unused components/constants (which is how `handleStorageChange` survived). | Fixed — pattern narrowed, `no-console` rule added. |

## 6. Asset/structure typos (fixed only via `git mv`, build verified after)

| # | Severity | Path | Issue | Status |
| --- | --- | --- | --- | --- |
| T1 | **Medium** | `src/Componetns/` → `src/components/` | Misspelt directory imported by ~120 files. | Fixed (`git mv`, imports rewritten, build verified). |
| T2 | **Medium** | `src/Admin/pages/AdminMediaGellary/` | "Gellary" typo (`src/Pages/Media/MediaGellary/` too). | Fixed → `admin/pages/media/`, `pages/media/gallery/`. |
| T3 | **Medium** | `src/Admin/pages/AdminProtfolio/ProtfolioManagement.jsx` | "Protfolio" typo. | Fixed → `admin/pages/portfolio/`. |
| T4 | **Medium** | `src/Admin/pages/AdminCarearOportunity/` | "Carear Oportunity" typos. | Fixed → `admin/pages/careers/`. |
| T5 | **Medium** | `src/Componetns/Services/PhotographyVedioServices/`, `MarketingVedio/`, route `/services/Photography&VedioServices` | "Vedio" typo. | Fixed → `photography-video/`, URL `/services/photography-video`. |
| T6 | **Medium** | `src/Componetns/Services/BestExhibitionStallDesgin/` | "Desgin" typo. | Fixed → `exhibition-stall-design/`. |
| T7 | **Low** | `src/Admin/pages/Testimonal/` | "Testimonal" typo. | Fixed → `admin/pages/testimonials/`. |
| T8 | **Low** | `src/Componetns/Services/InfluencerMarketingAgency/WhyNeedInfuencer/`, `MarketingVedio/` | "Infuencer"/"Vedio" typos. | Fixed → `why-need-an-influencer/`. |
| T9 | **Low** | `src/Admin/Components/` vs `src/Admin/pages/` | Two competing structures for the same layer; some pages import from `Admin/Components/*`, others keep their own `Table`/`Form` files next to the page. | Fixed — one `src/admin/{components,pages,layouts}` structure with a consistent `ResourceManager` pattern. |
| T10 | **Low** | `src/App.css`, `src/assets/react.svg`, `public/vite.svg`, `public/Blog.json`, `public/blogs.json`, `public/blog-1.json`, `public/blog-2.json` | Unused starter/duplicate assets. | Fixed — removed. |

## 7. Admin UX gaps

| # | Severity | File:line | Issue | Status |
| --- | --- | --- | --- | --- |
| A1 | **High** | `src/Admin/pages/Events/EventsList.jsx` + `Events/AddEvent.jsx` | Events have **add but no edit/delete/detail route**; `AddEvent` never persists anywhere (it calls `alert`/`toast` only). | Fixed — `/admin/dashboard/events` (+ `/new`, `/:id/edit`), full CRUD against the API. |
| A2 | **High** | All `*Management.jsx` pages | "Edit" re-uses the same modal but `handleUpdate` writes only to localStorage; there is **no delete confirmation with server state**, no reorder, no publish/unpublish, no search/filter/pagination server-side, no empty state, no error state. | Fixed — shared `ResourceManager` with create/edit/delete/bulk-delete/reorder/publish toggle, server-side search, pagination, empty + error states. |
| A3 | **Medium** | `src/Admin/Layouts/AdminSidebar.jsx:18-38` | Sidebar omits existing pages (dashboard, users, events, media, blogs are unreachable from the menu); no role awareness. | Fixed — full menu with role-based hiding (convenience only — the API enforces permissions). |
| A4 | **Medium** | `src/Admin/Layouts/AdminSidebar.jsx:43-46` | Logout sets `window.location.href = '/admin/login'` and only clears localStorage — no server-side session revocation is possible today. | Fixed — `POST /api/auth/logout/` blacklists the refresh token, then navigate. |
| A5 | **Medium** | `src/Admin/pages/AdminOpportunity/*`, `AdminProtfolio`, `AdminCorporoateEvents` | Submissions (artist/talent/vendor applications) are stored in localStorage and have "approve/reject" buttons that only mutate that array — no workflow, no notes, no email. | Fixed — `status` + `admin_notes` on the server, review actions in the admin UI. |
| A6 | **Low** | `src/Admin/pages/Dashboard.jsx:44-70` | Dashboard shows fabricated revenue (`৳2.5L`, `৳25,00,000`), fake recent events/bookings. | Fixed — real counts from `/api/admin/dashboard/stats/`. |

## 8. Forms (public)

| # | Severity | File:line | Issue | Status |
| --- | --- | --- | --- | --- |
| F1 | **High** | `src/Componetns/Contacts/ContactForm.jsx` | Contact form does not send anything (no endpoint); success toast is faked. | Fixed — `POST /api/contact/`, validation, throttling, honeypot, email notification, persisted in DB and visible in `/admin/dashboard/messages`. |
| F2 | **High** | `src/Pages/Opportunities/*` (`ArtistRegistration`, `TalentHunt`, `VendorRegistration`, `CareerOpportunities`) | All four forms validate then discard the data (localStorage/console). CV uploads are not uploaded anywhere. | Fixed — four real endpoints with file uploads (CV/image), size/type validation, admin review workflow. |
| F3 | **High** | `src/Pages/BookAnArtists/*` | "Book" buttons open a modal that does not submit anywhere. | Fixed — `POST /api/artist-bookings/` with optional artist FK. |
| F4 | **Medium** | all forms | No disabled-while-submitting beyond a local spinner, no field-level server errors, no `aria-invalid`, no `<label htmlFor>` in several forms. | Fixed — submit disabled + spinner, server field errors mapped to inputs, labels/aria added. |

## 9. Confirmed "known issues" checklist from the brief

1. ✅ Client-side-only admin protection **confirmed** — and worse: hardcoded credentials (S1) + localStorage flag (S2).
2. ✅ No 404 route / no `errorElement`; `/admin` renders blank (R2, R3).
3. ✅ `/services/SpecialEvent/:eventId` conflicts with 7 hardcoded detail routes (R1).
4. ✅ Inconsistent/typo'd/mixed-case URLs incl. `&` in paths; list-vs-detail naming mismatch; numeric `:id` (R4, R5).
5. ✅ Loader-based `document.title` hack; many routes without titles; brand inconsistency (M1, M2, M4).
6. ✅ ~90 static imports; admin ships to every visitor; no lazy loading (R8).
7. ✅ Dead/commented blog routes and duplicate blog implementations (R6, Q7).
8. ✅ Folder/file typos (T1–T9).
9. ✅ `events/add` with no edit route; other admin pages have no real delete/reorder; two competing structures (A1, A2, T9).
10. ✅ Data-source map + form behaviour below (§10).

Extra issues found beyond the brief: duplicate byte-identical JSON content files (D4), the Vite starter app still in the bundle (D5), a second shadow service store (D8), placeholder.com images in seeded admin data (D8/A5), `console.log` volume (Q2), `Math.random()` during render (Q4), missing `alt` attributes (Q5), hotlinked `wp-content` images (Q6), `netlify.toml`/`_redirects` contradicting Vercel (S7), a stray `public/public/_redirects` (S7), favicon inside `/src` (S5).

## 10. Data-source map (before → after)

| Page (before) | Data source before | After |
| --- | --- | --- |
| `/` Home | `Hero` (localStorage `heroSlides` + hardcoded defaults), `Services` (localStorage `services`), `Gallary` (`/gallery.json`), `Testimonials` (localStorage `testimonials` → `/Testimonals.json`), `OurClients`, `WhyChooseUs`, `EventCoverage` (static copy) | `/api/hero-slides/`, `/api/services/`, `/api/gallery/?limit=12`, `/api/testimonials/`, `/api/faqs/?section=home`, `/api/settings/` |
| `/services` | localStorage `services` (empty for new visitors) | `/api/services/` |
| `/services/CorporateEvent` + `/:id` | static copy + `/CorporateEvents/CorporateEvents.json` | `/api/services/corporate-events/` + `/api/services/corporate-events/entries/:slug/` |
| `/services/BestExhibitionStallDesgin` + `/services/exhibition-events/:id` | static copy + `/ExhibitionStallData/ExhibitionStallData.json` | same service-entry API (`exhibition-stall-design`) |
| `/services/Photography&VedioServices` (+ `/:id`) | static copy + `/CorporateEvents/*.json` (copy-paste) | service `photography-video` + entries |
| `/services/SpecialEvent` (+ 8 static detail pages) | `/Services/SpecialEvent.json` fetched separately by 8 components | service `special-events` + 8 `ServiceEntry` rows |
| `/services/InfluencerMarketingAgency` | localStorage `influencers`; `InfluencerList` fetches `/InfluencerData` (missing file) | `/api/influencers/` |
| `/services/{SingerAndCelebrityBooking,WeddingPlanner&Management,VirtualEvent}` | static JSX copy | `Service` row body (rich text) |
| `/About` | `/About/About.json` fetched by 4 child components (4× duplicate requests) | `/api/team/`, `/api/faqs/?section=about`, `/api/settings/` (single request each) |
| `/Portfolio` | `/portfolio.json`-style localStorage `portfolios` + placeholder fallback | `/api/portfolio/` |
| `/media/gallery` | `/gallery.json` | `/api/gallery/` |
| `/media/video` | localStorage `videos` | `/api/videos/` |
| `/media/blog`, `/media/blog/:id` | `/blogs.json` (+ localStorage `blogs` in PostCard) | `/api/blogs/`, `/api/blogs/:slug/` |
| `/book-an-artist/*` | `/*Data/*.json` static files | `/api/artists/?category=…` |
| `/opportunities/*` | `/TalentHunt/TalentHunt.json` + localStorage `talents` for showcases | `/api/artists/?featured=1` (showcase) + `POST /api/talent-hunt-registrations/` etc. |
| `/contact` | static copy; form discarded data | `/api/settings/`, `/api/faqs/`, `POST /api/contact/` |
| `/admin/login` | **hardcoded credentials** | `POST /api/auth/login/` |
| `/admin/dashboard` (all 25 pages) | localStorage / mock arrays | authenticated `/api/admin/*` CRUD in PostgreSQL |

## 11. Post-fix verification

| Check | Result |
| --- | --- |
| `npm run lint` | 0 errors, 0 warnings |
| `npm run build` | Builds; public and admin are separate chunks; no >500 kB warning |
| `npm test` (vitest) | Passing (auth, ProtectedRoute legacy-storage regression, service modules) |
| `pytest` (backend) | Passing, coverage > 80 % |
| `docker compose up` | Django + PostgreSQL boot; migrations + `seed_demo_data` run |
| Legacy localStorage flag | Setting `admin`, `token`, `isLoggedIn` grants **no** access — regression test in `src/__tests__/ProtectedRoute.test.jsx` |
| Old URLs | All 301/302 to the new slug routes (see §3 R4) |
