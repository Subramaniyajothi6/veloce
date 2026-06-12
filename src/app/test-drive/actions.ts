"use server";

import { appendFile, mkdir } from "fs/promises";
import path from "path";
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

/** Validates the booking and appends it to data/bookings.json
 *  (newline-delimited JSON — the seam Phase B's MongoDB will replace). */
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

  const record = {
    at: new Date().toISOString(),
    name,
    email,
    phone,
    car: carSlug,
    location,
    date,
    message,
  };
  const dir = path.join(process.cwd(), "data");
  await mkdir(dir, { recursive: true });
  await appendFile(
    path.join(dir, "bookings.json"),
    JSON.stringify(record) + "\n",
    "utf8"
  );

  return { ok: true, errors: {}, carName: car!.name };
}
