import Link from "next/link";
import { dbConfigured } from "@/lib/db";
import { getCars } from "@/lib/inventory";
import { deleteCar } from "../actions";

export default async function AdminCarsPage() {
  const cars = await getCars();
  const editable = dbConfigured();

  return (
    <div className="grid gap-8">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <span className="eyebrow">
            <b>{String(cars.length).padStart(2, "0")}</b> Inventory
          </span>
          <h1 className="font-display uppercase text-[clamp(2rem,5vw,3rem)] leading-none mt-2">
            Cars
          </h1>
        </div>
        <Link href="/admin/cars/new" className="btn btn-red">
          <span>New car</span> <b className="arr">→</b>
        </Link>
      </div>

      {!editable && (
        <div className="border border-veloce/40 bg-veloce/10 px-5 py-4 font-mono text-[0.8rem] text-cream">
          <b className="text-veloce">Read-only.</b> Set <code>MONGODB_URI</code> to
          edit, add or remove cars.
        </div>
      )}

      <div className="border border-line divide-y divide-line">
        {cars.map((c) => (
          <div
            key={c.slug}
            className="grid grid-cols-[1fr_auto] items-center gap-4 px-4 py-4 hover:bg-panel/60 transition-colors"
          >
            <div className="min-w-0">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-cream text-[1.05rem]">{c.name}</span>
                <span className="font-mono text-[0.66rem] tracking-[0.18em] uppercase text-ash">
                  {c.slug}
                </span>
              </div>
              <div className="font-mono text-[0.7rem] tracking-[0.12em] text-ash mt-1">
                {c.category} · {c.price}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/admin/cars/${c.slug}`}
                className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-cream hover:text-veloce transition-colors px-3 py-2 border border-line"
              >
                Edit
              </Link>
              <form action={deleteCar}>
                <input type="hidden" name="slug" value={c.slug} />
                <button
                  disabled={!editable}
                  className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-ash hover:text-veloce transition-colors px-3 py-2 border border-line disabled:opacity-40 disabled:hover:text-ash"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
