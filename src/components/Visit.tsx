import Image from "next/image";
import Link from "next/link";
import { locations } from "@/data/locations";

export default function Visit() {
  return (
    <section id="visit" className="relative overflow-hidden text-center">
      <div className="absolute inset-x-0 -inset-y-[8%] z-0" aria-hidden="true">
        <Image
          src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2000&auto=format&fit=crop"
          alt=""
          width={2000}
          height={1333}
          sizes="100vw"
          data-plx="-0.05"
          className="w-full h-full object-cover will-change-transform [filter:saturate(0.85)_brightness(0.6)]"
        />
      </div>
      <div
        className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,var(--color-night)_2%,rgba(10,10,11,0.55)_30%,rgba(10,10,11,0.55)_70%,var(--color-night)_98%)]"
        aria-hidden="true"
      />
      <div className="wrap relative z-[2] py-[clamp(7rem,16vh,11rem)]">
        <div className="reveal">
          <span className="eyebrow justify-center">
            <b>08</b> Visit
          </span>
          <h2 className="h2 text-[clamp(3.4rem,11vw,9.5rem)] leading-[0.95]">
            <span className="block">Feel it</span>
            <span className="block text-transparent [-webkit-text-stroke:2px_var(--color-cream)]">
              for yourself
            </span>
          </h2>
          <p className="text-[#c9c8c0] max-w-[32rem] mx-auto mt-[1.8rem] text-[1.02rem]">
            Fifteen minutes behind the wheel beats fifteen hundred words. Pick a
            showroom, pick a key — we&apos;ll handle the rest.
          </p>
          <div className="flex gap-[1.1rem] justify-center flex-wrap mt-[2.8rem]">
            <Link className="btn btn-red magnetic" href="/test-drive">
              <span>Book a test drive</span> <b className="arr">→</b>
            </Link>
            <a className="btn btn-ghost magnetic" href="tel:+498921200">
              <span>+49 89 2120 0</span>
            </a>
          </div>
          <div className="flex justify-center gap-[clamp(2rem,6vw,5rem)] flex-wrap mt-[clamp(3.5rem,8vh,5.5rem)] pt-[2.2rem] border-t border-white/[0.14]">
            {locations.map((l) => (
              <div
                key={l.city}
                className="font-mono text-[0.74rem] tracking-[0.22em] uppercase text-ash leading-[2]"
              >
                <b className="text-cream font-semibold block tracking-[0.3em]">
                  {l.city}
                </b>
                {l.address}
                <br />
                {l.hours}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
