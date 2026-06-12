/* Loads a GLB in a real browser (draco included) and prints the scene's
   bounding box plus each mesh's size/material — for debugging normalization. */
import { chromium } from "playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const url = `${BASE}${process.argv[2] ?? "/models/giallo-gt.glb"}`;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.on("console", (m) => console.log(m.text()));
await page.goto(BASE);
await page.setContent(`<script type="importmap">{"imports":{
  "three":"https://unpkg.com/three@0.184.0/build/three.module.js",
  "three/addons/":"https://unpkg.com/three@0.184.0/examples/jsm/"
}}</script>`);
await page.evaluate(async (glbUrl) => {
  const THREE = await import("three");
  const { GLTFLoader } = await import("three/addons/loaders/GLTFLoader.js");
  const { DRACOLoader } = await import("three/addons/loaders/DRACOLoader.js");
  const draco = new DRACOLoader().setDecoderPath(
    "https://www.gstatic.com/draco/versioned/decoders/1.5.7/"
  );
  const loader = new GLTFLoader().setDRACOLoader(draco);
  const gltf = await loader.loadAsync(glbUrl);
  const scene = gltf.scene;
  scene.updateMatrixWorld(true);
  const v = new THREE.Vector3();
  const full = new THREE.Box3().setFromObject(scene);
  console.log("FULL bbox size:", full.getSize(v).toArray().map((n) => n.toFixed(2)).join(" x "),
    "min.y:", full.min.y.toFixed(3));
  scene.traverse((o) => {
    if (!o.isMesh) return;
    const b = new THREE.Box3().setFromObject(o);
    const s = b.getSize(v).toArray().map((n) => n.toFixed(2)).join("x");
    const mat = Array.isArray(o.material) ? o.material[0] : o.material;
    console.log(`mesh=${o.name} mat=${mat?.name} size=${s} minY=${b.min.y.toFixed(2)} transparent=${mat?.transparent}`);
  });
}, url);
await browser.close();
