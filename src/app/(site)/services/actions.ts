"use server";

import { enquiryFields } from "@/data/enquiryFields";
import { getService } from "@/data/services";
import { connectDB } from "@/lib/db";
import { getCar } from "@/lib/inventory";
import { EnquiryModel } from "@/models/Enquiry";

/* NOTE: "use server" modules may only export async functions — the state
   type lives here (types are erased), but the initial value lives with the
   form component. */
export interface EnquiryState {
  ok: boolean;
  /** Field name → message; "form" for top-level errors. */
  errors: Record<string, string>;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validates a service enquiry and, when a database is configured, persists it
 *  to the `Enquiry` collection. With no `MONGODB_URI` the form still validates
 *  and confirms (demo mode) — matching the test-drive booking behaviour. */
export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData
): Promise<EnquiryState> {
  const errors: Record<string, string> = {};

  const service = getService(String(formData.get("service") ?? "").trim());
  if (!service)
    return { ok: false, errors: { form: "Unknown service — reload and try again." } };

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim().slice(0, 40);
  const message = String(formData.get("message") ?? "").trim().slice(0, 2000);

  if (name.length < 2) errors.name = "Tell us your name.";
  if (!EMAIL.test(email)) errors.email = "That email doesn't look right.";

  /* Only fields declared for this service make it into the document. */
  const details: Record<string, string> = {};
  for (const field of enquiryFields[service.slug] ?? []) {
    const value = String(formData.get(field.name) ?? "").trim().slice(0, 300);
    if (!value) {
      if (field.required) errors[field.name] = "We need this one.";
      continue;
    }
    if (field.type === "select" && !field.options?.includes(value)) {
      errors[field.name] = "Pick one of the options.";
      continue;
    }
    if (field.type === "car") {
      /* Store the car's display name; free text is fine for cars we don't list. */
      const car = await getCar(value);
      details[field.name] = car ? car.name : value;
      continue;
    }
    details[field.name] = value;
  }

  if (Object.keys(errors).length) return { ok: false, errors };

  /* Persist when a DB is configured; otherwise confirm without storing. */
  try {
    const conn = await connectDB();
    if (conn) {
      await EnquiryModel.create({
        service: service.slug,
        serviceTitle: service.title,
        name,
        email,
        phone,
        details,
        message,
      });
    }
  } catch (err) {
    console.error("[enquiry] failed to persist:", err);
    return {
      ok: false,
      errors: { form: "Something went wrong sending your enquiry. Please try again." },
    };
  }

  return { ok: true, errors: {} };
}
