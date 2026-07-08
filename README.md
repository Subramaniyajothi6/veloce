# VELOCE

A cinematic, single-brand **luxury car showroom** built with the Next.js App Router. VELOCE is a fictional dealership: each car on the site is a real hypercar (Bugatti, Ferrari, Porsche, Lamborghini, Koenigsegg, Pagani…) presented with an interactive **WebGL 3D model**, a scroll-driven "cinematic" reveal, a live **paint configurator**, editorial highlights/specs/galleries, and working **test-drive booking** + **service enquiry** flows backed by MongoDB, plus a password-protected **admin panel** to manage inventory and leads.

> Demo/portfolio project. 3D models are CC-licensed; photography is manufacturer press/editorial used for a non-commercial demo (see [Attribution](#attribution--licensing)).

---

## Table of contents

- [Tech stack](#tech-stack)
- [Features](#features)
- [Quick start](#quick-start)
- [Environment variables](#environment-variables)
- [Project structure](#project-structure)
- [Routes](#routes)
- [Content & data model](#content--data-model)
- [3D models](#3d-models)
- [Image pipeline (Cloudinary)](#image-pipeline-cloudinary)
- [Database & scripts](#database--scripts)
- [Admin panel & auth](#admin-panel--auth)
- [Forms & server actions](#forms--server-actions)
- [Motion & effects](#motion--effects)
- [Styling](#styling)
- [npm scripts & tooling](#npm-scripts--tooling)
- [Known traps / gotchas](#known-traps--gotchas)
- [Deployment](#deployment)
- [Attribution & licensing](#attribution--licensing)

---

## Tech stack

| Area | Choice |
|------|--------|
| Framework | **Next.js 16** (App Router, React Server Components, Server Actions) |
| Language | **TypeScript 5** |
| UI runtime | **React 19** |
| Styling | **Tailwind CSS v4** (CSS-first config in `globals.css`, `@tailwindcss/postcss`) |
| 3D | **three** `^0.184` + **@react-three/fiber** `9.x` + **@react-three/drei** `10.x` |
| Database | **MongoDB Atlas** via **Mongoose** `9.x` |
| Images | **Cloudinary** (delivery) via a custom `next/image` loader |
| Auth | Signed, HttpOnly session cookie gated by a Next 16 **Proxy** (renamed middleware) |
| Tooling | **tsx** (script runner), **Playwright** + **sharp** (visual/image QA), **ESLint 9** |

Requires **Node.js 20+**.

---

## Features

- **Home page** — cinematic hero, brand manifesto, marquee, flagship models, drag-scroll showroom, services, records, heritage archive, and visit/locations.
- **Model detail** (`/models/[slug]`) — scroll-driven 3D "cinematic" experience, then editorial **Highlights**, full **Specification** sheet, **Engineering features**, **spec comparison**, photography **Gallery**, and **track** numbers.
- **Paint configurator** (`/models/[slug]/configure`) — full-screen "atelier" that repaints the 3D car in real time from a per-car finish palette.
- **Full inventory** (`/models`) grid.
- **Services** (`/services`, `/services/[slug]`) — service detail pages with per-service **enquiry forms** and a **finance calculator**.
- **Test-drive booking** (`/test-drive`) — form persisted to MongoDB.
- **Admin panel** (`/admin`) — password login, dashboard, car inventory CRUD, bookings list, enquiries list.
- **Resilience** — everything degrades gracefully: no DB → static data; no WebGL → hero photo; reduced-motion → effects disabled.

---

## Quick start

```bash
# 1. install
npm install

# 2. configure secrets (see the table below) — create .env.local and fill it in
#    (the site still runs with an empty/absent .env.local, using static data)

# 3. (optional) seed the database with all cars
npm run seed

# 4. run the dev server
npm run dev
```

Open <http://localhost:3000>.

The site **runs without any configuration** — with no `MONGODB_URI` it falls back to the static dataset in `src/data/cars.ts`. Database, admin, and booking/enquiry persistence require the env vars below.

---

## Environment variables

Stored in `.env.local` (git-ignored). None are required to render the site; they enable persistence and admin.

| Variable | Required for | Notes |
|----------|--------------|-------|
| `MONGODB_URI` | DB-backed inventory, bookings, enquiries, admin | MongoDB Atlas connection string. Absent → static fallback, no persistence. |
| `ADMIN_PASSWORD` | `/admin` login | The single admin password. |
| `SESSION_SECRET` | `/admin` sessions | Secret used to sign the session cookie. Admin is disabled unless **both** admin vars are set. |
| `CLOUDINARY_UPLOAD_PRESET` | uploading new photos | Unsigned preset name (e.g. `veloce_unsigned`), used only by `tools/cloudinary-upload.mjs`. The delivery cloud name (`dc6fd4ith`) is hard-coded in the loader/upload tool. |

---

## Project structure

```
veloce/
├─ public/
│  ├─ cars/            # source photography (mirrored to Cloudinary as veloce/cars/<name>)
│  └─ models/          # optimized .glb 3D models the site loads
├─ scripts/            # tsx DB scripts (seed / sync-car / remove-car)
├─ tools/              # node .mjs dev utilities (Cloudinary upload, Playwright QA, image grading…)
├─ downloads/          # 3D-model provenance + notes (MODELS.md); source archives git-ignored
├─ src/
│  ├─ proxy.ts         # Next 16 Proxy (middleware) — gates /admin
│  ├─ app/
│  │  ├─ layout.tsx    # root <html> shell
│  │  ├─ (site)/       # public site (shared chrome + page transitions)
│  │  │  ├─ layout.tsx, template.tsx
│  │  │  ├─ page.tsx                    # home
│  │  │  ├─ models/page.tsx             # inventory grid
│  │  │  ├─ models/[slug]/page.tsx      # car detail
│  │  │  ├─ services/…                  # services + [slug] + actions.ts
│  │  │  └─ test-drive/…                # booking page + actions.ts
│  │  ├─ models/[slug]/configure/       # paint configurator (OUTSIDE (site) — bare layout)
│  │  └─ admin/
│  │     ├─ login/                      # login page + LoginForm + actions
│  │     └─ (panel)/                    # dashboard, cars CRUD, bookings, enquiries, actions
│  ├─ components/      # UI: Hero, Showroom, Services, Footer, Nav, …
│  │  ├─ car3d/        # CarCanvas, CarExperience, Configurator (3D + configurator)
│  │  └─ cardetail/    # Highlights, EngineeringFeatures, SpecCompare, SpecGauges, ModelSubNav
│  ├─ hooks/           # motion/effect hooks (useScramble, useHorizontalScroll, …)
│  ├─ lib/             # db, inventory, auth, session, cloudinary-loader, motion, raf, scroll
│  ├─ models/          # Mongoose schemas: Car, Booking, Enquiry
│  └─ data/            # static content: cars, showroom, services, flagships, locations, stats, archive
├─ next.config.ts      # custom image loader + Unsplash remote pattern
└─ globals.css         # Tailwind v4 config + design tokens (imported by root layout)
```

---

## Routes

### Public (`(site)` route group — shared nav/footer + page-transition template)

| Path | Purpose |
|------|---------|
| `/` | Home (hero, manifesto, marquee, flagships, showroom, services, records, archive, visit) |
| `/models` | Full inventory grid |
| `/models/[slug]` | Car detail: 3D experience → highlights → specs → features → compare → gallery → track |
| `/services` | Services overview |
| `/services/[slug]` | Service detail + enquiry form + finance calculator |
| `/test-drive` | Test-drive booking form (`?car=<slug>` prefills) |

### Configurator (outside `(site)` — full-screen bare layout)

| Path | Purpose |
|------|---------|
| `/models/[slug]/configure` | Live paint "atelier" over the 3D car |

### Admin (gated by `src/proxy.ts`)

| Path | Purpose |
|------|---------|
| `/admin/login` | Password login |
| `/admin` | Dashboard |
| `/admin/cars`, `/admin/cars/new`, `/admin/cars/[slug]` | Inventory CRUD |
| `/admin/bookings` | Test-drive bookings |
| `/admin/enquiries` | Service enquiries |

---

## Content & data model

The **single seam** between the site and its data is `src/lib/inventory.ts` (`getCars()` / `getCar(slug)`). Pages never import `@/data/cars` directly. This enforces a deliberate split:

- **Code-owned (always from `src/data/cars.ts`):** the fragile 3D-rig config (`model.url`, `yaw`, `repaint`, material names, `bodyMaterials`, `finishMaterials`, `partRecolor`, `finishes`) and the editorial **`highlights[]`** and **`features[]`** blocks. Editing `cars.ts` updates these immediately on the next render/build — no DB write needed. This guarantees an admin edit can never break the 3D scene.
- **DB-owned (from MongoDB when configured):** `image` (hero + thumbnail), `gallery[]`, `specs[]`, `track[]`, `price`, `name`, `category`, `tagline`, `description`, `alt`, `paint`, `modelUrl`, `order`.

`inventory.ts` reads the DB when available and **merges the code rig by slug**; on **any** DB error or with no DB it falls back to the full static dataset, so the live site never breaks.

**Consequence:** after editing a car's DB-owned fields in `cars.ts`, push them to Mongo with `npx tsx scripts/sync-car.ts <slug>` (see [Database & scripts](#database--scripts)).

### Static content files (`src/data/`)

| File | Content |
|------|---------|
| `cars.ts` | Full `CarProfile[]` — the source of truth for code-side fields and DB seeding |
| `showroom.ts` | Home showroom cards |
| `flagships.ts` | Home flagship feature |
| `services.ts` | Service offerings |
| `enquiryFields.ts` | Per-service enquiry-form field definitions |
| `locations.ts` | Showroom locations (Visit section) |
| `stats.ts` | Record/stat numbers |
| `archive.ts` | Heritage archive cars |

### Current inventory (8 cars)

`royale` (Bugatti La Voiture Noire) · `furia` (Ferrari SF90 XX Stradale) · `vento-rs` (Porsche 911 GT3 RS) · `giallo-gt` (Lamborghini Centenario) · `gemera` (Koenigsegg Gemera) · `huayra` (Pagani Huayra) · `royale-classic` (Bugatti Bolide) · `furia-classic` (Ferrari 599XX).

---

## 3D models

- GLBs live in `public/models/<slug>.glb`; provenance and re-download links are in `downloads/MODELS.md`. Source archives (`.zip`, `extracted/`, `optimized/`) are git-ignored.
- Each car's rig is configured in `cars.ts` under `model`: `url`, `yaw`, `repaint`, and material lists.
- **Repaint** recolors the body material(s) to the selected finish hex (metallic response under the cool studio lighting). `bodyMaterials` / `finishMaterials` scope which materials the signature paint vs. a configurator finish touch.
- **`partRecolor`** (see `recolorPartsInBox` in `CarCanvas.tsx`) recolors only the connected geometry islands of a named material inside a bounding box in the GLB's raw space — used for details like the royale's silver rear script/badge without disturbing shared cached geometry.
- Rendering is done in `components/car3d/CarCanvas.tsx`; the scroll-driven presentation is `CarExperience.tsx`; the configurator UI is `Configurator.tsx`.

---

## Image pipeline (Cloudinary)

`next/image` uses a **custom loader** (`src/lib/cloudinary-loader.ts`, wired via `next.config.ts` → `images.loaderFile`):

- `"/cars/<name>.jpg"` → `https://res.cloudinary.com/dc6fd4ith/image/upload/f_auto,q_auto,w_<width>,c_limit/veloce/cars/<name>`
- `images.unsplash.com` URLs pass through with the requested width; everything else is untouched.

So a file referenced as `/cars/foo.jpg` **must exist on Cloudinary** as `veloce/cars/foo` or it 404s (dev and prod both use the loader). To add photos:

```bash
# put files in public/cars/, then upload (unsigned preset; re-runs skip existing):
node tools/cloudinary-upload.mjs veloce_unsigned
# or:  $env:CLOUDINARY_UPLOAD_PRESET="veloce_unsigned"; node tools/cloudinary-upload.mjs
```

The public_id is `veloce/cars/<name>` (extension dropped), giving the loader a 1:1 mapping. The `public/cars/*.jpg` source files are also committed to git so the repo remains the source of truth.

---

## Database & scripts

Connection is a cached Mongoose singleton in `src/lib/db.ts`. Schemas in `src/models/`:

- **`Car`** — `slug` (unique), `name`, `category`, `price`, `tagline`, `description`, `image`, `alt`, `paint`, `modelUrl`, `specs[]`, `gallery[]`, `track[]`, `order`.
- **`Booking`** — test-drive submissions.
- **`Enquiry`** — service enquiry submissions.

Scripts (run with `tsx`; they auto-load `.env.local`):

| Command | Effect |
|---------|--------|
| `npm run seed` (`tsx scripts/seed.ts`) | Upsert **all** cars from `cars.ts` into Mongo. Re-syncs everything — can overwrite admin edits. |
| `npx tsx scripts/sync-car.ts <slug>` | Upsert **one** car's DB-owned fields only. Preferred after editing a single car so other cars' admin edits aren't clobbered. |
| `npx tsx scripts/remove-car.ts <slug> [<slug>…]` | Remove car document(s) from Mongo. |

---

## Admin panel & auth

- `src/proxy.ts` (Next 16 Proxy, Node runtime) matches `/admin/:path*` and redirects anything but `/admin/login` to the login page unless a valid session cookie is present.
- **Defense in depth:** each admin page/server action **also** re-checks auth (`src/lib/auth.ts`), per Next's guidance not to rely on the proxy alone.
- Sessions are a signed, HttpOnly, `SameSite=Lax` cookie (`secure` in production), created/verified in `src/lib/session.ts`. Admin is only enabled when both `ADMIN_PASSWORD` and `SESSION_SECRET` are set.
- Login/logout and mutations are **Server Actions** (`admin/login/actions.ts`, `admin/(panel)/actions.ts`).

---

## Forms & server actions

- **Test-drive** (`(site)/test-drive/actions.ts`) → writes a `Booking`. Visible in `/admin/bookings`.
- **Service enquiry** (`(site)/services/actions.ts`, `ServiceEnquiryForm.tsx`, fields from `enquiryFields.ts`) → writes an `Enquiry`. Visible in `/admin/enquiries`. Includes a `FinanceCalculator`.

All submissions go through Server Actions with server-side validation; they degrade safely if the DB is unavailable.

---

## Motion & effects

Hooks in `src/hooks/`, orchestrated by `components/GlobalEffects.tsx` / `RouteEffects.tsx`. All respect `prefers-reduced-motion` and no-op without JS. A shared RAF loop lives in `src/lib/raf.ts` (`onFrame`); helpers in `src/lib/motion.ts`.

| Hook | Effect |
|------|--------|
| `useScramble` | Decode/scramble entrance for section headings (`.h2`); rebuilds each visual line as a non-wrapping block and **freezes width+height** so it can't reflow neighbours. |
| `useHorizontalScroll` | Pinned, drag-throwable horizontal showroom gallery (vertical scroll drives horizontal translate). Tracks the drag on `window` (no pointer capture) so card `<Link>`s stay clickable. |
| `useMagnetic` | Magnetic hover pull for `.magnetic` buttons/links. |
| `useReveal` | Scroll-into-view reveal for `.reveal` elements. |
| `useCounters` | Animated number counters. |
| `useParallax` | Parallax translation. |
| `useSmoothScroll` | Lerped smooth scrolling. |
| `useManifestoFill` | Progressive text fill on scroll. |
| `useMarqueeSkew` | Velocity-based marquee skew. |
| `useArchivePreview` | Hover image preview for the heritage archive. |

Notable components: `Preloader`, `Cursor` (custom cursor with `data-cursor` labels), `Noise`, `ScrollProgress`, `ToTop`, `ServiceDeck` (sticky stacked cards), `SpecGauges` (tachometer counters).

---

## Styling

- **Tailwind CSS v4**, configured CSS-first in `globals.css` (no `tailwind.config.js`). Design tokens are CSS variables, e.g. `--color-coal #070708`, `--color-cream #f2f1ec`, `--color-ash #8e8d86`, `--color-veloce #e10600`. Utilities like `bg-coal`, `text-veloce`, `border-line` derive from these.
- The Tailwind source scan is scoped to `src/` on purpose (`@import "tailwindcss" source(none); @source "../";`) to avoid the oxide OOM trap below.
- Custom utilities/classes: `.h2`, `.text-outline` (hollow display text), `.eyebrow`, `.btn`/`.btn-red`/`.btn-ghost`, `.wrap`, `.sec`, plus a hide-on-scroll nav using a `--nav-h` variable and `.nav-hidden`.

---

## npm scripts & tooling

```bash
npm run dev     # start dev server (http://localhost:3000)
npm run build   # production build
npm run start   # serve the production build
npm run lint    # ESLint
npm run seed    # seed all cars into MongoDB
```

`tools/` holds standalone Node utilities (run with `node tools/<x>.mjs`), the important ones:

| Tool | Purpose |
|------|---------|
| `cloudinary-upload.mjs` | Upload `public/cars/*` to Cloudinary. |
| `frame-check.mjs` | Playwright-render a car's 3D intro/color frames (`frame-<slug>-*.png`) — the reliable way to verify 3D paint (the browser extension jams on 3D pages). |
| `glb-probe.mjs` | Inspect a GLB's materials/geometry (used to author `partRecolor` boxes). |
| `verify.mjs` | Automated route smoke check (`$env:BASE=...; node tools/verify.mjs`). |
| `perf-probe.mjs` | Performance probe (run **headed** — headless WebGL is software-rendered). |
| `grade-*.mjs`, `color-*`, `yaw-*`, `mobile-*` | Per-car image grading (sharp) and QA capture helpers. |

---

## Known traps / gotchas

- **This is Next.js 16** — APIs and conventions differ from older versions. See `AGENTS.md`; the bundled docs live in `node_modules/next/dist/docs/`.
- **Middleware is renamed "Proxy"** — the file is `src/proxy.ts` and exports `proxy()` + `config.matcher`.
- **Cloudinary is mandatory for `/cars/*`** — a new local photo won't render until uploaded (the loader points at Cloudinary in dev and prod alike).
- **DB vs code split** — editing `gallery`/hero/specs in `cars.ts` does nothing on the live page until `sync-car.ts <slug>` runs; `highlights`/`features` update from code immediately.
- **Turbopack dev image cache** is `.next/dev/cache/images` (not `.next/cache/images`); clear it + hard-refresh after replacing a same-named image.
- **Tailwind oxide OOM** — if every route 500s with `memory allocation of 2013265920 bytes failed`, oxide tried to scan the whole project; the fix (`source(none)` + scoped `@source`) is already in `globals.css`. Keep it.
- **3D visual checks** — use `tools/frame-check.mjs` (Playwright), not browser-extension screenshots, which stall on WebGL pages.

---

## Deployment

Optimized for **Vercel** (App Router, Server Actions, Node-runtime proxy). Set the [environment variables](#environment-variables) in the host, ensure MongoDB Atlas allows the deployment's egress, and confirm all `/cars/*` photos are uploaded to Cloudinary. `next build` must pass. Cloudinary and MongoDB Atlas are external managed services (no bundling needed).

---

## Attribution & licensing

- **3D models** are third-party, CC-licensed (per-model credit is on each `car.model.credit`; see `downloads/MODELS.md`).
- **Photography** is manufacturer press / editorial imagery, used here for a **non-commercial demo/portfolio** only; provenance is logged in `downloads/photos/credits.txt`. Replace with owned/licensed assets before any commercial use.
- "VELOCE Motors" is a fictional brand created for this project.
