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
- `/models` — "The Range" grid of all 7 cars.
- `/models/[slug]` — SSG detail pages (royale, furia, vento-rs, tempesta-v12,
  giallo-gt, notte-v10, volt-zero): **3D scroll experience** (480vh pinned
  section; R3F camera orbits the car as you scroll; specs appear stage by
  stage; scramble title; price/CTA outro) → story section → "Next in the
  range" strip. **Next 16 note: `params` is a `Promise` — must `await`.**

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
                          Rig (camera orbit from progressRef)
  car3d/CarExperience.tsx scrolly wrapper: stage state, spec overlays, scramble
                          title, progress rail, reduced-motion static fallback
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
public/models/  one GLB per car slug (royale.glb … volt-zero.glb), currently
                low-poly CC-BY placeholders from poly.pizza (credits in
                cars.ts `model.credit`); car.glb is the old shared Ferrari
                (unused, kept until realistic models land)
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

## PENDING — swap placeholder 3D models for realistic Sketchfab ones

User wants realistic per-car models (placeholders are low-poly). User was given
7 Sketchfab links (CC-BY: La Voiture Noire, SF90 XX, 911 GT3, Centenario,
DB11, Audi R8, Tesla Roadster) and instructions to download glTF zips named
`<slug>.zip` into `D:\New website\veloce\downloads`. When they land: unzip,
convert/optimize to GLB (draco + texture resize via `npx @gltf-transform/cli`),
replace files in public/models/, tune per-car `yaw`, update `model.credit`,
and consider skipping the body repaint for textured realistic models (maybe a
`repaint: false` flag). Then delete unused public/models/car.glb.

## PENDING — Phase B (user explicitly wants this)

Approved plan exists (originally at
`C:\Users\subra\.claude\plans\what-if-we-want-parallel-hamming.md`):

1. **MongoDB Atlas + Mongoose**: `Car` collection seeded from `src/data/cars.ts`;
   cached connection helper `src/lib/db.ts`; swap data imports for DB queries
   in server components (the data files are the designed seam).
2. **Test-drive booking**: replace `mailto:` CTAs with a form → server action →
   `Booking` collection (+ optional email via Resend).
3. **Admin**: `/admin` route group, Auth.js, CRUD for cars.

## PENDING — effect ideas offered to user (Codrops-style, not yet built)

WebGL distortion/ripple on image hover · image-trail following cursor on
/models · sticky stacked cards for Services · scroll-velocity letter stretch on
ghost headings · drag-to-explore gallery · infinite WebGL carousel for Archive.

## Verification checklist (after any change)

1. `npm run build` — must pass with 0 TS errors, 12+ routes.
2. `npm run dev` → check `/`, `/models`, `/models/furia` (3D loads, scroll
   stages work, page wipe plays on navigation).
3. Test reduced-motion (DevTools rendering emulation) and touch emulation —
   everything must degrade (stacked showroom, static 3D view, no cursor).
4. No hydration warnings in browser console.
