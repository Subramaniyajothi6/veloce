import type { CSSProperties } from "react";
import { services } from "@/data/services";

export default function Services() {
  return (
    <section id="services" className="sec">
      <div className="wrap">
        <div className="sec-top reveal">
          <div>
            <span className="eyebrow">
              <b>05</b> Ownership
            </span>
            <h2 className="h2">
              Beyond the <span className="text-outline">handshake</span>
            </h2>
          </div>
          <p>
            Buying the car is the shortest part of the story. Everything after
            the keys is ours to take care of.
          </p>
        </div>

        <div className="border-t border-line">
          {services.map((s, i) => (
            <div
              key={s.num}
              className="reveal group relative grid grid-cols-[90px_1.1fr_1.6fr_60px] gap-8 items-center px-4 py-[2.3rem] border-b border-line transition-[background-color,padding] duration-[0.4s] ease-out-expo hover:bg-white/[0.025] hover:pl-[1.8rem] max-[820px]:grid-cols-[50px_1fr_46px] max-[820px]:[grid-template-areas:'num_title_arr'_'num_copy_arr']"
              style={i ? ({ "--d": `${i * 0.06}s` } as CSSProperties) : undefined}
            >
              <span className="font-mono text-[0.85rem] text-ash tracking-[0.2em] transition-colors duration-300 group-hover:text-veloce max-[820px]:[grid-area:num] max-[820px]:self-start max-[820px]:pt-[0.3rem]">
                {s.num}
              </span>
              <h3 className="text-[clamp(1.4rem,2.6vw,2.1rem)] tracking-[0.03em] max-[820px]:[grid-area:title]">
                {s.title}
              </h3>
              <p className="text-ash text-[0.95rem] max-w-[46ch] max-[820px]:[grid-area:copy] max-[820px]:mt-[0.4rem]">
                {s.copy}
              </p>
              <span
                className="w-[46px] h-[46px] border border-line rounded-full grid place-items-center justify-self-end [transition:background-color_0.35s,border-color_0.35s,rotate_0.5s_var(--ease-out-expo)] group-hover:bg-veloce group-hover:border-veloce group-hover:rotate-45 max-[820px]:[grid-area:arr]"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-[17px] h-[17px] stroke-ash [stroke-width:1.8] fill-none [stroke-linecap:round] [stroke-linejoin:round] transition-[stroke] duration-300 group-hover:stroke-white"
                >
                  <path d="M7 17L17 7M8 7h9v9" />
                </svg>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
