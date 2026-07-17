"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { Area, Fieldset, Text, inputCls, labelCls } from "@/components/admin/formUi";
import type { CarProfile } from "@/types";
import { saveCar, type CarFormState } from "../actions";

const initial: CarFormState = {};

/** Stable per-row id so React keys survive reorder/remove (never the index). */
const rid = () => Math.random().toString(36).slice(2, 9);

/* ---------- row-list state helpers ---------- */
function useRows<T>(seed: T[]) {
  const [rows, setRows] = useState<T[]>(seed);
  return {
    rows,
    setRows,
    add: (blank: T) => setRows((r) => [...r, blank]),
    remove: (i: number) => setRows((r) => r.filter((_, j) => j !== i)),
    update: (i: number, patch: Partial<T>) =>
      setRows((r) => r.map((it, j) => (j === i ? { ...it, ...patch } : it))),
    move: (i: number, dir: -1 | 1) =>
      setRows((r) => {
        const j = i + dir;
        if (j < 0 || j >= r.length) return r;
        const c = [...r];
        [c[i], c[j]] = [c[j], c[i]];
        return c;
      }),
  };
}

/* ---------- small presentational bits ---------- */
function RowCard({
  index,
  count,
  onMove,
  onRemove,
  children,
}: {
  index: number;
  count: number;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
  children: React.ReactNode;
}) {
  const iconBtn =
    "font-mono text-[0.7rem] w-7 h-7 grid place-items-center border border-line text-ash hover:text-cream disabled:opacity-30 disabled:hover:text-ash";
  return (
    <div className="border border-line bg-night/40 p-4 grid gap-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-ash/70">
          #{index + 1}
        </span>
        <div className="flex items-center gap-1.5">
          <button type="button" onClick={() => onMove(-1)} disabled={index === 0} className={iconBtn} aria-label="Move up">↑</button>
          <button type="button" onClick={() => onMove(1)} disabled={index === count - 1} className={iconBtn} aria-label="Move down">↓</button>
          <button
            type="button"
            onClick={onRemove}
            className="font-mono text-[0.62rem] tracking-[0.16em] uppercase text-ash hover:text-veloce border border-line px-3 h-7"
          >
            Remove
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}

function RowInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-1">
      <span className={labelCls}>{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />
    </label>
  );
}

function RowArea({
  label,
  value,
  onChange,
  rows = 2,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="grid gap-1">
      <span className={labelCls}>{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} className={`${inputCls} resize-y leading-relaxed`} />
    </label>
  );
}

function AddButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="btn btn-ghost text-[0.7rem] justify-self-start">
      <span>+ {children}</span>
    </button>
  );
}

/* ---------- row shapes (all-string for inputs; `id` is a stable React key) ---------- */
type SpecRow = { id: string; label: string; value: string; unit: string; decimals: string; detail: string };
type GalleryRow = { id: string; src: string; alt: string; caption: string };
type TrackRow = { id: string; label: string; value: string; note: string };
type HighlightRow = { id: string; title: string; copy: string; image: string };
type FeatureRow = { id: string; title: string; copy: string; image: string; statValue: string; statLabel: string };

