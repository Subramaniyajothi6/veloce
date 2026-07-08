"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useMemo } from "react";
import * as THREE from "three";
import type { CarModel3D } from "@/types";

/** Longest horizontal dimension every car is normalized to (world units). */
const CAR_LENGTH = 4.4;

/** Aspect ratio the cinematic shots were composed for (≈1440×900 landscape).
 *  Narrower viewports (phones in portrait) get the lens widened + camera eased
 *  back so the wide car keeps its framing instead of spilling out of frame. */
const REF_ASPECT = 1.6;

const BODY_NAME = /body|paint|chasis|chassis|shell/i;

/** Surface area of a mesh's geometry (relative — used to find the body). */
function geometryArea(geo: THREE.BufferGeometry) {
  const pos = geo.getAttribute("position");
  if (!pos) return 0;
  const idx = geo.getIndex();
  const count = idx ? idx.count : pos.count;
  const a = new THREE.Vector3();
  const b = new THREE.Vector3();
  const c = new THREE.Vector3();
  let area = 0;
  for (let i = 0; i + 2 < count; i += 3) {
    a.fromBufferAttribute(pos, idx ? idx.getX(i) : i);
    b.fromBufferAttribute(pos, idx ? idx.getX(i + 1) : i + 1);
    c.fromBufferAttribute(pos, idx ? idx.getX(i + 2) : i + 2);
    area += b.sub(a).cross(c.sub(a)).length() / 2;
  }
  return area;
}

/** Bounding box over opaque meshes only — baked shadow planes, glass and
 *  scattered micro-geometry (stray badges/bolts in found models) must not
 *  define the car's footprint or ground line.
 *
 *  setFromObject is called with precise=true: found models often author the
 *  wheels with a rotation baked into the node transform, and the default
 *  (non-precise) bound wraps the *rotated geometry's AABB corners*, inflating
 *  it well below the real tyre — which then floats the whole car off the
 *  ground. Precise bounds the actual vertices, so the car sits on its tyres. */
function opaqueBox(root: THREE.Object3D) {
  root.updateMatrixWorld(true);
  const meshes: { mesh: THREE.Mesh; area: number }[] = [];
  let total = 0;
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    const mat = Array.isArray(m.material) ? m.material[0] : m.material;
    if (mat?.transparent) return;
    const area = geometryArea(m.geometry);
    meshes.push({ mesh: m, area });
    total += area;
  });
  const box = new THREE.Box3();
  const tmp = new THREE.Box3();
  for (const { mesh, area } of meshes) {
    if (area < total * 0.002) continue;
    tmp.setFromObject(mesh, true);
    box.union(tmp);
  }
  return box.isEmpty() ? box.setFromObject(root, true) : box;
}

/** Recolor only the connected geometry islands of one material that sit fully
 *  inside a raw-model-space box. CSR2-style models bake badges/lettering into
 *  the same material as body trim (spine strip, mirror caps), so a whole-
 *  material recolor is not an option — instead the mesh's triangles are
 *  partitioned into two draw groups on a fresh index (vertex data stays
 *  shared with drei's cached scene) and only the in-box islands get the new
 *  material. Runs before the body repaint, which must stay array-aware. */
