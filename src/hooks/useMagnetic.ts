import { useEffect } from "react";
import { isFinePointer, prefersReduced } from "@/lib/motion";
import { onFrame } from "@/lib/raf";

/**
 * Buttons with `.magnetic` lean toward the cursor within a radius, easing on a
 * shared rAF so the pull springs rather than snaps. An inner `<span>` (the
 * label) leans a little further than the frame, giving the button depth.
 */
const RADIUS = 130;
const PULL = 0.38;
const LABEL_PULL = 0.22;
const EASE = 0.14;

export function useMagnetic() {
  useEffect(() => {
    if (!isFinePointer() || prefersReduced()) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>(".magnetic"));
    if (!els.length) return;

    const items = els.map((b) => ({
      b,
      label: b.querySelector<HTMLElement>("span"),
      tx: 0,
      ty: 0,
      x: 0,
      y: 0,
    }));

    const onMove = (e: PointerEvent) => {
      for (const m of items) {
        const r = m.b.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        if (Math.hypot(dx, dy) < RADIUS) {
          m.tx = dx * PULL;
          m.ty = dy * PULL;
        } else {
          m.tx = 0;
          m.ty = 0;
        }
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const off = onFrame(() => {
      for (const m of items) {
        m.x += (m.tx - m.x) * EASE;
        m.y += (m.ty - m.y) * EASE;
        if (
          m.tx === 0 &&
          m.ty === 0 &&
          Math.abs(m.x) < 0.02 &&
          Math.abs(m.y) < 0.02
        ) {
          if (m.b.style.transform) m.b.style.transform = "";
          if (m.label && m.label.style.transform) m.label.style.transform = "";
          continue;
        }
        m.b.style.transform = `translate(${m.x.toFixed(2)}px,${m.y.toFixed(
          2
        )}px)`;
        if (m.label)
          m.label.style.transform = `translate(${(m.x * LABEL_PULL).toFixed(
            2
          )}px,${(m.y * LABEL_PULL).toFixed(2)}px)`;
      }
    });

    return () => {
      window.removeEventListener("pointermove", onMove);
      off();
      items.forEach((m) => {
        m.b.style.transform = "";
        if (m.label) m.label.style.transform = "";
      });
    };
  }, []);
}
