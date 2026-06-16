/* Grades the real-car thumbnails (sourced from Wikimedia Commons) with the
   same cinematic look as grade-photos.mjs, so they read like the rest of the
   site. Raw sources live in downloads/photos/_raw, output to public/cars.
   Usage: node tools/grade-new.mjs */
import sharp from "sharp";
import path from "path";

const SRC = "downloads/photos/_raw";
const OUT = "public/cars";
const WIDTH = 1600;

const FILES = [
  "royale.jpg",
  "furia.jpg",
  "vento-rs.jpg",
  "giallo-gt.jpg",
  "notte-v10.jpg",
  "royale-classic.jpg",
  "furia-classic.jpg",
  "tempesta-v12-classic.jpg",
  "notte-v10-classic.jpg",
];

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

for (const f of FILES) {
  const img = sharp(path.join(SRC, f)).rotate().resize({ width: WIDTH, withoutEnlargement: true });
  const { width, height } = await img.clone().toBuffer({ resolveWithObject: true }).then((r) => r.info);
  await img
    .modulate({ brightness: 0.9, saturation: 0.84 })
    .linear(1.06, -10)
    .composite([{ input: vignetteSvg(width, height), blend: "multiply" }])
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(path.join(OUT, f));
  console.log(`graded ${f}`);
}
console.log("done");
