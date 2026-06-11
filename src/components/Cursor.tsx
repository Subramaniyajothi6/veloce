"use client";

import { useEffect, useRef } from "react";
import { isFinePointer, prefersReduced } from "@/lib/motion";
import { onFrame } from "@/lib/raf";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!isFinePointer() || prefersReduced()) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const text = textRef.current;
    if (!dot || !ring || !text) return;

    let mx = -100;
    let my = -100;
    let rx = -100;
    let ry = -100;
    let shown = false;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!shown) {
        shown = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
        rx = mx;
        ry = my;
      }
      dot.style.transform = `translate(${mx - 3}px,${my - 3}px)`;
    };
    const onLeave = () => {
      shown = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };
    // delegated so dynamically rendered links keep working
    const onOver = (e: PointerEvent) => {
      const t = (e.target as Element).closest?.("a, button, [data-cursor]");
      if (!t) {
        ring.classList.remove("is-hover", "is-label");
        return;
      }
      const label = t.getAttribute("data-cursor");
      if (label) {
        text.textContent = label;
        ring.classList.add("is-label");
        ring.classList.remove("is-hover");
      } else {
        ring.classList.add("is-hover");
        ring.classList.remove("is-label");
      }
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("pointerover", onOver);
    const off = onFrame(() => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      const half = ring.offsetWidth / 2;
      ring.style.transform = `translate(${(rx - half).toFixed(1)}px,${(ry - half).toFixed(1)}px)`;
    });

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("pointerover", onOver);
      off();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <span ref={textRef} className="cursor-text" />
      </div>
    </>
  );
}
