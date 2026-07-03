/* Grades the royale-classic (Bugatti Bolide) per-car photo set with the same
   cinematic look as the other grade scripts, so the new TopGear + Bugatti press
   shots read like the rest of the site.
   Raw sources live in public/cars/_incoming/bolide, output to public/cars.
   Usage: node tools/grade-royale-classic.mjs */
import sharp from "sharp";
import path from "path";

const SRC = "public/cars/_incoming/bolide";
const OUT = "public/cars";
const WIDTH = 1600;

/** public/cars output  ←  _incoming/bolide source (user-picked slots) */
const MAP = {
  "royale-classic-hero.jpg": "b17.jpg",    // HERO — blue front 3/4, low, dramatic studio
  "royale-classic-seats.jpg": "b06.jpg",   // H1 — carbon bucket seats (Le Mans skeleton)
  "royale-classic-cockpit.jpg": "b05.jpg", // H2 — cockpit, removable wheel (stripped for work)
  "royale-classic-aero.jpg": "b07.jpg",    // H3 — X-tail aero duct, red accent (surfaces earn keep)
  "royale-classic-panel.jpg": "b08.jpg",   // H4 — livery/body panel detail (forty, hand-finished)
  "royale-classic-exhaust.jpg": "b04.jpg", // F1 — twin exhausts + diffuser (1,600 PS)
  "royale-classic-wing.jpg": "b03.jpg",    // F2 — rear wing + Michelin slick (downforce you can see)
  "royale-classic-rear.jpg": "b10.jpg",    // F3 — rear 3/4 on track (built to be lapped)
  "royale-classic-wheel.jpg": "b26.jpg",   // F4 — detachable steering wheel + display (runs the car)
  "royale-classic-corner.jpg": "b18.jpg",  // G1 — front cornering on track (into the corner)
  "royale-classic-pov.jpg": "b21.jpg",     // G2 — cockpit POV, hands on wheel (from the seat)
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