function recolorPartsInBox(
  root: THREE.Object3D,
  spec: NonNullable<CarModel3D["partRecolor"]>[number],
) {
  const region = new THREE.Box3(
    new THREE.Vector3(...spec.box[0]),
    new THREE.Vector3(...spec.box[1]),
  );
  const accent = new THREE.MeshStandardMaterial({
    color: new THREE.Color(spec.color),
    metalness: spec.metalness ?? 0.3,
    roughness: spec.roughness ?? 0.6,
    emissive: new THREE.Color(spec.color),
    emissiveIntensity: spec.emissive ?? 0,
  });
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
    if (mat?.name !== spec.material) return;
    const geo = mesh.geometry;
    const pos = geo.getAttribute("position");
    const idx = geo.getIndex();
    if (!pos || !idx) return;

    /* union-find over vertices, welding coincident positions so islands the
       exporter split into disconnected fans still count as one part */
    const parent = new Int32Array(pos.count);
    for (let i = 0; i < parent.length; i++) parent[i] = i;
    const find = (i: number) => {
      while (parent[i] !== i) {
        parent[i] = parent[parent[i]];
        i = parent[i];
      }
      return i;
    };
    const union = (a: number, b: number) => {
      const ra = find(a);
      const rb = find(b);
      if (ra !== rb) parent[ra] = rb;
    };
    const weld = new Map<string, number>();
    for (let i = 0; i < pos.count; i++) {
      const key = `${Math.round(pos.getX(i) * 5000)},${Math.round(pos.getY(i) * 5000)},${Math.round(pos.getZ(i) * 5000)}`;
      const prev = weld.get(key);
      if (prev === undefined) weld.set(key, i);
      else union(i, prev);
    }
    for (let t = 0; t < idx.count; t += 3) {
      union(idx.getX(t), idx.getX(t + 1));
      union(idx.getX(t + 1), idx.getX(t + 2));
    }

    /* island bounds in raw world space (pre-yaw/normalization) */
    mesh.updateWorldMatrix(true, false);
    const v = new THREE.Vector3();
    const bounds = new Map<number, THREE.Box3>();
    for (let i = 0; i < pos.count; i++) {
      const island = find(i);
      let b = bounds.get(island);
      if (!b) bounds.set(island, (b = new THREE.Box3()));
      b.expandByPoint(v.fromBufferAttribute(pos, i).applyMatrix4(mesh.matrixWorld));
    }
    const picked = new Set<number>();
    for (const [island, b] of bounds) if (region.containsBox(b)) picked.add(island);

    /* partition triangles into [rest, accent] draw groups */
    const rest: number[] = [];
    const hot: number[] = [];
    for (let t = 0; t < idx.count; t += 3) {
      (picked.has(find(idx.getX(t))) ? hot : rest).push(
        idx.getX(t),
        idx.getX(t + 1),
        idx.getX(t + 2),
      );
    }
    if (!hot.length) return;
    const split = new THREE.BufferGeometry();
    for (const [name, attr] of Object.entries(geo.attributes)) split.setAttribute(name, attr);
    split.setIndex(rest.concat(hot));
    split.addGroup(0, rest.length, 0);
    split.addGroup(rest.length, hot.length, 1);
    mesh.geometry = split;
    mesh.material = [mat, accent];
  });
}

/**
 * Each car ships as a found GLB with its own scale, orientation and material
 * names — normalize size/ground, strip embedded lights, then repaint the
 * body: explicitly listed materials, else one named like a body (≥5% of the
 * surface), else the largest non-black-painted one.
 */
