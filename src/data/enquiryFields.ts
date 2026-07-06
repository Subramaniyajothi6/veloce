import { locations } from "@/data/locations";
import type { EnquiryField } from "@/types";

/** Service-specific inputs on each enquiry form. The same config drives the
 *  form's rendering and the server action's field whitelist, so nothing a
 *  visitor invents in devtools ever reaches the database. */
export const enquiryFields: Record<string, EnquiryField[]> = {
  financing: [
    { name: "car", label: "The car", type: "car", required: true },
    {
      name: "deposit",
      label: "Deposit",
      type: "select",
      options: ["10%", "20%", "30%", "50% or more", "Trade-in covers it"],
      required: true,
    },
    {
      name: "term",
      label: "Term",
      type: "select",
      options: [
        "24 months",
        "36 months",
        "48 months",
        "60 months",
        "72 months",
        "84 months",
      ],
      required: true,
    },
  ],
  sourcing: [
    {
      name: "car",
      label: "The car you want",
      type: "text",
      placeholder: "Pagani Huayra BC, 2017–2019, exposed carbon",
      required: true,
    },
    {
      name: "budget",
      label: "Budget",
      type: "select",
      options: ["€250k – €500k", "€500k – €1m", "€1m – €2m", "€2m+", "No ceiling"],
      required: true,
    },
    {
      name: "timeframe",
      label: "Timeframe",
      type: "select",
      options: ["No rush — the right one", "Within 90 days", "Yesterday"],
    },
  ],
  "trade-in": [
    {
      name: "car",
      label: "Your car",
      type: "text",
      placeholder: "Ferrari 488 Pista, 2019",
      required: true,
    },
    { name: "mileage", label: "Mileage", type: "text", placeholder: "12,000 km" },
    {
      name: "intent",
      label: "Route",
      type: "select",
      options: ["Trade-in", "Consignment", "Not sure — advise me"],
      required: true,
    },
  ],
  aftercare: [
    {
      name: "car",
      label: "The car",
      type: "text",
      placeholder: "Porsche Carrera GT, 2005",
      required: true,
    },
    {
      name: "city",
      label: "Nearest showroom",
      type: "select",
      options: locations.map((l) => l.city),
      required: true,
    },
    {
      name: "interest",
      label: "Primarily interested in",
      type: "select",
      options: [
        "Concierge servicing",
        "Climate storage",
        "Covered transport",
        "Track-day support",
        "The full programme",
      ],
      required: true,
    },
  ],
};
