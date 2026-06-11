"use client";

import { useEffect, useRef, useState } from "react";
import { clamp, prefersReduced } from "@/lib/motion";

/* play once per session — client navigations back to home skip it */
let hasPlayed = false;

export default function Preloader() {
  const [done, setDone] = useState(false); // slide up
  const [gone, setGone] = useState(hasPlayed); // unmount
  const countRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLElement>(null);

  useEffect(() => {
    /* hero entrance animations are gated on html.loaded so they can't play
       hidden behind the overlay while React is still hydrating */
    if (hasPlayed || prefersReduced()) {
      hasPlayed = true;
      setGone(true);
      document.documentElement.classList.add("loaded");
      return;
    }
    let raf = 0;
    const timeouts = new Set<number>();
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      hasPlayed = true;
      setDone(true);
      document.documentElement.classList.add("loaded");
      timeouts.add(window.setTimeout(() => setGone(true), 1200));
    };
    let t0: number | null = null;
    const DUR = 1500;
    const tick = (ts: number) => {
      if (t0 === null) t0 = ts;
      const p = clamp((ts - t0) / DUR, 0, 1);
      const e = 1 - Math.pow(1 - p, 3);
      const n = Math.round(e * 100);
      if (countRef.current)
        countRef.current.textContent = (n < 10 ? "0" : "") + n;
      if (lineRef.current)
        lineRef.current.style.transform = `scaleX(${e})`;
      if (p < 1) raf = requestAnimationFrame(tick);
      else timeouts.add(window.setTimeout(finish, 250));
    };
    raf = requestAnimationFrame(tick);
    timeouts.add(window.setTimeout(finish, 4000)); // failsafe
    return () => {
      cancelAnimationFrame(raf);
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, []);

  if (gone) return null;
  return (
    <div
      aria-hidden="true"
      className={`js-only fixed inset-0 z-[9500] bg-coal flex items-center justify-center transition-transform duration-1000 ease-in-out-hard ${
        done ? "-translate-y-[101%]" : ""
      }`}
    >
      <div className="overflow-hidden">
        <span className="block font-display text-[clamp(3rem,10vw,6.5rem)] tracking-[0.04em] leading-none text-cream uppercase [transform:translateY(110%)] animate-rise">
          VELOCE<b className="text-veloce">.</b>
        </span>
      </div>
      <div className="absolute left-[clamp(1.5rem,5vw,4rem)] bottom-[clamp(1rem,4vw,2.5rem)] font-mono text-[0.7rem] tracking-[0.3em] uppercase text-ash">
        Performance · Curated
      </div>
      <div
        ref={countRef}
        className="absolute right-[clamp(1.5rem,5vw,4rem)] bottom-[clamp(1rem,4vw,2.5rem)] font-mono text-[clamp(2.5rem,8vw,5rem)] font-medium text-white/25 leading-none tabular-nums"
      >
        00
      </div>
      <div className="absolute left-0 bottom-0 h-0.5 w-full bg-white/10">
        <i
          ref={lineRef}
          className="absolute inset-0 bg-veloce origin-left [transform:scaleX(0)] not-italic"
        />
      </div>
    </div>
  );
}
