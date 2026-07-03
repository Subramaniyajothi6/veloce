import type { Flagship } from "@/types";

export const flagships: Flagship[] = [
  {
    slug: "gemera",
    index: "N°1",
    eyebrow: "Mega-GT",
    name: "Koenigsegg Gemera",
    lede: "Koenigsegg's first four-seater: a camless 2.0-litre twin-turbo triple and three electric motors for 1,700 hp, a 1.9-second launch, and room for the whole family behind two dihedral doors.",
    image: "/cars/gemera.jpg",
    alt: "Grey Koenigsegg Gemera, front three-quarter on a dark stand",
    badge: "Four seats",
    specs: [
      { value: 1700, unit: "HP", label: "Power" },
      { value: 1.9, decimals: 1, unit: "S", label: "0–100 km/h" },
      { value: 400, unit: "KM/H", label: "Top speed" },
      { value: 4, unit: "SEATS", label: "Cabin" },
    ],
    price: "€1,700,000",
  },
  {
    slug: "royale",
    index: "N°2",
    eyebrow: "Hypercar",
    name: "Bugatti La Voiture Noire",
    lede: "A single coachbuilt commission on the Chiron's quad-turbo W16 — the most expensive new car ever sold. All black, all carbon, named for the lost Type 57 SC Atlantic it pays tribute to.",
    image: "/cars/royale.jpg",
    alt: "Black Bugatti La Voiture Noire, elevated front three-quarter studio shot",
    badge: "One of one",
    specs: [
      { value: 1500, unit: "HP", label: "Power" },
      { value: 2.4, decimals: 1, unit: "S", label: "0–100 km/h" },
      { value: 420, unit: "KM/H", label: "Top speed" },
      { value: 1600, unit: "NM", label: "Torque" },
    ],
    price: "€11,000,000",
    reversed: true,
  },
];
