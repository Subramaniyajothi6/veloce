import { Fragment } from "react";

const items = ["Veloce Motors", "Performance", "Heritage", "Precision", "Exotics"];

function Group() {
  return (
    <div className="flex items-center gap-[2.8rem] pr-[2.8rem]">
      {items.map((t, i) => (
        <Fragment key={t}>
          <span
            className={`font-display text-[clamp(2rem,4.5vw,3.4rem)] tracking-[0.04em] whitespace-nowrap uppercase ${
              i % 2 ? "text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.4)]" : ""
            }`}
          >
            {t}
          </span>
          <span className="text-veloce text-[1.3rem]">✦</span>
        </Fragment>
      ))}
    </div>
  );
}

export default function Marquee() {
  return (
    <div
      className="marquee group overflow-hidden py-[1.4rem] border-y border-line bg-night [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]"
      aria-hidden="true"
    >
      <div className="flex w-max animate-mq group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        <Group />
        <Group />
      </div>
    </div>
  );
}
