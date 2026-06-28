"use server";

import { locations } from "@/data/locations";
import { connectDB } from "@/lib/db";
import { getCar } from "@/lib/inventory";
import { BookingModel } from "@/models/Booking";

/* NOTE: "use server" modules may only export async functions — the state
   type lives here (types are erased), but the initial value lives with the
   form component. */
export interface BookingState {
  ok: boolean;
  /** Field name → message; "form" for top-level errors. */
  errors: Record<string, string>;
  /** Echoed back so the confirmation can name the car. */
  carName?: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validates the booking and, when a database is configured, persists it to the
 *  `Booking` collection. With no `MONGODB_URI` the form still validates and
 *  confirms (demo mode) — nothing is stored, matching the pre-DB behaviour. */
export async function submitBooking(
  _prev: BookingState,
  formData: FormData
): Promise<BookingState> {
  const errors: Record<string, string> = {};

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const carSlug = String(formData.get("car") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (name.length < 2) errors.name = "Tell us your name.";
  if (!EMAIL.test(email)) errors.email = "That email doesn't look right.";
  const car = await getCar(carSlug);
  if (!car) errors.car = "Pick a car from the range.";
  if (!locations.some((l) => l.city === location))
    errors.location = "Pick a showroom.";
  if (!date) {
    errors.date = "Pick a date.";
  } else {
    const d = new Date(`${date}T12:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(d.getTime()) || d < today)
      errors.date = "Pick a date from today onward.";
  }

  if (Object.keys(errors).length) return { ok: false, errors };

  /* Persist when a DB is configured; otherwise confirm without storing. */
  try {
    const conn = await connectDB();
    if (conn) {
      await BookingModel.create({
        name,
        email,
        phone,
        carSlug,
        carName: car!.name,
        location,
        date,
        message,
      });
    }
  } catch (err) {
    console.error("[booking] failed to persist:", err);
    return {
      ok: false,
      errors: { form: "Something went wrong saving your request. Please try again." },
    };
  }

  return { ok: true, errors: {}, carName: car!.name };
}
