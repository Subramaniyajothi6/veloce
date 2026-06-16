/* Build a manifest of candidate gallery photos (1600px thumb URLs +
   attribution) from Wikimedia Commons categories for the renamed main cars.
   Downloading is done separately via curl. Output: downloads/gallery-cand/manifest.json */
import fs from "node:fs";

const UA = "VeloceDevSite/1.0 (educational portfolio)";
const OUT = "downloads/gallery-cand";
fs.mkdirSync(OUT, { recursive: true });

const CARS = [
  { slug: "royale", cats: ["Bugatti La Voiture Noire"] },
  { slug: "furia", cats: ["Ferrari SF90 XX Stradale", "Ferrari SF90 Stradale"] },
  { slug: "vento-rs", cats: ["Porsche 911 GT3 RS (992.1)", "Porsche 992 GT3 RS"] },
  { slug: "giallo-gt", cats: ["Lamborghini Centenario"] },
  { slug: "notte-v10", cats: ["Audi R8"] },
];

const api = async (params) => {
  const u = new URL("https://commons.wikimedia.org/w/api.php");
  u.search = new URLSearchParams({ format: "json", ...params }).toString();
  const r = await fetch(u, { headers: { "User-Agent": UA } });
  return r.json();
};
const strip = (s) => (s ? s.replace(/<[^>]+>/g, "").trim() : "");

const manifest = [];
for (const { slug, cats } of CARS) {
  let got = 0;
  for (const cat of cats) {
    if (got >= 8) break;
    const j = await api({
      action: "query",
      generator: "categorymembers",
      gcmtitle: `Category:${cat}`,
      gcmtype: "file",
      gcmlimit: "60",
      prop: "imageinfo",
      iiprop: "url|extmetadata|mime",
      iiurlwidth: "1600",
    });
    for (const p of Object.values(j.query?.pages ?? {})) {
      if (got >= 8) break;
      const ii = p.imageinfo?.[0];
      if (!ii || ii.mime !== "image/jpeg") continue;
      if (!(ii.thumbwidth > ii.thumbheight)) continue; // landscape
      got++;
      manifest.push({
        slug,
        file: `${slug}-${got}.jpg`,
        thumburl: ii.thumburl,
        title: p.title.replace(/^File:/, ""),
        artist: strip(ii.extmetadata?.Artist?.value),
        license: ii.extmetadata?.LicenseShortName?.value ?? "",
      });
    }
  }
  console.log(`${slug}: ${got}`);
}
fs.writeFileSync(`${OUT}/manifest.json`, JSON.stringify(manifest, null, 2));
console.log("total candidates:", manifest.length);
