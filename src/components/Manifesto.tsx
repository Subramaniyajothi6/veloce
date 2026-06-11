import { Fragment } from "react";

const words: Array<{ w: string; hot?: boolean }> = [
  { w: "Every" }, { w: "car" }, { w: "on" }, { w: "our" }, { w: "floor" },
  { w: "was" }, { w: "hunted,", hot: true }, { w: "not" }, { w: "bought." },
  { w: "We" }, { w: "comb" }, { w: "auctions," }, { w: "private" },
  { w: "collections" }, { w: "and" }, { w: "factory" }, { w: "allocations" },
  { w: "for" }, { w: "machines" }, { w: "with" }, { w: "a" },
  { w: "heartbeat", hot: true }, { w: "—" }, { w: "then" }, { w: "inspect," },
  { w: "certify" }, { w: "and" }, { w: "deliver" }, { w: "them" }, { w: "to" },
  { w: "your" }, { w: "door," }, { w: "anywhere", hot: true },
  { w: "on", hot: true }, { w: "earth.", hot: true },
];

export default function Manifesto() {
  return (
    <section className="py-[clamp(7rem,14vw,12rem)]">
      <div className="wrap">
        <span className="eyebrow reveal">
          <b>01</b> The House
        </span>
        <p
          id="manifesto"
          aria-label={words.map((x) => x.w).join(" ")}
          className="max-w-[56rem] mt-[2.2rem] text-[clamp(1.5rem,3.4vw,2.6rem)] font-semibold leading-[1.4] tracking-[-0.01em]"
        >
          {words.map((x, i) => (
            <Fragment key={i}>
              <span className={`mw${x.hot ? " hot" : ""}`}>{x.w}</span>{" "}
            </Fragment>
          ))}
        </p>
      </div>
    </section>
  );
}
