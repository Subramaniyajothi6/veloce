"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { clamp, prefersReduced } from "@/lib/motion";
import { onFrame } from "@/lib/raf";
import type { CarProfile } from "@/types";
import CarCanvas from "./CarCanvas";

const formatSpec = (value: number, decimals?: number) =>
  decimals ? value.toFixed(decimals) : value.toLocaleString("en-US");

/** useLayoutEffect on the client (no flash), useEffect on the server (no SSR warning). */
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Codrops-style decode/scramble entrance for the car name. */
function ScrambleTitle({ text }: { text: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  /* Long names (e.g. "Bugatti La Voiture Noire") overflow the one-line title
     and spill down behind the car. Measure the natural single-line width and
     shrink the font just enough to keep the whole name on one line, never
     growing past the clamp ceiling — short names keep the big display size. */
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      el.style.fontSize = ""; // back to the clamp default, then measure
      const avail = el.clientWidth; // line box (already inside the px-6 padding)
      const natural = el.scrollWidth; // full one-line text width
      if (natural > avail) {
        const base = parseFloat(getComputedStyle(el).fontSize);
        el.style.fontSize = `${(base * avail) / natural}px`;
      }
    };
    fit();
    window.addEventListener("resize", fit);
    // re-measure once the display webfont has actually loaded
    document.fonts?.ready.then(fit).catch(() => {});
    return () => window.removeEventListener("resize", fit);
  }, [text]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduced()) return;
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const totalFrames = Math.max(24, text.length * 4);
    let frame = 0;
    let raf = 0;
    const tick = () => {
      frame++;
      const resolved = Math.floor((frame / totalFrames) * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        out +=
          i < resolved
            ? text[i]
            : text[i] === " "
              ? " "
              : charset[Math.floor(Math.random() * charset.length)];
      }
      el.textContent = out;
      if (frame < totalFrames) raf = requestAnimationFrame(tick);
      else el.textContent = text;
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.textContent = text;
    };
  }, [text]);
  return (
    <h1
      ref={ref}
      className="block w-full font-display uppercase leading-[0.95] text-[clamp(3.4rem,12vw,10rem)] whitespace-nowrap"
    >
      {text}
    </h1>
  );
}

