import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import FinanceCalculator from "@/components/FinanceCalculator";
import ServiceEnquiryForm from "@/components/ServiceEnquiryForm";
import { enquiryFields } from "@/data/enquiryFields";
import { getService, services } from "@/data/services";
import { getCars } from "@/lib/inventory";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: `${service.title} — VELOCE Motors`,
    description: service.copy,
  };
}

/** Parse a display price like "€11,000,000" into a number (NaN when unpriced). */
function parsePrice(price: string): number {
  return Number(price.replace(/[^\d]/g, ""));
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const index = services.findIndex((s) => s.slug === service.slug);
  const next = services[(index + 1) % services.length];
  const fields = enquiryFields[service.slug] ?? [];

  const isFinancing = service.slug === "financing";
  const needsCars = isFinancing || fields.some((f) => f.type === "car");
  const cars = needsCars ? await getCars() : [];
  const calculatorCars = cars
    .map((c) => ({ slug: c.slug, name: c.name, price: parsePrice(c.price) }))
    .filter((c) => Number.isFinite(c.price) && c.price > 0);

  return (
    <>
      {/* hero */}
      <section className="sec pt-[clamp(8rem,16vh,11rem)] pb-[clamp(3.5rem,7vw,5.5rem)]">
        <div className="wrap">
          <div className="reveal">
            <span className="eyebrow">
              <b>{service.num}</b> Ownership
            </span>
            <h1 className="h2 max-w-[16ch]">
              {service.headline[0]}{" "}
              <span className="text-outline">{service.headline[1]}</span>
            </h1>
            <p className="text-ash mt-6 max-w-[38rem] text-[1.02rem]">
              {service.lede}
            </p>
          </div>
        </div>
      </section>

      {/* headline figures */}
      <section className="bg-coal border-y border-line">
        <div className="wrap py-[clamp(3.5rem,8vh,5.5rem)]">
          <div className="grid grid-cols-3 gap-[clamp(1.5rem,4vw,3rem)] max-[760px]:grid-cols-1">
            {service.stats.map((stat, i) => (
              <div
                key={stat.label}
                className="reveal border-t-2 border-veloce pt-6"
                style={{ "--d": `${i * 0.08}s` } as CSSProperties}
              >
                <div className="font-mono text-[0.66rem] tracking-[0.28em] uppercase text-ash">
                  {stat.label}
                </div>
                <div className="font-mono font-semibold tabular-nums leading-none text-[clamp(2.6rem,5vw,4rem)] mt-4">
                  {stat.value}
                </div>
                <p className="text-ash text-[0.9rem] mt-4">{stat.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* how it works */}
      <section className="sec">
        <div className="wrap">
          <div className="sec-top reveal">
            <div>
              <span className="eyebrow">
                <b>Process</b> How it works
              </span>
              <h2 className="h2">
                Four steps, <span className="text-outline">no drama</span>
              </h2>
            </div>
            <p>
              The same rhythm every time — you make the decisions, we do the
              paperwork, the phone calls and the waiting around.
            </p>
          </div>
          <div className="border-t border-line">
            {service.steps.map((step, i) => (
              <div
                key={step.title}
                className="reveal grid grid-cols-[90px_1.1fr_1.6fr] gap-8 items-baseline px-4 py-[2rem] border-b border-line max-[820px]:grid-cols-1 max-[820px]:gap-2"
                style={i ? ({ "--d": `${i * 0.06}s` } as CSSProperties) : undefined}
              >
                <span className="font-mono text-[0.85rem] text-veloce tracking-[0.2em]">
                  {`0${i + 1}`}
                </span>
                <h3 className="text-[clamp(1.3rem,2.2vw,1.8rem)] tracking-[0.03em]">
                  {step.title}
                </h3>
                <p className="text-ash text-[0.95rem] max-w-[46ch]">
                  {step.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* what's included */}
      <section className="sec pt-0">
        <div className="wrap">
          <div className="sec-top reveal">
            <div>
              <span className="eyebrow">
                <b>Scope</b> What&apos;s included
              </span>
              <h2 className="h2">
                Part of <span className="text-outline">the service</span>
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-x-[clamp(1.5rem,4vw,3rem)] gap-y-[clamp(2rem,4vw,3rem)] max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
            {service.inclusions.map((item, i) => (
              <div
                key={item.title}
                className="reveal border-t border-line pt-5"
                style={{ "--d": `${(i % 3) * 0.07}s` } as CSSProperties}
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-[0.62rem] tracking-[0.3em] text-veloce tabular-nums">
                    {`0${i + 1}`}
                  </span>
                  <h3 className="font-mono font-semibold text-[0.8rem] tracking-[0.22em] uppercase text-cream normal-nums">
                    {item.title}
                  </h3>
                </div>
                <p className="text-ash text-[0.92rem] mt-3">{item.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* payment calculator — financing only */}
      {isFinancing && calculatorCars.length > 0 && (
        <section className="sec pt-0">
          <div className="wrap">
            <div className="sec-top reveal">
              <div>
                <span className="eyebrow">
                  <b>Illustration</b> The mathematics
                </span>
                <h2 className="h2">
                  Run the <span className="text-outline">numbers</span>
                </h2>
              </div>
              <p>
                Pick a car, slide the deposit and the term, and watch the
                monthly settle. Real offers come from the enquiry below.
              </p>
            </div>
            <div className="reveal">
              <FinanceCalculator cars={calculatorCars} />
            </div>
          </div>
        </section>
      )}

      {/* enquiry */}
      <section id="enquire" className="bg-coal border-t border-line scroll-mt-24">
        <div className="wrap py-[clamp(4rem,9vh,6.5rem)]">
          <div className="sec-top reveal">
            <div>
              <span className="eyebrow">
                <b>Concierge</b> {service.title}
              </span>
              <h2 className="h2">
                Put it in <span className="text-outline">writing</span>
              </h2>
            </div>
            <p>
              Thirty seconds of form, one working day of response — a person,
              not an autoresponder.
            </p>
          </div>
          <div className="reveal max-w-[880px]">
            <ServiceEnquiryForm
              service={service.slug}
              submitLabel={service.enquiry.submitLabel}
              successTitle={service.enquiry.successTitle}
              successCopy={service.enquiry.successCopy}
              fields={fields}
              cars={cars.map(({ slug: s, name, category }) => ({
                slug: s,
                name,
                category,
              }))}
            />
            <p className="font-mono text-[0.72rem] tracking-[0.14em] uppercase text-[rgba(242,241,236,0.4)] mt-10 max-w-[60ch]">
              {service.note}
            </p>
            <p className="font-mono text-[0.72rem] tracking-[0.14em] uppercase text-ash mt-3">
              Rather talk?{" "}
              <a
                className="text-cream transition-colors duration-300 hover:text-veloce"
                href="mailto:hello@veloce.motors"
              >
                hello@veloce.motors
              </a>{" "}
              ·{" "}
              <a
                className="text-cream transition-colors duration-300 hover:text-veloce"
                href="tel:+498921200"
              >
                +49 89 2120 0
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* next service strip */}
      <Link
        href={`/services/${next.slug}`}
        className="group block border-t border-line"
        data-cursor="NEXT"
      >
        <div className="wrap py-[clamp(3rem,7vw,5rem)] flex items-end justify-between gap-8">
          <div>
            <span className="eyebrow">Next service</span>
            <span className="block font-display uppercase leading-none text-[clamp(2.2rem,6vw,4.5rem)] mt-4 transition-colors duration-300 group-hover:text-veloce">
              {next.title}
            </span>
          </div>
          <span className="font-display text-5xl leading-none transition-transform duration-[0.4s] ease-out-expo group-hover:translate-x-2.5">
            →
          </span>
        </div>
      </Link>
    </>
  );
}
