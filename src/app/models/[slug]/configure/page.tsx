import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Configurator from "@/components/car3d/Configurator";
import { getCar, getCars } from "@/lib/inventory";
import { ogImage } from "@/lib/og";

/* Deliberately OUTSIDE the (site) route group so it renders on the bare root
   layout — no marketing Nav/Footer over the full-screen atelier (same reason
   /admin lives outside the group). */

export async function generateStaticParams() {
  const cars = await getCars();
  return cars.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const car = await getCar(slug);
  if (!car) return {};
  const title = `Configure the ${car.name} — VELOCE Motors`;
  const description = `Choose a finish for the ${car.name} in the VELOCE atelier.`;
  const image = ogImage(car.image, car.alt || car.name);
  return {
    title,
    description,
    openGraph: {
      type: "website",
      siteName: "VELOCE Motors",
      title,
      description,
      url: `/models/${car.slug}/configure`,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}

export default async function ConfigurePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const car = await getCar(slug);
  if (!car) notFound();
  return <Configurator car={car} />;
}
