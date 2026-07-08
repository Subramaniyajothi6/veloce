"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { onFrame } from "@/lib/raf";
import { services } from "@/data/services";

/** One representative photo per service (Cloudinary-served via next/image). */
const IMAGES: Record<string, string> = {
  financing: "/cars/royale-detail.jpg",
  sourcing: "/cars/royale-location.jpg",
  "trade-in": "/cars/gemera-seats.jpg",
  aftercare: "/cars/royale-mood.jpg",
};

/**
 * Break a service title into the brand's two-line heading (line 2 in red).
 * Splits on the ampersand when there is one ("Financing & Leasing" →
 * "Financing" / "& Leasing"), otherwise on the last word ("Global Sourcing" →
 * "Global" / "Sourcing").
 */
function titleLines(title: string): [string, string] {
  const amp = title.indexOf(" & ");
  if (amp >= 0) return [title.slice(0, amp), title.slice(amp + 1)];
  const sp = title.lastIndexOf(" ");
  return sp >= 0 ? [title.slice(0, sp), title.slice(sp + 1)] : [title, ""];
}

/**
 * Ownership services as a sticky-stacked deck: each card pins to the viewport
 * while it's read, the next rises to cover it, and the covered card scales back
 * and dims. Effect runs only ≥861px without reduced-motion (matches the
 * `stacked` variant); below that the cards fall back to a plain flow.
 */
export default function ServiceDeck() {
  const deckRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const deck = deckRef.current;
    if (!deck) return;

    const wide = window.matchMedia("(min-width: 861px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cards = Array.from(
      deck.querySelectorAll<HTMLElement>("[data-card]")
    );

    const clear = () =>
      cards.forEach((c) => {
        c.style.transform = "";
        c.style.filter = "";
      });

    const frame = () => {
      if (!wide.matches || reduced.matches) return;
      const stickTop = window.innerHeight * 0.12;
      for (let i = 0; i < cards.length - 1; i++) {
        const next = cards[i + 1].getBoundingClientRect();
        const h = cards[i].getBoundingClientRect().height || 1;
        // 0 = untouched, 1 = fully covered by the next card
        const covered = Math.min(Math.max((stickTop + h - next.top) / h, 0), 1);
        cards[i].style.transform = `scale(${(1 - covered * 0.06).toFixed(
          4
        )}) translateY(${(-covered * 14).toFixed(1)}px)`;
        cards[i].style.filter = `brightness(${(1 - covered * 0.45).toFixed(3)})`;
      }
    };

    const onChange = () => {
      if (!wide.matches || reduced.matches) clear();
    };
    wide.addEventListener("change", onChange);
    reduced.addEventListener("change", onChange);

    const unsub = onFrame(frame);
    return () => {
      unsub();
      wide.removeEventListener("change", onChange);
      reduced.removeEventListener("change", onChange);
      clear();
    };
  }, []);

  return (
    <div ref={deckRef} className="mt-[clamp(2rem,5vw,3.5rem)]">
      {services.map((s) => (
        <Link
          key={s.slug}
          href={`/services/${s.slug}`}
          data-card
          data-cursor="VIEW"
          className="group sticky top-[12vh] h-[74vh] mb-[26vh] last:mb-0 grid grid-cols-[1.05fr_0.95fr] overflow-hidden bg-panel border border-line [transform-origin:center_top] [will-change:transform,filter] stacked:static stacked:h-auto stacked:mb-8 stacked:grid-cols-1"
        >
          <div className="flex flex-col justify-between p-[clamp(1.6rem,4vw,3.5rem)] order-1 stacked:order-2">
            <span className="font-display text-[clamp(3rem,6vw,5rem)] leading-none text-outline">
              {s.num.replace("/ ", "")}
            </span>
            <div>
              <h3 className="font-display uppercase text-[clamp(1.8rem,3.6vw,3.2rem)] leading-[1.02] tracking-[0.02em]">
                {(() => {
                  const [a, b] = titleLines(s.title);
                  return (
                    <>
                      {a}
                      <br />
                      <span className="text-veloce">{b}</span>
                    </>
                  );
                })()}
              </h3>
              <p className="text-ash leading-[1.7] text-[0.92rem] max-w-[38ch] mt-4">
                {s.copy}
              </p>
              <span className="inline-flex items-center gap-2 font-mono text-[0.66rem] tracking-[0.25em] uppercase text-cream mt-6">
                Explore{" "}
                <b className="text-veloce not-italic transition-transform duration-[0.35s] ease-out-expo group-hover:translate-x-1.5">
                  →
                </b>
              </span>
            </div>
          </div>

          <div className="relative bg-[#0d0d10] order-2 stacked:order-1 stacked:min-h-[30vh]">
            <Image
              src={IMAGES[s.slug]}
              alt=""
              fill
              sizes="(max-width: 860px) 100vw, 45vw"
              className="object-cover [filter:saturate(0.8)_brightness(0.85)]"
            />
            <div className="absolute inset-0 [background:linear-gradient(90deg,var(--color-panel)_0%,transparent_32%),linear-gradient(180deg,transparent_58%,rgba(10,10,11,0.6))]" />
          </div>
        </Link>
      ))}
      {/* real spacer element — extends the deck's content box so the last card
          can rise fully over the previous one and hold there. Sticky
          containment ignores padding/margin, so this must be actual content. */}
      <div aria-hidden="true" className="h-[90vh] stacked:hidden" />
    </div>
  );
}
