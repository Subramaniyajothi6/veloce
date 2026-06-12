import type { Metadata } from "next";
import BookingForm from "@/components/BookingForm";
import { cars, getCar } from "@/data/cars";

export const metadata: Metadata = {
  title: "Book a test drive — VELOCE Motors",
  description:
    "Choose your car, your showroom, and your morning. The concierge handles the rest.",
};

export default async function TestDrivePage({
  searchParams,
}: {
  searchParams: Promise<{ car?: string }>;
}) {
  const { car: carParam } = await searchParams;
  const preselected = carParam && getCar(carParam) ? carParam : undefined;

  return (
    <section className="sec pt-[clamp(8rem,16vh,11rem)]">
      <div className="wrap max-w-[960px]">
        <div className="reveal">
          <span className="eyebrow">
            <b>Concierge</b> Test drive
          </span>
          <h1 className="h2">
            Thirty minutes that will{" "}
            <span className="text-outline">cost you a fortune</span>
          </h1>
          <p className="text-ash mt-6 max-w-[36rem]">
            Pick the car, the showroom, and the morning. We prepare the route,
            the paperwork, and a second espresso for when you come back
            grinning.
          </p>
        </div>

        <div className="reveal mt-[clamp(2.5rem,6vh,4rem)]">
          <BookingForm
            cars={cars.map(({ slug, name, category }) => ({
              slug,
              name,
              category,
            }))}
            initialCar={preselected}
          />
        </div>
      </div>
    </section>
  );
}
