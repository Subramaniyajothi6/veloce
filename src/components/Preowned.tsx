import Image from "next/image";
import type { CSSProperties } from "react";

export default function Preowned() {
  return (
    <section
      id="preowned"
      className="relative overflow-hidden min-h-[64svh] flex items-center"
    >
      <div className="absolute inset-x-0 -inset-y-[8%] z-0" aria-hidden="true">
        <Image
          src="https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=1800&auto=format&fit=crop"
          alt=""
          width={1800}
          height={1200}
          sizes="100vw"
          data-plx="-0.06"
          className="w-full h-full object-cover will-change-transform [filter:saturate(0.9)_brightness(0.85)]"
        />
      </div>
      <div
        className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(10,10,11,0.93)_22%,rgba(10,10,11,0.55)_55%,rgba(10,10,11,0.25))]"
        aria-hidden="true"
      />
      <div className="wrap relative z-[2] w-full">
        <div className="flex items-end justify-between gap-12 flex-wrap py-20">
          <div className="reveal">
            <span className="eyebrow">
              <b>04</b> Certified Pre-owned
            </span>
            <h2 className="h2 max-w-[14ch]">
              History,
              <br />
              with a warranty
            </h2>
            <p className="text-[#c9c8c0] max-w-[27rem] mt-[1.4rem] text-base">
              Every pre-owned Veloce passes the same scrutiny as a factory build
              — provenance traced, every panel gauged, every fluid analysed.
            </p>
            <a className="btn btn-red magnetic mt-8" href="#visit">
              <span>Browse certified stock</span> <b className="arr">→</b>
            </a>
          </div>
          <div
            className="reveal text-right"
            style={{ "--d": "0.15s" } as CSSProperties}
          >
            <div className="font-display uppercase text-[clamp(4rem,9vw,7.5rem)] leading-[0.95] text-transparent [-webkit-text-stroke:2px_var(--color-veloce)]">
              212-PT
            </div>
            <div className="font-mono text-[0.72rem] tracking-[0.3em] uppercase text-ash mt-[0.6rem]">
              Inspection · 24-month warranty
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
