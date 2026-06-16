/* Two diagnostic frames per car: an early intro frame (car large + title, to
   confirm the title sits BEHIND the car) and a clear mid-scroll frame (true
   body color). Usage: BASE=... node tools/frame-check.mjs royale furia ... */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const slugs = process.argv.slice(2);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 820 } });

const at = async (frac) =>
  page.evaluate((f) => {
    const s = document.querySelector("section");
    scrollTo(0, (s.offsetHeight - innerHeight) * f);
  }, frac);

for (const slug of slugs) {
  await page.goto(`${BASE}/models/${slug}`, { waitUntil: "networkidle" });
  await page.waitForSelector("canvas");
  await page.waitForTimeout(4500);
  await at(0.05); // intro push-in: car large, title still up — layering test
  await page.waitForTimeout(2200);
  await page.screenshot({ path: `tools/frame-${slug}-intro.png` });
  await at(0.42); // clear hold shot — true body color
  await page.waitForTimeout(2200);
  await page.screenshot({ path: `tools/frame-${slug}-color.png` });
  console.log(slug, "done");
}
await browser.close();
