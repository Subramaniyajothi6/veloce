import type { ServiceItem } from "@/types";

export const services: ServiceItem[] = [
  {
    slug: "financing",
    num: "/ 01",
    title: "Financing & Leasing",
    copy: "Bespoke plans from 1.9% APR, approved within 48 hours — structured around collections, not just credit scores.",
    headline: ["Never let money", "slow you down"],
    lede: "Rates from 1.9% APR, structured around what you own — the collection, the history, the car itself — not just a credit score. Application to approval in 48 hours, and the paperwork comes to you.",
    stats: [
      {
        value: "1.9%",
        label: "APR, from",
        note: "Fixed or variable, secured against the car or the collection.",
      },
      {
        value: "48 h",
        label: "To approval",
        note: "Most files clear in one business day. Complex structures take two.",
      },
      {
        value: "84 mo",
        label: "Longest term",
        note: "Balloon, lease or classic hire-purchase — the calendar is yours.",
      },
    ],
    steps: [
      {
        title: "The conversation",
        copy: "Twenty minutes with a finance partner — the car, the horizon, and how the payments should feel.",
      },
      {
        title: "The structure",
        copy: "Lease, balloon, hire-purchase or equity release against cars you already own. We model all four; you pick one.",
      },
      {
        title: "The signature",
        copy: "Approval inside 48 hours. Papers signed at the showroom, or couriered wherever you happen to be.",
      },
      {
        title: "The keys",
        copy: "Funds clear, the car is prepped, and the first service is already in the diary.",
      },
    ],
    inclusions: [
      {
        title: "Collection-backed underwriting",
        copy: "The cars you own count for more than the payslip. We underwrite against the garage.",
      },
      {
        title: "Balloon & residual structures",
        copy: "Keep the monthly light and decide at the end — settle, refinance, or hand back the keys.",
      },
      {
        title: "Lease-to-own conversion",
        copy: "Started on a lease and fell in love? Convert to ownership at any point, without penalty.",
      },
      {
        title: "Portfolio credit lines",
        copy: "One agreed line across multiple cars, drawn down as the right ones surface.",
      },
      {
        title: "Private-bank partners",
        copy: "For structures the mainstream lenders can't hold. Discreet, and used to unusual assets.",
      },
      {
        title: "Early settlement, no penalty",
        copy: "Pay it off tomorrow if you like. We're car people, not penalty people.",
      },
    ],
    note: "Financing subject to status. Figures are illustrations, not offers — your structure is written for you.",
    enquiry: {
      submitLabel: "Request a finance offer",
      successTitle: "The numbers are on their way",
      successCopy:
        "A finance partner will call within one working day with a structure built around you — not a form letter.",
    },
  },
  {
    slug: "sourcing",
    num: "/ 02",
    title: "Global Sourcing",
    copy: "Name the spec. Allocation, auction or private sale — if it exists, our scouts find it within 90 days.",
    headline: ["If it exists,", "we find it"],
    lede: "Name the spec — year, colour, gearbox, provenance. Allocation, auction or private sale: our scouts cover forty countries, and most mandates close inside ninety days.",
    stats: [
      {
        value: "90",
        label: "Days, spec to keys",
        note: "Median across the last three years of sourcing mandates.",
      },
      {
        value: "40+",
        label: "Countries scouted",
        note: "Registered bidders at the majors, quieter contacts everywhere else.",
      },
      {
        value: "1 of 1",
        label: "Our favourite brief",
        note: "One-offs, homologation specials, the last of a series — the harder, the better.",
      },
    ],
    steps: [
      {
        title: "The brief",
        copy: "The exact spec, the tolerance around it, and the number you won't cross. All of it in writing, all of it confidential.",
      },
      {
        title: "The hunt",
        copy: "Allocations, auction rooms, collections that aren't for sale yet. You get a weekly note; the market hears nothing.",
      },
      {
        title: "The vetting",
        copy: "Full provenance audit and a pre-purchase inspection by our own technicians before you ever see a contract.",
      },
      {
        title: "The delivery",
        copy: "Negotiation, import, homologation, enclosed transport to your door — or to a storage bay under ours.",
      },
    ],
    inclusions: [
      {
        title: "Allocation access",
        copy: "Standing relationships with the factories, for cars that never reach a configurator.",
      },
      {
        title: "Auction representation",
        copy: "We bid, you sleep. Live representation at every major sale, terms agreed up front.",
      },
      {
        title: "Private-sale negotiation",
        copy: "The best cars trade quietly. We know the owners, and they take our calls.",
      },
      {
        title: "Provenance audit",
        copy: "History files, matching numbers, ownership chain — verified before money moves.",
      },
      {
        title: "Pre-purchase inspection",
        copy: "Our technicians fly to the car. Nothing is bought on photographs.",
      },
      {
        title: "Import & homologation",
        copy: "Duties, registration, emissions paperwork — handled, wherever the car lands.",
      },
    ],
    note: "No find, no fee. The retainer is deducted from our commission the day the car lands.",
    enquiry: {
      submitLabel: "Commission the search",
      successTitle: "The scouts have the brief",
      successCopy:
        "Expect the first note within a week — then one every week until the car is found.",
    },
  },
  {
    slug: "trade-in",
    num: "/ 03",
    title: "Trade-in & Consignment",
    copy: "Museum-grade valuation and discreet consignment. Your current keys become your down payment.",
    headline: ["Your keys are", "currency"],
    lede: "A museum-grade valuation inside 24 hours, then two roads: trade the car against the next one today, or consign it quietly and let us find the buyer who pays properly.",
    stats: [
      {
        value: "24 h",
        label: "To a valuation",
        note: "Inspected by our own technicians, priced against live market data.",
      },
      {
        value: "94%",
        label: "Of asking, achieved",
        note: "Average across consignment sales over the last twelve months.",
      },
      {
        value: "0",
        label: "Public listings",
        note: "Consignments trade off-market. Your car never becomes a banner ad.",
      },
    ],
    steps: [
      {
        title: "The valuation",
        copy: "Bring the car, or we collect it. Condition report, history review, and a number that holds for thirty days.",
      },
      {
        title: "The decision",
        copy: "Trade it against the next car today, or consign and wait for the right buyer. We'll tell you honestly which we'd do.",
      },
      {
        title: "The sale",
        copy: "Detailing, photography and a quiet word to the right collectors. Viewings happen here, not in your driveway.",
      },
      {
        title: "The settlement",
        copy: "Funds wired the day the deal closes — or rolled straight into the next car, minus nothing.",
      },
    ],
    inclusions: [
      {
        title: "Museum-grade valuation",
        copy: "Priced by people who sell these cars, not an algorithm scraping classifieds.",
      },
      {
        title: "Instant trade-in",
        copy: "The number is the number. Drive in with one car, leave with another.",
      },
      {
        title: "Off-market consignment",
        copy: "Sold quietly to vetted buyers. No listings, no tyre-kickers, no photographs in the wild.",
      },
      {
        title: "Preparation & photography",
        copy: "Paint correction, detailing and studio photography — recovered from the sale, only if it sells.",
      },
      {
        title: "Buyer vetting",
        copy: "Every viewing is a qualified buyer with proof of funds. Your time is part of the price.",
      },
      {
        title: "Storage while listed",
        copy: "Climate-controlled and insured under our roof until the day it changes hands.",
      },
    ],
    note: "Valuations hold for 30 days. Consignment terms are agreed per car, in writing, before the keys change hands.",
    enquiry: {
      submitLabel: "Request a valuation",
      successTitle: "The valuation is under way",
      successCopy:
        "Our technicians will call within one working day to arrange the inspection — dig out the history file.",
    },
  },
  {
    slug: "aftercare",
    num: "/ 04",
    title: "Lifetime Aftercare",
    copy: "Concierge servicing, climate storage, covered transport and track-day support — for as long as you own the car.",
    headline: ["For as long as", "you own it"],
    lede: "Concierge servicing, climate storage, covered transport and track-day support. Not a warranty with an expiry date — a standing relationship that lasts as long as the logbook carries your name.",
    stats: [
      {
        value: "4 h",
        label: "Concierge response",
        note: "One number to call. A human answers, and something happens.",
      },
      {
        value: "3",
        label: "Cities, one standard",
        note: "Munich, Dubai and Oslo — the same technicians' standards in all three.",
      },
      {
        value: "∞",
        label: "Expiry date",
        note: "Sell the car through us and the aftercare file transfers to the next owner.",
      },
    ],
    steps: [
      {
        title: "The onboarding",
        copy: "Every car we hand over is baselined — paint mapped, fluids logged, a file opened that follows the car for life.",
      },
      {
        title: "The rhythm",
        copy: "Servicing on our calendar, not your memory. We collect, service and return — covered transport, both ways.",
      },
      {
        title: "The seasons",
        copy: "Winter storage, spring recommissioning, tyres swapped and batteries tended while you're away.",
      },
      {
        title: "The days out",
        copy: "Track support with technicians and tyres at the circuit — and transport home when you've used them up.",
      },
    ],
    inclusions: [
      {
        title: "Concierge servicing",
        copy: "Collection and return in covered transport. You'll never see a service reception again.",
      },
      {
        title: "Climate storage",
        copy: "Humidity-controlled bays, trickle chargers, weekly checks — photographed, so you can look in from anywhere.",
      },
      {
        title: "Covered transport",
        copy: "Enclosed trucks between homes, borders and race tracks — insured door to door.",
      },
      {
        title: "Track-day support",
        copy: "Technicians, tyres and telemetry at the circuit. You drive; we do the rest.",
      },
      {
        title: "Detailing programmes",
        copy: "Scheduled correction and protection that keeps the paint at delivery standard.",
      },
      {
        title: "Warranty liaison",
        copy: "One phone call, and the factory claim is our problem instead of yours.",
      },
    ],
    note: "Aftercare is attached to the car, not the invoice — sell it through us and the file transfers with the keys.",
    enquiry: {
      submitLabel: "Enrol the car",
      successTitle: "Welcome to the family",
      successCopy:
        "The concierge will call within one working day to open the car's file and plan its first collection.",
    },
  },
];

export function getService(slug: string): ServiceItem | undefined {
  return services.find((s) => s.slug === slug);
}