function CarModel({
  paint,
  basePaint,
  model,
  studio,
}: {
  paint: string;
  basePaint: string;
  model: CarModel3D;
  /** Configurator studio: lower metalness so the finish colour reads true. */
  studio: boolean;
}) {
  const { scene } = useGLTF(model.url);

  const car = useMemo(() => {
    const c = scene.clone(true);

    /* some GLBs declare KHR_lights_punctual — their lights fight ours */
    const strays: THREE.Object3D[] = [];
    c.traverse((o) => {
      if ((o as THREE.Light).isLight || (o as THREE.Camera).isCamera) strays.push(o);
    });
    strays.forEach((o) => o.removeFromParent());

    c.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.castShadow = true;
      /* KHR_materials_transmission makes three.js render the whole scene
         into an extra buffer every frame (visible as scroll stutter) —
         swap refractive glass for cheap transparent glass */
      const mats = Array.isArray(m.material) ? m.material : [m.material];
      for (const mat of mats) {
        const p = mat as THREE.MeshPhysicalMaterial;
        if (p?.isMeshPhysicalMaterial && p.transmission > 0) {
          p.transmission = 0;
          p.transparent = true;
          p.opacity = Math.min(p.opacity, 0.45);
          p.depthWrite = false;
          p.roughness = Math.max(p.roughness, 0.05);
        }
      }
    });

    /* before the repaint: the split matches on original material names, and
       its group-0 material may itself be a body slot the repaint then paints */
    model.partRecolor?.forEach((spec) => recolorPartsInBox(c, spec));

    if (model.repaint) {
      /* rank materials by the surface area they cover */
      const byMat = new Map<THREE.Material, number>();
      c.traverse((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh) return;
        const mat = Array.isArray(m.material) ? m.material[0] : m.material;
        byMat.set(mat, (byMat.get(mat) ?? 0) + geometryArea(m.geometry));
      });
      const ranked = [...byMat.entries()].sort((x, y) => y[1] - x[1]);
      const total = ranked.reduce((s, [, v]) => s + v, 0);

      const isBlack = (mat: THREE.Material) => {
        const col = (mat as THREE.MeshStandardMaterial).color;
        return !col || Math.max(col.r, col.g, col.b) < 0.08;
      };
      const bodyMat =
        ranked.find(([m, a]) => BODY_NAME.test(m.name) && a / total > 0.05)?.[0] ??
        ranked.find(([m]) => !isBlack(m))?.[0];
      const isBody = (mat: THREE.Material) =>
        model.bodyMaterials ? model.bodyMaterials.includes(mat.name) : mat === bodyMat;
      /* When a model lists `finishMaterials`, only those take the chosen finish
         (the true outer shell); the remaining body slots — interior, grille
         backing, spine/trim bundled into the same "paint the whole car" set —
         stay at `basePaint` (the signature colour). Without it, the whole body
         takes the finish, as before. */
      const isFinish = (mat: THREE.Material) =>
        model.finishMaterials ? model.finishMaterials.includes(mat.name) : isBody(mat);

      const coat = (hex: string) =>
        new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(hex),
          /* Studio (configurator): a metallic base that's a touch rough under a
             sharp clearcoat reads as real automotive paint against the softbox
             environment — a soft body sheen plus a crisp highlight streak,
             instead of a flat game colour. The cinematic scroll keeps the
             glossier mirror finish (0.85 / smooth). */
          metalness: studio ? 0.65 : 0.85,
          roughness: studio ? 0.4 : 0.3,
          clearcoat: 1,
          clearcoatRoughness: studio ? 0.08 : 0.05,
        });
      const body = coat(paint);
      /* only build a distinct base coat when it would actually differ */
      const base =
        model.finishMaterials && basePaint !== paint ? coat(basePaint) : body;

      const pick = (mat: THREE.Material) =>
        isFinish(mat) ? body : isBody(mat) ? base : null;
      c.traverse((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh) return;
        if (Array.isArray(m.material)) {
          /* multi-group mesh (partRecolor split): recoat only the body slots */
          m.material = m.material.map((mm) => pick(mm) ?? mm);
        } else {
          const next = pick(m.material);
          if (next) m.material = next;
        }
        /* everything else keeps its authored look (glass, trim, interior) */
      });
    }

    /* optional: paint the brake calipers a solid accent colour, lifted with a
       little emissive so they read behind the spokes in the dark set */
    if (model.caliperColor && model.caliperMaterials?.length) {
      const col = new THREE.Color(model.caliperColor);
      const cal = new THREE.MeshStandardMaterial({
        color: col,
        metalness: 0.2,
        roughness: 0.5,
        emissive: col,
        emissiveIntensity: 0.35,
      });
      c.traverse((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh) return;
        const mat = Array.isArray(m.material) ? m.material[0] : m.material;
        if (mat && model.caliperMaterials!.includes(mat.name)) m.material = cal;
      });
    }

    /* optional: flat matte recolor of named materials (kills a model's stray
       accent colour — e.g. neon-green seat belts/calipers — so it doesn't fight
       the livery). Drops any baked map so a textured accent can't bleed through. */
    if (model.recolor?.length) {
      const swaps = model.recolor.map((r) => ({
        names: r.materials,
        mat: new THREE.MeshStandardMaterial({
          color: new THREE.Color(r.color),
          metalness: r.metalness ?? 0.3,
          roughness: r.roughness ?? 0.6,
        }),
      }));
      c.traverse((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh) return;
        const mat = Array.isArray(m.material) ? m.material[0] : m.material;
        const hit = mat && swaps.find((s) => s.names.includes(mat.name));
        if (hit) m.material = hit.mat;
      });
    }

    /* normalize: face one way, span CAR_LENGTH, sit on y=0, centered */
    c.rotation.y = model.yaw ?? 0;
    const box = opaqueBox(c);
    const size = box.getSize(new THREE.Vector3());
    c.scale.setScalar(CAR_LENGTH / Math.max(size.x, size.z));
    const box2 = opaqueBox(c);
    const center = box2.getCenter(new THREE.Vector3());
    c.position.set(-center.x, -box2.min.y, -center.z);
    return c;
  }, [scene, paint, basePaint, studio, model.yaw, model.repaint, model.bodyMaterials, model.finishMaterials, model.caliperColor, model.caliperMaterials, model.recolor, model.partRecolor]);

  return <primitive object={car} />;
}

