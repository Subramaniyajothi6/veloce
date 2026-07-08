import ServiceDeck from "./ServiceDeck";

/** Ownership services. Renders as the home-page section by default;
 *  `standalone` turns it into the /services index page (h1 + nav clearance).
 *  The cards are a sticky-stacked deck (see ServiceDeck). */
export default function Services({ standalone = false }: { standalone?: boolean }) {
  const Heading = standalone ? "h1" : "h2";
  return (
    <section
      id="services"
      className={standalone ? "sec pt-[clamp(8rem,16vh,11rem)]" : "sec"}
    >
      <div className="wrap">
        <div className="sec-top reveal">
          <div>
            <span className="eyebrow">
              {standalone ? (
                <>
                  <b>Ownership</b> Services
                </>
              ) : (
                <>
                  <b>05</b> Ownership
                </>
              )}
            </span>
            <Heading className="h2">
              Beyond the <span className="text-outline">handshake</span>
            </Heading>
          </div>
          <p>
            Buying the car is the shortest part of the story. Everything after
            the keys is ours to take care of.
          </p>
        </div>

        <ServiceDeck />
      </div>
    </section>
  );
}
