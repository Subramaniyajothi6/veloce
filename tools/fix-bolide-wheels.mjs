/* The royale.glb (Bugatti Bolide, "X16 Gold" rip) bakes neon-green stripes into
   the two wheel textures (the tyre sidewall maps to a green region). We recolour
   those green pixels to near-black and write a fixed GLB, leaving the original
   untouched. Patch is IN-PLACE per image bufferView (new webp padded to the
   original byteLength, which RIFF/WEBP decoders honour) so no buffer re-layout /
   offset maths is needed — lowest risk.
   Usage: node tools/fix-bolide-wheels.mjs */
import fs from "fs";
import sharp from "sharp";

const IN = "public/models-old/royale.glb";
const OUT = "public/models-old/royale-classic.glb";

const buf = fs.readFileSync(IN);
const jsonLen = buf.readUInt32LE(12);
const json = JSON.parse(buf.slice(20, 20 + jsonLen).toString("utf8"));
const binStart = 12 + 8 + jsonLen + 8;
const binLen = buf.readUInt32LE(12 + 8 + jsonLen);
const out = Buffer.from(buf); // copy we mutate in place

const srcOf = (t) => {
  const tx = json.textures[t];
  return tx.source != null ? tx.source : tx.extensions.EXT_texture_webp.source;
};

/** Recolour bright-green pixels of a webp to near-black, return new webp bytes. */
async function degreen(data, q) {
  const { data: px, info } = await sharp(data).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  for (let i = 0; i < px.length; i += ch) {
    const r = px[i], g = px[i + 1], b = px[i + 2];
    if (g > 70 && g > r * 1.25 && g > b * 1.25) { px[i] = 18; px[i + 1] = 18; px[i + 2] = 20; }
  }
  return sharp(px, { raw: { width: info.width, height: info.height, channels: ch } }).webp({ quality: q }).toBuffer();
}

async function patchImage(texIdx) {
  const img = json.images[srcOf(texIdx)];
  const bv = json.bufferViews[img.bufferView];
  const off = binStart + (bv.byteOffset || 0);
  const orig = out.slice(off, off + bv.byteLength);
  // shrink quality until it fits the original slot (RIFF size header lets us pad)
  let q = 92;
  let webp = await degreen(orig, q);
  while (webp.length > bv.byteLength && q > 40) {
    q -= 12;
    webp = await degreen(orig, q);
  }
  if (webp.length > bv.byteLength) throw new Error(`tex#${texIdx} still too big (${webp.length} > ${bv.byteLength})`);
  out.fill(0, off, off + bv.byteLength);     // zero the slot
  webp.copy(out, off);                         // write new webp at the front
  console.log(`patched tex#${texIdx}: new ${webp.length}B / slot ${bv.byteLength}B (q${q})`);
}

await patchImage(10);
await patchImage(12);
fs.writeFileSync(OUT, out);
console.log("wrote", OUT, `(${out.length}B, original left intact)`);
