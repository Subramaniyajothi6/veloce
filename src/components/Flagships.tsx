import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { flagships } from "@/data/flagships";

export default function Flagships() {
  return (
    <section id="flagships" className="sec">
      <div className="wrap">
        <div className="sec-top reveal">
          <div>
            <span className="eyebrow">
              <b>03</b> The Flagships
            </span>
            <h2 className="h2">
              Chosen by the <span className="text-outline">house</span>
            </h2>
          </div>
          <p>
            Two machines we&apos;d keep if we could only keep two. Specified by
            our founders, ready for a new garage.
          </p>
        </div>

        {flagships.map((f) => (
          <article
            key={f.slug}
            className="grid grid-cols-[1.08fr_1fr] gap-[clamp(2.5rem,6vw,5.5rem)] items-center py-[clamp(3rem,7vw,5.5rem)] [&+&]:border-t border-line max-[900px]:grid-cols-1"
          >
            <div
              className={`f-img reveal relative ${
                f.reversed ? "min-[901px]:order-2" : ""
              }`}
            >
              <span
                className="absolute -top-[1.6rem] -right-[0.5rem] z-[3] font-display text-[clamp(4rem,8vw,7rem)] text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.35)] leading-none"
                aria-hidden="true"
              >
                {f.index}
              </span>
              <div className="clip">
                <div
                  className="relative aspect-[4/3.1] overflow-hidden bg-panel"
                  data-cursor="VIEW"
                >
                  <Image
                    src={f.image}
                    alt={f.alt}
                    width={1600}
                    height={1240}
                    sizes="(max-width: 900px) 100vw, 50vw"
                    data-plx="-0.045"
                    className="w-[104%] h-[112%] object-cover will-change-transform [filter:saturate(0.95)]"
                  />
                </div>
              </div>
              {f.badge && (
                <span className="absolute left-[1.2rem] top-[1.2rem] z-[3] font-mono text-[0.64rem] font-semibold tracking-[0.26em] uppercase bg-veloce text-white px-[0.9rem] py-2">
                  {f.badge}
                </span>
              )}
            </div>

            <div className="reveal" style={{ "--d": "0.1s" } as CSSProperties}>
              <span className="eyebrow mb-[1.2rem]">{f.eyebrow}</span>
              <h2 className="text-[clamp(2.8rem,6vw,4.6rem)]">{f.name}</h2>
              <p className="text-ash mt-[1.4rem] max-w-[30rem] text-[1.02rem]">
                {f.lede}
              </p>
              <div
                className="grid grid-cols-2 border border-line mt-[2.2rem]"
                data-counters
              >
                {f.specs.map((s) => (
                  <div
                    key={s.label}
                    className="py-[1.4rem] px-6 border-t border-l border-line -mt-px -ml-px"
                  >
                    <div className="font-mono text-[clamp(1.9rem,3.2vw,2.7rem)] font-semibold leading-none tabular-nums">
                      <span data-count={s.value} data-dec={s.decimals}>
                        0
                      </span>
                      <small className="text-[0.55em] text-ash font-medium ml-1">
                        {s.unit}
                      </small>
                    </div>
                    <div className="font-mono text-[0.64rem] tracking-[0.24em] uppercase text-ash mt-2">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-[1.6rem] mt-[2.2rem] flex-wrap">
                <Link className="btn btn-ghost" href={`/models/${f.slug}`}>
                  <span>Explore in 3D</span> <b className="arr">→</b>
                </Link>
                <span className="font-mono text-[0.85rem] tracking-[0.14em] text-ash">
                  FROM <b className="text-cream font-semibold">{f.price}</b>
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
