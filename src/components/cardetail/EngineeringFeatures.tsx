import Image from "next/image";
import type { CSSProperties } from "react";
import type { CarFeature } from "@/types";

/** Alternating full-width image/text "engineering" stories (Porsche-style). */
export default function EngineeringFeatures({ items }: { items: CarFeature[] }) {
  return (
    <section id="engineering" className="sec pt-0 scroll-mt-24">
      <div className="wrap">
        <div className="sec-top reveal">
          <div>
            <span className="eyebrow">
              <b>Engineering</b> Under the skin
            </span>
            <h2 className="h2">
              How it&apos;s <span className="text-outline">made</span>
            </h2>
          </div>
        </div>

        <div className="flex flex-col gap-[clamp(2.5rem,6vw,5rem)]">
          {items.map((f, i) => (
            <article
              key={f.title}
              className={`grid grid-cols-2 gap-[clamp(2rem,5vw,4.5rem)] items-center max-[860px]:grid-cols-1 ${
                i % 2 ? "[&>div:first-child]:min-[861px]:order-2" : ""
              }`}
            >
              <div className="reveal relative">
                <div className="clip">
                  <div className="relative aspect-[4/3] overflow-hidden bg-panel">
                    <Image
                      src={f.image}
                      alt=""
                      width={1400}
                      height={1050}
                      sizes="(max-width: 860px) 100vw, 50vw"
                      className="w-full h-full object-cover [filter:saturate(0.9)]"
                    />
                  </div>
                </div>
              </div>

              <div
                className="reveal"
                style={{ "--d": "0.1s" } as CSSProperties}
              >
                <span className="font-mono text-[0.66rem] tracking-[0.3em] uppercase text-ash">
                  {`0${i + 1} / 0${items.length}`}
                </span>
                <h3 className="text-[clamp(1.8rem,3.4vw,2.8rem)] leading-[1.05] mt-4">
                  {f.title}
                </h3>
                {f.stat && (
                  <div className="flex items-baseline gap-3 mt-6 border-l-2 border-veloce pl-4">
                    <span className="font-mono font-semibold tabular-nums text-[clamp(1.6rem,3vw,2.2rem)] leading-none text-cream">
                      {f.stat.value}
                    </span>
                    <span className="font-mono text-[0.66rem] tracking-[0.18em] uppercase text-ash">
                      {f.stat.label}
                    </span>
                  </div>
                )}
                <p className="text-ash text-[1.02rem] leading-relaxed mt-6 max-w-[34rem]">
                  {f.copy}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
