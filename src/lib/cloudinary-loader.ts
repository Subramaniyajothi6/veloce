/**
 * Custom next/image loader — serves /cars/* photography from Cloudinary
 * (UPLOAD mode; assets pushed by tools/cloudinary-upload.mjs as
 * "veloce/cars/<name>"). Unsplash remotes keep their own CDN with the
 * requested width applied; anything else passes through untouched.
 *
 * Activated via next.config.ts `images.loaderFile` — do not import directly.
 */
import { CLOUD } from "./cloudinary";

export default function cloudinaryLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  if (src.startsWith("/cars/")) {
    const id = src.slice(1).replace(/\.(jpe?g|png|webp|avif)$/i, "");
    const q = quality ? `q_${quality}` : "q_auto";
    return `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,${q},w_${width},c_limit/veloce/${id}`;
  }
  if (src.startsWith("https://images.unsplash.com/")) {
    const u = new URL(src);
    u.searchParams.set("w", String(width));
    u.searchParams.set("auto", "format");
    if (!u.searchParams.has("q")) u.searchParams.set("q", String(quality ?? 75));
    return u.toString();
  }
  return src;
}
