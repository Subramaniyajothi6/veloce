/* One-off: grade the giallo-gt candidate shots that are NOT currently placed on the
   page into public/_review/giallo/ so they can be compared at the site's graded look
   in the giallo-review.html contact sheet. Safe to delete public/_review later.
   Usage: node tools/grade-giallo-review.mjs */
import sharp from "sharp";
import path from "path";
import { mkdirSync } from "fs";

const SRC = "downloads/photos/_raw";
const OUT = "public/_review/giallo";
const WIDTH = 1600;
mkdirSync(OUT, { recursive: true });

/** output ← raw source (candidates not on the page) */
const MAP = {
  "giallo-more-2.jpg": "giallo-more-2.jpg", // dynamic rear 3/4 on road, wing up (16:9)
  "giallo-more-3.jpg": "giallo-more-3.jpg", // clean head-on studio (16:9)
  "giallo-more-5.jpg": "giallo-more-5.jpg", // dead-rear engine deck (dup of giallo-gt-rear)
  "giallo-int-2.jpg": "giallo-int-2.jpg",   // console detail (yellow/blue)
  "giallo-int-3.jpg": "giallo-int-3.jpg",   // instrument cluster close-up (hex motif)
};

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
