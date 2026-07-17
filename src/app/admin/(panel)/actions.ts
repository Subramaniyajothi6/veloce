"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { endSession, requireAuth } from "@/lib/auth";
import { connectDB, dbConfigured } from "@/lib/db";
import { BookingModel } from "@/models/Booking";
import { CarModel } from "@/models/Car";
import { EnquiryModel } from "@/models/Enquiry";

export async function logout(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}

export interface CarFormState {
  error?: string;
}

function parseJsonArray(label: string, raw: string): unknown[] {
  const trimmed = raw.trim();
  if (!trimmed) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    throw new Error(`${label}: not valid JSON.`);
  }
  if (!Array.isArray(parsed)) throw new Error(`${label}: must be a JSON array.`);
  return parsed;
}

/* --- Validators for the visual row editors. Never trust the client: coerce
   shapes and throw readable, row-numbered errors surfaced back in the form. --- */
type SpecOut = { value: number; decimals?: number; unit: string; label: string; detail?: string };
type PhotoOut = { src: string; alt: string; caption: string };
type TrackOut = { label: string; value: string; note: string };
type HighlightOut = { title: string; copy: string; image: string };
type FeatureOut = { title: string; copy: string; image: string; stat?: { value: string; label: string } };

const S = (v: unknown) => (typeof v === "string" ? v : v == null ? "" : String(v)).trim();

function asObj(v: unknown, label: string, i: number): Record<string, unknown> {
  if (!v || typeof v !== "object" || Array.isArray(v))
    throw new Error(`${label} #${i + 1}: invalid entry.`);
  return v as Record<string, unknown>;
}

function validateSpecs(arr: unknown[]): SpecOut[] {
  return arr.map((r, i) => {
    const o = asObj(r, "Spec", i);
    const rawValue = S(o.value);
    if (!rawValue) throw new Error(`Spec #${i + 1}: value is required.`);
    const value = Number(rawValue);
    if (!Number.isFinite(value))
      throw new Error(`Spec #${i + 1}: value "${rawValue}" isn't a number (digits only — no commas or units).`);
    const unit = S(o.unit);
    const label = S(o.label);
    if (!unit) throw new Error(`Spec #${i + 1}: unit is required.`);
    if (!label) throw new Error(`Spec #${i + 1}: label is required.`);
    const out: SpecOut = { value, unit, label };
    const dec = S(o.decimals);
    if (dec && Number.isFinite(Number(dec))) out.decimals = Number(dec);
    const detail = S(o.detail);
    if (detail) out.detail = detail;
    return out;
  });
}

function validateGallery(arr: unknown[]): PhotoOut[] {
  return arr.map((r, i) => {
    const o = asObj(r, "Gallery photo", i);
    const src = S(o.src);
    if (!src) throw new Error(`Gallery photo #${i + 1}: an image is required.`);
    return { src, alt: S(o.alt), caption: S(o.caption) };
  });
}

function validateTrack(arr: unknown[]): TrackOut[] {
  return arr.map((r, i) => {
    const o = asObj(r, "Track figure", i);
    const label = S(o.label);
    const value = S(o.value);
    if (!label || !value) throw new Error(`Track figure #${i + 1}: label and value are required.`);
    return { label, value, note: S(o.note) };
  });
}

function validateHighlights(arr: unknown[]): HighlightOut[] {
  return arr.map((r, i) => {
    const o = asObj(r, "Highlight", i);
    const title = S(o.title);
    const image = S(o.image);
    if (!title) throw new Error(`Highlight #${i + 1}: a title is required.`);
    if (!image) throw new Error(`Highlight #${i + 1}: an image is required (upload one or remove the row).`);
    return { title, copy: S(o.copy), image };
  });
}

function validateFeatures(arr: unknown[]): FeatureOut[] {
  return arr.map((r, i) => {
    const o = asObj(r, "Feature", i);
    const title = S(o.title);
    const image = S(o.image);
    if (!title) throw new Error(`Feature #${i + 1}: a title is required.`);
    if (!image) throw new Error(`Feature #${i + 1}: an image is required (upload one or remove the row).`);
    const out: FeatureOut = { title, copy: S(o.copy), image };
    const stat = o.stat && typeof o.stat === "object" ? (o.stat as Record<string, unknown>) : null;
    const sv = stat ? S(stat.value) : "";
    const sl = stat ? S(stat.label) : "";
    if (sv || sl) out.stat = { value: sv, label: sl };
    return out;
  });
}

/** Create (mode=new) or update (mode=edit) a car. Upserts the editable
 *  inventory only — the 3D rig stays in code and is merged on read. */
