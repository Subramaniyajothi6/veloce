import { clamp, prefersReduced } from "./motion";

let anim = 0;

/** Abort an in-flight smooth scroll (e.g. when the user wheels/touches). */
export function cancelSmoothScroll() {
  cancelAnimationFrame(anim);
}

/** JS-driven eased scroll to an absolute Y position. */
export function smoothTo(y: number) {
  if (prefersReduced()) {
    window.scrollTo(0, y);
    return;
  }
  const startY = window.scrollY;
  const diff = y - startY;
  const dur = clamp(Math.abs(diff) * 0.45, 500, 1400);
  let t0: number | null = null;
  cancelAnimationFrame(anim);
  const step = (ts: number) => {
    if (t0 === null) t0 = ts;
    const p = clamp((ts - t0) / dur, 0, 1);
    const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    window.scrollTo(0, startY + diff * e);
    if (p < 1) anim = requestAnimationFrame(step);
  };
  anim = requestAnimationFrame(step);
}
