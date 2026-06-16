import type { Flagship } from "@/types";

export const flagships: Flagship[] = [
  {
    slug: "notte-v10",
    index: "N°1",
    eyebrow: "Supercar",
    name: "Audi R8 V10",
    lede: "A mid-engined 5.2-litre V10 shared with the Lamborghini Huracán, wrapped in aluminium and carbon with quattro all-wheel drive. Supercar noise, usable every day.",
    image: "/cars/notte-v10-night.jpg",
    alt: "Red Audi R8 V10 performance, front three-quarter at night",
    specs: [
      { value: 610, unit: "HP", label: "Power" },
      { value: 3.2, decimals: 1, unit: "S", label: "0–100 km/h" },
      { value: 330, unit: "KM/H", label: "Top speed" },
      { value: 8700, unit: "RPM", label: "Redline" },
    ],
    price: "€186,000",
  },
  {
    slug: "volt-zero",
    index: "N°2",
    eyebrow: "Hyper EV",
    name: "Tesla Roadster",
    lede: "Tesla's second-generation Roadster: three motors, all-wheel drive, and a claimed 1.9-second sprint to 60 mph. The numbers it promises would out-drag almost anything with a fuel cap.",
    image: "/cars/volt-zero.jpg",
    alt: "Tesla Roadster at its night unveiling",
    badge: "100% Electric",
    specs: [
      { value: 2.1, decimals: 1, unit: "S", label: "0–100 km/h" },
      { value: 400, unit: "KM/H", label: "Top speed" },
      { value: 1000, unit: "KM", label: "Range" },
      { value: 3, unit: "MOTORS", label: "Drive" },
    ],
    price: "€200,000",
    reversed: true,
  },
];
