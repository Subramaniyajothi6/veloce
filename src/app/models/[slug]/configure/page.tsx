import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Configurator from "@/components/car3d/Configurator";
import { getCar, getCars } from "@/lib/inventory";

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
  return {
    title: `Configure the ${car.name} — VELOCE Motors`,
    description: `Choose a finish for the ${car.name} in the VELOCE atelier.`,
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
