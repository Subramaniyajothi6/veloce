/**
 * Sync ONE car's editable inventory from `src/data/cars.ts` into MongoDB.
 *
 *   npx tsx scripts/sync-car.ts <slug>
 *
 * Same upsert shape as `scripts/seed.ts`, but scoped to a single slug so editing
 * one car's gallery / hero image / specs in code can be pushed live without
 * touching (or clobbering) any other car's DB document. The 3D-rig internals and
 * the editorial highlights/features stay in code and are merged by
 * `src/lib/inventory.ts`; only the DB-backed fields are written here.
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

  const slug = process.argv[2];
  if (!slug) {
    console.error("✗ Usage: npx tsx scripts/sync-car.ts <slug>");
    process.exit(1);
  }

  const c = cars.find((car) => car.slug === slug);
  if (!c) {
    console.error(`✗ No car with slug "${slug}" in src/data/cars.ts.`);
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("✗ MONGODB_URI is not set. Add it to .env.local, then re-run.");
    process.exit(1);
  }

  await mongoose.connect(uri);

  const res = await CarModel.updateOne(
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
      },
    },
    { upsert: true }
  );

  const how = res.upsertedCount ? "inserted" : res.modifiedCount ? "updated" : "already in sync";
  console.log(`✓ "${slug}" ${how} in database "${mongoose.connection.name}" (gallery: ${c.gallery.length} photos).`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("✗ Sync failed:", err);
  process.exit(1);
});
