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
  /** Source + license line (attribution). */
  credit: string;
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
  model: CarModel3D;
  specs: CarSpec[];
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

/** Ownership service row. */
export interface ServiceItem {
  num: string;
  title: string;
  copy: string;
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
