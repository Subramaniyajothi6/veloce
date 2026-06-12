# Realistic 3D models — download list (Sketchfab)

> **STATUS: DONE 2026-06-12.** All 7 downloaded (all CC-BY-4.0 — exact credit
> lines in each zip's license.txt), optimized, and wired into
> `public/models/`. DB11 = Hari's version. See HANDOFF.md for the per-car
> `yaw`/`bodyMaterials` overrides and the giallo `--flatten false --join
> false` exception. This file is kept for re-download provenance.

Sketchfab requires a logged-in account to download (a free account is enough —
"Sign up" with Google works). Claude cannot do this step programmatically.

## How to download (per car)

1. Open the link, check the license line near the author name — it should say
   **"CC Attribution"** (avoid "NonCommercial / ShareAlike" if a backup offers
   plain Attribution; NC is acceptable for this portfolio project if needed).
2. Click **Download 3D Model** → under *Converted formats* pick **glTF** →
   a `.zip` downloads.
3. Rename the zip to the car slug below (e.g. `royale.zip`) and put it in
   `D:\New website\veloce\downloads\`.
4. Tell Claude the zips are in — conversion/optimization/wiring is automated
   from there (gltf-transform, draco, `--palette false`, per-car yaw + credit).

## The list

| slug (zip name) | Car on site | Real car | Pick | Verified |
|---|---|---|---|---|
| `royale.zip` | Royale | Bugatti La Voiture Noire | [SINNIK](https://sketchfab.com/3d-models/bugatti-la-voiture-noire-b713f2e7c48842c194084cf42b0b7a5f) · [MattDoesBlender](https://sketchfab.com/3d-models/bugatti-la-voiture-noire-b2c503c4858d4cb9817416ccb1da60d4) · [AGZ](https://sketchfab.com/3d-models/2019-bugatti-la-voiture-noire-e7ff9cafbcbf41d49153db3a485565e8) · [Ddiaz (NC-SA)](https://sketchfab.com/3d-models/2019-bugatti-la-voiture-noire-5a4f0bad5ecb4fccafa2ea36f9bfaeea) | Ddiaz: downloadable, CC-BY-**NC-SA**, 239.8k tris. Others: check license on page |
| `furia.zip` | Furia | Ferrari SF90 XX Stradale | [Ddiaz Design](https://sketchfab.com/3d-models/2023-ferrari-sf90-xx-stradale-2c80c667232544649328cf3589921bcd) | ✓ free, **CC Attribution**, 262.7k tris |
| `vento-rs.zip` | Vento RS | Porsche 911 GT3 (992) | [Ddiaz Design](https://sketchfab.com/3d-models/2022-porsche-911-gt3-992-ba01afbaf32846e598db315be3507db3) | ✓ free, **CC Attribution**, 235.7k tris |
| `tempesta-v12.zip` | Tempesta V12 | Aston Martin DB11 | [Black Snow](https://sketchfab.com/3d-models/aston-martin-db11-0ce56f01b1ff40b3a4e36bc56873dbc7) · [Outlaw Games](https://sketchfab.com/3d-models/aston-martin-db11-81ca13960be6456aa9c26bb4bb124e4a) · [Haris3D](https://sketchfab.com/3d-models/2017-aston-martin-db11-52l-twin-turbo-v12-936854ba7dde46f09a47d355d433808c) | check license on page |
| `giallo-gt.zip` | Giallo GT | Lamborghini Centenario LP-770 | [SDC PERFORMANCE](https://sketchfab.com/3d-models/free-lamborghini-centenario-lp-770-f70732dbd53c4c9daef0b9904d51dd5a) | ✓ free, **CC Attribution**, 245.1k tris |
| `notte-v10.zip` | Notte V10 | Audi R8 V10 | [kulonee](https://sketchfab.com/3d-models/audi-r8-d7fb18d450124225a97bdd4b2d122d59) · [artbyzia 2017](https://sketchfab.com/3d-models/audi-r8-2017-3702de6c13cb4829afba67aaf2e92963) · [Ddiaz (NC-SA)](https://sketchfab.com/3d-models/2023-audi-r8-coupe-v10-gt-rwd-0701d14ce550407f900df891316788f0) | Ddiaz: downloadable, CC-BY-**NC-SA**, 261.9k tris. Others: check license on page |
| `volt-zero.zip` | Volt Zero | Tesla Roadster 2020 | [metarex.4d](https://sketchfab.com/3d-models/tesla-roadster-2020-1fbf29e297bd4a17ac39a00a378441d8) | ✓ free, **CC Attribution**, 608.9k tris |

Any comparable downloadable model of the same car is fine if a link is dead —
note the author + license so the `model.credit` line in `src/data/cars.ts`
can be updated.

## What happens after the zips land (automated)

1. Unzip each, convert/optimize to GLB:
   `npx @gltf-transform/cli optimize in.gltf out.glb --compress draco --texture-compress webp --texture-size 1024 --palette false`
   (**`--palette false` is mandatory** — palette merging breaks the body-repaint heuristic.)
2. Replace `public/models/<slug>.glb`, tune per-car `yaw`, set `repaint: false`
   for models whose authored livery should be kept, update `model.credit`.
3. Verify: `npm run build`, then headed perf probe `node tools/perf-probe.mjs`.