export default function CarExperience({ car }: { car: CarProfile }) {
  const stages = car.specs.length + 2; // intro + one per spec + outro
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const [stage, setStage] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setMounted(true);
    setReduced(prefersReduced());
  }, []);

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    if (!section) return;
    let last = -1;
    return onFrame(() => {
      const span = section.offsetHeight - window.innerHeight;
      if (span <= 0) return;
      const r = section.getBoundingClientRect();
      const p = clamp(-r.top / span, 0, 1);
      progressRef.current = p;
      if (railRef.current)
        railRef.current.style.transform = `scaleY(${p})`;
      const s = Math.min(stages - 1, Math.floor(p * stages));
      if (s !== last) {
        last = s;
        setStage(s);
      }
    });
  }, [stages, reduced]);

  const outro = stage === stages - 1;
  /* letterboxed while a spec shot is framed */
  const cine = !reduced && stage >= 1 && !outro;

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={reduced ? undefined : { height: `${stages * 85}vh` }}
    >
      <div className="sticky top-0 h-svh overflow-hidden bg-night">
        {mounted && (
          <CarCanvas
            paint={car.paint}
            model={car.model}
            progressRef={progressRef}
            stages={stages}
            staticView={reduced}
            introOffset={stage === 0 && !reduced}
          />
        )}

        {/* cinema vignette */}
        <div
          className="absolute inset-0 z-[3] pointer-events-none bg-[radial-gradient(120%_85%_at_50%_45%,transparent_55%,rgba(7,7,8,0.6)_100%)]"
          aria-hidden="true"
        />

        {/* letterbox bars + shot HUD */}
        {!reduced && (
          <>
            <div
              className={`absolute top-0 inset-x-0 z-[4] h-[clamp(2.6rem,6.5vh,4.2rem)] bg-black transition-[translate] duration-700 ease-out-expo ${
                cine ? "translate-y-0" : "-translate-y-full"
              }`}
              aria-hidden="true"
            />
            <div
              className={`absolute bottom-0 inset-x-0 z-[4] h-[clamp(2.6rem,6.5vh,4.2rem)] bg-black flex items-center justify-between gap-6 px-[clamp(1.25rem,5vw,4rem)] transition-[translate] duration-700 ease-out-expo ${
                cine ? "translate-y-0" : "translate-y-full"
              }`}
              aria-hidden="true"
            >
              <span className="font-mono text-[0.62rem] tracking-[0.3em] uppercase text-ash tabular-nums whitespace-nowrap overflow-hidden text-ellipsis">
                {cine &&
                  `Shot 0${stage} / 0${car.specs.length} — ${car.specs[stage - 1].label}`}
              </span>
              <span className="font-mono text-[0.62rem] tracking-[0.3em] uppercase text-ash whitespace-nowrap max-[600px]:hidden">
                {car.name} · Veloce Motors
              </span>
            </div>
          </>
        )}

        {/* intro title — anchored into the empty band ABOVE the car (the scene
            is nudged down 20vh during the intro) instead of vertically centered,
            so the big name lives in the open space rather than behind the model.
            Still z-[1] (below the canvas) so the car body crops it cleanly. */}
        <div
          className={`absolute inset-0 z-[1] flex items-start justify-center text-center px-6 pt-[clamp(7rem,24vh,16rem)] pointer-events-none transition-[opacity,translate] duration-700 ease-out-expo ${
            stage === 0 || reduced
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-6"
          }`}
        >
          <ScrambleTitle text={car.name} />
        </div>

        {/* intro chrome — eyebrow above the car, tagline + scroll cue below,
            in FRONT of it (z-[5]) */}
        <div
          className={`absolute inset-0 z-[5] flex flex-col items-center justify-between text-center px-6 pt-[clamp(6rem,14vh,9rem)] pb-[clamp(2rem,6vh,4rem)] pointer-events-none transition-[opacity,translate] duration-700 ease-out-expo ${
            stage === 0 || reduced
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-6"
          }`}
        >
          <span className="eyebrow justify-center">
            <b>{car.category}</b>
          </span>
          <div className="flex flex-col items-center gap-[clamp(1rem,4vh,2rem)]">
            <p className="font-mono text-[0.78rem] tracking-[0.26em] uppercase text-ash">
              {car.tagline}
            </p>
            {!reduced && (
              <span className="font-mono text-[0.66rem] tracking-[0.3em] uppercase text-ash animate-pulse">
                Scroll to walk around the car
              </span>
            )}
          </div>
        </div>

        {/* spec stages */}
        {!reduced &&
          car.specs.map((s, i) => (
            <div
              key={s.label}
              className={`absolute top-1/2 -translate-y-1/2 z-[5] pointer-events-none ${
                i % 2 ? "right-[clamp(1.5rem,7vw,6rem)] text-right" : "left-[clamp(1.5rem,7vw,6rem)]"
              }`}
              aria-hidden={stage !== i + 1}
            >
              <div
                className={`transition-[opacity,translate,filter] duration-700 ease-out-expo ${
                  stage === i + 1
                    ? "opacity-100 translate-y-0 [filter:blur(0px)]"
                    : "opacity-0 translate-y-8 [filter:blur(10px)]"
                }`}
              >
                <span className="font-mono text-[0.66rem] tracking-[0.3em] uppercase text-ash">
                  {`0${i + 1} / 0${car.specs.length}`}
                </span>
                <div className="font-mono font-semibold leading-none tabular-nums text-[clamp(3.2rem,8vw,6.5rem)] mt-3">
                  {formatSpec(s.value, s.decimals)}
                  <small className="text-[0.4em] text-veloce font-semibold ml-2 align-baseline">
                    {s.unit}
                  </small>
                </div>
                <div
                  className={`h-px w-24 bg-veloce mt-5 ${i % 2 ? "ml-auto" : ""}`}
                />
                <div className="font-mono text-[0.72rem] tracking-[0.26em] uppercase text-cream mt-4">
                  {s.label}
                </div>
                {s.detail && (
                  <p
                    className={`text-ash text-[0.92rem] leading-relaxed mt-3 max-w-[20rem] ${
                      i % 2 ? "ml-auto" : ""
                    }`}
                  >
                    {s.detail}
                  </p>
                )}
              </div>
            </div>
          ))}

        {/* outro / CTA */}
        <div
          className={`absolute inset-x-0 bottom-0 z-[5] flex flex-col items-center text-center gap-6 pb-[clamp(2.5rem,8vh,5rem)] px-6 transition-[opacity,translate] duration-700 ease-out-expo ${
            outro || reduced
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-8 pointer-events-none"
          }`}
        >
          {reduced && (
            <div className="grid grid-cols-3 gap-6 max-[700px]:grid-cols-2 mb-2">
              {car.specs.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="font-mono font-semibold tabular-nums text-[1.6rem]">
                    {formatSpec(s.value, s.decimals)}
                    <small className="text-[0.55em] text-veloce ml-1">{s.unit}</small>
                  </div>
                  <div className="font-mono text-[0.62rem] tracking-[0.22em] uppercase text-ash mt-1">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}
          <span className="font-mono text-[0.85rem] tracking-[0.14em] text-ash">
            FROM <b className="text-cream font-semibold">{car.price}</b>
          </span>
          <div className="flex gap-[1.1rem] justify-center flex-wrap">
            <Link
              className="btn btn-red magnetic"
              href={`/test-drive?car=${car.slug}`}
            >
              <span>Book this car</span> <b className="arr">→</b>
            </Link>
            <Link className="btn btn-ghost magnetic" href="/models">
              <span>Back to the range</span>
            </Link>
          </div>
        </div>

        {/* progress rail */}
        {!reduced && (
          <div
            className="absolute right-[1.4rem] top-1/2 -translate-y-1/2 z-[5] h-[34vh] w-px bg-white/15"
            aria-hidden="true"
          >
            <i
              ref={railRef}
              className="absolute inset-0 bg-veloce origin-top [transform:scaleY(0)] not-italic"
            />
          </div>
        )}
      </div>
    </section>
  );
}
