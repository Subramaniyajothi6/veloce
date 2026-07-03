/* Grades the giallo-gt (Lamborghini Centenario) per-car photo set with the same
   cinematic look as grade-royale.mjs, so the new official Lamborghini press shots
   read like the rest of the site. Raw sources live in downloads/photos/_raw,
   output to public/cars.
   Usage: node tools/grade-giallo.mjs */
import sharp from "sharp";
import path from "path";

const SRC = "downloads/photos/_raw";
const OUT = "public/cars";
const WIDTH = 1600;

/** public/cars output ← downloads/photos/_raw source (Lamborghini press set) */
const MAP = {
  "giallo-gt.jpg": "giallo-new-1.jpg",        // studio front 3/4 elevated (hero + thumbnail)
  "giallo-gt-rear.jpg": "giallo-new-2.jpg",   // dead-rear, engine deck + triple exhaust + diffuser
  "giallo-gt-rear34.jpg": "giallo-new-3.jpg", // studio rear 3/4, carbon haunches + wing
  "giallo-gt-exhaust.jpg": "giallo-new-4.jpg",// triple-exhaust + CENTENARIO badge detail
  "giallo-gt-motion.jpg": "giallo-new-5.jpg", // dynamic rear 3/4 on road, rear wing raised
  "giallo-gt-cabin.jpg": "giallo-int-1.jpg",  // wide full cabin, dash + wheel + cluster + console (hi-res upgrade)
  // second batch (Jun 29) — higher-res 16:9 press + real TopGear track shots
  "giallo-gt-storm.jpg": "giallo-more-1.jpg",      // dynamic front 3/4 on road, storm sky (gallery)
  "giallo-gt-side.jpg": "giallo-more-4.jpg",       // clean studio side profile (ENG2 rear-steer)
  "giallo-gt-track-front.jpg": "giallo-more-6.jpg",// REAL on-track front 3/4 cornering (gallery)
  "giallo-gt-track-rear.jpg": "giallo-more-7.jpg", // REAL on-track rear 3/4 at speed (gallery)
  // third pass (Jun 29) — user-selected from the review sheet
  "giallo-gt-headon.jpg": "giallo-more-3.jpg",     // clean head-on studio (H1)
  "giallo-gt-rear-road.jpg": "giallo-more-2.jpg",  // dynamic rear 3/4 on road, wing up (H3)
  "giallo-gt-console.jpg": "giallo-int-2.jpg",     // centre-console detail, drive-mode selector (feature)
  "giallo-gt-cluster.jpg": "giallo-int-3.jpg",     // digital instrument cluster, hex motif (feature)
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
