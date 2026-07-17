/**
 * Client-side unsigned photo upload to Cloudinary — powers the admin panel's
 * "Upload photo" buttons so a non-technical client never touches the CLI tool
 * (`tools/cloudinary-upload.mjs`) or git.
 *
 * Uploads into the same `veloce/cars/<name>` folder the delivery loader expects
 * and returns a `/cars/<name>` path — so an uploaded photo behaves exactly like
 * a committed one (next/image resizing + OG card cropping both work). The cloud
 * account + folder + public_id↔path mapping are shared via `./cloudinary`.
 */
import { CARS_FOLDER, CLOUD, publicIdToCarPath } from "./cloudinary";

const PRESET = "veloce_unsigned";

export interface UploadResult {
  /** App-relative path to store on the car, e.g. "/cars/royale-hero-lq3f9". */
  path: string;
  /** Absolute Cloudinary URL (handy for an immediate preview). */
  url: string;
}

/** Slugify a car slug/label into a safe Cloudinary public_id stem. */
function stem(slug: string): string {
  return (slug || "car")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "car";
}

/**
 * Upload one image file. Throws with a readable message on failure so the
 * caller can surface it inline.
 */
export async function uploadCarPhoto(file: File, slug: string): Promise<UploadResult> {
  if (!file.type.startsWith("image/")) {
    throw new Error("That file isn't an image.");
  }
  // 10 MB guard — Cloudinary's free unsigned limit and plenty for web photos.
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Image is larger than 10 MB — please use a smaller file.");
  }

  const rand = Math.random().toString(36).slice(2, 7);
  const publicId = `${stem(slug)}-${Date.now().toString(36)}${rand}`;

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", PRESET);
  form.append("folder", CARS_FOLDER);
  form.append("public_id", publicId);

  let data: { public_id?: string; secure_url?: string; error?: { message?: string } };
  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
      method: "POST",
      body: form,
    });
    data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data?.error?.message || `Upload failed (${res.status}).`);
    }
  } catch (err) {
    if (err instanceof Error) throw err;
    throw new Error("Upload failed — check your connection and try again.");
  }

  const pid = data.public_id ?? `${CARS_FOLDER}/${publicId}`; // "veloce/cars/<name>"
  return { path: publicIdToCarPath(pid), url: data.secure_url ?? "" };
}
