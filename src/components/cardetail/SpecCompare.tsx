import type { CarProfile } from "@/types";
import SpecGauges, { type GaugeRow } from "./SpecGauges";

/** Pull a comparable figure out of a car's spec list. */
const hp = (c: CarProfile) => c.specs.find((s) => s.unit === "HP")?.value;
const zero = (c: CarProfile) =>
  c.specs.find((s) => /0[–-]100/.test(s.label))?.value;
const vmax = (c: CarProfile) =>
  c.specs.find((s) => s.unit === "KM/H" && /top\s*speed/i.test(s.label))?.value;

type Row = GaugeRow;

/** "How it compares" — this car's headline figures against the whole range. */
export default function SpecCompare({
  car,
  allCars,
}: {
  car: CarProfile;
  allCars: CarProfile[];
}) {
  const collect = (fn: (c: CarProfile) => number | undefined) =>
    allCars.map(fn).filter((n): n is number => typeof n === "number");

  const rows: Row[] = [];

  // Power & top speed: higher is better → fill = value / max
  for (const [label, unit, fn] of [
    ["Power", "HP", hp],
    ["Top speed", "KM/H", vmax],
  ] as const) {
    const v = fn(car);
    const all = collect(fn);
    if (v === undefined || !all.length) continue;
    const max = Math.max(...all);
    const avg = all.reduce((s, n) => s + n, 0) / all.length;
    rows.push({ label, unit, value: v, fill: v / max, avgFill: avg / max, avg });
  }

  // 0–100: lower is better → fill = min / value (quickest = full bar)
  {
    const v = zero(car);
    const all = collect(zero);
    if (v !== undefined && all.length) {
      const min = Math.min(...all);
      const avg = all.reduce((s, n) => s + n, 0) / all.length;
      rows.push({
        label: "0–100 km/h",
        unit: "S",
        value: v,
        fill: min / v,
        avgFill: min / avg,
        avg,
        decimals: 1,
      });
    }
  }

  if (!rows.length) return null;

  return (
    <section id="compare" className="bg-coal border-y border-line scroll-mt-24">
      <div className="wrap py-[clamp(4rem,9vh,6.5rem)]">
        <div className="sec-top reveal">
          <div>
            <span className="eyebrow">
              <b>Compare</b> Against the range
            </span>
            <h2 className="h2">
              Where it <span className="text-outline">stands</span>
            </h2>
          </div>
          <p>
            Each figure measured against every car in the current VELOCE range —
            the needle sweeps to the class leader, the tick marks the range
            average.
          </p>
        </div>

        <div className="reveal mt-[clamp(2rem,5vw,3.5rem)]">
          <SpecGauges rows={rows} />
        </div>
      </div>
    </section>
  );
}
