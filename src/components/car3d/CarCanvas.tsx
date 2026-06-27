"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, useGLTF } from "@react-three/drei";
import { Suspense, useMemo } from "react";
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
 *  define the car's footprint or ground line. */
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
    tmp.setFromObject(mesh);
    box.union(tmp);
  }
  return box.isEmpty() ? box.setFromObject(root) : box;
}

/**
 * Each car ships as a found GLB with its own scale, orientation and material
 * names — normalize size/ground, strip embedded lights, then repaint the
 * body: explicitly listed materials, else one named like a body (≥5% of the
 * surface), else the largest non-black-painted one.
 */
function CarModel({ paint, model }: { paint: string; model: CarModel3D }) {
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

      const body = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(paint),
        metalness: 0.85,
        roughness: 0.3,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
      });
      c.traverse((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh) return;
        const mat = Array.isArray(m.material) ? m.material[0] : m.material;
        if (isBody(mat)) m.material = body;
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

    /* normalize: face one way, span CAR_LENGTH, sit on y=0, centered */
    c.rotation.y = model.yaw ?? 0;
    const box = opaqueBox(c);
    const size = box.getSize(new THREE.Vector3());
    c.scale.setScalar(CAR_LENGTH / Math.max(size.x, size.z));
    const box2 = opaqueBox(c);
    const center = box2.getCenter(new THREE.Vector3());
    c.position.set(-center.x, -box2.min.y, -center.z);
    return c;
  }, [scene, paint, model.yaw, model.repaint, model.bodyMaterials, model.caliperColor, model.caliperMaterials]);

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
      fov = Math.min(74, (2 * Math.atan(Math.tan(hRef / 2) / aspect) * 180) / Math.PI);
      fit = 1 + (REF_ASPECT / aspect - 1) * 0.16;
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

export default function CarCanvas({
  paint,
  model,
  progressRef,
  stages,
  staticView,
  introOffset = false,
}: {
  paint: string;
  model: CarModel3D;
  progressRef: React.RefObject<number>;
  stages: number;
  staticView: boolean;
  /** Nudge the whole scene down during the intro so the big title clears it. */
  introOffset?: boolean;
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
        shadows
        dpr={[1, 2]}
        gl={{ alpha: true }}
        camera={{ fov: 32, position: [5, 1.6, 6.5] }}
      >
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
        <mesh rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[60, 60]} />
          <meshStandardMaterial color="#0b0b0c" />
        </mesh>
        <Suspense fallback={null}>
          <CarModel paint={paint} model={model} />
          <ContactShadows
            position={[0, 0.01, 0]}
            opacity={0.65}
            scale={16}
            blur={2.4}
            far={4}
            resolution={512}
          />
        </Suspense>
        <Rig progressRef={progressRef} stages={stages} staticView={staticView} />
      </Canvas>
    </div>
  );
}
