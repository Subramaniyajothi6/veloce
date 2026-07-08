"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CarCanvas from "./CarCanvas";
import type { CarProfile } from "@/types";

/** Curated finishes offered in the configurator, over the car's own signature.
 *  Real-world automotive paint references, chosen for contrast across the row. */
const FINISHES: { name: string; hex: string }[] = [
  { name: "Nero", hex: "#0b0b0d" }, // jet black
  { name: "Bianco", hex: "#e9ebee" }, // pearl white
  { name: "Rosso Corsa", hex: "#c01829" }, // Ferrari racing red
  { name: "Argento", hex: "#c0c4c9" }, // metallic silver
  { name: "Blu Notte", hex: "#1d3567" }, // midnight royal blue
  { name: "Verde", hex: "#1b4a31" }, // British racing green
  { name: "Oro", hex: "#bd9a56" }, // champagne gold
];

export default function Configurator({ car }: { car: CarProfile }) {
  // This car's factory-authentic palette (first = signature); fall back to the
  // generic set for any car that hasn't been given one yet.
  const swatches =
    car.finishes && car.finishes.length
      ? car.finishes
      : [{ name: "Signature", hex: car.paint }, ...FINISHES].filter(
          (s, i, arr) =>
            arr.findIndex((x) => x.hex.toLowerCase() === s.hex.toLowerCase()) === i
        );

  const [paint, setPaint] = useState(swatches[0].hex);
  const [webgl, setWebgl] = useState(true);
  const progressRef = useRef(0);

  // one-time WebGL probe so a machine without it still gets the car (as a photo)
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setWebgl(
        !!(c.getContext("webgl") || c.getContext("experimental-webgl"))
      );
    } catch {
      setWebgl(false);
    }
  }, []);

  return (
    <main className="atelier fixed inset-0 bg-coal overflow-hidden">
      {/* stage */}
      {webgl ? (
        <CarCanvas
          paint={paint}
          basePaint={car.paint}
          model={car.model}
          progressRef={progressRef}
          stages={1}
          staticView
          orbit
        />
      ) : (
        <div className="absolute inset-0">
          <Image
            src={car.image}
            alt={car.alt}
            fill
            sizes="100vw"
            className="object-cover opacity-80"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-coal via-transparent to-coal/60" />
        </div>
      )}

      {/* top bar */}
      <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between gap-6 p-[clamp(1.25rem,4vw,2.5rem)]">
        <Link
          href={`/models/${car.slug}`}
          className="group inline-flex items-center gap-3 font-mono text-[0.7rem] tracking-[0.22em] uppercase text-ash hover:text-cream transition-colors"
        >
          <span className="text-veloce transition-transform duration-300 ease-out-expo group-hover:-translate-x-1">
            ←
          </span>
          Back to {car.name}
        </Link>
        <span className="font-mono text-[0.66rem] tracking-[0.28em] uppercase text-ash">
          Configure
        </span>
      </div>

      {/* identity */}
      <div className="absolute left-[clamp(1.25rem,4vw,2.5rem)] top-[clamp(4.5rem,12vh,7rem)] z-10 max-w-[min(90vw,32rem)] pointer-events-none">
        <span className="eyebrow">
          <b>{car.category}</b> Atelier
        </span>
        <h1 className="font-display uppercase leading-[0.95] text-[clamp(2.4rem,6vw,4.5rem)] mt-2">
          {car.name}
        </h1>
        <p className="font-mono text-[0.8rem] tracking-[0.14em] text-ash mt-3">
          FROM <b className="text-cream font-semibold">{car.price}</b>
        </p>
      </div>

      {/* swatch dock */}
      <div className="absolute bottom-0 inset-x-0 z-10 px-[clamp(1.25rem,4vw,2.5rem)] pt-[clamp(1.25rem,4vw,2.5rem)] pb-[clamp(0.6rem,2vw,1.25rem)]">
        <div className="mx-auto w-fit max-w-full">
          <p className="text-center font-mono text-[0.62rem] tracking-[0.3em] uppercase text-ash mb-4">
            {webgl ? "Select a finish" : "Preview unavailable — showing studio photography"}
          </p>
          <div className="flex items-end justify-center gap-[clamp(0.25rem,0.9vw,0.75rem)] overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {swatches.map((s) => {
              const on = paint.toLowerCase() === s.hex.toLowerCase();
              return (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => webgl && setPaint(s.hex)}
                  disabled={!webgl}
                  aria-pressed={on}
                  aria-label={s.name}
                  className="group flex flex-col items-center gap-2 flex-none w-[clamp(5.5rem,11vw,6.75rem)] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {/* Ring is a real bordered wrapper with the disc grid-centered
                      inside it — always concentric, unlike a box-shadow ring drawn
                      under a scale transform (which Chrome shifts off-center). The
                      transparent border keeps size/layout stable when unselected. */}
                  <span
                    className={`grid place-items-center rounded-full border-2 w-[clamp(2.7rem,5.8vw,3.6rem)] h-[clamp(2.7rem,5.8vw,3.6rem)] transition-[transform,border-color,background-color] duration-300 ease-out-expo ${
                      on
                        ? "border-veloce bg-coal scale-105"
                        : "border-transparent group-hover:scale-105"
                    }`}
                  >
                    <span
                      className={`block w-[clamp(2.2rem,5vw,3rem)] h-[clamp(2.2rem,5vw,3rem)] rounded-full border transition-colors duration-300 ${
                        on ? "border-transparent" : "border-white/25 group-hover:border-cream"
                      }`}
                      style={{ backgroundColor: s.hex }}
                    />
                  </span>
                  <span
                    className={`font-mono text-[0.58rem] tracking-[0.14em] uppercase whitespace-nowrap transition-colors ${
                      on ? "text-cream" : "text-ash"
                    }`}
                  >
                    {s.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
