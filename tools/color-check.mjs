/* Headless screenshots to verify (a) each car's body repaint matches its
   thumbnail and (b) the intro title sits behind the car. Captures a hero
   frame (title visible) and a mid-scroll body frame. Usage:
   BASE=http://localhost:3000 node tools/color-check.mjs royale furia ... */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const slugs = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["royale", "furia", "vento-rs", "giallo-gt"];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1100, height: 720 } });

for (const slug of slugs) {
  await page.goto(`${BASE}/models/${slug}`, { waitUntil: "networkidle" });
  await page.waitForSelector("canvas");
  await page.waitForTimeout(4500); // GLB load + first frames + title settle
  await page.screenshot({ path: `tools/color-${slug}-hero.png` });
  // scroll ~12% so the intro title fades but the hero shot still frames the car
  await page.evaluate(() => {
    const s = document.querySelector("section");
    scrollTo(0, (s.offsetHeight - innerHeight) * 0.12);
  });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `tools/color-${slug}-body.png` });
  console.log(slug, "done");
}

await browser.close();
