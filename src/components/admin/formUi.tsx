import type { ReactNode } from "react";

/** Shared field styling for the admin car editor. */
export const labelCls =
  "font-mono text-[0.62rem] tracking-[0.24em] uppercase text-ash";
export const inputCls =
  "bg-panel border border-line px-4 py-3 text-cream outline-none focus:border-veloce transition-colors w-full read-only:opacity-60";

/** Uncontrolled labelled text input (read on the server via FormData). */
export function Text({
  label,
  name,
  defaultValue,
  readOnly,
  placeholder,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  readOnly?: boolean;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className={labelCls}>{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        readOnly={readOnly}
        placeholder={placeholder}
        className={inputCls}
      />
      {hint && <span className="font-mono text-[0.6rem] text-ash/70 leading-relaxed">{hint}</span>}
    </label>
  );
}

/** Uncontrolled labelled textarea. */
export function Area({
  label,
  name,
  defaultValue,
  rows = 4,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
}) {
  return (
    <label className="grid gap-2">
      <span className={labelCls}>{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        className={`${inputCls} resize-y leading-relaxed`}
      />
    </label>
  );
}

/** Titled group with an optional one-line helper. */
export function Fieldset({
  legend,
  hint,
  children,
}: {
  legend: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="grid gap-5 border border-line px-5 py-5">
      <legend className="px-2 font-mono text-[0.66rem] tracking-[0.24em] uppercase text-veloce">
        {legend}
      </legend>
      {hint && (
        <p className="font-mono text-[0.66rem] text-ash leading-relaxed -mt-2">
          {hint}
        </p>
      )}
      {children}
    </fieldset>
  );
}
