import Link from "next/link";

const columns = [
  {
    title: "Models",
    links: [
      { label: "Bugatti La Voiture Noire", href: "/models/royale" },
      { label: "Ferrari SF90 XX", href: "/models/furia" },
      { label: "Porsche 911 GT3", href: "/models/vento-rs" },
      { label: "Lamborghini Centenario", href: "/models/giallo-gt" },
      { label: "Tesla Roadster", href: "/models/volt-zero" },
      { label: "The full range", href: "/models" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Financing", href: "/#services" },
      { label: "Pre-owned", href: "/#preowned" },
      { label: "Sourcing", href: "/#services" },
      { label: "Showrooms", href: "/#visit" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative z-[2] border-t border-line overflow-hidden bg-coal">
      <div className="wrap">
        <div className="grid grid-cols-[2fr_1fr_1fr_1.1fr] gap-10 pt-[4.5rem] pb-8 max-[820px]:grid-cols-2 max-[440px]:grid-cols-1">
          <div className="max-[820px]:col-span-full">
            <a
              className="flex items-center gap-2 font-display text-[1.25rem] tracking-[0.12em] leading-none uppercase"
              href="#top"
              aria-label="VELOCE Motors — back to top"
            >
              VELOCE
              <i className="w-[9px] h-[9px] bg-veloce flex-none not-italic" />
            </a>
            <p className="text-ash text-[0.92rem] max-w-[30ch] mt-[1.2rem]">
              Performance automobiles, curated. Sourcing, certifying and
              delivering the world&apos;s most wanted machines since 1987.
            </p>
          </div>
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h4 className="font-mono text-[0.68rem] font-semibold tracking-[0.3em] uppercase text-[rgba(242,241,236,0.45)] mb-[1.3rem]">
                {col.title}
              </h4>
              <ul className="list-none flex flex-col gap-[0.65rem]">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      className="text-ash text-[0.93rem] transition-colors duration-300 hover:text-veloce"
                      href={l.href}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div>
            <h4 className="font-mono text-[0.68rem] font-semibold tracking-[0.3em] uppercase text-[rgba(242,241,236,0.45)] mb-[1.3rem]">
              Contact
            </h4>
            <ul className="list-none flex flex-col gap-[0.65rem] text-ash text-[0.93rem]">
              <li>
                <a
                  className="transition-colors duration-300 hover:text-veloce"
                  href="mailto:hello@veloce.motors"
                >
                  hello@veloce.motors
                </a>
              </li>
              <li>
                <a
                  className="transition-colors duration-300 hover:text-veloce"
                  href="tel:+498921200"
                >
                  +49 89 2120 0
                </a>
              </li>
              <li>Leopoldstraße 90, Munich</li>
              <li>Mon–Sat · 9:00–19:00</li>
            </ul>
          </div>
        </div>

        <div
          className="font-display text-[clamp(5rem,19vw,17rem)] leading-[0.82] text-center uppercase text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.08)] select-none pointer-events-none -mb-[0.14em]"
          aria-hidden="true"
        >
          Veloce
        </div>

        <div className="flex flex-wrap gap-4 items-center justify-between border-t border-white/[0.06] py-6 font-mono text-[0.72rem] tracking-[0.14em] text-[rgba(242,241,236,0.4)]">
          <span>
            © {new Date().getFullYear()} VELOCE MOTORS GMBH — ALL RIGHTS
            RESERVED
          </span>
          <span>
            PHOTOGRAPHY VIA{" "}
            <a
              className="border-b border-white/20 transition-colors duration-300 hover:text-veloce hover:border-veloce"
              href="https://commons.wikimedia.org"
              rel="noopener"
            >
              WIKIMEDIA COMMONS
            </a>{" "}
            · BUILT TO REDLINE
          </span>
        </div>
      </div>
    </footer>
  );
}
