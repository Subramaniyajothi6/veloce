/* Headed capture of the 3D detail page at a phone viewport (headless WebGL
   screenshots hang on GPU readpixels — headed renders on the real GPU). */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = process.env.OUT ?? ".";
const SLUG = process.env.SLUG ?? "royale";
const W = 390, H = 844;

const browser = await chromium.launch({ headless: false });
const ctx = await browser.newContext({
  viewport: { width: W, height: H },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
const page = await ctx.newPage();

await page.goto(`${BASE}/models/${SLUG}`, { waitUntil: "networkidle" });
await page.waitForSelector("canvas");
await page.waitForTimeout(6000);
await page.screenshot({ path: `${OUT}/m3d-${SLUG}-intro.png` });
console.log("intro");

const sh = await page.evaluate(() => document.querySelector("section")?.offsetHeight ?? 0);
for (const p of [0.12, 0.3, 0.5, 0.72, 0.92]) {
  await page.evaluate((yy) => scrollTo(0, yy), Math.round((sh - H) * p));
  await page.waitForTimeout(2600);
  await page.screenshot({ path: `${OUT}/m3d-${SLUG}-${p}.png` });
  console.log(p);
}

await browser.close();
console.log("DONE");
