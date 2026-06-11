import { useEffect } from "react";
import { prefersReduced } from "@/lib/motion";
import { onFrame } from "@/lib/raf";

/** Gentle scroll parallax for every [data-plx] element. */
export function useParallax() {
  useEffect(() => {
    if (prefersReduced()) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-plx]"));
    if (!els.length) return;
    return onFrame(() => {
      const vh = window.innerHeight;
      for (const el of els) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -80 || r.top > vh + 80) continue;
        const f = parseFloat(el.dataset.plx || "0");
        const off = (r.top + r.height / 2 - vh / 2) * f;
        el.style.transform = `translate3d(0,${off.toFixed(1)}px,0)`;
      }
    });
  }, []);
}
