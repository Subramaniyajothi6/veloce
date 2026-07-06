"use client";

import { useState } from "react";

interface CarPriceOption {
  slug: string;
  name: string;
  price: number;
}

const labelCls =
  "font-mono text-[0.66rem] tracking-[0.26em] uppercase text-ash";
const optionCls = "bg-coal text-cream";
const readoutCls =
  "font-mono font-semibold tabular-nums text-[1.05rem] text-cream";
const sliderCls = "w-full accent-veloce cursor-pointer mt-3";

const euro = (n: number) => `€${Math.round(n).toLocaleString("en-US")}`;

/** Illustrative APR: longer money costs more. Mirrors the tiers quoted on the
 *  financing page (from 1.9%). */
function aprFor(termMonths: number): number {
  if (termMonths <= 36) return 1.9;
  if (termMonths <= 60) return 2.4;
  return 2.9;
}

/** Interactive monthly-payment estimator on /services/financing. Pure
 *  client-side illustration — the enquiry form below it is the real ask. */
export default function FinanceCalculator({ cars }: { cars: CarPriceOption[] }) {
  const [price, setPrice] = useState(cars[0]?.price ?? 500_000);
  const [carSlug, setCarSlug] = useState(cars[0]?.slug ?? "");
  const [depositPct, setDepositPct] = useState(20);
  const [term, setTerm] = useState(48);

  const deposit = (price * depositPct) / 100;
  const financed = price - deposit;
  const apr = aprFor(term);
  const r = apr / 100 / 12;
  const monthly = financed > 0 ? (financed * r) / (1 - (1 + r) ** -term) : 0;
  const total = deposit + monthly * term;

  return (
    <div className="border border-line bg-panel p-[clamp(1.6rem,4vw,3rem)] grid grid-cols-[1.2fr_1fr] gap-[clamp(2rem,5vw,4rem)] max-[860px]:grid-cols-1">
      {/* controls */}
      <div className="grid gap-8 content-start">
        <div>
          <label className={labelCls} htmlFor="fin-car">
            The car
          </label>
          <select
            id="fin-car"
            value={carSlug}
            onChange={(e) => {
              const slug = e.target.value;
              setCarSlug(slug);
              const car = cars.find((c) => c.slug === slug);
              if (car) setPrice(car.price);
            }}
            className="w-full bg-transparent border-b border-line pb-3 pt-2 text-cream text-[1rem] appearance-none cursor-pointer [color-scheme:dark] focus:outline-none focus:border-veloce transition-colors duration-300"
          >
            {cars.map((c) => (
              <option key={c.slug} value={c.slug} className={optionCls}>
                {c.name} — {euro(c.price)}
              </option>
            ))}
            <option value="" className={optionCls}>
              Another number — set it below
            </option>
          </select>
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-4">
            <label className={labelCls} htmlFor="fin-price">
              Price
            </label>
            <span className={readoutCls}>{euro(price)}</span>
          </div>
          <input
            id="fin-price"
            type="range"
            min={200_000}
            max={12_000_000}
            step={10_000}
            value={price}
            onChange={(e) => {
              setPrice(Number(e.target.value));
              setCarSlug("");
            }}
            className={sliderCls}
            aria-label="Car price"
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-4">
            <label className={labelCls} htmlFor="fin-deposit">
              Deposit — {depositPct}%
            </label>
            <span className={readoutCls}>{euro(deposit)}</span>
          </div>
          <input
            id="fin-deposit"
            type="range"
            min={10}
            max={70}
            step={5}
            value={depositPct}
            onChange={(e) => setDepositPct(Number(e.target.value))}
            className={sliderCls}
            aria-label="Deposit percentage"
          />
        </div>

        <div>
          <div className="flex items-baseline justify-between gap-4">
            <label className={labelCls} htmlFor="fin-term">
              Term
            </label>
            <span className={readoutCls}>{term} months</span>
          </div>
          <input
            id="fin-term"
            type="range"
            min={12}
            max={84}
            step={12}
            value={term}
            onChange={(e) => setTerm(Number(e.target.value))}
            className={sliderCls}
            aria-label="Term in months"
          />
        </div>
      </div>

      {/* result */}
      <div className="border-l border-line pl-[clamp(2rem,4vw,3.5rem)] max-[860px]:border-l-0 max-[860px]:pl-0 max-[860px]:border-t max-[860px]:pt-8 grid gap-6 content-start">
        <div>
          <div className="font-mono text-[0.66rem] tracking-[0.28em] uppercase text-ash">
            Estimated monthly
          </div>
          <div className="font-mono font-semibold tabular-nums leading-none text-[clamp(2.4rem,4.5vw,3.6rem)] mt-3">
            {euro(monthly)}
            <small className="text-[0.4em] text-veloce ml-2">/ MO</small>
          </div>
        </div>
        <dl className="grid gap-3 font-mono text-[0.78rem] tracking-[0.1em]">
          <div className="flex justify-between gap-6 border-b border-line pb-3">
            <dt className="text-ash uppercase">Financed</dt>
            <dd className="tabular-nums">{euro(financed)}</dd>
          </div>
          <div className="flex justify-between gap-6 border-b border-line pb-3">
            <dt className="text-ash uppercase">APR</dt>
            <dd className="tabular-nums">{apr.toFixed(1)}%</dd>
          </div>
          <div className="flex justify-between gap-6 border-b border-line pb-3">
            <dt className="text-ash uppercase">Total payable</dt>
            <dd className="tabular-nums">{euro(total)}</dd>
          </div>
        </dl>
        <p className="text-ash text-[0.82rem]">
          An illustration, not an offer — your structure is written around you.
          Send the enquiry below and we&apos;ll put real numbers on it.
        </p>
      </div>
    </div>
  );
}
