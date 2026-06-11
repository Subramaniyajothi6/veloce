import { useEffect } from "react";
import { clamp, prefersReduced } from "@/lib/motion";
import { onFrame } from "@/lib/raf";

/** The marquee band leans (skews) with scroll velocity, easing back upright. */
export function useMarqueeSkew() {
  useEffect(() => {
    if (prefersReduced()) return;
    const wrap = document.querySelector<HTMLElement>(".marquee");
    if (!wrap) return;
    let lastY = window.scrollY;
    let skew = 0;
    const off = onFrame(() => {
      const vy = window.scrollY - lastY;
      lastY = window.scrollY;
      skew += (clamp(vy * 0.55, -14, 14) - skew) * 0.1;
      wrap.style.transform =
        Math.abs(skew) < 0.05 ? "" : `skewX(${(-skew).toFixed(2)}deg)`;
    });
    return () => {
      off();
      wrap.style.transform = "";
    };
  }, []);
}
