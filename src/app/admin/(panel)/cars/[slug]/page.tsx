import Link from "next/link";
import { notFound } from "next/navigation";
import { getCar } from "@/lib/inventory";
import CarForm from "../CarForm";

export default async function EditCarPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const car = await getCar(slug);
  if (!car) notFound();

  return (
    <div className="grid gap-8">
      <div>
        <Link
          href="/admin/cars"
          className="font-mono text-[0.66rem] tracking-[0.24em] uppercase text-ash hover:text-cream transition-colors"
        >
          ← Cars
        </Link>
        <h1 className="font-display uppercase text-[clamp(2rem,5vw,3rem)] leading-none mt-3">
          {car.name}
        </h1>
      </div>
      <CarForm mode="edit" car={car} />
    </div>
  );
}
