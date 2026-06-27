/* Mobile audit: capture every page/section at a phone viewport. */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = process.env.OUT ?? ".";
const W = 390, H = 844;

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: W, height: H },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
});
const page = await ctx.newPage();

async function shot(name) {
  await page.screenshot({ path: `${OUT}/m-${name}.png` });
  console.log("shot", name);
}

// ---------- HOME ----------
await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(3500); // let preloader lift
await shot("home-01-hero");

// step down the page in viewport-height chunks
const total = await page.evaluate(() => document.body.scrollHeight);
let y = 0, idx = 2;
while (y < total) {
  y += Math.round(H * 0.92);
  await page.evaluate((yy) => scrollTo(0, yy), y);
  await page.waitForTimeout(900);
  await shot(`home-${String(idx).padStart(2, "0")}`);
  idx++;
  if (idx > 16) break;
}

// ---------- MODELS GRID ----------
await page.goto(`${BASE}/models`, { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
await shot("models-01-top");
await page.evaluate(() => scrollTo(0, 700));
await page.waitForTimeout(900);
await shot("models-02");
await page.evaluate(() => scrollTo(0, 1600));
await page.waitForTimeout(900);
await shot("models-03");

// ---------- MODEL DETAIL (3D) ----------
await page.goto(`${BASE}/models/royale`, { waitUntil: "networkidle" });
await page.waitForSelector("canvas").catch(() => {});
await page.waitForTimeout(6000);
await shot("detail-01-intro");
const sh = await page.evaluate(() => document.querySelector("section")?.offsetHeight ?? 0);
for (const p of [0.15, 0.35, 0.6, 0.85]) {
  await page.evaluate((yy) => scrollTo(0, yy), Math.round((sh - H) * p));
  await page.waitForTimeout(2500);
  await shot(`detail-${p}`);
}
// sections below 3D
await page.evaluate(() => scrollTo(0, document.body.scrollHeight - H * 3));
await page.waitForTimeout(1500);
await shot("detail-specs");
await page.evaluate(() => scrollTo(0, document.body.scrollHeight - H));
await page.waitForTimeout(1500);
await shot("detail-bottom");

// ---------- TEST DRIVE ----------
await page.goto(`${BASE}/test-drive?car=royale`, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await shot("testdrive-01");
await page.evaluate(() => scrollTo(0, 700));
await page.waitForTimeout(800);
await shot("testdrive-02");

await browser.close();
console.log("DONE");
