
# VELOCE Motors — Project Handoff

> Context document for continuing work in a new chat. Everything below is already
> built and verified unless marked **PENDING**.

## What this project is

A fictional luxury automobile sales company website ("VELOCE Motors"), design
inspired by Codrops (tympanus.net/codrops) — dark theme, bold display type,
scroll-driven effects, custom cursor. It started as a single static
`D:\New website\index.html` (keep as read-only visual reference; `aurora.html`
in the same folder is unrelated — never touch it) and was migrated to this
Next.js app at `D:\New website\veloce`.

User profile: knows MERN, wanted Next.js + TypeScript + **Tailwind CSS**
(explicit instruction: use Tailwind utilities everywhere; only write custom CSS
classes when no utility exists).

## Stack

| Thing | Version / choice |
|---|---|
| Next.js | 16.2.9, App Router, Turbopack, `src/` dir, `@/*` alias |
| React | 19.2.4 |
| Tailwind CSS | v4 (CSS-first config via `@theme` in `globals.css`, no tailwind.config) |
| 3D | three 0.184, @react-three/fiber 9.6, @react-three/drei 10.7 |
| Fonts | next/font/google: Anton (display), Manrope (body), Space Grotesk (mono) → CSS vars `--font-anton/-manrope/-grotesk` |
| Images | next/image, remotePatterns allows `images.unsplash.com` (next.config.ts) |
| Animations | NO GSAP/Lenis — hand-rolled hooks sharing one rAF engine |

Run: `npm run dev` (localhost:3000) · Build: `npm run build` (passes clean, all
12 routes prerender; 7 detail pages via generateStaticParams).

## Routes

- `/` — full landing page: Preloader → Hero (split-char headline, Ken Burns bg)
  → Marquee (scroll-velocity skew) → Manifesto (scroll word-fill) → Showroom
  (pinned horizontal-scroll gallery) → Flagships (clip-path reveals + counters)
  → Pre-owned (parallax banner) → Services (hover rows) → Record (stat counters
  + quote) → Archive (hover list w/ cursor-trailing image preview) → Visit (CTA).
- `/models` — "The Range" grid of all cars.
- `/models/[slug]` — SSG detail pages. **Current lineup (2026-07-03): royale,
  furia, vento-rs, giallo-gt, gemera, huayra** + a "classic" line (royale-classic,
  furia-classic, tempesta-v12-classic, notte-v10-classic). [notte-v10 (Audi R8) +
  volt-zero (Tesla) were REMOVED; gemera + huayra ADDED — see the 2026-07 section
  below.] **cinematic 3D scroll experience**
  (pinned section, height = stages × 85vh where stages = specs.length + 2;
  R3F camera cuts between keyframed "shots" — low front hero, long-lens
  close-up, side profile, rear 3/4, overhead crane, tight nose — each with a
  slow dolly + fov lens change + handheld drift; 6 specs per car appear shot
  by shot with a one-line `detail` caption; letterbox bars + bottom shot HUD
  during spec stages; scramble title; price/CTA outro) → story section →
  **full spec sheet** (numbered rows, value + `detail`) → **photo gallery**
  (`car.gallery`, real Commons photos) → **track band** (`car.track`,
  fictional timing-tower stats) → "Next in the range" strip. **Next 16 note:
  `params` is a `Promise` — must `await`.**
