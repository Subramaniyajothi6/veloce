"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { CarProfile } from "@/types";
import { saveCar, type CarFormState } from "../actions";

const initial: CarFormState = {};
const labelCls =
  "font-mono text-[0.62rem] tracking-[0.24em] uppercase text-ash";
const inputCls =
  "bg-panel border border-line px-4 py-3 text-cream outline-none focus:border-veloce transition-colors w-full read-only:opacity-60";

function Text({
  label,
  name,
  defaultValue,
  readOnly,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  readOnly?: boolean;
}) {
  return (
    <label className="grid gap-2">
      <span className={labelCls}>{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        readOnly={readOnly}
        className={inputCls}
      />
    </label>
  );
}

function Area({
  label,
  name,
  defaultValue,
  rows = 4,
  mono,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
  mono?: boolean;
}) {
  return (
    <label className="grid gap-2">
      <span className={labelCls}>{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        className={`${inputCls} resize-y leading-relaxed ${mono ? "font-mono text-[0.8rem]" : ""}`}
      />
    </label>
  );
}

export default function CarForm({
  mode,
  car,
}: {
  mode: "new" | "edit";
  car?: CarProfile;
}) {
  const [state, action, pending] = useActionState(saveCar, initial);
  const j = (v: unknown) => JSON.stringify(v ?? [], null, 2);

  return (
    <form action={action} className="grid gap-6 max-w-[46rem]">
      <input type="hidden" name="mode" value={mode} />

      <Text label="Slug" name="slug" defaultValue={car?.slug} readOnly={mode === "edit"} />
      <Text label="Name" name="name" defaultValue={car?.name} />

      <div className="grid grid-cols-2 gap-6 max-[600px]:grid-cols-1">
        <Text label="Category" name="category" defaultValue={car?.category} />
        <Text label="Price" name="price" defaultValue={car?.price} />
      </div>

      <Text label="Tagline" name="tagline" defaultValue={car?.tagline} />
      <Area label="Description" name="description" defaultValue={car?.description} rows={3} />

      <div className="grid grid-cols-2 gap-6 max-[600px]:grid-cols-1">
        <Text label="Image path" name="image" defaultValue={car?.image} />
        <Text label="Image alt" name="alt" defaultValue={car?.alt} />
      </div>
      <div className="grid grid-cols-2 gap-6 max-[600px]:grid-cols-1">
        <Text label="Paint (hex)" name="paint" defaultValue={car?.paint} />
        <Text label="3D model URL" name="modelUrl" defaultValue={car?.model.url} />
      </div>

      <Area label="Specs (JSON array)" name="specs" defaultValue={j(car?.specs)} rows={12} mono />
      <Area label="Gallery (JSON array)" name="gallery" defaultValue={j(car?.gallery)} rows={6} mono />
      <Area label="Track (JSON array)" name="track" defaultValue={j(car?.track)} rows={6} mono />

      {state.error && (
        <p className="font-mono text-[0.78rem] text-veloce leading-relaxed border border-veloce/40 bg-veloce/10 px-4 py-3">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-4 flex-wrap">
        <button type="submit" disabled={pending} className="btn btn-red disabled:opacity-60">
          <span>{pending ? "Saving…" : mode === "new" ? "Create car" : "Save changes"}</span>
        </button>
        <Link href="/admin/cars" className="btn btn-ghost">
          <span>Cancel</span>
        </Link>
      </div>
    </form>
  );
}
