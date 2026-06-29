import Image from "next/image";
import type { CSSProperties } from "react";
import type { CarHighlight } from "@/types";

/** Porsche-style 2×2 highlight grid: image + title + blurb per cell. */
export default function Highlights({
  items,
  carName,
}: {
  items: CarHighlight[];
  carName: string;
}) {
  return (
    <section id="highlights" className="sec pt-0 scroll-mt-24">
      <div className="wrap">
        <div className="sec-top reveal">
          <div>
            <span className="eyebrow">
              <b>Highlights</b> What sets it apart
            </span>
            <h2 className="h2">
              The case for the <span className="text-outline">{carName.split(" ").slice(-1)}</span>
            </h2>
          </div>
          <p>
            Four things you notice first — in the metal, on the road, and in the
            way it was built.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-[clamp(1rem,2.5vw,2rem)] max-[760px]:grid-cols-1">
          {items.map((h, i) => (
            <article
              key={h.title}
              className="reveal group relative overflow-hidden bg-panel"
              style={{ "--d": `${(i % 2) * 0.08}s` } as CSSProperties}
            >
              <div className="relative aspect-[16/11] overflow-hidden">
                <Image
                  src={h.image}
                  alt=""
                  width={1200}
                  height={825}
                  sizes="(max-width: 760px) 100vw, 50vw"
                  className="w-full h-full object-cover scale-[1.02] [filter:saturate(0.85)] transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.08]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(7,7,8,0.92))] pointer-events-none" />
                <span
                  className="absolute top-4 left-5 font-display text-[clamp(2rem,4vw,3rem)] leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.3)]"
                  aria-hidden="true"
                >
                  {`0${i + 1}`}
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-[clamp(1.4rem,3vw,2.2rem)]">
                <h3 className="text-[clamp(1.3rem,2.2vw,1.8rem)] tracking-[0.01em] text-cream">
                  {h.title}
                </h3>
                <p className="text-ash text-[0.92rem] leading-relaxed mt-3 max-w-[34rem]">
                  {h.copy}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
