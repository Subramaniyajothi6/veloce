/**
 * Seed MongoDB from the static car dataset (`src/data/cars.ts`).
 *
 *   npm run seed
 *
 * Requires `MONGODB_URI` (read from the environment or `.env.local`). Idempotent:
 * upserts by slug, so re-running updates existing cars rather than duplicating.
 * Only the editable inventory is stored — the 3D-rig internals stay in code and
 * are merged back by `src/lib/inventory.ts`.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import mongoose from "mongoose";
import { cars } from "../src/data/cars";
import { CarModel } from "../src/models/Car";

/** Minimal .env.local loader so the script works without dotenv. */
function loadEnvLocal() {
  try {
    const file = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of file.split("\n")) {
      const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (m && process.env[m[1]] === undefined)
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* no .env.local — rely on the ambient environment */
  }
}

async function main() {
  loadEnvLocal();

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("✗ MONGODB_URI is not set. Add it to .env.local, then re-run `npm run seed`.");
    process.exit(1);
  }

  await mongoose.connect(uri);

  let n = 0;
  for (let i = 0; i < cars.length; i++) {
    const c = cars[i];
    await CarModel.updateOne(
      { slug: c.slug },
      {
        $set: {
          slug: c.slug,
          name: c.name,
          category: c.category,
          price: c.price,
          tagline: c.tagline,
          description: c.description,
          image: c.image,
          alt: c.alt,
          paint: c.paint,
          modelUrl: c.model.url,
          specs: c.specs,
          gallery: c.gallery,
          track: c.track,
          order: i,
        },
      },
      { upsert: true }
    );
    n++;
  }

  console.log(`✓ Seeded ${n} cars into database "${mongoose.connection.name}".`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("✗ Seed failed:", err);
  process.exit(1);
});
