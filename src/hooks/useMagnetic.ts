import { useEffect } from "react";
import { isFinePointer, prefersReduced } from "@/lib/motion";

/** Buttons with .magnetic lean toward the cursor while hovered. */
export function useMagnetic() {
  useEffect(() => {
    if (!isFinePointer() || prefersReduced()) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>(".magnetic"));
    const timeouts = new Set<number>();

    const cleanups = els.map((el) => {
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${(dx * 0.2).toFixed(1)}px,${(dy * 0.2).toFixed(1)}px)`;
      };
      const leave = () => {
        el.style.transition = "transform .5s cubic-bezier(.2,1,.3,1.2)";
        el.style.transform = "";
        timeouts.add(window.setTimeout(() => (el.style.transition = ""), 500));
      };
      const enter = () => {
        el.style.transition = "transform .15s ease-out";
        timeouts.add(window.setTimeout(() => (el.style.transition = "none"), 150));
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      el.addEventListener("pointerenter", enter);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
        el.removeEventListener("pointerenter", enter);
        el.style.transform = "";
        el.style.transition = "";
      };
    });

    return () => {
      cleanups.forEach((fn) => fn());
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, []);
}
