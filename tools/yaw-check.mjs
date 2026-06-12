/* Captures the 3D intro shot + a mid-scroll side shot for every car —
   used to eyeball model orientation (yaw) and body repaint after a swap. */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3210";
const slugs = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["royale", "furia", "vento-rs", "tempesta-v12", "giallo-gt", "notte-v10", "volt-zero"];

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

for (const slug of slugs) {
  await page.goto(`${BASE}/models/${slug}`, { waitUntil: "networkidle" });
  await page.waitForSelector("canvas");
  await page.waitForTimeout(5000); // GLB load + first frames
  await page.screenshot({ path: `tools/yaw-${slug}-hero.png` });
  await page.evaluate(() => {
    const s = document.querySelector("section");
    scrollTo(0, (s.offsetHeight - innerHeight) * 0.38);
  });
  await page.waitForTimeout(2500); // camera lerp settles
  await page.screenshot({ path: `tools/yaw-${slug}-mid.png` });
  console.log(slug, "done");
}

await browser.close();
