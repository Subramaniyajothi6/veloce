"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { uploadCarPhoto } from "@/lib/cloudinary-upload";
import { inputCls, labelCls } from "./formUi";

/**
 * Controlled image field with a live preview and an "Upload photo" button that
 * pushes the file straight to Cloudinary and fills in the path. The parent owns
 * the value; pass `name` to also emit a hidden input so a top-level field (the
 * hero image) lands in FormData directly.
 */
export default function ImageUploadField({
  label,
  value,
  onChange,
  slug,
  name,
  compact,
}: {
  label?: string;
  value: string;
  onChange: (path: string) => void;
  slug: string;
  name?: string;
  compact?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | undefined>();
  const fileRef = useRef<HTMLInputElement>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setErr(undefined);
    try {
      const { path } = await uploadCarPhoto(file, slug);
      onChange(path);
    } catch (e2) {
      setErr((e2 as Error).message);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const h = compact ? 74 : 116;
  const w = Math.round(h * 1.6);

  return (
    <div className="grid gap-2">
      {label && <span className={labelCls}>{label}</span>}
      <div className="flex items-start gap-3 flex-wrap">
        <div
          className="relative bg-panel border border-line overflow-hidden shrink-0 grid place-items-center"
          style={{ width: w, height: h }}
        >
          {value ? (
            <Image
              src={value}
              alt=""
              width={w}
              height={h}
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="font-mono text-[0.55rem] tracking-[0.2em] uppercase text-ash/60">
              no image
            </span>
          )}
          {busy && (
            <span className="absolute inset-0 grid place-items-center bg-night/70 font-mono text-[0.55rem] tracking-[0.2em] uppercase text-cream">
              Uploading…
            </span>
          )}
        </div>
        <div className="grid gap-2 flex-1 min-w-[12rem]">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/cars/name.jpg"
            className={inputCls}
          />
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={busy}
              className="btn btn-ghost text-[0.66rem] disabled:opacity-60"
            >
              <span>{busy ? "Uploading…" : value ? "Replace photo" : "Upload photo"}</span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onPick}
              className="hidden"
            />
          </div>
          {err && (
            <p className="font-mono text-[0.68rem] text-veloce leading-relaxed">{err}</p>
          )}
        </div>
      </div>
      {name && <input type="hidden" name={name} value={value} />}
    </div>
  );
}