export default function CarForm({ mode, car }: { mode: "new" | "edit"; car?: CarProfile }) {
  const [state, action, pending] = useActionState(saveCar, initial);
  const slug = car?.slug ?? "";

  const [image, setImage] = useState(car?.image ?? "");
  const [paint, setPaint] = useState(car?.paint ?? "#888888");

  const specs = useRows<SpecRow>(
    (car?.specs ?? []).map((s) => ({
      id: rid(),
      label: s.label ?? "",
      value: s.value != null ? String(s.value) : "",
      unit: s.unit ?? "",
      decimals: s.decimals != null ? String(s.decimals) : "",
      detail: s.detail ?? "",
    }))
  );
  const highlights = useRows<HighlightRow>(
    (car?.highlights ?? []).map((h) => ({ id: rid(), title: h.title, copy: h.copy, image: h.image }))
  );
  const features = useRows<FeatureRow>(
    (car?.features ?? []).map((f) => ({
      id: rid(),
      title: f.title,
      copy: f.copy,
      image: f.image,
      statValue: f.stat?.value ?? "",
      statLabel: f.stat?.label ?? "",
    }))
  );
  const gallery = useRows<GalleryRow>(
    (car?.gallery ?? []).map((g) => ({ id: rid(), src: g.src, alt: g.alt, caption: g.caption }))
  );
  const track = useRows<TrackRow>(
    (car?.track ?? []).map((t) => ({ id: rid(), label: t.label, value: t.value, note: t.note }))
  );

  /* ---------- serialize row state -> JSON for FormData (server validates) ---------- */
  // Spec `value` is sent as a raw string on purpose: the server coerces + rejects
  // blanks/non-numbers so bad input can't be silently turned into 0.
  const specsJson = useMemo(
    () =>
      JSON.stringify(
        specs.rows
          .filter((s) => s.label.trim() || s.unit.trim() || s.value.trim())
          .map((s) => ({
            label: s.label.trim(),
            value: s.value.trim(),
            unit: s.unit.trim(),
            ...(s.decimals.trim() ? { decimals: s.decimals.trim() } : {}),
            ...(s.detail.trim() ? { detail: s.detail.trim() } : {}),
          }))
      ),
    [specs.rows]
  );
  const galleryJson = useMemo(
    () =>
      JSON.stringify(
        gallery.rows
          .filter((g) => g.src.trim())
          .map((g) => ({ src: g.src.trim(), alt: g.alt.trim(), caption: g.caption.trim() }))
      ),
    [gallery.rows]
  );
  const trackJson = useMemo(
    () =>
      JSON.stringify(
        track.rows
          .filter((t) => t.label.trim() || t.value.trim())
          .map((t) => ({ label: t.label.trim(), value: t.value.trim(), note: t.note.trim() }))
      ),
    [track.rows]
  );
  const highlightsJson = useMemo(
    () =>
      JSON.stringify(
        highlights.rows
          .filter((h) => h.title.trim() || h.copy.trim() || h.image.trim())
          .map((h) => ({ title: h.title.trim(), copy: h.copy.trim(), image: h.image.trim() }))
      ),
    [highlights.rows]
  );
  const featuresJson = useMemo(
    () =>
      JSON.stringify(
        features.rows
          .filter((f) => f.title.trim() || f.copy.trim() || f.image.trim())
          .map((f) => ({
            title: f.title.trim(),
            copy: f.copy.trim(),
            image: f.image.trim(),
            ...(f.statValue.trim() || f.statLabel.trim()
              ? { stat: { value: f.statValue.trim(), label: f.statLabel.trim() } }
              : {}),
          }))
      ),
    [features.rows]
  );

  return (
    <form action={action} className="grid gap-7 max-w-[52rem]">
      <input type="hidden" name="mode" value={mode} />
      {/* serialized row editors */}
      <input type="hidden" name="specs" value={specsJson} />
      <input type="hidden" name="gallery" value={galleryJson} />
      <input type="hidden" name="track" value={trackJson} />
      <input type="hidden" name="highlights" value={highlightsJson} />
      <input type="hidden" name="features" value={featuresJson} />

      {/* ---- Basics ---- */}
      <Fieldset legend="Basics">
        <Text label="Name" name="name" defaultValue={car?.name} placeholder="Bugatti La Voiture Noire" />
        <div className="grid grid-cols-2 gap-6 max-[600px]:grid-cols-1">
          <Text label="Category" name="category" defaultValue={car?.category} placeholder="Grand Tourer" />
          <Text label="Price" name="price" defaultValue={car?.price} placeholder="€11,000,000" />
        </div>
        <Text label="Tagline" name="tagline" defaultValue={car?.tagline} placeholder="One of one." />
        <Area label="Description" name="description" defaultValue={car?.description} rows={3} />
      </Fieldset>

      {/* ---- Hero photo + paint ---- */}
      <Fieldset legend="Hero photo" hint="The main image on the inventory grid and the car page — also the link-share thumbnail.">
        <ImageUploadField label="Image" value={image} onChange={setImage} slug={slug} name="image" />
        <Text label="Image description (alt text)" name="alt" defaultValue={car?.alt} placeholder="Black Bugatti La Voiture Noire, front three-quarter" />
        <label className="grid gap-2">
          <span className={labelCls}>Signature paint colour</span>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={/^#[0-9a-fA-F]{6}$/.test(paint) ? paint : "#888888"}
              onChange={(e) => setPaint(e.target.value)}
              className="h-11 w-14 bg-panel border border-line p-1"
              aria-label="Paint colour"
            />
            <input value={paint} onChange={(e) => setPaint(e.target.value)} placeholder="#9aa0a6" className={inputCls} />
            <input type="hidden" name="paint" value={paint} />
          </div>
        </label>
      </Fieldset>

      {/* ---- Specs ---- */}
      <Fieldset legend="Specifications" hint="Each becomes an animated figure on the car page (e.g. 1500 · HP · Power).">
        <div className="grid gap-3">
          {specs.rows.map((s, i) => (
            <RowCard key={s.id} index={i} count={specs.rows.length} onMove={(d) => specs.move(i, d)} onRemove={() => specs.remove(i)}>
              <div className="grid grid-cols-2 gap-3 max-[600px]:grid-cols-1">
                <RowInput label="Label" value={s.label} onChange={(v) => specs.update(i, { label: v })} placeholder="Power" />
                <div className="grid grid-cols-[1fr_1fr_auto] gap-3">
                  <RowInput label="Value" value={s.value} onChange={(v) => specs.update(i, { value: v })} placeholder="1500" />
                  <RowInput label="Unit" value={s.unit} onChange={(v) => specs.update(i, { unit: v })} placeholder="HP" />
                  <RowInput label="Decimals" value={s.decimals} onChange={(v) => specs.update(i, { decimals: v })} placeholder="0" />
                </div>
              </div>
              <RowInput label="Detail (optional)" value={s.detail} onChange={(v) => specs.update(i, { detail: v })} placeholder="8.0L quad-turbo W16" />
            </RowCard>
          ))}
        </div>
        <AddButton onClick={() => specs.add({ id: rid(), label: "", value: "", unit: "", decimals: "", detail: "" })}>Add spec</AddButton>
      </Fieldset>

      {/* ---- Highlights ---- */}
      <Fieldset legend="Highlights" hint="The 2×2 story cards on the car page. Leave empty to hide the section.">
        <div className="grid gap-3">
          {highlights.rows.map((h, i) => (
            <RowCard key={h.id} index={i} count={highlights.rows.length} onMove={(d) => highlights.move(i, d)} onRemove={() => highlights.remove(i)}>
              <RowInput label="Title" value={h.title} onChange={(v) => highlights.update(i, { title: v })} placeholder="Coachbuilt in carbon" />
              <RowArea label="Copy" value={h.copy} onChange={(v) => highlights.update(i, { copy: v })} />
              <ImageUploadField label="Image" value={h.image} onChange={(v) => highlights.update(i, { image: v })} slug={slug} compact />
            </RowCard>
          ))}
        </div>
        <AddButton onClick={() => highlights.add({ id: rid(), title: "", copy: "", image: "" })}>Add highlight</AddButton>
      </Fieldset>

      {/* ---- Features ---- */}
      <Fieldset legend="Engineering features" hint="Alternating image/text stories. The optional figure shows large beside the copy.">
        <div className="grid gap-3">
          {features.rows.map((f, i) => (
            <RowCard key={f.id} index={i} count={features.rows.length} onMove={(d) => features.move(i, d)} onRemove={() => features.remove(i)}>
              <RowInput label="Title" value={f.title} onChange={(v) => features.update(i, { title: v })} placeholder="The W16 heart" />
              <RowArea label="Copy" value={f.copy} onChange={(v) => features.update(i, { copy: v })} rows={3} />
              <ImageUploadField label="Image" value={f.image} onChange={(v) => features.update(i, { image: v })} slug={slug} compact />
              <div className="grid grid-cols-2 gap-3 max-[600px]:grid-cols-1">
                <RowInput label="Figure value (optional)" value={f.statValue} onChange={(v) => features.update(i, { statValue: v })} placeholder="1500" />
                <RowInput label="Figure label (optional)" value={f.statLabel} onChange={(v) => features.update(i, { statLabel: v })} placeholder="horsepower" />
              </div>
            </RowCard>
          ))}
        </div>
        <AddButton onClick={() => features.add({ id: rid(), title: "", copy: "", image: "", statValue: "", statLabel: "" })}>Add feature</AddButton>
      </Fieldset>

      {/* ---- Gallery ---- */}
      <Fieldset legend="Gallery" hint="Extra photography shown lower on the car page.">
        <div className="grid gap-3">
          {gallery.rows.map((g, i) => (
            <RowCard key={g.id} index={i} count={gallery.rows.length} onMove={(d) => gallery.move(i, d)} onRemove={() => gallery.remove(i)}>
              <ImageUploadField label="Photo" value={g.src} onChange={(v) => gallery.update(i, { src: v })} slug={slug} compact />
              <div className="grid grid-cols-2 gap-3 max-[600px]:grid-cols-1">
                <RowInput label="Alt text" value={g.alt} onChange={(v) => gallery.update(i, { alt: v })} />
                <RowInput label="Caption" value={g.caption} onChange={(v) => gallery.update(i, { caption: v })} />
              </div>
            </RowCard>
          ))}
        </div>
        <AddButton onClick={() => gallery.add({ id: rid(), src: "", alt: "", caption: "" })}>Add photo</AddButton>
      </Fieldset>

      {/* ---- Track ---- */}
      <Fieldset legend="On the track" hint="Figures in the track band (e.g. 0–100 km/h · 2.4s).">
        <div className="grid gap-3">
          {track.rows.map((t, i) => (
            <RowCard key={t.id} index={i} count={track.rows.length} onMove={(d) => track.move(i, d)} onRemove={() => track.remove(i)}>
              <div className="grid grid-cols-2 gap-3 max-[600px]:grid-cols-1">
                <RowInput label="Label" value={t.label} onChange={(v) => track.update(i, { label: v })} placeholder="0–100 km/h" />
                <RowInput label="Value" value={t.value} onChange={(v) => track.update(i, { value: v })} placeholder="2.4s" />
              </div>
              <RowInput label="Note (optional)" value={t.note} onChange={(v) => track.update(i, { note: v })} />
            </RowCard>
          ))}
        </div>
        <AddButton onClick={() => track.add({ id: rid(), label: "", value: "", note: "" })}>Add figure</AddButton>
      </Fieldset>

      {/* ---- Advanced ---- */}
      <details className="border border-line px-5 py-4">
        <summary className="font-mono text-[0.66rem] tracking-[0.24em] uppercase text-ash cursor-pointer select-none">
          Advanced — technical settings
        </summary>
        <div className="grid gap-5 mt-5">
          <p className="font-mono text-[0.66rem] text-ash leading-relaxed">
            These control identity and the 3D scene. Changing them can break the 3D car — leave as-is unless you know what you&apos;re doing.
          </p>
          <Text
            label="Slug (URL id)"
            name="slug"
            defaultValue={car?.slug}
            readOnly={mode === "edit"}
            placeholder="la-voiture-noire"
            hint={mode === "edit" ? "The slug can't be changed after creation." : "Lowercase letters, numbers and dashes only."}
          />
          <Text label="3D model URL" name="modelUrl" defaultValue={car?.model.url} placeholder="/models/royale.glb" />
        </div>
      </details>

      {state.error && (
        <p className="font-mono text-[0.78rem] text-veloce leading-relaxed border border-veloce/40 bg-veloce/10 px-4 py-3">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-4 flex-wrap sticky bottom-0 bg-night/90 backdrop-blur py-4 -mx-1 px-1">
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
