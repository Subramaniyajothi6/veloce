export const clamp = (v: number, a: number, b: number): number =>
  Math.min(Math.max(v, a), b);

/** Client-only: respect the user's reduced-motion preference. */
export const prefersReduced = (): boolean =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Client-only: true for mouse/trackpad pointers (cursor + hover effects). */
export const isFinePointer = (): boolean =>
  window.matchMedia("(pointer: fine)").matches;
