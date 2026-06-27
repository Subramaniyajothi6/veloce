/* Detect horizontal overflow (elements wider than the viewport) on each page
   at a phone viewport, and capture the lower detail-page sections. */
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
});
const page = await ctx.newPage();

async function audit(path) {
  await page.goto(`${BASE}${path}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  const res = await page.evaluate((W) => {
    const docW = document.documentElement.scrollWidth;
    const offenders = [];
    document.querySelectorAll("*").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.right > W + 1) {
        offenders.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className || "").toString().slice(0, 60),
          right: Math.round(r.right),
          width: Math.round(r.width),
        });
      }
    });
    // de-dup-ish: keep widest 12
    offenders.sort((a, b) => b.right - a.right);
    return { docW, viewport: W, offenders: offenders.slice(0, 12) };
  }, W);
  console.log(`\n=== ${path} ===`);
  console.log(`docScrollWidth=${res.docW} viewport=${res.viewport} ${res.docW > res.viewport ? "<<< HORIZONTAL OVERFLOW" : "ok"}`);
  for (const o of res.offenders) console.log(`  ${o.tag}.${o.cls}  right=${o.right} w=${o.width}`);
}

for (const p of ["/", "/models", "/models/royale", "/test-drive?car=royale"]) {
  await audit(p);
}

// capture lower detail sections (HTML, fine in headless)
await page.goto(`${BASE}/models/royale`, { waitUntil: "networkidle" });
await page.waitForTimeout(2000);
const shots = [
  ["detail-story", 0.62],
  ["detail-specsheet", 0.72],
  ["detail-gallery", 0.82],
  ["detail-track", 0.9],
  ["detail-next", 1.0],
];
const bh = await page.evaluate(() => document.body.scrollHeight);
for (const [name, p] of shots) {
  await page.evaluate((y) => scrollTo(0, y), Math.round((bh - H) * p));
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/m-${name}.png` });
}
console.log("\nDONE");
await browser.close();
