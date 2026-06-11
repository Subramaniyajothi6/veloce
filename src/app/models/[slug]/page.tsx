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
              <a
                className="btn btn-red magnetic"
                href={`mailto:drive@veloce.motors?subject=Test drive — ${car.name}`}
              >
                <span>Book a test drive</span> <b className="arr">→</b>
              </a>
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
