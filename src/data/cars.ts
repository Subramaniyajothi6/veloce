import type { CarProfile } from "@/types";

/* Photography: real cars from Wikimedia Commons (CC BY / CC BY-SA / PD).
   Full per-file attribution lives in downloads/photos/credits.txt. */

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
    alt: "Veloce Royale hypercar in ice-blue over exposed carbon, shot low in the paddock",
    paint: "#e9e7e0",
    model: {
      url: "/models/royale.glb",
      yaw: Math.PI,
      repaint: true,
      /* CSR2 rip: the tintable body is "coloured", authored black — the
         non-black heuristic would skip it */
      bodyMaterials: ["lavoiturecsr2_coloured__env_50_spec"],
      credit: "Bugatti La Voiture Noire by SINNIK — Sketchfab, CC BY 4.0",
    },
    specs: [
      {
        value: 1500,
        unit: "HP",
        label: "Power",
        detail: "Quad-turbo W16. No electric assistance, no apologies.",
      },
      {
        value: 2.4,
        decimals: 1,
        unit: "S",
        label: "0–100 km/h",
        detail: "Carbon clutch launch, all four wheels biting at once.",
      },
      {
        value: 420,
        unit: "KM/H",
        label: "Top speed",
        detail: "Active aero collapsed flat into low-drag trim.",
      },
      {
        value: 1600,
        unit: "NM",
        label: "Torque",
        detail: "Peak from 2,000 rpm — a tide, not a wave.",
      },
      {
        value: 8,
        decimals: 1,
        unit: "L",
        label: "Displacement",
        detail: "Sixteen cylinders fed by four turbochargers.",
      },
      {
        value: 12,
        unit: "CARS",
        label: "Production run",
        detail: "A numbered dozen, each specified in a single sitting.",
      },
    ],
    gallery: [
      {
        src: "/cars/royale-2.jpg",
        alt: "Veloce Royale front three-quarter under festival lights",
        caption: "Commission N°07, photographed before its first shakedown",
      },
      {
        src: "/cars/royale-3.jpg",
        alt: "Veloce Royale high view showing the X-graphic intakes",
        caption: "Active aero in parc-fermé trim",
      },
    ],
    track: [
      { label: "Veloce circuit lap", value: "1:11.4", note: "Slicks, factory driver, no ballast" },
      { label: "100–0 km/h", value: "28.9 M", note: "Carbon-ceramics, cold morning" },
      { label: "Peak lateral grip", value: "1.45 G", note: "Turn 4, sustained" },
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
    alt: "Rosso-red Veloce Furia rear three-quarter, parked outside the atelier",
    paint: "#e10600",
    model: {
      url: "/models/furia.glb",
      repaint: true,
      credit: "2023 Ferrari SF90 XX Stradale by Ddiaz Design — Sketchfab, CC BY 4.0",
    },
    specs: [
      {
        value: 963,
        unit: "HP",
        label: "System power",
        detail: "Twin-turbo V8 plus three electric motors, summed.",
      },
      {
        value: 2.6,
        decimals: 1,
        unit: "S",
        label: "0–100 km/h",
        detail: "Torque-fill erases the gearshifts entirely.",
      },
      {
        value: 350,
        unit: "KM/H",
        label: "Top speed",
        detail: "Hybrid boost held all the way to the limiter.",
      },
      {
        value: 900,
        unit: "NM",
        label: "Torque",
        detail: "Instant. The turbos never get the chance to lag.",
      },
      {
        value: 3,
        unit: "MOTORS",
        label: "Electric drive",
        detail: "Two on the front axle, one inside the gearbox.",
      },
      {
        value: 40,
        unit: "KM",
        label: "Silent range",
        detail: "Leave the neighbourhood without waking it.",
      },
    ],
    gallery: [
      {
        src: "/cars/furia-2.jpg",
        alt: "Veloce Furia front three-quarter with the black roof stripe",
        caption: "The concours lawn, the morning after delivery",
      },
      {
        src: "/cars/furia-3.jpg",
        alt: "Veloce Furia rear deck and quad exhaust",
        caption: "Four tailpipes, three motors, no pauses",
      },
    ],
    track: [
      { label: "Veloce circuit lap", value: "1:14.2", note: "Hybrid boost mapped to qualifying" },
      { label: "100–0 km/h", value: "30.1 M", note: "Regen blended with the ceramics" },
      { label: "Peak lateral grip", value: "1.38 G", note: "Torque-vectored through Turn 7" },
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
    alt: "Silver Veloce Vento RS low-slung under the museum lights",
    paint: "#a8aeb6",
    model: {
      url: "/models/vento-rs.glb",
      repaint: true,
      credit: "2022 Porsche 911 GT3 (992) by Ddiaz Design — Sketchfab, CC BY 4.0",
    },
    specs: [
      {
        value: 720,
        unit: "HP",
        label: "Power",
        detail: "Every horsepower asked to justify its weight.",
      },
      {
        value: 2.8,
        decimals: 1,
        unit: "S",
        label: "0–100 km/h",
        detail: "On slicks it's quicker. We stopped measuring.",
      },
      {
        value: 341,
        unit: "KM/H",
        label: "Top speed",
        detail: "Drag-limited by the fixed wing. Worth it.",
      },
      {
        value: 1290,
        unit: "KG",
        label: "Dry weight",
        detail: "Carbon tub, lexan rear screen, no carpet.",
      },
      {
        value: 520,
        unit: "KG",
        label: "Downforce",
        detail: "At 250 km/h the wing starts paying rent.",
      },
      {
        value: 558,
        unit: "HP/T",
        label: "Power to weight",
        detail: "Better than anything else we build.",
      },
    ],
    gallery: [
      {
        src: "/cars/vento-rs-2.jpg",
        alt: "Veloce Vento RS race car number 60 in the garage",
        caption: "Chassis 60, between stints",
      },
      {
        src: "/cars/vento-rs-3.jpg",
        alt: "Veloce Vento RS prototype mirror and intake detail in the dark",
        caption: "Prototype LT-4, photographed in the vault",
      },
    ],
    track: [
      { label: "Veloce circuit lap", value: "1:13.1", note: "The fixed wing earns its keep" },
      { label: "100–0 km/h", value: "29.4 M", note: "1,290 kg has its advantages" },
      { label: "Peak lateral grip", value: "1.42 G", note: "Mechanical grip, no tricks" },
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
    alt: "White Veloce Tempesta V12 in the dark museum vault between red lifts",
    paint: "#ff5a1f",
    model: {
      url: "/models/tempesta-v12.glb",
      yaw: Math.PI,
      repaint: true,
      /* "Painted_Black" (trim) outranks the real body and matches /paint/ */
      bodyMaterials: ["Body_Color"],
      credit: "2017 Aston Martin DB11 by Hari — Sketchfab, CC BY 4.0",
    },
    specs: [
      {
        value: 770,
        unit: "HP",
        label: "Power",
        detail: "Naturally aspirated. Built while the world still lets us.",
      },
      {
        value: 2.9,
        decimals: 1,
        unit: "S",
        label: "0–100 km/h",
        detail: "No turbos to wait for. Just rpm and nerve.",
      },
      {
        value: 355,
        unit: "KM/H",
        label: "Top speed",
        detail: "Reached with the windows cracked, for the sound.",
      },
      {
        value: 9500,
        unit: "RPM",
        label: "Redline",
        detail: "The soundtrack needs no speakers.",
      },
      {
        value: 6.5,
        decimals: 1,
        unit: "L",
        label: "Displacement",
        detail: "Twelve cylinders, zero turbos, no regrets.",
      },
      {
        value: 720,
        unit: "NM",
        label: "Torque",
        detail: "Arrives high in the revs. You go looking for it.",
      },
    ],
    gallery: [
      {
        src: "/cars/tempesta-v12-2.jpg",
        alt: "Orange Veloce Tempesta V12 side profile under studio spotlights",
        caption: "The launch specification, as it left the stand",
      },
      {
        src: "/cars/tempesta-v12-3.jpg",
        alt: "Veloce Tempesta V12 front three-quarter at a night meet",
        caption: "An owner's car at the midnight gathering",
      },
    ],
    track: [
      { label: "Veloce circuit lap", value: "1:16.8", note: "Third gear most of the lap, for the noise" },
      { label: "100–0 km/h", value: "31.0 M", note: "Street tyres, full tank" },
      { label: "Peak lateral grip", value: "1.28 G", note: "Progressive at the limit, by design" },
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
    alt: "Veloce Giallo GT in racing green over gold wheels, kerbside in the city",
    paint: "#ffc400",
    model: {
      url: "/models/giallo-gt.glb",
      repaint: true,
      /* authored as exposed carbon + orange accents; paint shell and accents */
      bodyMaterials: ["Carbon_R", "Material"],
      credit: "Lamborghini Centenario LP-770 by SDC PERFORMANCE — Sketchfab, CC BY 4.0",
    },
    specs: [
      {
        value: 585,
        unit: "HP",
        label: "Power",
        detail: "Flat-plane V8, tuned for breadth over peak.",
      },
      {
        value: 3.7,
        decimals: 1,
        unit: "S",
        label: "0–100 km/h",
        detail: "Brisk enough. This one is about the next 2,000 km.",
      },
      {
        value: 318,
        unit: "KM/H",
        label: "Top speed",
        detail: "Stable, quiet, two coffees on board.",
      },
      {
        value: 980,
        unit: "KM",
        label: "Tank range",
        detail: "Munich to Milan and back on one fill.",
      },
      {
        value: 473,
        unit: "L",
        label: "Luggage",
        detail: "Two weeks for two people, properly packed.",
      },
      {
        value: 1745,
        unit: "KG",
        label: "Kerb weight",
        detail: "Heavy enough to feel hewn, light enough to dance.",
      },
    ],
    gallery: [
      {
        src: "/cars/giallo-gt-2.jpg",
        alt: "Veloce Giallo GT cabin: steering wheel and tan leather dashboard",
        caption: "A cabin built for the 2,000-km Sunday",
      },
      {
        src: "/cars/giallo-gt-3.jpg",
        alt: "Veloce Giallo GT in deep blue on a stone driveway",
        caption: "The four-seat commission, customer car",
      },
    ],
    track: [
      { label: "Veloce circuit lap", value: "1:21.5", note: "A GT, lapped honestly" },
      { label: "100–0 km/h", value: "32.8 M", note: "With the luggage still in the boot" },
      { label: "Peak lateral grip", value: "1.12 G", note: "Comfort dampers, sport map" },
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
    alt: "Matte-black Veloce Notte V10 side profile against desert mountains at dusk",
    paint: "#1d2f5e",
    model: {
      url: "/models/notte-v10.glb",
      repaint: true,
      bodyMaterials: ["Car_Paint", "Car_Paint.001"],
      credit: "Audi R8 by kulonee — Sketchfab, CC BY 4.0",
    },
    specs: [
      {
        value: 620,
        unit: "HP",
        label: "Power",
        detail: "A V10 tuned for the last golden hour of the day.",
      },
      {
        value: 3.1,
        decimals: 1,
        unit: "S",
        label: "0–100 km/h",
        detail: "Quick without violence. This one seduces.",
      },
      {
        value: 324,
        unit: "KM/H",
        label: "Top speed",
        detail: "Past midnight, on the autostrada of your choosing.",
      },
      {
        value: 800,
        unit: "NM",
        label: "Torque",
        detail: "Enough to surf the wave instead of chasing it.",
      },
      {
        value: 5.2,
        decimals: 1,
        unit: "L",
        label: "V10 displacement",
        detail: "Naturally aspirated. The founders refuse to retire it.",
      },
      {
        value: 8700,
        unit: "RPM",
        label: "Redline",
        detail: "The last thousand rpm is the whole point.",
      },
    ],
    gallery: [
      {
        src: "/cars/notte-v10-2.jpg",
        alt: "Veloce Notte V10 in indigo blue, front three-quarter after rain",
        caption: "Indigo over black, the first-morning shot",
      },
      {
        src: "/cars/notte-v10-3.jpg",
        alt: "Veloce Notte V10 cockpit in black alcantara, lights down",
        caption: "The night-spec cockpit, lights down",
      },
    ],
    track: [
      { label: "Veloce circuit lap", value: "1:19.9", note: "Set at dusk, naturally" },
      { label: "100–0 km/h", value: "32.2 M", note: "Steel brakes, perfect pedal" },
      { label: "Peak lateral grip", value: "1.18 G", note: "Balanced to slide, not snap" },
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
    alt: "Silver Veloce Volt Zero at its night unveiling, crowd behind the glass",
    paint: "#dfe4ea",
    model: {
      url: "/models/volt-zero.glb",
      repaint: true,
      credit: "Tesla Roadster 2020 by metarex.4d — Sketchfab, CC BY 4.0",
    },
    specs: [
      {
        value: 1020,
        unit: "HP",
        label: "Power",
        detail: "Four motors, one per wheel, zero noise.",
      },
      {
        value: 1.9,
        decimals: 1,
        unit: "S",
        label: "0–100 km/h",
        detail: "Pinned to the seat at a whisper.",
      },
      {
        value: 400,
        unit: "KM/H",
        label: "Top speed",
        detail: "Out-drags everything with a fuel cap.",
      },
      {
        value: 620,
        unit: "KM",
        label: "Range",
        detail: "Measured the boring way: on a motorway, in the rain.",
      },
      {
        value: 4,
        unit: "MOTORS",
        label: "Torque vectoring",
        detail: "Each wheel its own argument, settled in milliseconds.",
      },
      {
        value: 18,
        unit: "MIN",
        label: "10–80% charge",
        detail: "One espresso. Maybe a biscotto.",
      },
    ],
    gallery: [
      {
        src: "/cars/volt-zero-2.jpg",
        alt: "Veloce Volt Zero in red, side profile at the proving ground",
        caption: "Validation car VZ-02 at the proving ground",
      },
      {
        src: "/cars/volt-zero-3.jpg",
        alt: "Veloce Volt Zero in red, low side profile in the shade",
        caption: "The press car, between drives",
      },
    ],
    track: [
      { label: "Veloce circuit lap", value: "1:13.8", note: "Two flying laps before thermal derate" },
      { label: "100–0 km/h", value: "29.8 M", note: "Regen does a third of the work" },
      { label: "Peak lateral grip", value: "1.35 G", note: "Four motors arguing it level" },
    ],
  },
];

export const getCar = (slug: string) => cars.find((c) => c.slug === slug);
