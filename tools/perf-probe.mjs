/* GPU-backed scroll-perf probe for the 3D detail pages.
   Usage: node tools/perf-probe.mjs [slug ...] */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3100";
const slugs = process.argv.slice(2).length ? process.argv.slice(2) : ["royale", "furia"];

const browser = await chromium.launch({ headless: false });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

for (const slug of slugs) {
  await page.goto(`${BASE}/models/${slug}`, { waitUntil: "networkidle" });
  await page.waitForSelector("canvas", { timeout: 20000 });
  await page.waitForTimeout(5000); // GLB fetch + decode + first compile

  const r = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const section = document.querySelector("section");
        const span = section.offsetHeight - innerHeight;
        let frames = 0;
        let worst = 0;
        let over50 = 0;
        let last = performance.now();
        const t0 = last;
        const tick = (t) => {
          frames++;
          const d = t - last;
          if (d > worst) worst = d;
          if (d > 50) over50++;
          last = t;
          if (t - t0 < 5000) requestAnimationFrame(tick);
          else
            resolve({
              fps: Math.round((frames / (t - t0)) * 1000),
              worst: Math.round(worst),
              jankFrames: over50,
            });
        };
        requestAnimationFrame(tick);
        let i = 0;
        const scroller = setInterval(() => {
          i++;
          scrollTo(0, (span * (i % 25)) / 25);
          if (i >= 50) clearInterval(scroller);
        }, 100);
      })
  );
  console.log(`${slug}: avg ${r.fps} fps · worst frame ${r.worst}ms · frames>50ms: ${r.jankFrames}`);
}

await browser.close();
