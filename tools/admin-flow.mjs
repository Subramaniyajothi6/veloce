import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3001";
const OUT = process.env.OUT ?? ".";
const PW = process.env.PW ?? "veloce-dev-admin";
const W = 1280, H = 900;

const b = await chromium.launch({ headless: true });
const ctx = await b.newContext({ viewport: { width: W, height: H } });
const page = await ctx.newPage();
const wait = (ms) => page.waitForTimeout(ms);

// 1. unauth /admin -> redirected to login
await page.goto(`${BASE}/admin`, { waitUntil: "domcontentloaded" });
await wait(800);
console.log("1. /admin redirected to:", page.url());
await page.screenshot({ path: `${OUT}/adm-01-login.png` });

// 2. wrong password -> error
await page.fill('input[name="password"]', "totally-wrong");
await page.click('button[type="submit"]');
await wait(1500);
console.log("2. wrong-pw error visible:", await page.locator("text=Incorrect password").count());
await page.screenshot({ path: `${OUT}/adm-02-wrongpw.png` });

// 3. correct password -> dashboard
await page.fill('input[name="password"]', PW);
await page.click('button[type="submit"]');
await wait(2000);
console.log("3. after login url:", page.url());
console.log("   dashboard 'Control room' visible:", await page.locator("text=Control room").count());
await page.screenshot({ path: `${OUT}/adm-03-dashboard.png` });

// 4. cars list
await page.goto(`${BASE}/admin/cars`, { waitUntil: "domcontentloaded" });
await wait(800);
console.log("4. cars list has 'Bugatti La Voiture Noire':", await page.locator("text=Bugatti La Voiture Noire").count());
await page.screenshot({ path: `${OUT}/adm-04-cars.png` });

// 5. edit form populated
await page.goto(`${BASE}/admin/cars/royale`, { waitUntil: "domcontentloaded" });
await wait(800);
console.log("5. edit name value:", await page.inputValue('input[name="name"]'));
console.log("   specs textarea has content:", (await page.inputValue('textarea[name="specs"]')).slice(0, 20));
await page.screenshot({ path: `${OUT}/adm-05-edit.png` });

// 6. bookings
await page.goto(`${BASE}/admin/bookings`, { waitUntil: "domcontentloaded" });
await wait(800);
console.log("6. bookings page heading:", await page.locator("text=Test-drive bookings").count());
await page.screenshot({ path: `${OUT}/adm-06-bookings.png` });

// 7. logout -> session cleared -> /admin redirects to login again
await page.goto(`${BASE}/admin`, { waitUntil: "domcontentloaded" });
await wait(500);
await page.click('button:has-text("Log out")');
await wait(1500);
console.log("7. after logout url:", page.url());
await page.goto(`${BASE}/admin`, { waitUntil: "domcontentloaded" });
await wait(800);
console.log("   /admin after logout redirected to:", page.url());

await b.close();
console.log("DONE");
