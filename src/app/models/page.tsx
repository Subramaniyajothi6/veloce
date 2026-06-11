import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { cars } from "@/data/cars";

export const metadata: Metadata = {
  title: "The Range — VELOCE Motors",
  description:
    "Seven machines, one obsession. Explore every model in the VELOCE range in 3D.",
};

export default function ModelsPage() {
  return (
    <section className="sec pt-[clamp(8rem,16vh,11rem)]">
      <div className="wrap">
        <div className="sec-top reveal">
          <div>
            <span className="eyebrow">
              <b>{`0${cars.length}`}</b> The Range
            </span>
            <h2 className="h2">
              Seven ways to <span className="text-outline">lose your head</span>
            </h2>
          </div>
          <p>
            Every car in the current range, in the metal. Open one — then scroll
            to walk around it and read the numbers that matter.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-[clamp(1.5rem,3.5vw,3rem)] gap-y-[clamp(2.5rem,5vw,4.5rem)] max-[760px]:grid-cols-1">
          {cars.map((car, i) => (
            <Link
              key={car.slug}
              href={`/models/${car.slug}`}
              data-cursor="VIEW"
              className="group reveal relative"
              style={{ "--d": `${(i % 2) * 0.08}s` } as CSSProperties}
            >
              <span
                className="absolute -top-[1.1rem] -left-[0.4rem] z-[3] font-display text-[clamp(2.6rem,5vw,4.2rem)] leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.5)]"
                aria-hidden="true"
              >
                {`0${i + 1}`}
              </span>
              <div className="relative aspect-[16/10] overflow-hidden bg-panel after:content-[''] after:absolute after:inset-0 after:bg-[linear-gradient(180deg,transparent_55%,rgba(10,10,11,0.55))] after:pointer-events-none">
                <Image
                  src={car.image}
                  alt={car.alt}
                  width={1400}
                  height={875}
                  sizes="(max-width: 760px) 100vw, 50vw"
                  className="w-full h-full object-cover scale-[1.01] [filter:saturate(0.85)] [transition:scale_1s_var(--ease-out-expo),filter_0.7s] group-hover:scale-[1.07] group-hover:[filter:saturate(1.05)]"
                />
                <span className="absolute top-4 right-4 z-[2] font-mono text-[0.66rem] tracking-[0.18em] text-white bg-[rgba(10,10,11,0.55)] border border-white/[0.18] backdrop-blur-[8px] px-[0.8rem] py-[0.45rem] uppercase">
                  {car.category}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-6 pt-[1.1rem]">
                <h3 className="text-[clamp(1.6rem,2.6vw,2.3rem)] tracking-[0.03em] transition-colors duration-300 group-hover:text-veloce">
                  {car.name}
                </h3>
                <span className="font-mono text-[0.8rem] tracking-[0.12em] text-ash whitespace-nowrap">
                  {car.price}
                </span>
              </div>
              <p className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-ash mt-1">
                {car.specs[0].value.toLocaleString("en-US")} {car.specs[0].unit}{" "}
                · {car.specs[1].value.toFixed(car.specs[1].decimals ?? 0)} S ·
                explore in 3D <b className="text-veloce">→</b>
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