export async function saveCar(
  _prev: CarFormState,
  formData: FormData
): Promise<CarFormState> {
  await requireAuth();
  if (!dbConfigured())
    return { error: "Connect a database (set MONGODB_URI) to add or edit cars." };

  const get = (k: string) => String(formData.get(k) ?? "").trim();
  const slug = get("slug").toLowerCase();
  const name = get("name");

  if (!/^[a-z0-9-]+$/.test(slug))
    return { error: "Slug must be lowercase letters, numbers and dashes only." };
  if (name.length < 2) return { error: "Name is required." };
  if (!get("image")) return { error: "A hero photo is required — upload one." };

  const paint = get("paint");
  if (paint && !/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(paint))
    return { error: "Paint must be a hex colour like #9aa0a6 (or leave it blank)." };

  let specs: SpecOut[];
  let gallery: PhotoOut[];
  let track: TrackOut[];
  let highlights: HighlightOut[];
  let features: FeatureOut[];
  try {
    specs = validateSpecs(parseJsonArray("Specs", get("specs")));
    gallery = validateGallery(parseJsonArray("Gallery", get("gallery")));
    track = validateTrack(parseJsonArray("Track", get("track")));
    highlights = validateHighlights(parseJsonArray("Highlights", get("highlights")));
    features = validateFeatures(parseJsonArray("Features", get("features")));
  } catch (err) {
    return { error: (err as Error).message };
  }

  const fields = {
    name,
    category: get("category"),
    price: get("price"),
    tagline: get("tagline"),
    description: get("description"),
    image: get("image"),
    alt: get("alt"),
    paint,
    modelUrl: get("modelUrl"),
    specs,
    gallery,
    track,
    highlights,
    features,
  };

  try {
    const conn = await connectDB();
    if (!conn) return { error: "Database not reachable." };

    if (get("mode") === "new") {
      if (await CarModel.exists({ slug }))
        return { error: `A car with slug "${slug}" already exists.` };
      const order = await CarModel.estimatedDocumentCount();
      await CarModel.create({ slug, order, ...fields });
    } else {
      await CarModel.updateOne({ slug }, { $set: fields });
    }
  } catch (err) {
    console.error("[admin] saveCar failed:", err);
    return { error: "Save failed — check the server logs." };
  }

  revalidatePath("/models");
  revalidatePath(`/models/${slug}`);
  revalidatePath("/admin/cars");
  redirect("/admin/cars");
}

export async function deleteCar(formData: FormData): Promise<void> {
  await requireAuth();
  if (!dbConfigured()) return;
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) return;
  try {
    const conn = await connectDB();
    if (conn) await CarModel.deleteOne({ slug });
  } catch (err) {
    console.error("[admin] deleteCar failed:", err);
  }
  revalidatePath("/models");
  revalidatePath("/admin/cars");
}

export async function updateBookingStatus(formData: FormData): Promise<void> {
  await requireAuth();
  if (!dbConfigured()) return;
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["new", "contacted", "closed"].includes(status)) return;
  try {
    const conn = await connectDB();
    if (conn) await BookingModel.updateOne({ _id: id }, { $set: { status } });
  } catch (err) {
    console.error("[admin] updateBookingStatus failed:", err);
  }
  revalidatePath("/admin/bookings");
}

export async function deleteBooking(formData: FormData): Promise<void> {
  await requireAuth();
  if (!dbConfigured()) return;
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  try {
    const conn = await connectDB();
    if (conn) await BookingModel.deleteOne({ _id: id });
  } catch (err) {
    console.error("[admin] deleteBooking failed:", err);
  }
  revalidatePath("/admin/bookings");
}

export async function updateEnquiryStatus(formData: FormData): Promise<void> {
  await requireAuth();
  if (!dbConfigured()) return;
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["new", "contacted", "closed"].includes(status)) return;
  try {
    const conn = await connectDB();
    if (conn) await EnquiryModel.updateOne({ _id: id }, { $set: { status } });
  } catch (err) {
    console.error("[admin] updateEnquiryStatus failed:", err);
  }
  revalidatePath("/admin/enquiries");
}

export async function deleteEnquiry(formData: FormData): Promise<void> {
  await requireAuth();
  if (!dbConfigured()) return;
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  try {
    const conn = await connectDB();
    if (conn) await EnquiryModel.deleteOne({ _id: id });
  } catch (err) {
    console.error("[admin] deleteEnquiry failed:", err);
  }
  revalidatePath("/admin/enquiries");
}
