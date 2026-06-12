/* Screenshot helper: captures the 3D stage mid-scroll plus key pages. */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3100";
const browser = await chromium.launch({ headless: false });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

// furia mid-scroll: spec stage with letterbox + HUD
await page.goto(`${BASE}/models/furia`, { waitUntil: "networkidle" });
await page.waitForSelector("canvas");
await page.waitForTimeout(6000);
await page.evaluate(() => {
  const s = document.querySelector("section");
  scrollTo(0, (s.offsetHeight - innerHeight) * 0.3);
});
await page.waitForTimeout(2500);
await page.screenshot({ path: "tools/shot-furia-stage.png" });

// furia new sections below the 3D
await page.evaluate(() => {
  document.querySelector("figure")?.scrollIntoView({ block: "center" });
});
await page.waitForTimeout(1500);
await page.screenshot({ path: "tools/shot-furia-gallery.png" });

// models grid with real thumbnails
await page.goto(`${BASE}/models`, { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
await page.evaluate(() => scrollTo(0, 500));
await page.waitForTimeout(1200);
await page.screenshot({ path: "tools/shot-models-grid.png" });

// test drive form
await page.goto(`${BASE}/test-drive?car=furia`, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
await page.screenshot({ path: "tools/shot-test-drive.png" });

await browser.close();
console.log("done");
