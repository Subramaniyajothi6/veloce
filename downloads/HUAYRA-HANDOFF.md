# Pagani Huayra BC — build handoff

**Status: 2026-07-03 — DONE. Real 3D model wired.**
2020 Huayra Roadster BC (Ddiaz Design, CC-BY-NC-SA) optimized 21.7→2.34 MB into
`public/models/huayra.glb`; body material `Pagani_HuayraBCRoadsterLS_2019Paint_Material`
repainted silver `#c9cccd`. Everything below is live.

## Identity
- **slug:** `huayra` · **name:** "Pagani Huayra BC" · **category:** "Track Hypercar" · **price:** €3,000,000
- Sits in the main flagship line after `gemera` (line is now 6 again).

## 3D model — THE ONE REMAINING STEP
No public no-login GLB exists (same as the Gemera). Download from Sketchfab
(your login), then it's a 2-line swap:
1. Open **[Black Snow — Pagani Huayra (Free)](https://sketchfab.com/3d-models/pagani-huayra-free-c2d61a9f53a54a229547bb76e4b71e25)** → confirm CC-BY + a **Download 3D Model** button → glTF → save as `downloads/pagani-huayra.zip` (or drop a `.glb` directly).
2. Tell Claude. Then: optimize (`gltf-transform optimize … --palette false`) → `public/models/huayra.glb`; find the body material via `tools/mat-rank.mjs`; set `bodyMaterials` + a silver `paint`; tune `yaw`; update `model.credit`.

**Placeholder now:** `model.url = /models/furia.glb`, `paint = #c9cccd` (silver),
`credit = "Pagani Huayra BC — 3D model pending"`. Swap `url` → `/models/huayra.glb`
and drop the placeholder note once the real model is in.

## Photos — locked lineup (graded into public/cars/)
Sources in `downloads/photos/huayra-review/orig/`; mixes the **red-stripe BC
Roadster** (Road&Track, tan interior) + the **blue-stripe BC Coupé** (TopGear).

| public/cars | source | slot |
|---|---|---|
| `huayra.jpg` | `hr-126` | `image` (overview + grid thumb) |
| `huayra-track.jpg` | `hr-113` | highlight 1 — Homologated for the track |
| `huayra-gullwing.jpg` | `tg-157` | highlight 2 — Gullwing theatre |
| `huayra-wind.jpg` | `hr-120` | highlight 3 — Named for the wind |
| `huayra-aero.jpg` | `tg-60` | highlight 4 — Aerodynamics that think |
| `huayra-engine.jpg` | `tg-48` | feature 1 — 800 hp AMG V12 |
| `huayra-jewel.jpg` | `hr-117` | feature 2 — Finished like jewellery |
| `huayra-bay.jpg` | `hr-116` | feature 3 — Nothing left hidden |
| `huayra-cockpit.jpg` | `hr-108` | feature 4 — Cockpit like a watch |
| `huayra-cabin.jpg` | `hr-110` | feature 5 — Two seats, tailored |
| `huayra-wheels.jpg` | `hr-130` | feature 6 — Track rubber, road plates |
| `huayra-flaps.jpg` | `hr-129` | feature 7 — Aero, worked into the body |
| `huayra-g1.jpg` | `tg-67` | gallery 1 |
| `huayra-g2.jpg` | `tg-93` | gallery 2 |

## Files touched
- `src/data/cars.ts` — new `huayra` entry (specs, copy, images, placeholder model)
- `src/data/showroom.ts` — Huayra card
- `src/components/Footer.tsx` — Huayra models link
- MongoDB — `npx tsx scripts/sync-car.ts huayra` (image/gallery/specs are DB-backed)
- Review/demo: `downloads/photos/huayra-review/{index,demo}.html`

## Provenance
Press/dealer photos (Road&Track/Hearst + TopGear), not CC — showcase use, per owner.
