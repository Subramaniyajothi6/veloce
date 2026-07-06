/**
 * Remove one or more cars from MongoDB by slug.
 *
 *   npx tsx scripts/remove-car.ts <slug> [<slug> ...]
 *
 * Counterpart to `scripts/sync-car.ts`: after a car is deleted from
 * `src/data/cars.ts`, its DB document keeps serving through
 * `src/lib/inventory.ts` until it is deleted here too.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import mongoose from "mongoose";
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

  const slugs = process.argv.slice(2);
  if (slugs.length === 0) {
    console.error("✗ Usage: npx tsx scripts/remove-car.ts <slug> [<slug> ...]");
    process.exit(1);
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("✗ MONGODB_URI is not set. Add it to .env.local, then re-run.");
    process.exit(1);
  }

  await mongoose.connect(uri);

  for (const slug of slugs) {
    const res = await CarModel.deleteMany({ slug });
    console.log(
      res.deletedCount
        ? `✓ "${slug}" removed from database "${mongoose.connection.name}" (${res.deletedCount} document${res.deletedCount === 1 ? "" : "s"}).`
        : `- "${slug}" not found in database "${mongoose.connection.name}" — nothing to remove.`
    );
  }

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("✗ Remove failed:", err);
  process.exit(1);
});
