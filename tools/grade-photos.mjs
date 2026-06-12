/* Rebuilds public/cars/*.jpg from the raw downloads with a uniform
   cinematic grade (darken + desaturate + contrast + vignette) so all
   photography reads like one night-time brand shoot.
   Usage: node tools/grade-photos.mjs */
import sharp from "sharp";
import path from "path";

const SRC = "downloads/photos";
const OUT = "public/cars";
const WIDTH = 1600;

/** public/cars file ← downloads/photos source */
const MAP = {
  "royale.jpg": "royale-2.jpg",
  "royale-2.jpg": "royale-1.jpg",
  "royale-3.jpg": "royale-3.jpg",
  "furia.jpg": "furia-3.jpg",
  "furia-2.jpg": "furia-1.jpg",
  "furia-3.jpg": "furia-2.jpg",
  "vento-rs.jpg": "gt40-p1.jpg",
  "vento-rs-2.jpg": "vento-rs-1.jpg",
  "vento-rs-3.jpg": "gt40-mk4.jpg",
  "tempesta-v12.jpg": "supra-rad.jpg",
  "tempesta-v12-2.jpg": "tempesta-v12-3.jpg",
  "tempesta-v12-3.jpg": "tempesta-v12-2.jpg",
  "giallo-gt.jpg": "m8-first.jpg",
  "giallo-gt-2.jpg": "m850-a.jpg",
  "giallo-gt-3.jpg": "m8-whip.jpg",
  "notte-v10.jpg": "chal-vapor2.jpg",
  "notte-v10-2.jpg": "notte-v10-1.jpg",
  "notte-v10-3.jpg": "chal-vapor.jpg",
  "volt-zero.jpg": "volt-zero-1.jpg",
  "volt-zero-2.jpg": "volt-zero-2.jpg",
  "volt-zero-3.jpg": "volt-zero-3.jpg",
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
    .linear(1.06, -10) // gentle contrast, sink the shadows
    .composite([{ input: vignetteSvg(width, height), blend: "multiply" }])
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(path.join(OUT, out));
  console.log(`graded ${out}  <-  ${src}`);
}
console.log("done");
