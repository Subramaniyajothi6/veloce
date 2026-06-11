import type { CarProfile } from "@/types";

export const cars: CarProfile[] = [
  {
    slug: "royale",
    name: "Royale",
    category: "Hypercar",
    price: "€2,400,000",
    tagline: "One of twelve. None alike.",
    description:
      "The Royale is the house's crown jewel — a quad-turbo W16 hypercar built in a numbered run of twelve, each specified in a single sitting with its first owner. Carbon monocoque, active aero, and a cabin trimmed like a watch case.",
    image: "/cars/royale.jpg",
    alt: "Veloce Royale hypercar in its bespoke green-over-carbon livery",
    paint: "#e9e7e0",
    model: {
      url: "/models/royale.glb",
      /* the Bolide's green/black livery is baked into textures — repainting
         would flatten it; the authored look IS the "none alike" spec */
      repaint: false,
      credit: "Bugatti Bolide 2024 — via github.com/Vivekkk-1/3D-Models",
    },
    specs: [
      { value: 1500, unit: "HP", label: "Power" },
      { value: 2.4, decimals: 1, unit: "S", label: "0–100 km/h" },
      { value: 420, unit: "KM/H", label: "Top speed" },
      { value: 1600, unit: "NM", label: "Torque" },
    ],
  },
  {
    slug: "furia",
    name: "Furia",
    category: "Hybrid Hypercar",
    price: "€1,350,000",
    tagline: "Rage, electrified.",
    description:
      "A twin-turbo V8 with three motors stitched into the driveline. The Furia fills the gaps between gearshifts with instant torque — violence with no pauses, and a 40 km silent mode for leaving the neighbourhood politely.",
    image: "/cars/furia.jpg",
    alt: "White-and-red Veloce Furia hybrid hypercar in the night studio",
    paint: "#e10600",
    model: {
      url: "/models/furia.glb",
      repaint: true,
      credit: "Ferrari 599 — via github.com/Vivekkk-1/3D-Models",
    },
    specs: [
      { value: 963, unit: "HP", label: "System power" },
      { value: 2.6, decimals: 1, unit: "S", label: "0–100 km/h" },
      { value: 350, unit: "KM/H", label: "Top speed" },
      { value: 900, unit: "NM", label: "Torque" },
    ],
  },
  {
    slug: "vento-rs",
    name: "Vento RS",
    category: "Supercar",
    price: "€310,000",
    tagline: "The driver's tool.",
    description:
      "The lightest car we build. The Vento RS strips everything that doesn't make it faster around a lap — then adds a manual-feel paddle box, a fixed wing, and the most talkative steering rack in the range.",
    image: "/cars/vento-rs.jpg",
    alt: "Silver Veloce Vento RS low-slung racer in the night studio",
    paint: "#a8aeb6",
    model: {
      url: "/models/vento-rs.glb",
      repaint: true,
      credit: "Ford GT40 — via github.com/Vivekkk-1/3D-Models",
    },
    specs: [
      { value: 720, unit: "HP", label: "Power" },
      { value: 2.8, decimals: 1, unit: "S", label: "0–100 km/h" },
      { value: 341, unit: "KM/H", label: "Top speed" },
      { value: 1290, unit: "KG", label: "Dry weight" },
    ],
  },
  {
    slug: "tempesta-v12",
    name: "Tempesta V12",
    category: "V12 Coupé",
    price: "€465,000",
    tagline: "Twelve cylinders, zero apologies.",
    description:
      "Our last naturally-aspirated V12, built while the world still lets us. The Tempesta revs to 9,500 and pairs it with a carbon-ceramic soundtrack that needs no speakers. A future classic, sold as a present one.",
    image: "/cars/tempesta-v12.jpg",
    alt: "Orange Veloce Tempesta V12 coupé in the night studio",
    paint: "#ff5a1f",
    model: {
      url: "/models/tempesta-v12.glb",
      repaint: true,
      credit: "Toyota Supra MK4 — via github.com/Vivekkk-1/3D-Models",
    },
    specs: [
      { value: 770, unit: "HP", label: "Power" },
      { value: 2.9, decimals: 1, unit: "S", label: "0–100 km/h" },
      { value: 355, unit: "KM/H", label: "Top speed" },
      { value: 9500, unit: "RPM", label: "Redline" },
    ],
  },
  {
    slug: "giallo-gt",
    name: "Giallo GT",
    category: "Grand Tourer",
    price: "€189,000",
    tagline: "The 2,000-km Sunday.",
    description:
      "A grand tourer in the original sense: two seats, a flat-plane V8, and a boot that swallows two weeks of luggage. The Giallo GT crosses countries at a sprint and arrives with you still wanting to drive.",
    image: "/cars/giallo-gt.jpg",
    alt: "Yellow Veloce Giallo GT grand tourer in the night studio",
    paint: "#ffc400",
    model: {
      url: "/models/giallo-gt.glb",
      repaint: true,
      credit: "BMW M8 2020 — via github.com/Vivekkk-1/3D-Models",
    },
    specs: [
      { value: 585, unit: "HP", label: "Power" },
      { value: 3.7, decimals: 1, unit: "S", label: "0–100 km/h" },
      { value: 318, unit: "KM/H", label: "Top speed" },
      { value: 980, unit: "KM", label: "Tank range" },
    ],
  },
  {
    slug: "notte-v10",
    name: "Notte V10",
    category: "Grand Tourer",
    price: "€214,000",
    tagline: "Built for the last golden hour.",
    description:
      "Twilight is its natural habitat. A naturally-aspirated V10 grand tourer tuned for the last golden hour of the day — and the first one of the morning. The flagship our founders refuse to retire.",
    image: "/cars/notte-v10.jpg",
    alt: "Midnight-blue Veloce Notte V10 brooding in the dark studio",
    paint: "#1d2f5e",
    model: {
      url: "/models/notte-v10.glb",
      repaint: true,
      bodyMaterials: [
        "dDodge_ChallengerRTShakerF7_2015Paint_Material1",
        "dDodge_ChallengerRTShakerF7_2015Coloured_Material1",
      ],
      credit: "Dodge Challenger R/T — via github.com/Vivekkk-1/3D-Models",
    },
    specs: [
      { value: 620, unit: "HP", label: "Power" },
      { value: 3.1, decimals: 1, unit: "S", label: "0–100 km/h" },
      { value: 324, unit: "KM/H", label: "Top speed" },
      { value: 800, unit: "NM", label: "Torque" },
    ],
  },
  {
    slug: "volt-zero",
    name: "Volt Zero",
    category: "Hyper EV",
    price: "€248,000",
    tagline: "Silence, weaponized.",
    description:
      "Our first all-electric flagship pins you to the seat at a whisper — and out-drags everything with a fuel cap. Four motors, torque vectoring measured in milliseconds, and a battery that fast-charges during an espresso.",
    image: "/cars/volt-zero.jpg",
    alt: "Silver Veloce Volt Zero electric concept in the night studio",
    paint: "#dfe4ea",
    model: {
      url: "/models/volt-zero.glb",
      yaw: Math.PI,
      repaint: true,
      credit: "Concept Car 037 [CC0] — via github.com/Vivekkk-1/3D-Models",
    },
    specs: [
      { value: 1020, unit: "HP", label: "Power" },
      { value: 1.9, decimals: 1, unit: "S", label: "0–100 km/h" },
      { value: 400, unit: "KM/H", label: "Top speed" },
      { value: 620, unit: "KM", label: "Range" },
    ],
  },
];

export const getCar = (slug: string) => cars.find((c) => c.slug === slug);
