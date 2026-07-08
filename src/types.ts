/** Inventory card in the horizontal showroom gallery. */
export interface ShowroomCar {
  slug: string;
  name: string;
  price: string;
  /** Highlighted spec, e.g. "1,500 HP" */
  specHp: string;
  /** Remaining spec line, e.g. "2.4 S / 420 KM/H" */
  specRest: string;
  image: string;
  alt: string;
}

/** Animated spec counter on a flagship spotlight. */
export interface FlagshipSpec {
  value: number;
  /** Decimal places for the count-up (e.g. 1 for "3.1") */
  decimals?: number;
  unit: string;
  label: string;
}

/** One labeled spec value (used by the 3D scroll experience). */
export interface CarSpec {
  value: number;
  decimals?: number;
  unit: string;
  label: string;
  /** One-line caption shown under the label in the cinematic scroll. */
  detail?: string;
}

/** Per-car 3D asset for the scroll experience. */
export interface CarModel3D {
  /** GLB under public/, e.g. "/models/furia.glb" */
  url: string;
  /** Extra Y rotation (radians) so the car noses the same way as the rest. */
  yaw?: number;
  /** Repaint the body with `paint`. Off for textured/realistic models —
   *  their authored liveries look better than a flat recolor. */
  repaint?: boolean;
  /** Exact material names to repaint (skips the body heuristic). */
  bodyMaterials?: string[];
  /** Subset of `bodyMaterials` that is the true outer shell. When set, the
   *  configurator finish is applied to these only; the remaining body slots
   *  (interior, grille backing, trim) stay at the signature `basePaint`. */
  finishMaterials?: string[];
  /** Exact brake-caliper material names to paint with `caliperColor`. */
  caliperMaterials?: string[];
  /** Solid color for the brake calipers (e.g. an orange "#ff5a1e"). */
  caliperColor?: string;
  /** Flat recolor of arbitrary named materials — e.g. neutralizing a
   *  model's stray accent colour (green seat belts / caliper paint) so it
   *  doesn't fight the chosen livery. No emissive, unlike `caliperColor`.
   *  Defaults to matte (metalness 0.3 / roughness 0.6) unless overridden. */
  recolor?: { materials: string[]; color: string; metalness?: number; roughness?: number }[];
  /** Recolor only the connected geometry islands of `material` that sit fully
   *  inside `box` ([min, max] corners in the GLB's raw world space, before
   *  yaw/normalization) — for badges/lettering baked into a shared body-paint
   *  material, where recoloring the whole material would hit trim elsewhere. */
  partRecolor?: {
    material: string;
    box: [[number, number, number], [number, number, number]];
    color: string;
    metalness?: number;
    roughness?: number;
    /** Self-glow intensity (same hue as `color`) — badges/lettering on faces
     *  the scene lights never reach need a lift to read at all. */
    emissive?: number;
  }[];
  /** Source + license line (attribution). */
  credit: string;
}

/** Photo in a car's detail-page gallery. */
export interface CarPhoto {
  src: string;
  alt: string;
  caption: string;
}

/** Fictional track figure shown in the "On the track" band. */
export interface TrackStat {
  label: string;
  value: string;
  note: string;
}

/** Porsche-style highlight card (2×2 grid on the detail page). */
export interface CarHighlight {
  title: string;
  copy: string;
  image: string;
}

/** Alternating image/text "engineering" feature story on the detail page. */
export interface CarFeature {
  title: string;
  copy: string;
  image: string;
  /** Optional headline figure shown beside the copy. */
  stat?: { value: string; label: string };
}

/** Full car profile backing /models and /models/[slug]. */
export interface CarProfile {
  slug: string;
  name: string;
  category: string;
  price: string;
  tagline: string;
  description: string;
  image: string;
  alt: string;
  /** Body paint color for the 3D model. */
  paint: string;
  /** Factory-authentic finishes offered in the configurator for THIS car
   *  (colours the real marque actually offers). First entry is the signature
   *  (its hex should match `paint`). Falls back to a generic set if omitted. */
  finishes?: { name: string; hex: string }[];
  model: CarModel3D;
  specs: CarSpec[];
  /** Extra photography for the detail page (hero image not included). */
  gallery: CarPhoto[];
  /** Track numbers for the detail page. */
  track: TrackStat[];
  /** Optional Porsche-style highlight grid (detail page). */
  highlights?: CarHighlight[];
  /** Optional engineering feature stories (detail page). */
  features?: CarFeature[];
}

/** Flagship spotlight (alternating image/copy article). */
export interface Flagship {
  slug: string;
  /** Display index, e.g. "N°1" */
  index: string;
  eyebrow: string;
  name: string;
  lede: string;
  image: string;
  alt: string;
  badge?: string;
  specs: FlagshipSpec[];
  price: string;
  /** Image on the right instead of the left */
  reversed?: boolean;
}

/** Row in the "Recently placed" archive list. */
export interface ArchiveSale {
  date: string;
  name: string;
  route: string;
  tag: string;
  image: string;
}

/** Headline figure on a service detail page. */
export interface ServiceStat {
  value: string;
  label: string;
  note: string;
}

/** Numbered step in a service detail page's "how it works". */
export interface ServiceStep {
  title: string;
  copy: string;
}

/** One "what's included" line on a service detail page. */
export interface ServiceInclusion {
  title: string;
  copy: string;
}

/** Per-service extra input on the enquiry form. `car` renders a select over
 *  the live range (options come from props, not this config). */
export interface EnquiryField {
  name: string;
  label: string;
  type: "text" | "select" | "car";
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

/** Ownership service row + its detail page at /services/[slug]. */
export interface ServiceItem {
  slug: string;
  num: string;
  title: string;
  copy: string;
  /** Detail-page headline: [plain part, outlined part]. */
  headline: [string, string];
  lede: string;
  stats: ServiceStat[];
  steps: ServiceStep[];
  inclusions: ServiceInclusion[];
  /** Small-print reassurance line shown with the enquiry form. */
  note: string;
  /** Enquiry form CTA + confirmation copy. */
  enquiry: {
    submitLabel: string;
    successTitle: string;
    successCopy: string;
  };
}

/** Animated stat in "The Record". */
export interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

/** Showroom location in the Visit section. */
export interface ShowroomLocation {
  city: string;
  address: string;
  hours: string;
}
