import { useEffect } from "react";
import { clamp, prefersReduced } from "@/lib/motion";

const finalText = (target: number, dec: number) =>
  dec ? target.toFixed(dec) : target.toLocaleString("en-US");

/** Eased count-up for every [data-count] inside [data-counters] groups. */
export function useCounters() {
  useEffect(() => {
    const groups = document.querySelectorAll<HTMLElement>("[data-counters]");
    const rafs = new Set<number>();
    const timeouts = new Set<number>();
    const observers: IntersectionObserver[] = [];

    const run = (el: HTMLElement) => {
      const target = parseFloat(el.dataset.count || "0");
      const dec = parseInt(el.dataset.dec || "0", 10);
      let t0: number | null = null;
      const dur = 1900;
      const step = (ts: number) => {
        if (t0 === null) t0 = ts;
        const p = clamp((ts - t0) / dur, 0, 1);
        const e = 1 - Math.pow(2, -10 * p);
        const v = target * e;
        el.textContent = dec
          ? v.toFixed(dec)
          : Math.round(v).toLocaleString("en-US");
        if (p < 1) rafs.add(requestAnimationFrame(step));
        else el.textContent = finalText(target, dec);
      };
      rafs.add(requestAnimationFrame(step));
    };

    groups.forEach((group) => {
      const spans = group.querySelectorAll<HTMLElement>("[data-count]");
      if (prefersReduced() || !("IntersectionObserver" in window)) {
        spans.forEach((el) => {
          el.textContent = finalText(
            parseFloat(el.dataset.count || "0"),
            parseInt(el.dataset.dec || "0", 10)
          );
        });
        return;
      }
      const io = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            spans.forEach((el, i) => {
              timeouts.add(window.setTimeout(() => run(el), i * 120));
            });
            io.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      io.observe(group);
      observers.push(io);
    });

    return () => {
      observers.forEach((io) => io.disconnect());
      timeouts.forEach((t) => clearTimeout(t));
      rafs.forEach((r) => cancelAnimationFrame(r));
    };
  }, []);
}
