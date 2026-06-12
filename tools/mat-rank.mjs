/* Ranks a scene.gltf's materials by triangle count (proxy for surface area)
   and prints base color factors — used to pick `bodyMaterials` overrides. */
import { readFileSync } from "fs";

for (const file of process.argv.slice(2)) {
  const g = JSON.parse(readFileSync(file, "utf8"));
  const tris = new Map();
  for (const mesh of g.meshes ?? []) {
    for (const prim of mesh.primitives ?? []) {
      const idx = prim.indices != null ? g.accessors[prim.indices].count : g.accessors[prim.attributes.POSITION].count;
      const mat = prim.material ?? -1;
      tris.set(mat, (tris.get(mat) ?? 0) + idx / 3);
    }
  }
  console.log(`\n===== ${file}`);
  [...tris.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .forEach(([mi, t]) => {
      const m = g.materials?.[mi] ?? {};
      const c = m.pbrMetallicRoughness?.baseColorFactor;
      const col = c ? `rgb(${c.slice(0, 3).map((v) => Math.round(v * 255)).join(",")})` : "tex/none";
      console.log(`${String(Math.round(t)).padStart(8)} tris  ${col.padEnd(18)} ${m.name}`);
    });
}
