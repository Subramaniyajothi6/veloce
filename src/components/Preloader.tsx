"use client";

import { useEffect, useRef, useState } from "react";
import { clamp, prefersReduced } from "@/lib/motion";

/* play once per session — client navigations back to home skip it */
let hasPlayed = false;

/** Ignition preloader: the load counter revs 000→100 (fast off the line, held
 *  at the top), then the coal curtains split top/bottom to reveal the hero. */
export default function Preloader() {
  const [split, setSplit] = useState(false); // curtains part
  const [gone, setGone] = useState(hasPlayed); // unmount
  const countRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null);

  useEffect(() => {
    /* hero entrance animations are gated on html.loaded so they can't play
       hidden behind the curtains while React is still hydrating */
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
      document.documentElement.classList.add("loaded");
      setSplit(true); // curtains open onto the revealed hero
      timeouts.add(window.setTimeout(() => setGone(true), 950));
    };
    let t0: number | null = null;
    const DUR = 1700;
    // rev-sweep: quick early, easing into a hold near the redline
    const ease = (t: number) => 1 - Math.pow(1 - t, 2.6);
    const tick = (ts: number) => {
      if (t0 === null) t0 = ts;
      const p = clamp((ts - t0) / DUR, 0, 1);
      const e = ease(p);
      if (countRef.current)
        countRef.current.textContent = String(Math.round(e * 100)).padStart(
          3,
          "0"
        );
      if (barRef.current) barRef.current.style.transform = `scaleX(${e})`;
      if (p < 1) raf = requestAnimationFrame(tick);
      else timeouts.add(window.setTimeout(finish, 220));
    };
    raf = requestAnimationFrame(tick);
    timeouts.add(window.setTimeout(finish, 4500)); // failsafe
    return () => {
      cancelAnimationFrame(raf);
      timeouts.forEach((t) => clearTimeout(t));
    };
  }, []);

  if (gone) return null;
  return (
    <div
      aria-hidden="true"
      className="js-only fixed inset-0 z-[9500] pointer-events-none"
    >
      {/* coal curtains — split apart on finish */}
      <div
        className={`absolute inset-x-0 top-0 h-1/2 bg-coal border-b border-white/[0.06] transition-transform duration-[850ms] ease-in-out-hard ${
          split ? "-translate-y-[101%]" : ""
        }`}
      />
      <div
        className={`absolute inset-x-0 bottom-0 h-1/2 bg-coal transition-transform duration-[850ms] ease-in-out-hard ${
          split ? "translate-y-[101%]" : ""
        }`}
      />

      {/* brand + revs — fade as the curtains part */}
      <div
        className={`absolute inset-0 z-[2] flex flex-col items-center justify-center gap-3 transition-opacity duration-300 ${
          split ? "opacity-0" : ""
        }`}
      >
        <span className="block font-display text-[clamp(3rem,10vw,6.5rem)] tracking-[0.04em] leading-none text-cream uppercase">
          VELOCE<b className="text-veloce">.</b>
        </span>
        <span className="font-mono text-[0.62rem] tracking-[0.34em] uppercase text-ash">
          Performance · Curated
        </span>
      </div>
      <div
        ref={countRef}
        className={`absolute right-[clamp(1.5rem,5vw,4rem)] bottom-[clamp(1rem,4vw,2.5rem)] z-[2] font-mono text-[clamp(2.5rem,8vw,5rem)] font-medium text-white/25 leading-none tabular-nums transition-opacity duration-300 ${
          split ? "opacity-0" : ""
        }`}
      >
        000
      </div>
      <div
        className={`absolute left-0 bottom-0 z-[2] h-0.5 w-full bg-white/10 transition-opacity duration-300 ${
          split ? "opacity-0" : ""
        }`}
      >
        <i
          ref={barRef}
          className="absolute inset-0 bg-veloce origin-left [transform:scaleX(0)] not-italic"
        />
      </div>
    </div>
  );
}
