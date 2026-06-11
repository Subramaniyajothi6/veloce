import { stats } from "@/data/stats";

export default function RecordSection() {
  return (
    <section id="record" className="sec pt-0">
      <div className="wrap">
        <div className="sec-top reveal">
          <div>
            <span className="eyebrow">
              <b>06</b> The Record
            </span>
            <h2 className="h2">
              Thirty-nine years,
              <br />
              zero shortcuts
            </h2>
          </div>
        </div>

        <div
          id="stats"
          className="reveal grid grid-cols-4 border border-line max-[860px]:grid-cols-2"
          data-counters
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`px-[1.6rem] py-[2.8rem] text-left border-l border-line first:border-l-0 max-[860px]:odd:border-l-0 max-[860px]:even:border-l ${
                i >= 2 ? "max-[860px]:border-t" : ""
              }`}
            >
              <div className="font-mono font-semibold text-[clamp(2.4rem,4.6vw,3.8rem)] leading-none tabular-nums">
                <span data-count={s.value}>0</span>
                {s.suffix && (
                  <b className="text-veloce font-semibold">{s.suffix}</b>
                )}
              </div>
              <div className="font-mono text-[0.66rem] tracking-[0.26em] uppercase text-ash mt-[0.9rem]">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <figure className="reveal max-w-[54rem] mx-auto mt-[clamp(5rem,10vw,8rem)] text-center relative px-4">
          <span
            className="font-display text-[7rem] leading-[0] text-veloce block mb-[2.2rem]"
            aria-hidden="true"
          >
            “
          </span>
          <p className="text-[clamp(1.4rem,3vw,2.1rem)] font-light leading-[1.5] italic text-[#dddcd4]">
            They don&apos;t sell you a car. They introduce you to it — and
            somehow it already knows your name.
          </p>
          <cite className="block mt-8 not-italic font-mono text-[0.74rem] tracking-[0.28em] uppercase text-ash">
            — <b className="text-cream font-medium">Friedrich Keller</b> ·
            Collector since 2009
          </cite>
        </figure>
      </div>
    </section>
  );
}
