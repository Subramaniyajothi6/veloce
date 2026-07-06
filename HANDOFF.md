
# VELOCE Motors — Project Handoff

> Context document for continuing work in a new chat. Everything below is already
> built and verified unless marked **PENDING**. Last updated: **2026-07-05**.

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
routes prerender; detail pages via generateStaticParams).

## Routes

- `/` — full landing page: Preloader → Hero (split-char headline, Ken Burns bg)
  → Marquee (scroll-velocity skew) → Manifesto (scroll word-fill) → Showroom
  (pinned horizontal-scroll gallery) → Flagships (clip-path reveals + counters)
  → Pre-owned (parallax banner) → Services (hover rows) → Record (stat counters
  + quote) → Archive (hover list w/ cursor-trailing image preview) → Visit (CTA).
- `/models` — "The Range" grid of all cars.
- `/models/[slug]` — SSG detail pages. **Current lineup: royale, furia,
  vento-rs, giallo-gt, gemera, huayra** + a "classic" line (royale-classic,
  furia-classic). [notte-v10 (Audi R8) + volt-zero (Tesla) were REMOVED
  2026-07; gemera + huayra ADDED; tempesta-v12-classic (Supra Mk4) +
  notte-v10-classic (Challenger R/T) REMOVED 2026-07-05 — user will supply a
  replacement classic (wants cool/luxurious, good 3D model, great 4K photos).]
  **Cinematic 3D scroll experience** (pinned section, height = stages × 85vh
  where stages = specs.length + 2; R3F camera cuts between keyframed "shots" —
  low front hero, long-lens close-up, side profile, rear 3/4, overhead crane,
  tight nose — each with a slow dolly + fov lens change + handheld drift;
  6 specs per car appear shot by shot with a one-line `detail` caption;
  letterbox bars + bottom shot HUD during spec stages; scramble title;
  price/CTA outro) → story section → **full spec sheet** → **photo gallery**
  (`car.gallery`) → **track band** (`car.track`) → "Next in the range" strip.
  **Next 16 note: `params` is a `Promise` — must `await`.**
- `/test-drive` (dynamic, `?car=<slug>` preselects) — booking form:
  `BookingForm.tsx` (client, `useActionState`) → server action
  `app/test-drive/actions.ts` (validates; writes to Mongo `Booking` collection
  when configured, else NDJSON `data/bookings.json` — gitignored).
  **Gotcha: "use server" files may only export async functions.**
- `/admin` — password + cookie auth admin panel (see Phase B below).

## File map (src/)

