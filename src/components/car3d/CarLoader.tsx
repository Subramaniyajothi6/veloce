/** Branded loading screen for the 3D stage. Covers the two blank phases a
 *  cold visit hits: the Three.js/R3F bundle downloading, then the car's GLB
 *  downloading + decoding. Pure DOM — no R3F/drei imports — so it can front the
 *  dynamically-imported canvas without dragging three into the initial bundle. */
export default function CarLoader({
  label = "Veloce",
  progress,
  className = "",
}: {
  /** Shown large above the bar — the car name once we know it, else the brand. */
  label?: string;
  /** 0–100 for a determinate bar; omit for the indeterminate sweep. */
  progress?: number;
  /** Extra classes on the root (used to fade the overlay out on ready). */
  className?: string;
}) {
  const pct =
    typeof progress === "number"
      ? Math.max(0, Math.min(100, progress))
      : null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Loading ${label}`}
      className={`absolute inset-0 z-[6] grid place-items-center bg-night px-6 transition-opacity duration-500 ease-out ${className}`}
    >
      <div className="flex w-full max-w-[22rem] flex-col items-center gap-6">
        <span className="font-display uppercase leading-none tracking-[0.04em] text-cream text-[clamp(2.4rem,7vw,3.6rem)]">
          {label}
          <b className="text-veloce">.</b>
        </span>

        {/* progress rail — a determinate fill once the GLB reports bytes, an
            indeterminate sweep while the JS chunk is still on the wire */}
        <div className="relative h-0.5 w-full overflow-hidden bg-white/10">
          {pct === null ? (
            <i className="absolute inset-y-0 left-0 w-1/3 not-italic bg-veloce animate-loader" />
          ) : (
            <i
              className="absolute inset-y-0 left-0 w-full origin-left not-italic bg-veloce transition-transform duration-300 ease-out"
              style={{ transform: `scaleX(${pct / 100})` }}
            />
          )}
        </div>

        <span className="font-mono text-[0.62rem] tracking-[0.34em] uppercase text-ash tabular-nums">
          {pct === null ? "Loading" : `${Math.round(pct)}%`}
        </span>
      </div>
    </div>
  );
}
