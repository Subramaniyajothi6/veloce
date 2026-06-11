import Image from "next/image";
import Link from "next/link";
import { showroomCars } from "@/data/showroom";

export default function Showroom() {
  const total = String(showroomCars.length + 1).padStart(2, "0");
  return (
    <section id="showroom" className="showroom relative stacked:h-auto!">
      <div className="g-pane sticky top-0 h-svh overflow-hidden flex items-end stacked:static stacked:h-auto stacked:overflow-visible stacked:block">
        <div
          className="absolute top-[max(2.5rem,6vh)] -right-[1vw] z-0 font-display text-[clamp(8rem,22vw,19rem)] leading-[0.8] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.07)] uppercase pointer-events-none select-none stacked:hidden"
          aria-hidden="true"
        >
          Showroom
        </div>
        <div className="wrap absolute top-[clamp(5.5rem,10vh,7.5rem)] inset-x-0 z-[5] flex items-end justify-between gap-8 stacked:static stacked:mb-10 w-full">
          <div>
            <span className="eyebrow">
              <b>02</b> The Showroom
            </span>
            <h2 className="h2">
              Current <span className="text-outline">inventory</span>
            </h2>
          </div>
          <span className="font-mono text-[0.62rem] tracking-[0.3em] uppercase text-ash">
            Scroll to explore →
          </span>
        </div>

        <div
          id="gTrack"
          className="relative z-[2] flex gap-[clamp(1.5rem,3.5vw,3rem)] items-end px-[clamp(1.25rem,5vw,4rem)] pb-[clamp(5rem,11vh,7rem)] w-max will-change-transform stacked:transform-none! stacked:w-full stacked:flex-col stacked:items-stretch stacked:p-0"
        >
          {showroomCars.map((car, i) => (
            <Link
              key={car.slug}
              className="group relative w-[min(56vw,800px)] flex-none stacked:w-full"
              href={`/models/${car.slug}`}
              data-cursor="DRIVE"
            >
              <span
                className="absolute -top-[1.1rem] -left-[0.4rem] z-[3] font-display text-[clamp(3rem,6vw,5rem)] leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.5)]"
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
                  sizes="(max-width: 860px) 100vw, 56vw"
                  className="w-full h-full object-cover scale-[1.01] [filter:saturate(0.85)] [transition:scale_1s_var(--ease-out-expo),filter_0.7s] group-hover:scale-[1.07] group-hover:[filter:saturate(1.05)]"
                />
                <span className="absolute top-4 right-4 z-[2] font-mono text-[0.66rem] tracking-[0.18em] text-white bg-[rgba(10,10,11,0.55)] border border-white/[0.18] backdrop-blur-[8px] px-[0.8rem] py-[0.45rem]">
                  <b className="text-veloce font-medium">{car.specHp}</b> / {car.specRest}
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-6 pt-[1.1rem]">
                <h3 className="text-[clamp(1.7rem,3vw,2.6rem)] tracking-[0.03em] transition-colors duration-300 group-hover:text-veloce">
                  {car.name}
                </h3>
                <span className="font-mono text-[0.8rem] tracking-[0.12em] text-ash whitespace-nowrap">
                  {car.price}
                </span>
              </div>
            </Link>
          ))}

          <Link
            className="group relative w-[min(34vw,440px)] aspect-[4/4.4] flex-none flex flex-col justify-between bg-veloce p-8 text-white overflow-hidden transition-colors duration-[0.4s] hover:bg-veloce-dark stacked:w-full stacked:aspect-auto stacked:min-h-[220px] stacked:gap-6"
            href="/models"
            data-cursor="GO"
          >
            <span className="font-mono text-[0.72rem] tracking-[0.26em] uppercase opacity-85">
              Full inventory
            </span>
            <span className="font-display text-[clamp(2.4rem,4.5vw,4rem)] leading-[1.02] uppercase">
              +27 more
              <br />
              in the vault
            </span>
            <span className="font-display text-5xl leading-none transition-transform duration-[0.4s] ease-out-expo group-hover:translate-x-2.5">
              →
            </span>
          </Link>
        </div>

        <div
          className="wrap absolute bottom-[clamp(1.4rem,3.5vh,2.4rem)] inset-x-0 z-[5] flex items-center gap-6 w-full stacked:hidden"
          aria-hidden="true"
        >
          <span className="font-mono text-[0.78rem] tracking-[0.3em] text-ash tabular-nums">
            <b id="gCount" className="text-cream font-medium">
              01
            </b>{" "}
            / {total}
          </span>
          <div className="flex-1 h-px bg-white/[0.15] relative">
            <i
              id="gProgress"
              className="absolute inset-0 bg-veloce origin-left [transform:scaleX(0)] not-italic"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