```
app/
  layout.tsx        root: html/fonts/globals only (marketing chrome lives in
                    the (site) route group so /admin gets a clean shell)
  template.tsx      page transition: .page-wipe (red wipe) + .page-enter (rise)
  globals.css       @theme tokens + custom classes. NOTE: starts with
                    `@import "tailwindcss" source(none); @source "../";`
                    — scan src/ only (oxide OOM fix, do not remove)
  page.tsx          home (sections only + Preloader + skip link)
  models/page.tsx   range grid
  models/[slug]/page.tsx  detail page (await params, generateMetadata, notFound)
components/
  Nav, Footer, Cursor, ScrollProgress, ToTop, Noise, Preloader (client chrome)
  Hero, Marquee, Manifesto, Showroom, Flagships, Preowned, Services,
  RecordSection, Archive, Visit (server sections)
  GlobalEffects.tsx  mounts all document-level hooks, returns null
  RouteEffects.tsx   <GlobalEffects key={pathname}/> re-binds hooks per route
  cardetail/         Highlights / EngineeringFeatures / SpecCompare /
                     ModelSubNav (split out of models/[slug]/page.tsx 2026-06-29)
  car3d/CarCanvas.tsx     R3F canvas, lights, ground, CarModel (loads per-car
                          GLB from car.model.url; strips embedded lights /
                          cameras / KHR transmission; auto-normalizes any GLB:
                          uniform scale to 4.4 units, grounded via precise
                          opaque bbox, centered; repaints body materials —
                          explicit `bodyMaterials` list, else name/area
                          heuristic; optional `caliperColor`, `recolor`
                          (now with metalness/roughness), and **`partRecolor`**
                          — island split, see 2026-07-05 section),
                          Rig (keyframed cinematic shots from progressRef)
  car3d/CarExperience.tsx scrolly wrapper: stage state, spec overlays,
                          letterbox bars + shot HUD, vignette, scramble title,
                          progress rail, reduced-motion static fallback
hooks/   useReveal, useCounters, useParallax, useManifestoFill,
         useHorizontalScroll, useMagnetic, useSmoothScroll, useMarqueeSkew,
         useArchivePreview  (all StrictMode-safe with full cleanup)
lib/     motion.ts, raf.ts (ONE shared rAF loop), scroll.ts,
         db.ts (cached Mongo conn, null without URI), inventory.ts (DB-or-
         static seam; merges 3D rig config from code by slug), session.ts,
         auth.ts, cloudinary? (NOT yet — see PENDING), wheelSplit.js
         (vento-rs 5-zone wheel shader)
models/  Car.ts, Booking.ts (Mongoose)
proxy.ts Next 16 renamed middleware→proxy; guards /admin/*
data/    cars.ts (CarProfile[] — single source for /models pages, incl. 3D rig
         config), showroom.ts, flagships.ts, archive.ts, services.ts, stats.ts,
         locations.ts
types.ts CarProfile, CarModel3D (bodyMaterials/recolor/partRecolor/…), etc.
public/models/  one GLB per car slug; credits in cars.ts `model.credit`.
                Optimize pipeline: `npx @gltf-transform/cli optimize scene.gltf
                out.glb --compress draco --texture-compress webp --texture-size
                1024 --palette false` (+ `--flatten false --join false` for
                models with animated nodes).
public/cars/    real photography, uniform cinematic grade baked in by
                tools/grade-*.mjs (sharp). Mixed licensing: CC/PD Commons +
                knowingly-used © press shots (non-commercial demo only) —
                logged honestly in downloads/photos/credits.txt.
tools/          verify.mjs (Playwright e2e), perf-probe.mjs (headed GPU fps),
                frame-check.mjs / color-check.mjs (3D colour screenshots
                against a running server, $env:BASE), yaw-check.mjs,
                mat-rank.mjs (ranks .gltf materials), glb-probe.mjs (per-mesh
                bboxes in a real browser), grade-*.mjs (photo grading maps)
```

## Conventions & gotchas (IMPORTANT for any new work)

1. **Tailwind-first**: utilities inline in JSX, exact values via arbitrary
   classes. Custom classes ONLY in `globals.css` `@layer components` for
   JS-toggled states, pseudo-element patterns, keyframe entrances, and
   repeated patterns (`.wrap`, `.eyebrow`, `.h2`, `.sec`, `.btn*`, …).
2. **Theme tokens** (`@theme`): colors `night #0a0a0b, coal #070708, panel
   #101012, cream #f2f1ec, ash #8e8d86, veloce #e10600, veloce-dark, line
   rgba(255,255,255,.09)`; easings `ease-out-expo`, `ease-in-out-hard`.
3. **Tailwind v4 transform trap**: `translate-*/scale-*/rotate-*` are
   STANDALONE properties — elements whose transform is set from JS must use
   arbitrary `[transform:...]` for the initial state or the two stack.
4. **`stacked` custom variant** = `@media (max-width:860px), (prefers-reduced-
   motion: reduce)`; JS gallery activates at `min-width:861px` to match.
5. **`js` class gating** on `<html>` so the site works without JS.
6. **Smooth scroll**: document capture-phase click listener; `preventDefault()`
   so Next `<Link>` yields; cross-page `/#id` falls through to Link.
7. **Effects re-binding**: `RouteEffects` remounts `GlobalEffects` keyed by
   pathname.
8. **Preloader** plays once per session, home route only; entrance animations
   gate on `html.loaded`, never fixed delays.
