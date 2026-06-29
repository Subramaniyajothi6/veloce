import type { CarProfile } from "@/types";

/** Pull a comparable figure out of a car's spec list. */
const hp = (c: CarProfile) => c.specs.find((s) => s.unit === "HP")?.value;
const zero = (c: CarProfile) =>
  c.specs.find((s) => /0[–-]100/.test(s.label))?.value;
const vmax = (c: CarProfile) =>
  c.specs.find((s) => s.unit === "KM/H" && /top\s*speed/i.test(s.label))?.value;

interface Row {
  label: string;
  unit: string;
  value: number;
  /** 0–1 fill for this car's bar (best in range = 1). */
  fill: number;
  /** 0–1 position of the range average marker. */
  avgFill: number;
  avg: number;
  decimals?: number;
}

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
  const fmt = (n: number, d = 0) =>
    n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

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
            the bar fills to the class leader, the tick marks the range average.
          </p>
        </div>

        <div className="flex flex-col gap-[clamp(1.6rem,4vw,2.6rem)]">
          {rows.map((r, i) => (
            <div
              key={r.label}
              className="reveal grid grid-cols-[10rem_1fr] gap-[clamp(1rem,3vw,2.5rem)] items-center max-[600px]:grid-cols-1 max-[600px]:gap-3"
              style={{ "--d": `${i * 0.08}s` } as import("react").CSSProperties}
            >
              <div>
                <div className="font-mono text-[0.66rem] tracking-[0.24em] uppercase text-ash">
                  {r.label}
                </div>
                <div className="font-mono font-semibold tabular-nums text-[clamp(1.8rem,3.2vw,2.6rem)] leading-none mt-1">
                  {fmt(r.value, r.decimals)}
                  <small className="text-[0.42em] text-veloce ml-1.5">{r.unit}</small>
                </div>
              </div>

              <div className="relative h-[3px] bg-white/[0.12] mt-1">
                <i
                  className="absolute inset-y-0 left-0 bg-veloce not-italic origin-left"
                  style={{ width: `${Math.max(2, Math.min(100, r.fill * 100))}%` }}
                />
                {/* range-average tick */}
                <i
                  className="absolute -top-[5px] -bottom-[5px] w-px bg-cream/60 not-italic"
                  style={{ left: `${Math.max(0, Math.min(100, r.avgFill * 100))}%` }}
                  aria-hidden="true"
                />
                <span
                  className="absolute top-[10px] font-mono text-[0.6rem] tracking-[0.14em] uppercase text-ash whitespace-nowrap -translate-x-1/2"
                  style={{ left: `${Math.max(6, Math.min(94, r.avgFill * 100))}%` }}
                >
                  avg {fmt(r.avg, r.decimals)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
