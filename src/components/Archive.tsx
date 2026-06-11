import Image from "next/image";
import { archiveSales } from "@/data/archive";

export default function Archive() {
  return (
    <section id="archive" className="sec">
      <div className="wrap">
        <div className="sec-top reveal">
          <div>
            <span className="eyebrow">
              <b>07</b> The Archive
            </span>
            <h2 className="h2">
              Recently <span className="text-outline">placed</span>
            </h2>
          </div>
          <p>
            Five keys we handed over this season — where they came from, where
            they sleep now. Run your cursor down the list to meet each car.
          </p>
        </div>

        <ul id="arcList" className="reveal list-none border-t border-line">
          {archiveSales.map((s) => (
            <li
              key={s.name}
              className="arc-row group relative grid grid-cols-[130px_1.5fr_1fr_auto] gap-8 items-center px-4 py-[1.9rem] border-b border-line before:content-[''] before:absolute before:inset-0 before:bg-veloce before:scale-y-0 before:origin-bottom hover:before:scale-y-100 hover:before:origin-top before:transition-transform before:duration-[0.45s] before:ease-out-expo max-[760px]:grid-cols-[1fr_auto] max-[760px]:gap-x-4 max-[760px]:gap-y-[0.45rem] max-[760px]:px-[0.6rem] max-[760px]:py-6 max-[760px]:[grid-template-areas:'date_date'_'name_tag'_'route_route']"
            >
              <span className="relative font-mono text-[0.78rem] tracking-[0.22em] text-ash transition-colors duration-300 group-hover:text-white/85 max-[760px]:[grid-area:date]">
                {s.date}
              </span>
              <h3 className="relative text-[clamp(1.6rem,3.4vw,2.6rem)] tracking-[0.03em] transition-transform duration-[0.45s] ease-out-expo group-hover:translate-x-3.5 max-[760px]:[grid-area:name] max-[760px]:group-hover:translate-x-0">
                {s.name}
              </h3>
              <span className="relative font-mono text-[0.8rem] tracking-[0.14em] uppercase text-ash transition-colors duration-300 group-hover:text-white/85 max-[760px]:[grid-area:route]">
                {s.route}
              </span>
              <span className="relative justify-self-end font-mono text-[0.68rem] tracking-[0.2em] uppercase border border-line rounded-full px-[0.95rem] py-[0.45rem] text-ash transition-[border-color,color] duration-300 group-hover:border-white/55 group-hover:text-white whitespace-nowrap max-[760px]:[grid-area:tag] max-[760px]:self-center">
                {s.tag}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div id="arcPreview" className="arc-preview" aria-hidden="true">
        {archiveSales.map((s) => (
          <Image
            key={s.name}
            src={s.image}
            alt=""
            width={900}
            height={675}
            sizes="340px"
          />
        ))}
      </div>
    </section>
  );
}
