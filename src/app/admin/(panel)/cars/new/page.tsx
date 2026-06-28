import Link from "next/link";
import CarForm from "../CarForm";

export default function NewCarPage() {
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
          New car
        </h1>
      </div>
      <CarForm mode="new" />
    </div>
  );
}
