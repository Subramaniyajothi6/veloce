import { useEffect } from "react";
import { clamp, prefersReduced } from "@/lib/motion";
import { onFrame } from "@/lib/raf";

/**
 * Pinned horizontal showroom gallery: the section's height is stretched so
 * vertical scroll drives a lerped horizontal translate of the track.
 * Falls back to the stacked layout below 861px / with reduced motion.
 */
export function useHorizontalScroll() {
  useEffect(() => {
    const showroom = document.querySelector<HTMLElement>(".showroom");
    const track = document.getElementById("gTrack");
    const pane = document.querySelector<HTMLElement>(".g-pane");
    const progress = document.getElementById("gProgress");
    const count = document.getElementById("gCount");
    if (!showroom || !track || !pane) return;

    const cards = track.children.length;
    let active = false;
    let max = 0;
    let cur = 0;

    const layout = () => {
      active = window.matchMedia("(min-width: 861px)").matches && !prefersReduced();
      if (!active) {
        showroom.style.height = "";
        track.style.transform = "";
        return;
      }
      max = track.scrollWidth - pane.clientWidth;
      showroom.style.height = `${max + window.innerHeight}px`;
    };

    const off = onFrame(() => {
      if (!active) return;
      const r = showroom.getBoundingClientRect();
      const span = showroom.offsetHeight - window.innerHeight;
      if (span <= 0) return;
      const p = clamp(-r.top / span, 0, 1);
      const target = p * max;
      cur += (target - cur) * 0.09;
      if (Math.abs(target - cur) < 0.4) cur = target;
      track.style.transform = `translate3d(${-cur}px,0,0)`;
      if (progress) progress.style.transform = `scaleX(${p})`;
      if (count) {
        const idx = 1 + Math.round(p * (cards - 1));
        count.textContent = (idx < 10 ? "0" : "") + idx;
      }
    });

    layout();
    window.addEventListener("resize", layout);
    window.addEventListener("load", layout);
    return () => {
      off();
      window.removeEventListener("resize", layout);
      window.removeEventListener("load", layout);
      showroom.style.height = "";
      track.style.transform = "";
    };
  }, []);
}