/** One cinematic camera setup: where the shot starts and how it moves
 *  while the viewer holds on it (slow dolly/pan/crane within the shot). */
interface CamShot {
  /** Orbit angle (rad) at the start of the shot. */
  angle: number;
  /** Angle traveled across the shot — a slow pan. */
  sweep: number;
  /** Distance from the car at the start. */
  radius: number;
  /** Radius change across the shot (negative = push in). */
  dolly: number;
  height: number;
  /** Height change across the shot (crane up/down). */
  rise: number;
  /** Lens — low fov = long lens compression for close-ups. */
  fov: number;
  /** Where the camera looks (height on the car). */
  lookY: number;
}

/** Shot characters cycled across the spec stages, in orbit order:
 *  low front hero → long-lens close-up → side profile → rear 3/4 →
 *  overhead crane → tight nose. Radius/height/fov define the framing;
 *  the orbit angle keeps advancing so cuts sweep around the car. */
const SHOT_STYLES = [
  { radius: 5.0, dolly: -0.55, height: 0.7, rise: 0.05, fov: 28, lookY: 0.55 },
  { radius: 3.4, dolly: -0.4, height: 0.55, rise: 0.1, fov: 24, lookY: 0.45 },
  { radius: 5.8, dolly: -0.45, height: 1.15, rise: 0, fov: 30, lookY: 0.6 },
  { radius: 4.6, dolly: -0.5, height: 0.8, rise: 0.15, fov: 28, lookY: 0.6 },
  { radius: 6.7, dolly: -0.8, height: 3.3, rise: -0.5, fov: 36, lookY: 0.2 },
  { radius: 3.7, dolly: -0.45, height: 0.95, rise: -0.2, fov: 25, lookY: 0.7 },
];

const STATIC_SHOT: CamShot = {
  angle: 0.55, sweep: 0, radius: 6.4, dolly: 0, height: 1.35, rise: 0, fov: 33, lookY: 0.55,
};

/** Keyframes for the whole experience: slow push-in intro, one styled shot
 *  per spec stage, wide pull-back outro. Angles advance monotonically so the
 *  camera never has to swing back through the car between shots. */
function buildShots(stages: number): CamShot[] {
  const step = (Math.PI * 2.2) / stages;
  const shots: CamShot[] = [];
  for (let i = 0; i < stages; i++) {
    const angle = -0.5 + i * step;
    if (i === 0) {
      shots.push({ angle, sweep: step * 0.5, radius: 7, dolly: -0.9, height: 1.5, rise: -0.15, fov: 34, lookY: 0.55 });
    } else if (i === stages - 1) {
      shots.push({ angle, sweep: step * 0.6, radius: 6, dolly: 1.3, height: 1.45, rise: 0.35, fov: 36, lookY: 0.5 });
    } else {
      shots.push({ angle, sweep: step * 0.5, ...SHOT_STYLES[(i - 1) % SHOT_STYLES.length] });
    }
  }
  return shots;
}

/** Ease the in-shot motion so every dolly/pan starts and lands softly. */
const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

/** Scroll progress (0–1) drives a keyframed camera: hold + slow move within
 *  each stage's shot, then a fast eased sweep (the "cut") to the next one.
 *  A faint handheld drift keeps held shots alive. */
