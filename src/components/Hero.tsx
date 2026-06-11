import Image from "next/image";
import type { CSSProperties } from "react";

function Chars({ text }: { text: string }) {
  return [...text].map((ch, i) => (
    <span
      key={i}
      className={`hero-char${ch === "." ? " hero-char-dot" : ""}`}
      style={{ "--ci": i } as CSSProperties}
    >
      {ch}
    </span>
  ));
}

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-svh flex flex-col justify-end overflow-hidden">
      <div
        className="absolute inset-x-0 -inset-y-[6%] z-0 will-change-transform"
        data-plx="-0.05"
        aria-hidden="true"
      >
        <Image
          src="https://images.unsplash.com/photo-1571607388263-1044f9ea01dd?q=80&w=2000&auto=format&fit=crop"
          alt=""
          width={2000}
          height={1333}
          priority
          sizes="100vw"
          className="w-full h-full object-cover object-[center_62%] [transform:scale(1.18)] [filter:saturate(0.92)_contrast(1.05)] [html.loaded_&]:animate-kenburns motion-reduce:[transform:scale(1.04)]"
        />
      </div>
      <div
        className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(10,10,11,0.55)_0%,rgba(10,10,11,0.05)_35%,rgba(10,10,11,0.2)_62%,rgba(10,10,11,0.96)_96%)] after:content-[''] after:absolute after:inset-0 after:bg-[radial-gradient(120%_90%_at_50%_10%,transparent_50%,rgba(10,10,11,0.5))]"
        aria-hidden="true"
      />

      <div className="wrap relative z-[2] pb-[clamp(2rem,5vh,4rem)]">
        <div className="flex items-end justify-between gap-12 flex-wrap">
          <h1
            aria-label="Pure velocity."
            className="text-[clamp(4.2rem,15.5vw,13.5rem)] tracking-[0.01em] -ml-[0.04em]"
          >
            <span className="block overflow-hidden pb-[0.04em] -mb-[0.04em] text-transparent [-webkit-text-stroke:2.5px_var(--color-cream)]">
              <Chars text="PURE" />
            </span>
            <span className="block overflow-hidden pb-[0.04em] -mb-[0.04em]">
              <Chars text="VELOCITY." />
            </span>
          </h1>
          <div className="hero-fade max-w-[21.5rem] pb-[1.2rem]">
            <p className="text-[#c9c8c0] text-[0.95rem] font-light leading-[1.7]">
              Munich · Dubai · Oslo. Thirty-nine years of sourcing the world&apos;s
              most wanted performance machines — certified, insured and delivered
              like artworks.
            </p>
            <a className="btn btn-red magnetic mt-6" href="#showroom">
              <span>Enter the showroom</span> <b className="arr">↓</b>
            </a>
          </div>
        </div>

        <div className="hero-fade flex items-center justify-between gap-8 flex-wrap border-t border-white/[0.16] mt-[clamp(1.6rem,4vh,3rem)] pt-[1.1rem]">
          <span className="font-mono text-[0.72rem] tracking-[0.26em] uppercase text-[rgba(242,241,236,0.66)]">
            EST. 1987 — <b className="text-veloce font-medium">VELOCE MOTORS</b>
          </span>
          <span
            className="flex items-center gap-[0.8rem] font-mono text-[0.66rem] tracking-[0.3em] uppercase text-[rgba(242,241,236,0.55)]"
            aria-hidden="true"
          >
            Scroll{" "}
            <i className="block w-[42px] h-px bg-white/30 relative overflow-hidden not-italic after:content-[''] after:absolute after:inset-0 after:bg-veloce after:[transform:translateX(-100%)] after:animate-dash" />
          </span>
          <span className="font-mono text-[0.72rem] tracking-[0.26em] uppercase text-[rgba(242,241,236,0.66)]">
            <b className="text-veloce font-medium">770 HP</b> · 2.9 S · 355 KM/H
          </span>
        </div>
      </div>
    </section>
  );
}
