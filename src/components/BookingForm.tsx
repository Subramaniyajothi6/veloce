"use client";

import Link from "next/link";
import { useActionState } from "react";
import { submitBooking, type BookingState } from "@/app/(site)/test-drive/actions";
import { locations } from "@/data/locations";

const initialBookingState: BookingState = { ok: false, errors: {} };

interface CarOption {
  slug: string;
  name: string;
  category: string;
}

const field =
  "w-full bg-transparent border-b border-line pb-3 pt-2 text-cream text-[1rem] " +
  "placeholder:text-ash/60 focus:outline-none focus:border-veloce transition-colors duration-300";
const labelCls =
  "font-mono text-[0.66rem] tracking-[0.26em] uppercase text-ash";
// native <option> popups ignore color-scheme on Chromium/Windows (render white),
// so set the dropdown colours explicitly on each option
const optionCls = "bg-coal text-cream";
const placeholderOptionCls = "bg-coal text-ash";

function Err({ state, name }: { state: BookingState; name: string }) {
  const msg = state.errors[name];
  if (!msg) return null;
  return (
    <p className="font-mono text-[0.7rem] tracking-[0.08em] text-veloce mt-2">
      {msg}
    </p>
  );
}

export default function BookingForm({
  cars,
  initialCar,
}: {
  cars: CarOption[];
  initialCar?: string;
}) {
  const [state, formAction, pending] = useActionState(
    submitBooking,
    initialBookingState
  );

  if (state.ok) {
    return (
      <div className="reveal visible border border-line bg-panel p-[clamp(2rem,5vw,3.5rem)] text-center">
        <span className="eyebrow justify-center">
          <b>Confirmed</b> Request received
        </span>
        <h2 className="font-display uppercase leading-[1.02] text-[clamp(2.2rem,5vw,3.6rem)] mt-5">
          The {state.carName} will be waiting
        </h2>
        <p className="text-ash mt-5 max-w-[34rem] mx-auto">
          Our concierge will call you within one working day to confirm the
          time, route, and paperwork. Bring your licence — leave the rest to
          us.
        </p>
        <div className="flex gap-[1.1rem] justify-center flex-wrap mt-9">
          <Link className="btn btn-red magnetic" href="/models">
            <span>Back to the range</span> <b className="arr">→</b>
          </Link>
          <Link className="btn btn-ghost magnetic" href="/">
            <span>Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      noValidate
      className="grid grid-cols-2 gap-x-[clamp(1.5rem,4vw,3rem)] gap-y-9 max-[700px]:grid-cols-1"
    >
      <div>
        <label className={labelCls} htmlFor="bk-name">
          Full name
        </label>
        <input
          id="bk-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Enzo Rossi"
          className={field}
          required
        />
        <Err state={state} name="name" />
      </div>

      <div>
        <label className={labelCls} htmlFor="bk-email">
          Email
        </label>
        <input
          id="bk-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="enzo@example.com"
          className={field}
          required
        />
        <Err state={state} name="email" />
      </div>

      <div>
        <label className={labelCls} htmlFor="bk-phone">
          Phone <span className="normal-case">(optional)</span>
        </label>
        <input
          id="bk-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+49 …"
          className={field}
        />
      </div>

      <div>
        <label className={labelCls} htmlFor="bk-car">
          The car
        </label>
        <select
          id="bk-car"
          name="car"
          defaultValue={initialCar ?? ""}
          className={`${field} appearance-none cursor-pointer [color-scheme:dark]`}
          required
        >
          <option value="" disabled className={placeholderOptionCls}>
            Choose from the range
          </option>
          {cars.map((c) => (
            <option key={c.slug} value={c.slug} className={optionCls}>
              {c.name} — {c.category}
            </option>
          ))}
        </select>
        <Err state={state} name="car" />
      </div>

      <div>
        <label className={labelCls} htmlFor="bk-location">
          Showroom
        </label>
        <select
          id="bk-location"
          name="location"
          defaultValue=""
          className={`${field} appearance-none cursor-pointer [color-scheme:dark]`}
          required
        >
          <option value="" disabled className={placeholderOptionCls}>
            Pick a city
          </option>
          {locations.map((l) => (
            <option key={l.city} value={l.city} className={optionCls}>
              {l.city} — {l.address}
            </option>
          ))}
        </select>
        <Err state={state} name="location" />
      </div>

      <div>
        <label className={labelCls} htmlFor="bk-date">
          Preferred date
        </label>
        <input
          id="bk-date"
          name="date"
          type="date"
          className={`${field} [color-scheme:dark]`}
          required
        />
        <Err state={state} name="date" />
      </div>

      <div className="col-span-2 max-[700px]:col-span-1">
        <label className={labelCls} htmlFor="bk-message">
          Anything we should know? <span className="normal-case">(optional)</span>
        </label>
        <textarea
          id="bk-message"
          name="message"
          rows={3}
          placeholder="Mountain roads, please."
          className={`${field} resize-none`}
        />
      </div>

      {state.errors.form && (
        <div className="col-span-2 max-[700px]:col-span-1">
          <p className="font-mono text-[0.74rem] tracking-[0.06em] text-veloce border border-veloce/40 bg-veloce/10 px-4 py-3">
            {state.errors.form}
          </p>
        </div>
      )}

      <div className="col-span-2 max-[700px]:col-span-1 flex items-center gap-6 flex-wrap">
        <button
          type="submit"
          disabled={pending}
          className="btn btn-red magnetic disabled:opacity-60 disabled:pointer-events-none"
        >
          <span>{pending ? "Sending…" : "Request the drive"}</span>{" "}
          <b className="arr">→</b>
        </button>
        <span className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-ash">
          No deposit. No obligation.
        </span>
      </div>
    </form>
  );
}