function Rig({
  progressRef,
  stages,
  staticView,
}: {
  progressRef: React.RefObject<number>;
  stages: number;
  staticView: boolean;
}) {
  const shots = useMemo(() => buildShots(stages), [stages]);
  const target = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(0, 0.6, 0), []);
  const lookGoal = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const cam = state.camera as THREE.PerspectiveCamera;
    let shot = STATIC_SHOT;
    let e = 0;
    if (!staticView) {
      const s = Math.min(stages - 1e-4, progressRef.current * stages);
      const i = Math.floor(s);
      shot = shots[i];
      e = smoother(s - i);
    }
    /* fov is the VERTICAL field of view; on a portrait canvas the horizontal
       view collapses and the wide car gets cropped. Widen the lens to preserve
       the landscape horizontal framing (clamped so it never goes fish-eye) and
       ease the camera back a touch so even the tight shots keep the car whole. */
    const aspect = state.size.width / Math.max(1, state.size.height);
    let fov = shot.fov;
    let fit = 1;
    if (aspect < REF_ASPECT) {
      const hRef = 2 * Math.atan(Math.tan((shot.fov * Math.PI) / 360) * REF_ASPECT);
      /* fov clamp + pull-back coefficient trade "whole car always visible"
         against "car big enough to read" — lower clamp / smaller coefficient
         => the car fills more of a phone screen (widest shots crop slightly). */
      fov = Math.min(62, (2 * Math.atan(Math.tan(hRef / 2) / aspect) * 180) / Math.PI);
      fit = 1 + (REF_ASPECT / aspect - 1) * 0.1;
    }

    const a = shot.angle + shot.sweep * e;
    const r = (shot.radius + shot.dolly * e) * fit;
    const h = shot.height + shot.rise * e;
    /* handheld drift — two slow sines so it never reads as a loop */
    const t = state.clock.elapsedTime;
    const dx = staticView ? 0 : Math.sin(t * 0.5) * 0.05 + Math.sin(t * 1.7) * 0.015;
    const dy = staticView ? 0 : Math.cos(t * 0.8) * 0.03;
    target.set(Math.sin(a) * r + dx, Math.max(0.3, h + dy), Math.cos(a) * r);
    cam.position.lerp(target, staticView ? 1 : 0.09);
    look.lerp(lookGoal.set(dx * 0.4, shot.lookY, 0), staticView ? 1 : 0.08);
    cam.lookAt(look);
    cam.fov += (fov - cam.fov) * (staticView ? 1 : 0.06);
    cam.updateProjectionMatrix();
  });
  return null;
}

/** Fires once — after the GLB has resolved and the scene commits — so the
 *  parent can drop its loading overlay. Lives INSIDE the <Suspense> boundary,
 *  so it only mounts after the model (which suspends on useGLTF) is ready; a
 *  rAF defers the signal one frame so the car has actually painted. */
function Ready({ onReady }: { onReady?: () => void }) {
  useEffect(() => {
    const raf = requestAnimationFrame(() => onReady?.());
    return () => cancelAnimationFrame(raf);
  }, [onReady]);
  return null;
}

