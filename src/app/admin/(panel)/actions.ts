"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { endSession, requireAuth } from "@/lib/auth";
import { connectDB, dbConfigured } from "@/lib/db";
import { BookingModel } from "@/models/Booking";
import { CarModel } from "@/models/Car";

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

  let specs: unknown[];
  let gallery: unknown[];
  let track: unknown[];
  try {
    specs = parseJsonArray("Specs", get("specs"));
    gallery = parseJsonArray("Gallery", get("gallery"));
    track = parseJsonArray("Track", get("track"));
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
    paint: get("paint"),
    modelUrl: get("modelUrl"),
    specs,
    gallery,
    track,
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
