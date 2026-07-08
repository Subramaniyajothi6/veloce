import { useEffect } from "react";
import { clamp, prefersReduced } from "@/lib/motion";
import { onFrame } from "@/lib/raf";

/**
 * Pinned horizontal showroom gallery: the section's height is stretched so
 * vertical scroll drives a lerped horizontal translate of the track. Because
 * the height is stretched by exactly `max`, the horizontal range equals the
 * vertical span 1:1 — so a pointer drag can "grab and throw" the gallery by
 * scrolling the window, and the same lerp renders it. Falls back to the
 * stacked layout below 861px / with reduced motion; touch keeps native scroll.
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

    // grab-and-throw state
    let dragging = false;
    let moved = 0; // total abs travel in a gesture (for click suppression)
    let lastX = 0;
    let momentum = 0; // px/frame of vertical scroll still to apply

    const layout = () => {
      active =
        window.matchMedia("(min-width: 861px)").matches && !prefersReduced();
      pane.style.cursor = active ? "grab" : "";
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
      // throw momentum after release (1px scroll == 1px track move here)
      if (!dragging && momentum !== 0) {
        window.scrollBy(0, momentum);
        momentum *= 0.93;
        if (Math.abs(momentum) < 0.5) momentum = 0;
      }
      const span = showroom.offsetHeight - window.innerHeight;
      if (span <= 0) return;
      const r = showroom.getBoundingClientRect();
      const p = clamp(-r.top / span, 0, 1);
      const target = p * max;
      // snap 1:1 while dragging for a direct grab; ease otherwise (wheel/throw)
      cur += (target - cur) * (dragging ? 1 : 0.09);
      if (Math.abs(target - cur) < 0.4) cur = target;
      track.style.transform = `translate3d(${-cur}px,0,0)`;
      if (progress) progress.style.transform = `scaleX(${p})`;
      if (count) {
        const idx = 1 + Math.round(p * (cards - 1));
        count.textContent = (idx < 10 ? "0" : "") + idx;
      }
    });

    const onDown = (e: PointerEvent) => {
      if (!active || e.button !== 0 || e.pointerType === "touch") return;
      dragging = true;
      moved = 0;
      lastX = e.clientX;
      momentum = 0;
      pane.style.cursor = "grabbing";
      pane.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      moved += Math.abs(dx);
      window.scrollBy(0, -dx); // drag left → scroll down → gallery advances
      momentum = -dx; // last delta seeds the throw
    };
    const endDrag = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      pane.style.cursor = active ? "grab" : "";
      try {
        pane.releasePointerCapture(e.pointerId);
      } catch {
        // pointer already released
      }
    };
    // swallow the click that fires after a real drag, so it doesn't navigate
    const onClick = (e: MouseEvent) => {
      if (moved > 6) {
        e.preventDefault();
        e.stopPropagation();
        moved = 0;
      }
    };

    pane.addEventListener("pointerdown", onDown);
    pane.addEventListener("pointermove", onMove);
    pane.addEventListener("pointerup", endDrag);
    pane.addEventListener("pointercancel", endDrag);
    pane.addEventListener("click", onClick, true);

    layout();
    window.addEventListener("resize", layout);
    window.addEventListener("load", layout);
    return () => {
      off();
      window.removeEventListener("resize", layout);
      window.removeEventListener("load", layout);
      pane.removeEventListener("pointerdown", onDown);
      pane.removeEventListener("pointermove", onMove);
      pane.removeEventListener("pointerup", endDrag);
      pane.removeEventListener("pointercancel", endDrag);
      pane.removeEventListener("click", onClick, true);
      pane.style.cursor = "";
      showroom.style.height = "";
      track.style.transform = "";
    };
  }, []);
}
