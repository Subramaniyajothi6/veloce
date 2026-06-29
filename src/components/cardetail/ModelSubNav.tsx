"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export interface SubNavSection {
  id: string;
  label: string;
}

/** Sticky section nav under the 3D hero, with scroll-spy active highlighting.
 *  Links are plain #hash anchors so the site's smooth-scroll hook handles them. */
export default function ModelSubNav({ sections }: { sections: SubNavSection[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-25% 0px -65% 0px", threshold: 0 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [sections]);

  return (
    <nav
      className="sticky top-[2.7rem] z-[40] bg-night/85 backdrop-blur-[10px] border-y border-line"
      aria-label="On this page"
    >
      <div className="wrap flex gap-[clamp(1.25rem,3vw,2.5rem)] overflow-x-auto py-[0.9rem] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sections.map((s) => (
          <Link
            key={s.id}
            href={`#${s.id}`}
            className={`font-mono text-[0.68rem] tracking-[0.2em] uppercase whitespace-nowrap transition-colors duration-300 ${
              active === s.id ? "text-veloce" : "text-ash hover:text-cream"
            }`}
          >
            {s.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
