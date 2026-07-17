/**
 * Single source of truth for the Cloudinary delivery account and the car-photo
 * folder convention, shared by the next/image loader (`cloudinary-loader.ts`),
 * the admin uploader (`cloudinary-upload.ts`) and the OG card builder (`og.ts`).
 * Isomorphic constants only — safe to import on the client or the server.
 */
export const CLOUD = "dc6fd4ith";

/** Cloudinary folder every car photo lives in (public_id = `veloce/cars/<name>`). */
export const CARS_FOLDER = "veloce/cars";

/** Cloudinary public_id ("veloce/cars/<name>") -> app path ("/cars/<name>"). */
export function publicIdToCarPath(publicId: string): string {
  return "/" + publicId.replace(/^veloce\//, "");
}
