/* Grade the chosen gallery photos for the 5 renamed main cars with the same
   cinematic look as the heroes (grade-new.mjs), writing to NEW -g1/-g2 files
   so the shared -2/-3 placeholders (still used by the classic line) are
   untouched. Sources: hand-picked candidates in downloads/gallery-cand. */
import sharp from "sharp";

const SRC = "downloads/gallery-cand";
const OUT = "public/cars";
const WIDTH = 1600;

/* picked candidate -> output gallery file (front 3/4, then rear/alt) */
const PICKS = [
  ["royale-2.jpg", "royale-g1.jpg"],
  ["royale-4.jpg", "royale-g2.jpg"],
  ["furia-2.jpg", "furia-g1.jpg"],
  ["furia-3.jpg", "furia-g2.jpg"],
  ["vento-rs-2.jpg", "vento-rs-g1.jpg"],
  ["vento-rs-7.jpg", "vento-rs-g2.jpg"],
  ["giallo-gt-2.jpg", "giallo-gt-g1.jpg"],
  ["giallo-gt-3.jpg", "giallo-gt-g2.jpg"],
  ["notte-v10-5.jpg", "notte-v10-g1.jpg"],
  ["notte-v10-2.jpg", "notte-v10-g2.jpg"],
];

const vignette = (w, h) =>
  Buffer.from(
    `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><defs>
      <radialGradient id="v" cx="50%" cy="46%" r="72%">
        <stop offset="55%" stop-color="black" stop-opacity="0"/>
        <stop offset="100%" stop-color="black" stop-opacity="0.5"/>
      </radialGradient></defs>
      <rect width="100%" height="100%" fill="url(#v)"/></svg>`
  );

for (const [src, out] of PICKS) {
  const img = sharp(`${SRC}/${src}`).rotate().resize({ width: WIDTH, withoutEnlargement: true });
  const { width, height } = (await img.clone().toBuffer({ resolveWithObject: true })).info;
  await img
    .modulate({ brightness: 0.9, saturation: 0.84 })
    .linear(1.06, -10)
    .composite([{ input: vignette(width, height), blend: "multiply" }])
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(`${OUT}/${out}`);
  console.log(`graded ${out}  (${width}x${height})`);
}
console.log("done");
