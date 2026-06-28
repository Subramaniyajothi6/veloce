import "server-only";
import type { CarModel3D, CarProfile } from "@/types";
import { cars as staticCars, getCar as getStaticCar } from "@/data/cars";
import { connectDB } from "@/lib/db";
import { CarModel } from "@/models/Car";

/**
 * The single seam between the site and its data. Pages call `getCars()` /
 * `getCar()` and never import `@/data/cars` directly. When a database is
 * configured the editable inventory comes from MongoDB; the fragile 3D-rig
 * config (yaw / repaint / material names / calipers) is always merged from code
 * by slug so admin edits can never break the 3D scene. With no DB — or on any
 * DB error — we fall back to the static dataset, so the live site never breaks.
 */

/** Plain (lean) inventory document as it comes back from Mongo. */
interface LeanCar {
  slug: string;
  name: string;
  category?: string | null;
  price?: string | null;
  tagline?: string | null;
  description?: string | null;
  image?: string | null;
  alt?: string | null;
  paint?: string | null;
  modelUrl?: string | null;
  specs?: Array<{ value: number; decimals?: number | null; unit: string; label: string; detail?: string | null }>;
  gallery?: Array<{ src?: string | null; alt?: string | null; caption?: string | null }>;
  track?: Array<{ label?: string | null; value?: string | null; note?: string | null }>;
}

/** Code-only 3D rig overrides, keyed by slug, lifted from the static dataset. */
const rig = new Map<string, { paint: string; model: CarModel3D }>(
  staticCars.map((c) => [c.slug, { paint: c.paint, model: c.model }])
);

/** Build a full `CarProfile` from a DB inventory doc + its code rig override. */
function toProfile(doc: LeanCar): CarProfile {
  const override = rig.get(doc.slug);
  const model: CarModel3D = override
    ? { ...override.model, url: doc.modelUrl || override.model.url }
    : { url: doc.modelUrl || "/models/royale.glb", repaint: true, credit: "" };

  return {
    slug: doc.slug,
    name: doc.name,
    category: doc.category ?? "",
    price: doc.price ?? "",
    tagline: doc.tagline ?? "",
    description: doc.description ?? "",
    image: doc.image ?? "",
    alt: doc.alt ?? "",
    paint: doc.paint || override?.paint || "#888888",
    model,
    specs: (doc.specs ?? []).map((s) => ({
      value: s.value,
      decimals: s.decimals ?? undefined,
      unit: s.unit,
      label: s.label,
      detail: s.detail ?? undefined,
    })),
    gallery: (doc.gallery ?? []).map((g) => ({
      src: g.src ?? "",
      alt: g.alt ?? "",
      caption: g.caption ?? "",
    })),
    track: (doc.track ?? []).map((t) => ({
      label: t.label ?? "",
      value: t.value ?? "",
      note: t.note ?? "",
    })),
  };
}

/** All cars, ordered. DB when available, else the static dataset. */
export async function getCars(): Promise<CarProfile[]> {
  try {
    const conn = await connectDB();
    if (conn) {
      const docs = await CarModel.find().sort({ order: 1, createdAt: 1 }).lean<LeanCar[]>();
      if (docs.length) return docs.map(toProfile);
    }
  } catch (err) {
    console.error("[inventory] DB read failed — falling back to static data:", err);
  }
  return staticCars;
}

/** One car by slug. DB when available, else the static dataset. */
export async function getCar(slug: string): Promise<CarProfile | undefined> {
  try {
    const conn = await connectDB();
    if (conn) {
      const doc = await CarModel.findOne({ slug }).lean<LeanCar | null>();
      if (doc) return toProfile(doc);
    }
  } catch (err) {
    console.error("[inventory] DB read failed — falling back to static data:", err);
  }
  return getStaticCar(slug);
}
