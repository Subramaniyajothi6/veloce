"use client";

import { useEffect, useRef } from "react";

export interface GaugeRow {
  label: string;
  unit: string;
  value: number;
  /** 0–1 needle target — class leader in the range = 1. */
  fill: number;
  /** 0–1 position of the range-average tick. */
  avgFill: number;
  avg: number;
  decimals?: number;
}

// Dial geometry (a 240° tachometer sweep opening at the bottom).
const START = 150;
const SWEEP = 240;
const R = 92;
const CX = 130;
const CY = 120;
const REDLINE = 0.82; // fraction of the sweep where the red zone begins

const polar = (deg: number, r: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)];
};
const arcPath = (a0: number, a1: number, r: number) => {
  const [x0, y0] = polar(a0, r);
  const [x1, y1] = polar(a1, r);
  const large = (a1 - a0) % 360 > 180 ? 1 : 0;
  return `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
};
const clamp01 = (n: number) => Math.max(0, Math.min(1, n));
const fmt = (n: number, d = 0) =>
  n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });

// Static tick marks around the dial.
const TICKS = Array.from({ length: 25 }, (_, i) => {
  const a = START + (SWEEP * i) / 24;
  const major = i % 4 === 0;
  const [x0, y0] = polar(a, R - (major ? 13 : 7));
  const [x1, y1] = polar(a, R - 1);
  return { x0, y0, x1, y1, major, red: i / 24 > REDLINE };
});

// Needle: slight overshoot (an engine blip). Number: clean count, no overshoot.
const backOut = (t: number) => {
  const c = 1.35;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};
const cubicOut = (t: number) => 1 - Math.pow(1 - t, 3);

function Gauge({ row, index }: { row: GaugeRow; index: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const needleRef = useRef<SVGGElement>(null);
  const progRef = useRef<SVGPathElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  const fill = clamp01(row.fill);
  const avgAng = START + SWEEP * clamp01(row.avgFill);
  const [ax0, ay0] = polar(avgAng, R + 2);
  const [ax1, ay1] = polar(avgAng, R + 12);

  useEffect(() => {
    const wrap = wrapRef.current;
    const needle = needleRef.current;
    const prog = progRef.current;
    const num = numRef.current;
    if (!wrap || !needle || !prog || !num) return;

    const set = (needleP: number, numP: number) => {
      const ang = START + SWEEP * fill * needleP;
      needle.setAttribute("transform", `rotate(${ang.toFixed(2)} ${CX} ${CY})`);
      const frac = Math.max(0.001, Math.min(fill * needleP, 1));
      prog.setAttribute("d", arcPath(START, START + SWEEP * frac, R));
      const v = row.value * numP;
      num.textContent = row.decimals
        ? v.toFixed(row.decimals)
        : Math.round(v).toLocaleString("en-US");
    };

    set(0, 0);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      set(1, 1);
      return;
    }

    let raf = 0;
    let played = false;
    const D = 1900;
    const play = () => {
      const t0 = performance.now() + index * 160;
      const tick = (now: number) => {
        const t = Math.min(Math.max((now - t0) / D, 0), 1);
        set(backOut(t), cubicOut(t));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !played) {
            played = true;
            play();
            io.disconnect();
          }
        }
      },
      { threshold: 0.45 }
    );
    io.observe(wrap);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [fill, index, row.value, row.decimals]);

  return (
    <div
      ref={wrapRef}
      className="bg-night px-6 pt-9 pb-8 text-center flex flex-col items-center"
    >
      <svg
        viewBox="0 0 260 200"
        className="w-full max-w-[260px] h-auto block"
        aria-hidden="true"
      >
        <path
          d={arcPath(START, START + SWEEP, R)}
          fill="none"
          stroke="rgba(255,255,255,.10)"
          strokeWidth={3}
        />
        <path
          d={arcPath(START + SWEEP * REDLINE, START + SWEEP, R)}
          fill="none"
          stroke="rgba(225,6,0,.85)"
          strokeWidth={3}
        />
        {TICKS.map((t, i) => (
          <line
            key={i}
            x1={t.x0.toFixed(1)}
            y1={t.y0.toFixed(1)}
            x2={t.x1.toFixed(1)}
            y2={t.y1.toFixed(1)}
            stroke={
              t.red
                ? "rgba(225,6,0,.9)"
                : t.major
                  ? "rgba(242,241,236,.55)"
                  : "rgba(242,241,236,.22)"
            }
            strokeWidth={t.major ? 2.4 : 1.2}
          />
        ))}
        <path
          ref={progRef}
          d=""
          fill="none"
          stroke="rgba(242,241,236,.8)"
          strokeWidth={3}
        />
        {/* range-average marker, sitting just outside the arc */}
        <line
          x1={ax0.toFixed(1)}
          y1={ay0.toFixed(1)}
          x2={ax1.toFixed(1)}
          y2={ay1.toFixed(1)}
          stroke="rgba(242,241,236,.9)"
          strokeWidth={2}
        />
        <g ref={needleRef} transform={`rotate(${START} ${CX} ${CY})`}>
          <line
            x1={CX}
            y1={CY}
            x2={CX + R - 20}
            y2={CY}
            stroke="#e10600"
            strokeWidth={3}
            strokeLinecap="round"
          />
          <line
            x1={CX}
            y1={CY}
            x2={CX - 14}
            y2={CY}
            stroke="#e10600"
            strokeWidth={5}
            strokeLinecap="round"
          />
        </g>
        <circle cx={CX} cy={CY} r={7} fill="#0a0a0b" stroke="#e10600" strokeWidth={2.5} />
      </svg>

      <div className="font-mono font-semibold tabular-nums text-[clamp(1.8rem,3.4vw,2.8rem)] leading-none -mt-9">
        <span ref={numRef}>{fmt(row.value, row.decimals)}</span>
        <small className="text-[0.42em] text-veloce ml-1.5">{row.unit}</small>
      </div>
      <div className="mt-3 font-mono text-[0.66rem] tracking-[0.24em] uppercase text-ash">
        {row.label}
      </div>
      <div className="mt-2 flex items-center gap-2 font-mono text-[0.6rem] tracking-[0.14em] uppercase text-ash">
        <i className="w-[10px] h-px bg-cream/80 not-italic" aria-hidden="true" />
        avg {fmt(row.avg, row.decimals)}
      </div>
    </div>
  );
}

/** Animated tachometer dials for the "Where It Stands" range comparison. */
export default function SpecGauges({ rows }: { rows: GaugeRow[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-px bg-line border border-line">
      {rows.map((r, i) => (
        <Gauge key={r.label} row={r} index={i} />
      ))}
    </div>
  );
}
