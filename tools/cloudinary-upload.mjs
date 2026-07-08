// Upload public/cars/* to Cloudinary (UPLOAD mode, unsigned preset).
//
//   $env:CLOUDINARY_UPLOAD_PRESET="veloce_unsigned"; node tools/cloudinary-upload.mjs
//   node tools/cloudinary-upload.mjs <preset-name>
//
// Each file lands as public_id "veloce/cars/<name>" (extension dropped) so the
// next/image loader (src/lib/cloudinary-loader.ts) can map "/cars/x.jpg" 1:1.
// Re-running is safe: unsigned presets don't overwrite, existing ids are kept.
import { readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const CLOUD = "dc6fd4ith";
const PRESET = process.argv[2] || process.env.CLOUDINARY_UPLOAD_PRESET;
const DIR = fileURLToPath(new URL("../public/cars/", import.meta.url));
const ENDPOINT = `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`;
const TYPES = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif" };

if (!PRESET) {
  console.error("No preset. Pass it as the first arg or set CLOUDINARY_UPLOAD_PRESET.");
  process.exit(1);
}

const files = (await readdir(DIR)).filter((f) => TYPES[extname(f).toLowerCase()]);
console.log(`Uploading ${files.length} images from public/cars → ${CLOUD}/veloce/cars (preset: ${PRESET})`);

let ok = 0, skipped = 0, failed = 0;

async function uploadOne(name) {
  const publicId = `veloce/cars/${name.replace(/\.[^.]+$/, "")}`;
  const buf = await readFile(join(DIR, name));
  const form = new FormData();
  form.append("file", new Blob([buf], { type: TYPES[extname(name).toLowerCase()] }), name);
  form.append("upload_preset", PRESET);
  form.append("public_id", publicId);
  const res = await fetch(ENDPOINT, { method: "POST", body: form });
  const body = await res.json().catch(() => ({}));
  if (res.ok) {
    const existed = body.existing === true;
    existed ? skipped++ : ok++;
    console.log(`  ${existed ? "= exists" : "✓ up"}  ${publicId}  (${Math.round(buf.length / 1024)} KB)`);
  } else {
    failed++;
    console.error(`  ✗ FAIL  ${publicId} — ${body?.error?.message || res.status}`);
  }
}

// modest concurrency, one retry per file
const queue = [...files];
async function worker() {
  for (let name = queue.shift(); name; name = queue.shift()) {
    try {
      await uploadOne(name);
    } catch (e) {
      try { await uploadOne(name); } catch (e2) { failed++; console.error(`  ✗ FAIL  ${name} — ${e2.message}`); }
    }
  }
}
await Promise.all(Array.from({ length: 4 }, worker));

console.log(`\nDone: ${ok} uploaded, ${skipped} already existed, ${failed} failed.`);
if (!failed) {
  const probe = `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,w_640/veloce/cars/royale`;
  const r = await fetch(probe, { method: "HEAD" });
  console.log(`Delivery probe ${r.status === 200 ? "OK" : "FAILED (" + r.status + ")"}: ${probe}`);
}
process.exit(failed ? 1 : 0);
