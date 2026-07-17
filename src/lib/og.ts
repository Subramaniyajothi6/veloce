/**
 * Social share-card (OpenGraph / Twitter) image helpers.
 *
 * OG images must be ABSOLUTE URLs — crawlers (WhatsApp, iMessage, X, Discord,
 * Slack, Facebook, LinkedIn…) fetch them without our next/image loader — so we
 * build the Cloudinary URL directly here rather than reuse `cloudinary-loader`
 * (which returns loader-shaped URLs and only runs client/SSR side). The card is
 * cropped to the 1.91:1 (1200×630) ratio every platform expects, with `f_jpg`
 * for the broadest scraper compatibility and `g_auto` to keep the car centered.
 *
 * Uses the shared delivery cloud + `veloce/cars/<name>` public_id mapping from
 * `src/lib/cloudinary.ts`.
 */
import { CLOUD } from "./cloudinary";

/** Absolute 1200×630 card URL for a "/cars/<name>.jpg" hero or an Unsplash URL. */
export function ogImageUrl(src: string): string {
  if (src.startsWith("/cars/")) {
    const id = src.slice(1).replace(/\.(jpe?g|png|webp|avif)$/i, "");
    return `https://res.cloudinary.com/${CLOUD}/image/upload/f_jpg,q_auto,w_1200,h_630,c_fill,g_auto/veloce/${id}`;
  }
  // Unsplash (already used for site backdrops) — force an exact 1200×630 JPEG
  // crop; `fm=jpg` over `auto=format` so crawlers never get webp/avif.
  if (src.startsWith("https://images.unsplash.com/")) {
    const u = new URL(src);
    u.search = "";
    u.searchParams.set("w", "1200");
    u.searchParams.set("h", "630");
    u.searchParams.set("fit", "crop");
    u.searchParams.set("fm", "jpg");
    u.searchParams.set("q", "80");
    return u.toString();
  }
  return src;
}

/** A ready-to-spread OpenGraph/Twitter `images` entry for a car hero path. */
export function ogImage(src: string, alt: string) {
  return { url: ogImageUrl(src), width: 1200, height: 630, alt } as const;
}

/** Site-wide cover card — the "Feel it for yourself" deck backdrop; also the
 * fallback for pages without their own photo. */
export const DEFAULT_OG_IMAGE = ogImage(
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8",
  "A blacked-out performance car on an open deck at dusk — VELOCE Motors",
);