- `/test-drive` (dynamic, `?car=<slug>` preselects) — booking form:
  `BookingForm.tsx` (client, `useActionState`) → server action
  `app/test-drive/actions.ts` (validates, appends NDJSON to
  `data/bookings.json` — gitignored; the seam Phase B's MongoDB replaces).
  **Gotcha: "use server" files may only export async functions** — the
  initial state object lives in BookingForm, only the type is shared.
  All "Book a test drive" CTAs (Nav, Visit, car outro, detail page) point
  here; no more `mailto:`.

## File map (src/)

```
app/
  layout.tsx        fonts, metadata, inline <script> adding `js` class on <html>
                    (suppressHydrationWarning), shared chrome: Noise, ScrollProgress,
                    Cursor, Nav, <main id="top">, Footer, ToTop, RouteEffects
  template.tsx      page transition: .page-wipe (red wipe) + .page-enter (rise)
  globals.css       @theme tokens + custom classes (see Conventions)
  page.tsx          home (sections only + Preloader + skip link)
  models/page.tsx   range grid
  models/[slug]/page.tsx  detail page (await params, generateMetadata, notFound)
  icon.svg          favicon (red V)
components/
  Nav, Footer, Cursor, ScrollProgress, ToTop, Noise, Preloader (client chrome)
  Hero, Marquee, Manifesto, Showroom, Flagships, Preowned, Services,
  RecordSection, Archive, Visit (server sections)
  GlobalEffects.tsx  mounts all document-level hooks, returns null
  RouteEffects.tsx   <GlobalEffects key={pathname}/> so hooks re-bind per route
  car3d/CarCanvas.tsx     R3F canvas, lights, ground, CarModel (loads the
                          per-car GLB from car.model.url; strips embedded
                          lights/cameras; auto-normalizes any GLB: uniform
                          scale to 4.4 units length, grounded, centered;
                          repaints the body material — picked by name
                          /body|paint|chasis|shell/ at ≥5% surface area, else
                          largest non-black material by triangle area; glass
                          by name or opacity<1; other materials kept),
                          Rig (keyframed cinematic shots from progressRef:
                          buildShots() = intro push-in + SHOT_STYLES cycle +
                          outro pull-back; smootherstep in-shot motion, lerp
                          smoothing turns stage jumps into swish cuts,
                          fov lerp + handheld drift; takes `stages` prop)
  car3d/CarExperience.tsx scrolly wrapper: stage state, spec overlays (blur-in,
                          `detail` captions), letterbox bars + shot HUD,
                          vignette, scramble title, progress rail,
                          reduced-motion static fallback (3-col spec grid)
hooks/   useReveal, useCounters, useParallax, useManifestoFill,
         useHorizontalScroll, useMagnetic, useSmoothScroll, useMarqueeSkew,
         useArchivePreview  (all query the DOM like the original site did;
         all StrictMode-safe with full cleanup)
lib/     motion.ts (clamp, prefersReduced, isFinePointer)
         raf.ts (shared onFrame engine — ONE rAF loop for everything)
         scroll.ts (smoothTo eased scrolling + cancelSmoothScroll)
data/    cars.ts (CarProfile[] — single source for /models pages, incl. `paint`
         hex for 3D body color), showroom.ts, flagships.ts, archive.ts,
         services.ts, stats.ts, locations.ts
types.ts CarProfile, CarSpec, ShowroomCar, Flagship, ArchiveSale, etc.
public/models/  one GLB per car slug (royale.glb … volt-zero.glb); credits in
                cars.ts `model.credit`. furia.glb was re-optimized
                (gltf-transform: draco + 512px webp textures, **--palette
                false** — palette merges materials and breaks the body
                repaint heuristic). CarCanvas also strips
                KHR_materials_transmission at load (forces an extra
                full-scene render pass per frame = scroll stutter) and swaps
                it for cheap transparent glass.
public/cars/    real photography from Wikimedia Commons (CC BY / CC BY-SA /
                PD): <slug>.jpg hero + <slug>-2/-3.jpg gallery. Attribution
                per file in downloads/photos/credits.txt. Thumbnails
                everywhere use these photos; 3D appears ONLY in the
                /models/[slug] scroll experience. ALL files carry a uniform
                cinematic grade (darken/desaturate/contrast/vignette) baked
                in by tools/grade-photos.mjs (sharp; maps downloads/photos
                sources → public/cars, so re-running is idempotent — edit
                the MAP there to change a photo). Heroes were picked for
                dark/moody settings (Petersen Museum GT40 + Supra, USAF
                "Vapor" Challenger at dusk, night unveilings).
                **Gotcha: `.next/cache/images` survives rebuilds — after
                replacing files in public/, delete it or the optimizer
                serves stale variants.**
tools/          verify.mjs (Playwright e2e: images, vault-card click, form,
                sections), perf-probe.mjs (headed GPU scroll-fps probe),
                shots.mjs (screenshots). Run against `npx next start -p 3100`
                with $env:BASE. playwright is a devDependency.
```

## Conventions & gotchas (IMPORTANT for any new work)

1. **Tailwind-first**: utilities inline in JSX, exact values via arbitrary
   classes (`text-[clamp(...)]`, `[-webkit-text-stroke:2px_var(--color-cream)]`).
   Custom classes live ONLY in `globals.css` `@layer components` for: JS-toggled
   states (`.reveal/.visible`, `.mw/.on`, cursor `.is-hover/.is-label`,
   `.arc-preview/.show/.on`), pseudo-element patterns (`.btn-red::before`,
   `.eyebrow::after`), keyframe entrances (`.hero-char`, `.hero-fade`), and
   repeated patterns (`.wrap`, `.eyebrow`, `.h2`, `.sec`, `.sec-top`,
   `.text-outline`, `.btn*`).
2. **Theme tokens** (`@theme`): colors `night #0a0a0b, coal #070708, panel
   #101012, cream #f2f1ec, ash #8e8d86, veloce #e10600, veloce-dark, line
   rgba(255,255,255,.09)`; easings `ease-out-expo`, `ease-in-out-hard`;
   animations `animate-mq/dash/rise/kenburns`.
3. **Tailwind v4 transform trap**: `translate-*/scale-*/rotate-*` utilities use
   STANDALONE CSS properties. Any element whose transform is set from JS
   (`el.style.transform`) must use arbitrary `[transform:...]` for its initial
   state (e.g. progress bars use `[transform:scaleX(0)]`), or the two stack.
4. **`stacked` custom variant** = `@media (max-width:860px), (prefers-reduced-motion:
   reduce)` — used for the showroom gallery fallback. JS gallery activates at
   `min-width:861px` to match.
5. **`js` class gating**: inline script in layout head adds `js` to `<html>`;
   CSS guards `html.js .reveal`, `html.js .hero-char`, cursor `cursor:none`
   so the site works without JS.
6. **Smooth scroll** (`useSmoothScroll`): document click listener in CAPTURE
   phase; handles `#id` and same-page `/#id`; calls `preventDefault()` so
   Next `<Link>` (which checks `defaultPrevented`) yields. Cross-page `/#id`
   links fall through to Link. Nav/menu/footer use `<Link>` for everything.
7. **Effects re-binding**: hooks query `document` once on mount; `RouteEffects`
   remounts `GlobalEffects` keyed by `usePathname()` so every navigation
   re-runs them against the new DOM.
8. **Preloader** plays once per session (module-level `hasPlayed` flag),
   home route only. It adds `loaded` to `<html>` when it lifts (or instantly
   when skipped); hero-char/hero-fade/kenburns animations are gated on
   `html.loaded` — never give them fixed delays, hydration timing varies.
9. **template.tsx must not leave a transform on `.page-enter`**: a filled
   `transform` (even identity) makes the wrapper the containing block for all
   `position:fixed` descendants (broke the archive cursor preview). The class
   is removed onAnimationEnd, and the wipe/rise only plays on client
   navigations (module `hasNavigated` flag), not on first load.
10. **All motion respects** `prefers-reduced-motion` (global kill rule + per-hook
    guards) and pointer effects check `(pointer:fine)`.
11. **3D**: each car has `model: { url, yaw?, credit }` in cars.ts pointing at
    its own GLB; CarCanvas normalizes/repaints any GLB (see file map). Scroll
    progress lives in a mutable ref (no React state per frame); only the stage
    index is state. Canvas renders after `mounted` state to dodge SSR.

## DONE 2026-06-12 — realistic Sketchfab models swapped in

All 7 cars now use realistic models (all **CC-BY-4.0**, per-car credit lines
in `cars.ts`; sources + zips in `downloads/`, see `downloads/MODELS.md`):
La Voiture Noire (royale), SF90 XX (furia), 911 GT3 (vento-rs), DB11
(tempesta-v12, Hari's — the Black Snow one was downloaded too but unused),
Centenario (giallo-gt), Audi R8 (notte-v10), Tesla Roadster (volt-zero).
Pipeline: `npx @gltf-transform/cli optimize scene.gltf out.glb --compress
draco --texture-compress webp --texture-size 1024 --palette false`
(all GLBs ≤1.9 MB). Visual QA via `node tools/yaw-check.mjs [slugs…]`
(screenshots hero+mid per car against a running dev server, $env:BASE);
`tools/mat-rank.mjs <scene.gltf>` ranks materials by tris to find body
materials; `tools/glb-probe.mjs </models/x.glb>` prints per-mesh bboxes
in a real browser (draco-capable).

Per-car overrides that the heuristics could NOT infer (all in cars.ts):
`yaw: Math.PI` royale + tempesta-v12 (models nose −Z); explicit
`bodyMaterials` for royale (`lavoiturecsr2_coloured…` — authored black, the
non-black heuristic skips it), tempesta-v12 (`Body_Color` — "Painted_Black"
trim outranks it AND matches /paint/), giallo-gt (`Carbon_R` + `Material` —
authored carbon+orange), notte-v10 (`Car_Paint`, `Car_Paint.001`).

## DONE — Phase B (dynamic inventory + bookings + admin)

Built 2026-06-27, verified end-to-end against a live MongoDB Atlas cluster.
**Fallback-safe**: with no `MONGODB_URI` the whole site runs on the static
`src/data` content exactly as before — the DB is purely additive.

1. **MongoDB + Mongoose** — `src/lib/db.ts` (cached connection, returns `null`
   with no URI), `src/models/Car.ts` + `Booking.ts`. `src/lib/inventory.ts` is
   the single seam: `getCars()`/`getCar()` read DB-or-static and **merge the
   3D-rig config (paint/yaw/material names) from code by slug**, so DB stores
   only editable inventory and admin edits can't break the 3D scene. `/models`
   and `/models/[slug]` read through it. Seed with `npm run seed`
   (`scripts/seed.ts`, tsx, idempotent upsert by slug).
2. **Booking persistence** — `/test-drive` action writes to the `Booking`
   collection when a DB is configured, else validates/confirms only.
3. **Admin** (`/admin`) — **password + cookie auth** (not Auth.js; OAuth can be
   added later). `src/lib/session.ts` (HMAC-signed token, node:crypto),
   `src/lib/auth.ts` (cookie + `requireAuth`), **`src/proxy.ts`** (Next 16
   renamed `middleware`→`proxy`, Node runtime, guards `/admin/*`). Pages: login,
   dashboard, cars list + create/edit (`CarForm`, specs/gallery/track as JSON) +
   delete, bookings list + status + delete. Mutations re-check auth + DB.

**Site refactor**: marketing chrome (Nav/Footer/Cursor/effects) moved from the
root layout into a `(site)` route group so `/admin` renders on a clean shell.
URLs unchanged. Root layout is now just html/fonts/globals.

**Env vars** (`.env.example`): `MONGODB_URI`, `ADMIN_PASSWORD`, `SESSION_SECRET`
— all optional; set in `.env.local` (gitignored) and in Vercel for production.
Atlas network access must allow `0.0.0.0/0` for Vercel. `.env.local` is the only
config; nothing else is read (verified by grepping `process.env`).

### Still open (offered, not built)
- Home Showroom/Flagships/Archive still read their own static `src/data` files
  (not the DB) — wire them to Mongo if dynamic home content is wanted.
- Optional Resend email on booking; admin delete has no confirm step yet.

## DONE 2026-06-30 — giallo-gt ground gap + shadow-map warning

Two fixes on the `/models/[slug]` 3D scene, both in
`src/components/car3d/CarCanvas.tsx` (only file touched; no data/type changes):

1. **Car floated above the ground (giallo-gt only).** Root cause was **NOT** a
   stray low mesh — trap #8 / `Object_12` (the y=−0.51 shell) is correctly
   dropped by the area filter and never sets the ground line. The real cause:
   giallo-gt's GLB bakes a **rotation into the wheel node transforms**, and
   `Box3.setFromObject(mesh)` defaults to bounding the *rotated geometry's AABB
   corners*, which inflates ~0.13 units below the real tyre and lifted the whole
   car. Fix: `opaqueBox()` now calls **`setFromObject(mesh, true)`** (precise =
   bounds the actual vertices). General + safe: identical to before for
   axis-aligned meshes (furia and the rest are byte-for-byte unchanged), only
   tighter for rotated ones. Verified with an orthographic side-on render
   against a y=0 reference line — giallo now sits on its tyres, furia unchanged.
2. **Console warning** `THREE.WebGLShadowMap: PCFSoftShadowMap has been
   deprecated. Using PCFShadowMap instead.` three 0.184 deprecated
   `PCFSoftShadowMap` (what the boolean `<Canvas shadows>` selects) and silently
   falls back to `PCFShadowMap`. Set it explicitly: **`<Canvas
   shadows="percentage">`** (R3F maps `"percentage"` → `PCFShadowMap`). Same
   shadows, warning gone.

### Traps from this session
- `Box3.setFromObject(mesh)` bounds the geometry's local AABB *corners*
  transformed to world. For a mesh with a baked rotation (found-model wheels)
  that wrapper balloons well past the real vertices → floats the car. Use
  `setFromObject(mesh, true)` (precise) whenever the result drives grounding.
  This is distinct from trap #8 (which is about the area filter, still valid).
- R3F boolean `<Canvas shadows>` ⇒ `PCFSoftShadowMap`, deprecated in three 0.184
  (console warning + silent fallback). Use `shadows="percentage"` for
  `PCFShadowMap` explicitly (or `"soft"`/`"variance"` for the others).
- Debugging tip used here: an **orthographic** side render with a bright line at
  y=0 makes wheel-to-ground contact unambiguous; a perspective camera or a
  reference line not directly under the wheels will lie to you. Calibrate by
  rendering a known-good car (furia) alongside the suspect one.

## DONE 2026-07-01→03 — flagship swap (Gemera + Huayra) + fixes

**Two non-flagship cars swapped for two hypercars.** Removed `notte-v10`
(Audi R8) + `volt-zero` (Tesla), added `gemera` (Koenigsegg Gemera) + `huayra`
(Pagani Huayra BC). Main line is now **royale, furia, vento-rs, giallo-gt,
gemera, huayra** (6) + the unchanged classic line. Touched `cars.ts`,
`showroom.ts`, `flagships.ts` (now Gemera N°1 + Bugatti La Voiture Noire N°2),
`Footer.tsx`, and MongoDB (see DB note). `tsc --noEmit` clean; routes verified
200. 3D renders not yet eyeballed by the user (a `yaw`/`bodyMaterials` tweak may
still be wanted on either car).

- **Gemera** — Ddiaz "2021 Koenigsegg Gemera" GLB (CC-BY), optimized 15.8→1.8 MB
  → `public/models/gemera.glb`. Grey Graphite livery: `paint "#9aa0a6"`,
  `bodyMaterials: ["Koenigsegg_Gemera_2021Paint_Material"]`. 15 press photos
  graded into `public/cars/gemera*`.
- **Huayra** — Ddiaz "2020 Pagani Huayra Roadster BC" GLB (CC-BY-NC-SA — NC is
  fine for a showcase), optimized 21.7→2.34 MB → `public/models/huayra.glb`.
  Silver: `paint "#c9cccd"`,
  `bodyMaterials: ["Pagani_HuayraBCRoadsterLS_2019Paint_Material"]` (Carbon1
  panels + RED_PAINT pinstripe kept). 14 press photos graded into
  `public/cars/huayra*` (this car has **7 features**, not the usual 3). Full spec
  + image map: `downloads/HUAYRA-HANDOFF.md`. Review source photos kept in
  `downloads/photos/huayra-review/orig/` — re-grade from there to swap any image
  (source→`public/cars/huayra-*.jpg`, sharp grade brightness .9/sat .84/linear
  1.06,-10/vignette, width 1600).

**DB note (bit me):** `inventory.ts toProfile` takes `modelUrl` from the DB
(`doc.modelUrl || override.model.url`), so after changing a `model.url` in code
you MUST re-sync: `npx tsx scripts/sync-car.ts <slug>` — otherwise the stale DB
url wins. `seed.ts`/`sync-car.ts` only UPSERT — to REMOVE a car from the DB you
must `deleteMany({ slug })` yourself (done for notte-v10/volt-zero). `image` +
`gallery` are DB-backed (re-sync after editing); `highlights`/`features` come
from code (cars.ts) — no sync, but clear `.next/dev/cache/images` after
re-grading any file.

### Trap: Tailwind v4 @tailwindcss/oxide OOM (dev server 500s on every route)
Symptom: `npm run dev` says "Ready", then every route 500s; log = Turbopack
FATAL panic on `globals.css` with **`memory allocation of 2013265920 bytes
failed`** (os error 10054). Cause: Tailwind's oxide engine auto-scans the WHOLE
project (public/ images, downloads/) and tries to grab ~1.9 GB — fails on a
low-RAM (8 GB) box. Hits BOTH Turbopack and `next dev --webpack` (same engine).
NOT a code bug (tsc clean; deleting `.next` doesn't help). **Fix (permanent),
in `src/app/globals.css`:**

    @import "tailwindcss" source(none);
    @source "../";   /* scan src/ only — all TSX/TS live there */

Every route went 200 immediately after. (Freeing RAM also works, but this is
permanent + good practice.) Distinct from the image-optimizer deadlock (trap #5).

### PENDING — Cloudinary image CDN (in progress, blocked on user)
Goal: full-quality originals stay in the GitHub repo; images served via
Cloudinary (`f_auto`/`q_auto`/resize) so nothing is compressed locally.
**Cloud name: `dc6fd4ith`** (user's free account). Chosen plan = **UPLOAD mode**
(not fetch — fetch can't pull from `localhost` in dev, and the repo has a messy
uncommitted tree so a clean push isn't trivial): upload `public/cars/*` to
Cloudinary, then add a `next/image` **custom loader** so `/cars/x.jpg` renders as
`res.cloudinary.com/dc6fd4ith/image/upload/f_auto,q_auto,w_<width>/veloce/cars/x`
— **zero changes to cars.ts / the DB**. GLBs stay served from the repo.
**BLOCKED:** need an **UNSIGNED upload preset** (built-in `ml_default` is
signed-only → "must be whitelisted for unsigned uploads"). Next steps once the
user pastes the preset name: (1) `curl` upload every `public/cars/*.jpg` with
`-F upload_preset=<name> -F folder=veloce/cars -F public_id=<basename>`;
(2) add `src/lib/cloudinary-loader.ts` + `images: { loader:'custom',
loaderFile:'./src/lib/cloudinary-loader.ts' }` in next.config; (3) verify.
Scope still open (all cars vs. new-only). Alternative offered: fetch mode via a
clean GitHub push — user leaned upload.

### Git state (2026-07-03) — do not bulk-commit
Working tree = ~94 uncommitted changes on `main` (remote
`github.com/Subramaniyajothi6/veloce`), **including earlier-session work NOT from
the 2026-07 swap** (`CarCanvas.tsx`, `types.ts`, deleted `furia-*.jpg`,
`public/_review/`, `credits.txt`, `MODELS.md`). **Do NOT `git add -A`** — commit
deliberately. Nothing from the 2026-07 work is committed/pushed yet, so a
Cloudinary *fetch* approach (needs images on GitHub) isn't ready.

### Cleanup done
Removed the raw Huayra source GLB (21.7 MB) after optimizing, and the Huayra
review pages (`index/demo/compare.html` + `thumbs/`) — kept `orig/` for
re-grades. Gemera raw GLB (`downloads/2021_koenigsegg_gemera.glb`, 15.7 MB) still
present (offered to remove).

## PENDING — effect ideas offered to user (Codrops-style, not yet built)

WebGL distortion/ripple on image hover · image-trail following cursor on
/models · sticky stacked cards for Services · scroll-velocity letter stretch on
ghost headings · drag-to-explore gallery · infinite WebGL carousel for Archive.

## Verification checklist (after any change)

1. `npm run build` — must pass with 0 TS errors, 13+ routes.
2. `npm run dev` → check `/`, `/models`, `/models/furia` (3D loads, cinematic
   shots + letterbox work, page wipe plays on navigation), `/test-drive`
   (submit writes to `data/bookings.json`, invalid input shows field errors).
3. Automated: `npx next start -p 3100` then
   `$env:BASE="http://localhost:3100"; node tools/verify.mjs` (Playwright
   e2e). For 3D frame-rate use `node tools/perf-probe.mjs <slugs>` — it runs
   HEADED because headless WebGL is software-rendered and useless for perf.
4. Test reduced-motion (DevTools rendering emulation) and touch emulation —
   everything must degrade (stacked showroom, static 3D view, no cursor).
5. No hydration warnings in browser console.

## Session log — 2026-06-12 (all verified, build green)

- **Cinematic 3D scroll** on `/models/[slug]` (keyframed shots, letterbox,
  shot HUD, 6 specs each with `detail` captions).
- **Real photography everywhere** (3D only in the scroll experience), with a
  baked-in dark cinematic grade — see public/cars/ note above. To swap a
  photo: put the source in downloads/photos, edit MAP in
  tools/grade-photos.mjs, re-run it, delete `.next/cache/images`.
- **/test-drive booking flow** (all CTAs route there; `?car=` preselects).
- **Detail pages**: spec sheet → gallery → track band after the 3D section.
- **Furia stutter fixed**: GLB 6.2→2.7 MB; transmission glass neutralized in
  CarCanvas for all cars (it forced an extra full-scene render pass/frame).
- **"+27 in the vault" card**: verified clickable + navigates via Playwright;
  most likely the earlier jank made clicks feel dead.
- **Realistic 3D models swapped in** (second session same day) — see the
  "DONE 2026-06-12" section above. verify.mjs fixed along the way: the
  royale.jpg selector now matches next/image's encoded src, the scroll-perf
  check SKIPs under software WebGL, and the suite waits for the preloader to
  lift before clicking (was a flaky race).

### Trap list from this session (don't relearn these)

1. `"use server"` files may only export **async functions** — exporting a
   const object silently hands the client a broken action proxy.
2. `gltf-transform optimize` defaults include `palette` which merges/renames
   materials → kills the body-repaint heuristic. Always `--palette false`.
3. The Next image-optimizer cache survives rebuilds → stale photos after
   replacing files in public/. Delete it. **Path: in Next 16 + Turbopack DEV
   the cache is `.next/dev/cache/images`, NOT `.next/cache/images`** (the prod
   path). Clearing the wrong one does nothing; verify by requesting an
   un-cached width — if a fresh width is correct but a previously-loaded width
   is stale, you cleared the wrong dir. Browser also caches the optimized URL,
   so hard-refresh (Ctrl+Shift+R) after clearing.
4. PowerShell 5.1 `Get-Content`/`Set-Content` mojibakes UTF-8 (€ → â‚¬) —
   edit source files with proper tooling only.
5. Don't kill the Turbopack dev server's processes while sharing its `.next`
   (build daemon corrupts; fix = stop all project node processes, delete
   `.next`, rebuild).
6. `gltf-transform optimize`'s default `join`/`flatten` CORRUPTS models with
   animated nodes (giallo's wheels merged into a 3.5-unit-tall blob and broke
   grounding). Fix: add `--flatten false --join false` for that model.
7. The body-repaint heuristic fails two ways on found models: authored-BLACK
   bodies are skipped by the non-black rule (royale, giallo), and big trim
   materials named like "Painted_Black" win the /paint/ name match
   (tempesta). Fix = explicit `bodyMaterials` in cars.ts; find the right
   names with `tools/mat-rank.mjs`.
8. CarCanvas `opaqueBox` filters out meshes under 0.2% of total surface area —
   scattered micro-geometry (stray badges at y=−0.51 in giallo) must not set
   the ground line. Don't "simplify" that filter away.
9. Next 16 allows only ONE `next dev` per project (lockfile). If a dev server
   is already running (often the user's, port 3000), point tools at it via
   $env:BASE instead of starting another.
