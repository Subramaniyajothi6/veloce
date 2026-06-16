"use server";

import { getCar } from "@/data/cars";
import { locations } from "@/data/locations";

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

/** Validates the booking and confirms it. Persistence is deferred to Phase B
 *  (MongoDB) — for now a valid submission is NOT stored anywhere. (Writing to
 *  disk would fail anyway: the serverless filesystem is read-only.) */
export async function submitBooking(
  _prev: BookingState,
  formData: FormData
): Promise<BookingState> {
  const errors: Record<string, string> = {};

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const carSlug = String(formData.get("car") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();

  if (name.length < 2) errors.name = "Tell us your name.";
  if (!EMAIL.test(email)) errors.email = "That email doesn't look right.";
  const car = getCar(carSlug);
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

  /* Phase B will persist the booking here (MongoDB). Until then nothing is
     stored — the form just validates and confirms. */
  return { ok: true, errors: {}, carName: car!.name };
}
