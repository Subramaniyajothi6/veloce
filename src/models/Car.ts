import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * Editable inventory for a car. The fragile 3D-rig internals (yaw, repaint
 * flag, material-name arrays, calipers) deliberately live in code keyed by
 * slug (see `src/lib/inventory.ts`) so the admin panel can't break the 3D
 * scene. We keep `paint` and `modelUrl` here so a brand-new car can still get
 * a basic 3D treatment via the generic repaint heuristic.
 */
const SpecSchema = new Schema(
  {
    value: { type: Number, required: true },
    decimals: Number,
    unit: { type: String, required: true },
    label: { type: String, required: true },
    detail: String,
  },
  { _id: false }
);

const PhotoSchema = new Schema(
  { src: String, alt: String, caption: String },
  { _id: false }
);

const TrackSchema = new Schema(
  { label: String, value: String, note: String },
  { _id: false }
);

const CarSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: String,
    price: String,
    tagline: String,
    description: String,
    image: String,
    alt: String,
    /** Basic 3D body paint (hex). */
    paint: String,
    /** GLB the 3D experience loads, e.g. "/models/royale.glb". */
    modelUrl: String,
    specs: { type: [SpecSchema], default: [] },
    gallery: { type: [PhotoSchema], default: [] },
    track: { type: [TrackSchema], default: [] },
    /** Display order on /models. */
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type CarDoc = InferSchemaType<typeof CarSchema> & { _id: unknown };

/** Reuse the compiled model across HMR / lambda reuse (avoids OverwriteModelError). */
export const CarModel: Model<CarDoc> =
  (models.Car as Model<CarDoc>) ?? model<CarDoc>("Car", CarSchema);
