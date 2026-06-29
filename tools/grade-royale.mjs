/* Grades the royale (Bugatti La Voiture Noire) per-car photo set with the same
   cinematic look as grade-new.mjs, so the new shots read like the rest of the
   site. Raw sources live in downloads/photos/_raw, output to public/cars.
   Usage: node tools/grade-royale.mjs */
import sharp from "sharp";
import path from "path";

const SRC = "downloads/photos/_raw";
const OUT = "public/cars";
const WIDTH = 1600;

/** public/cars output ← downloads/photos/_raw source */
const MAP = {
  "royale.jpg": "royale-hero.jpg",        // studio front 3/4 elevated (hero + thumbnail)
  "royale-top.jpg": "royale-top.jpg",     // overhead top-down, carbon surface
  "royale-rear34.jpg": "royale-rear34.jpg", // studio rear 3/4
  "royale-location.jpg": "royale-location.jpg", // outdoor front 3/4 on location
  "royale-head-on.jpg": "royale-head-on.jpg",   // head-on front
  "royale-rear.jpg": "royale-rear.jpg",   // direct rear, six exhausts
  "royale-exhaust.jpg": "royale-exhaust.jpg",   // rear detail, titanium tailpipes
  "royale-detail.jpg": "royale-detail.jpg",     // front detail, grille + wheel + cabin
  "royale-mood.jpg": "royale-mood.jpg",   // ultra-dark glowing taillight
  "royale-spine.jpg": "royale-spine.jpg", // high-angle rear, dorsal spine
};

/** Radial vignette: transparent center, dark corners. */
function vignetteSvg(w, h) {
  return Buffer.from(
    `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="v" cx="50%" cy="46%" r="72%">
          <stop offset="55%" stop-color="black" stop-opacity="0"/>
          <stop offset="100%" stop-color="black" stop-opacity="0.5"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#v)"/>
    </svg>`
  );
}

for (const [out, src] of Object.entries(MAP)) {
  const img = sharp(path.join(SRC, src)).rotate().resize({ width: WIDTH, withoutEnlargement: true });
  const { width, height } = await img.clone().toBuffer({ resolveWithObject: true }).then((r) => r.info);
  await img
    .modulate({ brightness: 0.9, saturation: 0.84 })
    .linear(1.06, -10)
    .composite([{ input: vignetteSvg(width, height), blend: "multiply" }])
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(path.join(OUT, out));
  console.log(`graded ${out}  <-  ${src}`);
}
console.log("done");
