/* Grades the furia-classic (Ferrari 599XX) per-car photo set with the same
   cinematic look as grade-giallo.mjs / grade-royale.mjs, so the new Ferrari
   press + RM Sotheby's auction shots read like the rest of the site.
   Raw sources live in downloads/photos/_raw, output to public/cars.
   Usage: node tools/grade-furia-classic.mjs */
import sharp from "sharp";
import path from "path";

const SRC = "downloads/photos/_raw";
const OUT = "public/cars";
const WIDTH = 1600;

/** public/cars output ← downloads/photos/_raw source (599XX set) */
const MAP = {
  // Hero is furia-classic-headon.jpg (#44 front head-on, below). The plain
  // furia-classic.jpg file is the old red/yellow #37 original (kept in git,
  // now unused) and is NOT generated here.
  "furia-classic-headon.jpg": "599xx-front.webp",       // static front head-on, #44 (HERO)
  "furia-classic-track-front.jpg": "599xx-track-front.jpg", // REAL on-track front 3/4 cornering, #95 Spa (H1 + gallery)
  "furia-classic-engine.jpg": "599xx-engine.webp",     // V12 engine bay, hood open (H2)
  "furia-classic-rear.jpg": "599xx-rear.webp",         // static rear 3/4, fixed wing + diffuser (H3)
  "furia-classic-cockpit.jpg": "599xx-cockpit.webp",   // cockpit, suede wheel + roll cage (H4)
  "furia-classic-track-side.jpg": "599xx-track-side.jpg",   // REAL on-track side/rear 3/4 at speed, #95 (ENG1 + gallery)
  "furia-classic-detail.jpg": "599xx-detail.webp",     // bonnet "599XX Programme" shield detail (ENG2)
  "furia-classic-cabin.jpg": "599xx-cabin.jpg",        // carbon dashboard + manettino (ENG3)
  "furia-classic-cockpit.jpg": "599xx-cockpit.webp",   // cockpit, suede wheel + roll cage (gallery)
  "furia-classic-rollcage.jpg": "599xx-rollcage.webp", // front structure, roll cage + electronics (gallery) — low-res 768px source
  "furia-classic-cluster.jpg": "599xx-cluster.webp",   // digital instrument cluster / telemetry display (H3) — low-res 768px source
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