9. **template.tsx must not leave a transform on `.page-enter`** (breaks
   position:fixed descendants); class removed onAnimationEnd; wipe only on
   client navigations.
10. **All motion respects** `prefers-reduced-motion`; pointer effects check
    `(pointer:fine)`.
11. **3D**: per-car `model` config in cars.ts; scroll progress in a mutable
    ref; only stage index is state; Canvas renders after `mounted`.

## DONE — 3D model fleet (2026-06-12 … 2026-07-03)

All cars use realistic CC-BY Sketchfab models (credits in cars.ts; sources in
`downloads/`, see `downloads/MODELS.md`). Per-car overrides the heuristics
can't infer live in cars.ts: `yaw: Math.PI` (royale), explicit `bodyMaterials`
(royale, giallo-gt, gemera, huayra, royale-classic…). Find material names with
`tools/mat-rank.mjs` (source .gltf) or a GLB JSON-chunk dump (optimized .glb).

- **Gemera** (2026-07-02): Ddiaz GLB 1.8 MB, grey `#9aa0a6`,
  `bodyMaterials: ["Koenigsegg_Gemera_2021Paint_Material"]`.
- **Huayra** (2026-07-03): Ddiaz GLB 2.34 MB, silver `#c9cccd`,
  `bodyMaterials: ["Pagani_HuayraBCRoadsterLS_2019Paint_Material"]`; this car
  has **7 features**, not 3. Full spec + image map: `downloads/HUAYRA-HANDOFF.md`.
- **vento-rs wheels** (2026-06-16): 5-zone per-fragment shader recolor in
  `src/lib/wheelSplit.js` (rim/tyre/disc/hub/caliper).
- **Grounding fix**: `opaqueBox()` uses `setFromObject(mesh, true)` (precise) —
  found-model wheels bake rotations that inflate the default AABB.
- `<Canvas shadows="percentage">` (three 0.184 deprecated PCFSoftShadowMap).

## DONE — Phase B (dynamic inventory + bookings + admin, 2026-06-27)

**Fallback-safe**: with no `MONGODB_URI` the site runs on static `src/data`.

1. **MongoDB + Mongoose** — `src/lib/inventory.ts` is the single seam:
   `getCars()`/`getCar()` read DB-or-static and **merge the 3D-rig config from
   code by slug** (DB stores only editable inventory — admin edits can't break
   the 3D scene). Seed: `npm run seed` (idempotent upsert).
2. **Booking persistence** — `/test-drive` writes to `Booking` when configured.
3. **Admin** (`/admin`) — password + HMAC-signed cookie (`src/lib/session.ts`,
   `auth.ts`, `src/proxy.ts` guards). Login, dashboard, cars CRUD, bookings.

**Env** (`.env.example`): `MONGODB_URI`, `ADMIN_PASSWORD`, `SESSION_SECRET` —
all optional, set in `.env.local` (gitignored).

**DB split trap (bites often):** hero `image`, `gallery`, `specs`, `track`,
`price`, `alt`, `description`, `modelUrl` come **from the DB** when configured;
`highlights[].image`, `features[].image`, the 3D rig and `paint` come **from
code**. After editing DB-backed fields in cars.ts you MUST re-sync:
`npx tsx scripts/sync-car.ts <slug>` (single-slug upsert; `npm run seed`
re-syncs ALL). To REMOVE a car from the DB:
`npx tsx scripts/remove-car.ts <slug> [<slug> ...]` (added 2026-07-05).

## DONE — car photo upgrade (2026-06-28 … 07-03, was IMAGE-UPGRADE-HANDOFF.md)

Each car gets ~10 image slots: hero · 4 highlights · 3+ features · 2 gallery.
Goal ≥6 distinct topic-matched images. **Completed: vento-rs, furia (recoloured
silver `#d2d6da`), royale (10 distinct), giallo-gt (12 distinct), furia-classic
(10 distinct + official 599XX specs), gemera + huayra (shot with their swaps).**
notte-v10 / volt-zero photo tasks are moot (cars removed); so are the Supra +
Challenger classics (removed 2026-07-05, replacement classic TBD from user).
**PENDING photos: royale-classic (Bolide).**

