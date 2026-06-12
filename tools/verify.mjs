/* One-shot verification of the latest changes against a running server.
   Usage: node tools/verify.mjs */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const results = [];
const log = (name, ok, extra = "") =>
  results.push(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? " — " + extra : ""}`);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("pageerror", (e) => results.push(`PAGEERROR  ${e.message}`));

/* ---- 1. home: real images render ---- */
await page.goto(BASE, { waitUntil: "networkidle" });
// the preloader overlay (z-9500) swallows clicks until it lifts
await page
  .waitForFunction(() => document.documentElement.classList.contains("loaded"), { timeout: 15000 })
  .catch(() => results.push("WARN  preloader never lifted"));
/* next/image rewrites src to /_next/image?url=%2Fcars%2Froyale.jpg… —
   match the (still-literal) filename, not the encoded path */
const heroOk = await page
  .locator("img[src*='royale.jpg']")
  .first()
  .evaluate((el) => el.complete && el.naturalWidth > 0)
  .catch(() => "no-element");
log("home: showroom royale.jpg loads", heroOk === true, String(heroOk));

/* ---- 2. the vault card click ---- */
// scroll to the end of the pinned showroom so the card is on screen
await page.evaluate(() => {
  const showroom = document.querySelector(".showroom");
  const r = showroom.getBoundingClientRect();
  const bottom = window.scrollY + r.bottom - window.innerHeight;
  window.scrollTo(0, bottom - 4);
});
await page.waitForTimeout(1500); // let the lerp settle

const probe = await page.evaluate(() => {
  const card = document.querySelector('a[href="/models"][data-cursor="GO"]');
  if (!card) return { found: false };
  const r = card.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const onTop = document.elementFromPoint(cx, cy);
  return {
    found: true,
    rect: { x: Math.round(cx), y: Math.round(cy), w: Math.round(r.width) },
    visible: r.width > 0 && cy > 0 && cy < innerHeight && cx > 0 && cx < innerWidth,
    topElement: onTop
      ? onTop.tagName + "." + String(onTop.className).slice(0, 80)
      : "none",
    cardContainsTop: onTop ? card.contains(onTop) : false,
  };
});
results.push("vault probe: " + JSON.stringify(probe));

if (probe.found && probe.visible) {
  await page.mouse.click(probe.rect.x, probe.rect.y);
  await page.waitForTimeout(2200);
  log("vault card click navigates to /models", page.url() === BASE + "/models", page.url());
} else {
  log("vault card click navigates to /models", false, "card not visible after scroll");
}

/* ---- 3. /models grid + navigation to detail ---- */
await page.goto(BASE + "/models", { waitUntil: "networkidle" });
const gridImgs = await page.$$eval("a[href^='/models/'] img", (imgs) =>
  imgs.map((i) => ({ src: i.getAttribute("src"), ok: i.complete && i.naturalWidth > 0 }))
);
log("models grid: all images load", gridImgs.length >= 7 && gridImgs.every((i) => i.ok), `${gridImgs.length} imgs`);

/* ---- 4. furia detail: 3D canvas + new sections + scroll perf ---- */
await page.goto(BASE + "/models/furia", { waitUntil: "networkidle" });
await page.waitForSelector("canvas", { timeout: 20000 });
await page.waitForTimeout(4000); // GLB load + compile
const sections = await page.evaluate(() => ({
  specSheet: !!document.body.innerText.match(/EVERY\s+NUMBER/i),
  gallery: !!document.body.innerText.match(/SHOT ON\s+LOCATION/i),
  track: !!document.body.innerText.match(/TIMING TOWER/i),
  booking: !!document.querySelector('a[href="/test-drive?car=furia"]'),
}));
log("furia: spec sheet section", sections.specSheet);
log("furia: gallery section", sections.gallery);
log("furia: track section", sections.track);
log("furia: booking CTA", sections.booking);

// rough scroll-smoothness probe: count rAF frames during 4s of stepped scrolling
// (only meaningful on a real GPU — headless Chromium software-renders WebGL)
const renderer = await page.evaluate(() => {
  const gl = document.createElement("canvas").getContext("webgl");
  const ext = gl?.getExtension("WEBGL_debug_renderer_info");
  return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : "unknown";
});
const softwareGL = /swiftshader|software|llvmpipe/i.test(renderer);
const fps = await page.evaluate(
  () =>
    new Promise((resolve) => {
      let frames = 0;
      let longest = 0;
      let last = performance.now();
      const t0 = last;
      const tick = (t) => {
        frames++;
        longest = Math.max(longest, t - last);
        last = t;
        if (t - t0 < 4000) requestAnimationFrame(tick);
        else resolve({ fps: Math.round((frames / (t - t0)) * 1000), longest: Math.round(longest) });
      };
      requestAnimationFrame(tick);
      const span = document.querySelector("section").offsetHeight;
      let i = 0;
      const scroller = setInterval(() => {
        i++;
        window.scrollTo(0, (span * (i % 20)) / 20);
        if (i > 40) clearInterval(scroller);
      }, 100);
    })
);
if (softwareGL) {
  results.push(
    `SKIP  furia: scroll perf — software WebGL (${renderer}); run node tools/perf-probe.mjs for the real number`
  );
} else {
  log("furia: scroll perf", fps.fps >= 30 && fps.longest < 350, `avg ${fps.fps} fps, worst frame ${fps.longest}ms`);
}

/* ---- 5. booking form end-to-end ---- */
await page.goto(BASE + "/test-drive?car=royale", { waitUntil: "networkidle" });
const pre = await page.$eval("#bk-car", (el) => el.value);
log("test-drive: car preselected from URL", pre === "royale", pre);
await page.fill("#bk-name", "Playwright Tester");
await page.fill("#bk-email", "tester@example.com");
await page.selectOption("#bk-location", "Munich");
const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
await page.fill("#bk-date", tomorrow);
await page.click("button[type=submit]");
await page.waitForTimeout(2500);
const confirmed = await page.evaluate(() => /will be waiting/i.test(document.body.innerText));
log("test-drive: submission confirmed", confirmed);

/* ---- 6. validation errors path ---- */
await page.goto(BASE + "/test-drive", { waitUntil: "networkidle" });
await page.fill("#bk-name", "X");
await page.click("button[type=submit]");
await page.waitForTimeout(2000);
const hasErrors = await page.evaluate(() => /doesn't look right|Pick a/i.test(document.body.innerText));
log("test-drive: invalid form shows errors", hasErrors);

await browser.close();
console.log(results.join("\n"));
