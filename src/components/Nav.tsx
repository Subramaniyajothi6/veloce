"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { href: "/models", label: "Models" },
  { href: "/#showroom", label: "Showroom" },
  { href: "/#flagships", label: "Flagships" },
  { href: "/#services", label: "Services" },
  { href: "/#archive", label: "Archive" },
  { href: "/#visit", label: "Visit" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-[1000] border-b transition-[background-color,border-color] duration-[0.4s] ${
          scrolled
            ? "bg-[rgba(10,10,11,0.72)] backdrop-blur-[18px] backdrop-saturate-[1.4] border-line"
            : "border-transparent"
        }`}
      >
        <div
          className={`wrap flex items-center justify-between gap-8 transition-[padding] duration-[0.4s] ease-out-expo ${
            scrolled ? "py-[0.7rem]" : "py-[1.15rem]"
          }`}
        >
          <Link
            className="flex items-center gap-2 font-display text-[1.25rem] tracking-[0.12em] leading-none uppercase"
            href="/#top"
            aria-label="VELOCE Motors — home"
          >
            VELOCE<i className="w-[9px] h-[9px] bg-veloce flex-none not-italic" />
          </Link>
          <nav className="flex gap-8 max-[860px]:hidden" aria-label="Primary">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="relative py-[0.3rem] font-mono text-[0.74rem] font-medium tracking-[0.18em] uppercase text-ash transition-colors duration-300 hover:text-white after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:bg-veloce after:scale-x-0 after:origin-right hover:after:scale-x-100 hover:after:origin-left after:transition-transform after:duration-[0.4s] after:ease-out-expo"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <Link
            className="btn btn-red btn-sm magnetic max-[860px]:hidden"
            href="/#visit"
          >
            <span>Book a test drive</span>
          </Link>
          <button
            className="group hidden max-[860px]:flex flex-col items-center justify-center w-11 h-11 z-[1100]"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="menu"
          >
            <span className="block w-6 h-0.5 my-[3.5px] bg-white transition-[translate,rotate,opacity] duration-[0.4s] ease-out-expo group-aria-expanded:translate-y-[9px] group-aria-expanded:rotate-45" />
            <span className="block w-6 h-0.5 my-[3.5px] bg-white transition-opacity duration-300 group-aria-expanded:opacity-0" />
            <span className="block w-6 h-0.5 my-[3.5px] bg-white transition-[translate,rotate,opacity] duration-[0.4s] ease-out-expo group-aria-expanded:-translate-y-[9px] group-aria-expanded:-rotate-45" />
          </button>
        </div>
      </header>

      <div
        id="menu"
        className={`fixed inset-0 z-[1050] bg-[rgba(7,7,8,0.92)] backdrop-blur-[24px] flex flex-col justify-center gap-[0.4rem] px-[clamp(1.5rem,8vw,5rem)] transition-[opacity,visibility] duration-[0.45s] ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {links.map((l, i) => (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className={`flex items-baseline gap-[1.2rem] font-display text-[clamp(2.4rem,9vw,4.5rem)] uppercase tracking-[0.02em] text-cream leading-[1.15] hover:text-veloce transition-[opacity,translate,color] duration-500 ease-out-expo ${
              open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[30px]"
            }`}
            style={{ transitionDelay: open ? `${0.08 + i * 0.06}s` : "0s" }}
          >
            <small className="font-mono text-[0.8rem] text-veloce tracking-[0.2em]">
              {`0${i + 1}`}
            </small>{" "}
            {l.label}
          </Link>
        ))}
        <div className="mt-10 font-mono text-[0.78rem] tracking-[0.18em] uppercase text-ash">
          Munich · Dubai · Oslo — since 1987
        </div>
      </div>
    </>
  );
}
