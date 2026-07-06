"use client";

import { useActionState } from "react";
import { submitEnquiry, type EnquiryState } from "@/app/(site)/services/actions";
import type { EnquiryField } from "@/types";

const initialEnquiryState: EnquiryState = { ok: false, errors: {} };

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

function Err({ state, name }: { state: EnquiryState; name: string }) {
  const msg = state.errors[name];
  if (!msg) return null;
  return (
    <p className="font-mono text-[0.7rem] tracking-[0.08em] text-veloce mt-2">
      {msg}
    </p>
  );
}

/** Structured enquiry form shared by every /services/[slug] page. The
 *  service-specific inputs come from data/enquiryFields.ts; `cars` feeds the
 *  range dropdown when a field has type "car". */
export default function ServiceEnquiryForm({
  service,
  submitLabel,
  successTitle,
  successCopy,
  fields,
  cars = [],
}: {
  service: string;
  submitLabel: string;
  successTitle: string;
  successCopy: string;
  fields: EnquiryField[];
  cars?: CarOption[];
}) {
  const [state, formAction, pending] = useActionState(
    submitEnquiry,
    initialEnquiryState
  );

  if (state.ok) {
    return (
      <div className="reveal visible border border-line bg-panel p-[clamp(2rem,5vw,3.5rem)] text-center">
        <span className="eyebrow justify-center">
          <b>Received</b> Enquiry sent
        </span>
        <h3 className="font-display uppercase leading-[1.02] text-[clamp(2rem,4.5vw,3.2rem)] mt-5">
          {successTitle}
        </h3>
        <p className="text-ash mt-5 max-w-[34rem] mx-auto">{successCopy}</p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      noValidate
      className="grid grid-cols-2 gap-x-[clamp(1.5rem,4vw,3rem)] gap-y-9 max-[700px]:grid-cols-1"
    >
      <input type="hidden" name="service" value={service} />

      <div>
        <label className={labelCls} htmlFor={`enq-${service}-name`}>
          Full name
        </label>
        <input
          id={`enq-${service}-name`}
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
        <label className={labelCls} htmlFor={`enq-${service}-email`}>
          Email
        </label>
        <input
          id={`enq-${service}-email`}
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
        <label className={labelCls} htmlFor={`enq-${service}-phone`}>
          Phone <span className="normal-case">(optional)</span>
        </label>
        <input
          id={`enq-${service}-phone`}
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+49 …"
          className={field}
        />
      </div>

      {fields.map((f) => {
        const id = `enq-${service}-${f.name}`;
        if (f.type === "car") {
          return (
            <div key={f.name}>
              <label className={labelCls} htmlFor={id}>
                {f.label}
              </label>
              <select
                id={id}
                name={f.name}
                defaultValue=""
                className={`${field} appearance-none cursor-pointer [color-scheme:dark]`}
                required={f.required}
              >
                <option value="" disabled className={placeholderOptionCls}>
                  Choose from the range
                </option>
                {cars.map((c) => (
                  <option key={c.slug} value={c.slug} className={optionCls}>
                    {c.name} — {c.category}
                  </option>
                ))}
                <option value="Another car" className={optionCls}>
                  Another car — details below
                </option>
              </select>
              <Err state={state} name={f.name} />
            </div>
          );
        }
        if (f.type === "select") {
          return (
            <div key={f.name}>
              <label className={labelCls} htmlFor={id}>
                {f.label}
                {!f.required && <span className="normal-case"> (optional)</span>}
              </label>
              <select
                id={id}
                name={f.name}
                defaultValue=""
                className={`${field} appearance-none cursor-pointer [color-scheme:dark]`}
                required={f.required}
              >
                <option value="" disabled className={placeholderOptionCls}>
                  Pick one
                </option>
                {f.options?.map((o) => (
                  <option key={o} value={o} className={optionCls}>
                    {o}
                  </option>
                ))}
              </select>
              <Err state={state} name={f.name} />
            </div>
          );
        }
        return (
          <div key={f.name}>
            <label className={labelCls} htmlFor={id}>
              {f.label}
              {!f.required && <span className="normal-case"> (optional)</span>}
            </label>
            <input
              id={id}
              name={f.name}
              type="text"
              placeholder={f.placeholder}
              className={field}
              required={f.required}
            />
            <Err state={state} name={f.name} />
          </div>
        );
      })}

      <div className="col-span-2 max-[700px]:col-span-1">
        <label className={labelCls} htmlFor={`enq-${service}-message`}>
          Anything we should know? <span className="normal-case">(optional)</span>
        </label>
        <textarea
          id={`enq-${service}-message`}
          name="message"
          rows={3}
          placeholder="The details that matter to you."
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
          <span>{pending ? "Sending…" : submitLabel}</span> <b className="arr">→</b>
        </button>
        <span className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-ash">
          No obligation. One working day.
        </span>
      </div>
    </form>
  );
}
