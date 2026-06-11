import { useEffect } from "react";
import { clamp, prefersReduced } from "@/lib/motion";
import { onFrame } from "@/lib/raf";

/** Colors the #manifesto words in, word by word, as the user scrolls past. */
export function useManifestoFill() {
  useEffect(() => {
    const manifesto = document.getElementById("manifesto");
    if (!manifesto) return;
    const words = Array.from(manifesto.querySelectorAll<HTMLElement>(".mw"));
    if (!words.length) return;
    if (prefersReduced()) {
      words.forEach((w) => w.classList.add("on"));
      return;
    }
    return onFrame(() => {
      const r = manifesto.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height + vh * 0.35;
      const p = clamp((vh * 0.82 - r.top) / total, 0, 1);
      const n = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle("on", i < n));
    });
  }, []);
}
