import { useEffect } from "react";
import { clamp, isFinePointer, prefersReduced } from "@/lib/motion";
import { onFrame } from "@/lib/raf";

/**
 * Archive hover list: a floating image preview trails the cursor with
 * inertia and tilts with pointer velocity; each row swaps the image.
 */
export function useArchivePreview() {
  useEffect(() => {
    if (!isFinePointer() || prefersReduced()) return;
    const list = document.getElementById("arcList");
    const preview = document.getElementById("arcPreview");
    if (!list || !preview) return;
    const imgs = preview.querySelectorAll("img");
    const rows = Array.from(list.querySelectorAll(".arc-row"));
    let ax = -600;
    let ay = -600;
    let cx = -600;
    let cy = -600;

    const enterHandlers = rows.map((row, i) => {
      const fn = () => {
        imgs.forEach((im, j) => im.classList.toggle("on", i === j));
        preview.classList.add("show");
      };
      row.addEventListener("pointerenter", fn);
      return fn;
    });
    const leave = () => preview.classList.remove("show");
    list.addEventListener("pointerleave", leave);
    const move = (e: PointerEvent) => {
      ax = e.clientX;
      ay = e.clientY;
    };
    document.addEventListener("pointermove", move);

    const off = onFrame(() => {
      cx += (ax - cx) * 0.12;
      cy += (ay - cy) * 0.12;
      const rot = clamp((ax - cx) * 0.1, -10, 10);
      preview.style.transform = `translate(${(cx - preview.offsetWidth / 2).toFixed(1)}px,${(cy - preview.offsetHeight / 2).toFixed(1)}px) rotate(${rot.toFixed(2)}deg)`;
    });

    return () => {
      rows.forEach((row, i) =>
        row.removeEventListener("pointerenter", enterHandlers[i])
      );
      list.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointermove", move);
      off();
      preview.classList.remove("show");
    };
  }, []);
}