Workflow per car: user supplies shots → grade via a `tools/grade-<car>.mjs`
map (sharp, raws in `downloads/photos/_raw/`) → place in `public/cars/` with
descriptive names → wire cars.ts slots → update `downloads/photos/credits.txt`
honestly (press shots = © owner, non-commercial demo only; don't re-litigate) →
`npx tsx scripts/sync-car.ts <slug>` → verify with curl grep + tsc +
`node tools/frame-check.mjs <slug>` for 3D colour.

- **Image-cache trap:** Next 16 + Turbopack DEV caches optimized images at
  `.next/dev/cache/images` (NOT `.next/cache/images`). Clear + hard-refresh
  after replacing a file under the same name.
- **Browser-extension screenshots fail on the 3D pages** — use Playwright
  (`tools/frame-check.mjs`) for visual checks.
- **Git etiquette:** author is the user; **do NOT add a `Co-Authored-By:
  Claude` trailer**. Commit only when asked; push only when asked.

## DONE 2026-07-04/05 — royale rear "BUGATTI" script white + EB badge silver

The rear lettering + rear-deck EB badge on the La Voiture Noire now read
silver-white (matches the user's press-photo reference; user hand-tuned both
colors to `#C0C0C0` afterwards). Live-verified at `/models/royale` ≈0.6 scroll.

**New mechanism `partRecolor`** (types.ts + `recolorPartsInBox` in
CarCanvas.tsx): recolors only the **connected geometry islands** of a named
material whose bbox sits FULLY inside a box in the GLB's **raw world space**
(pre-yaw/normalize). Uses union-find over welded vertices, then splits the
mesh index into two draw groups (vertex data stays shared with drei's cached
scene — never mutate the cached geometry itself). The body-repaint pass is
array-aware to handle split meshes. Options: color, metalness, roughness,
**emissive** (intensity, same hue — needed because rear-facing faces get
almost no scene light). `recolor` also accepts metalness/roughness now.

**royale.glb material map (hours of probing — don't relearn):**
- The visible rear glyphs = the **7 overlay islands** in
  `lavoiturecsr2_light__env_50_spec` (that material is ALSO the headlight
  LEDs — never recolor it whole).
- `lavoiturecsr2_coloured__env_50_spec` (a BODY slot) contains letter BASES +
  a hex backing band in the same region — **painting those renders as a
  silver band behind dark letters** (first attempt, user rejected). It also
  holds the dorsal spine, mirror caps, and the EB deck badge (one 379-tri
  island at y 15–16.6).
- Front red macaron + side plaque = `lavoiturecsr2_badge` texture atlas —
  flat recolor turns the macaron into a blob; leave it.
- Orange taillight = `vehiclelights128__env_50_spec_RR` + a full-width
  smoked-red film `Matte__80800000__env_50_spec_trans` that sits IN FRONT of
  the letters.
- Current cars.ts config: `partRecolor` with the glyph box
  `[[-13,6.5,98.5],[13,10.2,102.5]]` on `…light…` (metalness .2, roughness
  .45, emissive .25) + EB box `[[-3,14.5,100],[3.5,16.6,103.6]]` on
  `…coloured…` (metalness .6, roughness .35, emissive .1), both `#C0C0C0`.

**Probing technique that finally worked:** per-material magenta tints miss
stacked/duplicate geometry — cluster the mesh into connected components
(union-find on welded verts) and inspect per-island bboxes, then select
islands by containment. Scratch probes were session-temp (not in repo);
`tools/glb-probe.mjs` + a GLB JSON-chunk dump get you started again.

**Dev-server note:** the long-running Turbopack server had wedged ("Jest
worker encountered 2 child process exceptions" on every page) — the fix is
kill node on :3000, delete `.next`, `npm run dev` (known deadlock trap; also
watch the oxide OOM trap below on this 8 GB box).

## DONE 2026-07-04 — FX demo prototypes (separate folder, not yet integrated)

7 Codrops-style effect prototypes live in **`D:\New website\effect-demos`**
(`view-demos.bat` serves them on :4600). User verdict: **KEEP** image-trail
(/models), sticky stacked cards (Services), headlight sweep, tachometer
counters, micro-polish pack; **REJECTED** heading letter-stretch + WebGL
distortion. **PENDING: integrate the keepers into the Next.js site.**

### Trap: Tailwind v4 @tailwindcss/oxide OOM (dev server 500s on every route)
Symptom: "Ready", then every route 500s; log = Turbopack FATAL panic on
`globals.css`, `memory allocation of 2013265920 bytes failed`. Cause: oxide
auto-scans the WHOLE project (public/, downloads/) wanting ~1.9 GB — fails on
this 8 GB box. **Permanent fix already in `globals.css`:**

    @import "tailwindcss" source(none);
    @source "../";   /* scan src/ only */

### PENDING — Cloudinary image CDN (blocked on user)
Plan = **UPLOAD mode**, cloud name `dc6fd4ith`: upload `public/cars/*` (curl,
`-F upload_preset=<name> -F folder=veloce/cars`), then a `next/image` custom
loader (`src/lib/cloudinary-loader.ts` + `images.loaderFile` in next.config) —
zero changes to cars.ts/DB. **BLOCKED: needs an UNSIGNED upload preset name
from the user** (built-in `ml_default` is signed-only).

### Git state — do not bulk-commit
Working tree has a large pile of uncommitted changes on `main` (remote
`github.com/Subramaniyajothi6/veloce`) spanning several sessions. **Do NOT
`git add -A`** — commit deliberately, only when the user asks, no
Co-Authored-By trailer.

## Verification checklist (after any change)

1. `npx tsc --noEmit` → 0 errors, then `npm run build` for real changes.
2. `npm run dev` → check `/`, `/models`, `/models/royale` (3D loads, cinematic
   shots + letterbox work, rear script silver at ≈0.6 scroll), `/test-drive`.
3. Automated: `npx next start -p 3100` then
   `$env:BASE="http://localhost:3100"; node tools/verify.mjs`. 3D colour:
   `node tools/frame-check.mjs <slug>`. Perf: `node tools/perf-probe.mjs`
   (HEADED — headless WebGL is software-rendered).
4. Test reduced-motion + touch emulation — everything must degrade.
5. No hydration warnings in console.

## Trap list (cumulative — don't relearn these)

1. `"use server"` files may only export **async functions**.
2. `gltf-transform optimize` defaults: `--palette false` always (palette
   merges materials → kills repaint); `--flatten false --join false` for
   models with animated nodes (else wheels merge into a blob).
3. Image-optimizer cache survives rebuilds; DEV path is
   `.next/dev/cache/images`. Browser also caches — hard-refresh.
4. PowerShell 5.1 `Get-/Set-Content` mojibakes UTF-8 — use proper tooling.
5. Don't kill the Turbopack dev server's processes while sharing its `.next`
   (corrupts; stop all node, delete `.next`, rebuild). Long-running dev
   servers also deadlock their image optimizer AND can wedge with "Jest
   worker" errors — restart clean first, it's usually not your code.
6. Body-repaint heuristic fails on authored-black bodies and "Painted_Black"
   trim names — use explicit `bodyMaterials`.
7. CarCanvas `opaqueBox` filters meshes under 0.2% surface area so stray
   micro-geometry can't set the ground line — don't simplify away.
8. Next 16 allows ONE `next dev` per project — point tools at the running
   server via `$env:BASE`.
9. Turbopack HMR does NOT reliably re-apply the 3D repaint after cars.ts
   edits — a clean rebuild (or at least a fresh headless page load) is
   authoritative; verify colours with frame-check, not the stale tab.
10. `Box3.setFromObject(mesh)` without `precise` bounds rotated-geometry AABB
    corners — floats cars off the ground.
11. Materials shared across car parts (CSR2 models): never whole-recolor a
    material without probing what else it covers; use `partRecolor` islands.
