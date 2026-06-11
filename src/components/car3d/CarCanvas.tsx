"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, useGLTF } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import * as THREE from "three";
import type { CarModel3D } from "@/types";

/** Longest horizontal dimension every car is normalized to (world units). */
const CAR_LENGTH = 4.4;

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

/** Bounding box over opaque meshes only — baked shadow planes and glass
 *  must not define the car's footprint or ground line. */
function opaqueBox(root: THREE.Object3D) {
  const box = new THREE.Box3();
  const tmp = new THREE.Box3();
  root.updateMatrixWorld(true);
  root.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    const mat = Array.isArray(m.material) ? m.material[0] : m.material;
    if (mat?.transparent) return;
    tmp.setFromObject(m);
    box.union(tmp);
  });
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
      if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).castShadow = true;
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

    /* normalize: face one way, span CAR_LENGTH, sit on y=0, centered */
    c.rotation.y = model.yaw ?? 0;
    const box = opaqueBox(c);
    const size = box.getSize(new THREE.Vector3());
    c.scale.setScalar(CAR_LENGTH / Math.max(size.x, size.z));
    const box2 = opaqueBox(c);
    const center = box2.getCenter(new THREE.Vector3());
    c.position.set(-center.x, -box2.min.y, -center.z);
    return c;
  }, [scene, paint, model.yaw, model.repaint, model.bodyMaterials]);

  return <primitive object={car} />;
}

/** Scroll progress (0–1) orbits the camera around the car. */
function Rig({
  progressRef,
  staticView,
}: {
  progressRef: React.RefObject<number>;
  staticView: boolean;
}) {
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame((state) => {
    const p = staticView ? 0.12 : progressRef.current;
    const angle = -0.6 + p * Math.PI * 1.85;
    const radius = 6.4 - Math.sin(p * Math.PI) * 1.6;
    const height = 1.5 + Math.sin(p * Math.PI) * 1.4;
    target.set(Math.sin(angle) * radius, height, Math.cos(angle) * radius);
    state.camera.position.lerp(target, 0.08);
    state.camera.lookAt(0, 0.6, 0);
  });
  return null;
}

export default function CarCanvas({
  paint,
  model,
  progressRef,
  staticView,
}: {
  paint: string;
  model: CarModel3D;
  progressRef: React.RefObject<number>;
  staticView: boolean;
}) {
  return (
    <div className="absolute inset-0">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ fov: 32, position: [5, 1.6, 6.5] }}
      >
        <color attach="background" args={["#0a0a0b"]} />
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
        <Rig progressRef={progressRef} staticView={staticView} />
      </Canvas>
    </div>
  );
}
