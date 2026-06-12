import type { Flagship } from "@/types";

export const flagships: Flagship[] = [
  {
    slug: "notte-v10",
    index: "N°1",
    eyebrow: "Grand Tourer",
    name: "Notte V10",
    lede: "Twilight is its natural habitat. A naturally-aspirated V10 grand tourer tuned for the last golden hour of the day — and the first one of the morning.",
    image: "/cars/notte-v10.jpg",
    alt: "Matte-black Veloce Notte V10 against desert mountains at dusk",
    specs: [
      { value: 620, unit: "HP", label: "Power" },
      { value: 3.1, decimals: 1, unit: "S", label: "0–100 km/h" },
      { value: 324, unit: "KM/H", label: "Top speed" },
      { value: 800, unit: "NM", label: "Torque" },
    ],
    price: "€214,000",
  },
  {
    slug: "volt-zero",
    index: "N°2",
    eyebrow: "Hyper EV",
    name: "Volt Zero",
    lede: "Silence, weaponized. Our first all-electric flagship pins you to the seat at a whisper — and out-drags everything with a fuel cap.",
    image: "/cars/volt-zero.jpg",
    alt: "Silver Veloce Volt Zero at its night unveiling",
    badge: "100% Electric",
    specs: [
      { value: 1020, unit: "HP", label: "Power" },
      { value: 1.9, decimals: 1, unit: "S", label: "0–100 km/h" },
      { value: 400, unit: "KM/H", label: "Top speed" },
      { value: 620, unit: "KM", label: "Range" },
    ],
    price: "€248,000",
    reversed: true,
  },
];
