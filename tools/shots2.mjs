/* Screenshots: showroom mid-gallery, flagship Notte, models grid. */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3100";
const browser = await chromium.launch({ headless: false });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForTimeout(2500);
// scroll into the showroom horizontal gallery (vento/tempesta area)
await page.evaluate(() => {
  const s = document.querySelector(".showroom");
  const r = s.getBoundingClientRect();
  scrollTo(0, scrollY + r.top + (s.offsetHeight - innerHeight) * 0.55);
});
await page.waitForTimeout(1800);
await page.screenshot({ path: "tools/shot2-showroom.png" });

// flagship Notte section
await page.evaluate(() => {
  document.querySelector("#flagships")?.scrollIntoView();
  scrollBy(0, 300);
});
await page.waitForTimeout(1500);
await page.screenshot({ path: "tools/shot2-flagship.png" });

await page.goto(BASE + "/models", { waitUntil: "networkidle" });
await page.evaluate(() => scrollTo(0, 600));
await page.waitForTimeout(1500);
await page.screenshot({ path: "tools/shot2-grid.png" });

await browser.close();
console.log("done");
