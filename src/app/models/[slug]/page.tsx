import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import CarExperience from "@/components/car3d/CarExperience";
import { cars, getCar } from "@/data/cars";

export function generateStaticParams() {
  return cars.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const car = getCar(slug);
  if (!car) return {};
  return {
    title: `${car.name} — VELOCE Motors`,
    description: `${car.tagline} ${car.category}, from ${car.price}. Explore the ${car.name} in 3D.`,
  };
}

export default async function CarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const car = getCar(slug);
  if (!car) notFound();

  const index = cars.findIndex((c) => c.slug === car.slug);
  const next = cars[(index + 1) % cars.length];

  return (
    <>
      <CarExperience car={car} />

      {/* story + photography */}
      <section className="sec">
        <div className="wrap grid grid-cols-[1.1fr_1fr] gap-[clamp(2.5rem,6vw,5rem)] items-center max-[860px]:grid-cols-1">
          <div className="reveal">
            <span className="eyebrow">
              <b>{car.category}</b> In the metal
            </span>
            <h2 className="h2">{car.name}</h2>
            <p className="text-ash mt-6 max-w-[34rem] text-[1.02rem]">
              {car.description}
            </p>
            <div className="flex items-center gap-[1.6rem] mt-10 flex-wrap">
              <Link
                className="btn btn-red magnetic"
                href={`/test-drive?car=${car.slug}`}
              >
                <span>Book a test drive</span> <b className="arr">→</b>
              </Link>
              <span className="font-mono text-[0.85rem] tracking-[0.14em] text-ash">
                FROM <b className="text-cream font-semibold">{car.price}</b>
              </span>
            </div>
          </div>
          <div
            className="reveal relative aspect-[4/3] overflow-hidden bg-panel"
            style={{ "--d": "0.12s" } as CSSProperties}
          >
            <Image
              src={car.image}
              alt={car.alt}
              width={1400}
              height={1050}
              sizes="(max-width: 860px) 100vw, 45vw"
              className="w-full h-full object-cover [filter:saturate(0.9)]"
            />
          </div>
        </div>
      </section>

      {/* full specification sheet */}
      <section className="sec pt-0">
        <div className="wrap">
          <div className="sec-top reveal">
            <div>
              <span className="eyebrow">
                <b>Data</b> Specification
              </span>
              <h2 className="h2">
                Every <span className="text-outline">number</span>
              </h2>
            </div>
            <p>
              The full sheet — what we measure, where we measure it, and why
              it matters on a real road.
            </p>
          </div>
          <div className="border-t border-line">
            {car.specs.map((s, i) => (
              <div
                key={s.label}
                className="reveal grid grid-cols-[1fr_auto] items-baseline gap-x-8 gap-y-2 py-[1.4rem] border-b border-line group"
                style={{ "--d": `${i * 0.05}s` } as CSSProperties}
              >
                <div className="flex items-baseline gap-6 flex-wrap">
                  <span className="font-mono text-[0.62rem] tracking-[0.3em] text-ash tabular-nums">
                    {`0${i + 1}`}
                  </span>
                  <span className="font-mono text-[0.78rem] tracking-[0.24em] uppercase text-cream">
                    {s.label}
                  </span>
                  {s.detail && (
                    <span className="text-ash text-[0.9rem] max-[700px]:hidden">
                      {s.detail}
                    </span>
                  )}
                </div>
                <div className="font-mono font-semibold tabular-nums text-[clamp(1.4rem,2.6vw,2rem)] leading-none transition-colors duration-300 group-hover:text-veloce">
                  {s.value.toLocaleString("en-US", {
                    minimumFractionDigits: s.decimals ?? 0,
                    maximumFractionDigits: s.decimals ?? 0,
                  })}
                  <small className="text-[0.55em] text-veloce ml-2">
                    {s.unit}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* photography */}
      <section className="sec pt-0">
        <div className="wrap">
          <div className="sec-top reveal">
            <div>
              <span className="eyebrow">
                <b>Film</b> In the wild
              </span>
              <h2 className="h2">
                Shot on <span className="text-outline">location</span>
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-[clamp(1.5rem,3.5vw,3rem)] max-[760px]:grid-cols-1">
            {car.gallery.map((photo, i) => (
              <figure
                key={photo.src}
                className="reveal group"
                style={{ "--d": `${i * 0.1}s` } as CSSProperties}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-panel">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={1400}
                    height={1050}
                    sizes="(max-width: 760px) 100vw, 50vw"
                    className="w-full h-full object-cover scale-[1.01] [filter:saturate(0.85)] [transition:scale_1s_var(--ease-out-expo),filter_0.7s] group-hover:scale-[1.06] group-hover:[filter:saturate(1.05)]"
                  />
                </div>
                <figcaption className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-ash pt-4">
                  <b className="text-veloce font-medium mr-2">{`0${i + 1}`}</b>
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* track numbers */}
      <section className="bg-coal border-y border-line">
        <div className="wrap py-[clamp(4rem,9vh,6.5rem)]">
          <div className="sec-top reveal">
            <div>
              <span className="eyebrow">
                <b>Timing</b> On the track
              </span>
              <h2 className="h2">
                From the <span className="text-outline">timing tower</span>
              </h2>
            </div>
            <p>
              Set on the Veloce test circuit, 4.2 km of everything a road can
              do to a car. Same tyres your car ships on, unless noted.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-[clamp(1.5rem,4vw,3rem)] max-[760px]:grid-cols-1">
            {car.track.map((t, i) => (
              <div
                key={t.label}
                className="reveal border-t-2 border-veloce pt-6"
                style={{ "--d": `${i * 0.08}s` } as CSSProperties}
              >
                <div className="font-mono text-[0.66rem] tracking-[0.28em] uppercase text-ash">
                  {t.label}
                </div>
                <div className="font-mono font-semibold tabular-nums leading-none text-[clamp(2.6rem,5vw,4rem)] mt-4">
                  {t.value}
                </div>
                <p className="text-ash text-[0.9rem] mt-4">{t.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* next model strip */}
      <Link
        href={`/models/${next.slug}`}
        className="group block border-t border-line"
        data-cursor="NEXT"
      >
        <div className="wrap py-[clamp(3rem,7vw,5rem)] flex items-end justify-between gap-8">
          <div>
            <span className="eyebrow">Next in the range</span>
            <span className="block font-display uppercase leading-none text-[clamp(2.6rem,7vw,5.5rem)] mt-4 transition-colors duration-300 group-hover:text-veloce">
              {next.name}
            </span>
          </div>
          <span className="font-display text-5xl leading-none transition-transform duration-[0.4s] ease-out-expo group-hover:translate-x-2.5">
            →
          </span>
        </div>
      </Link>
    </>
  );
}