export default function CarCanvas({
  paint,
  model,
  progressRef,
  stages,
  staticView,
  introOffset = false,
  orbit = false,
  basePaint,
  onReady,
}: {
  paint: string;
  model: CarModel3D;
  progressRef: React.RefObject<number>;
  stages: number;
  staticView: boolean;
  /** Nudge the whole scene down during the intro so the big title clears it. */
  introOffset?: boolean;
  /** Hand the camera to the viewer (drag-to-rotate) instead of the scripted
   *  Rig — used by the configurator so a finish can be inspected from any angle. */
  orbit?: boolean;
  /** Colour for the body slots that are NOT the outer shell (interior, grille
   *  backing, trim) when the model defines `finishMaterials`. Defaults to
   *  `paint`, so a single-colour repaint is unchanged. */
  basePaint?: string;
  /** Called once the GLB has loaded and the first frame is painted. */
  onReady?: () => void;
}) {
  return (
    /* z-[2]: the car renders ABOVE the intro title (z-[1]) but below the HUD
       overlays (z-[3]+). Canvas is transparent (no scene background) so the
       title shows through the empty areas and is hidden behind the car body. */
    <div
      className={`absolute inset-0 z-[2] transition-[translate] duration-700 ease-out-expo ${
        introOffset ? "translate-y-[20vh]" : "translate-y-0"
      }`}
    >
      <Canvas
        /* "percentage" = PCFShadowMap. three 0.184 deprecated PCFSoftShadowMap
           (the default for shadows={true}) and silently falls back to this — so
           set it explicitly to use the same shadows without the console warning. */
        shadows="percentage"
        dpr={[1, 2]}
        gl={{ alpha: true }}
        camera={{ fov: orbit ? 33 : 32, position: orbit ? [3.5, 1.5, 5.4] : [5, 1.6, 6.5] }}
      >
        {orbit ? (
          /* configurator studio — image-based lighting from softboxes the body
             reflects (built locally, no external HDR), so metallic paint reads
             as real car paint with proper highlight streaks instead of a flat
             game colour. A key light adds the sharp highlight + contact shadow. */
          <>
            <fog attach="fog" args={["#0a0a0b", 26, 52]} />
            <ambientLight intensity={0.28} />
            <Environment resolution={256} frames={1}>
              {/* soft ceiling wash */}
              <Lightformer
                intensity={0.9}
                color="#ffffff"
                position={[0, 6.5, 0]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={[14, 14, 1]}
              />
              {/* key softbox (camera-right) — the main body streak */}
              <Lightformer
                intensity={3}
                color="#ffffff"
                position={[5, 4, 6]}
                rotation={[0, -Math.PI / 4, 0]}
                scale={[5, 9, 1]}
              />
              {/* cool fill strip (camera-left) */}
              <Lightformer
                intensity={2.1}
                color="#eaf0ff"
                position={[-6, 3.5, 3]}
                rotation={[0, Math.PI / 3, 0]}
                scale={[3, 9, 1]}
              />
              {/* rear rim boxes to define the silhouette against the dark set */}
              <Lightformer
                intensity={2}
                color="#ffffff"
                position={[-2, 3, -7]}
                rotation={[0, Math.PI, 0]}
                scale={[8, 7, 1]}
              />
              <Lightformer
                intensity={1.6}
                color="#ffffff"
                position={[6, 2.5, -4]}
                rotation={[0, -2 * Math.PI / 3, 0]}
                scale={[3, 6, 1]}
              />
            </Environment>
            <directionalLight
              position={[6, 9, 4]}
              intensity={1.7}
              castShadow
              shadow-mapSize={[2048, 2048]}
            />
            <directionalLight position={[-6, 5, -2]} intensity={0.5} />
          </>
        ) : (
          <>
            <fog attach="fog" args={["#0a0a0b", 14, 26]} />
            <ambientLight intensity={0.35} />
            <directionalLight
              position={[6, 9, 4]}
              intensity={2.4}
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            <directionalLight position={[-7, 4, -6]} intensity={1} color="#7f8cff" />
            <spotLight position={[0, 10, 0]} intensity={1.2} angle={0.5} penumbra={1} />
          </>
        )}
        <mesh rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[60, 60]} />
          <meshStandardMaterial color="#0b0b0c" />
        </mesh>
        <Suspense fallback={null}>
          <CarModel paint={paint} basePaint={basePaint ?? paint} model={model} studio={orbit} />
          <Ready onReady={onReady} />
          <ContactShadows
            position={[0, 0.01, 0]}
            opacity={0.65}
            scale={16}
            blur={2.4}
            far={4}
            resolution={512}
          />
        </Suspense>
        {orbit ? (
          /* viewer-controlled: drag to rotate, wheel/pinch to zoom, no pan,
             clamped above the ground line so the car can't be seen from below */
          <OrbitControls
            makeDefault
            target={[0, 0.6, 0]}
            enablePan={false}
            enableDamping
            dampingFactor={0.08}
            minDistance={4.2}
            maxDistance={9}
            minPolarAngle={0.18}
            maxPolarAngle={Math.PI / 2 - 0.03}
          />
        ) : (
          <Rig progressRef={progressRef} stages={stages} staticView={staticView} />
        )}
      </Canvas>
    </div>
  );
}
