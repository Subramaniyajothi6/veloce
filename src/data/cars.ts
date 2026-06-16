import type { CarProfile } from "@/types";

/* Real cars behind each 3D model. Thumbnails are real photographs from
   Wikimedia Commons (CC BY / CC BY-SA / CC0 / PD); per-file attribution in
   downloads/photos/credits.txt. 3D-model credits are on each model.credit.
   "VELOCE Motors" remains the site/showroom brand. */

export const cars: CarProfile[] = [
  {
    slug: "royale",
    name: "Bugatti La Voiture Noire",
    category: "Hypercar",
    price: "€11,000,000",
    tagline: "One of one.",
    description:
      "A single coachbuilt commission on the Chiron's quad-turbo W16 — the most expensive new car ever sold. All black, all carbon, named for the lost Type 57 SC Atlantic it pays tribute to.",
    image: "/cars/royale.jpg",
    alt: "Black Bugatti La Voiture Noire, front studio shot",
    /* a charcoal "black" — pure #000 vanishes on the dark set and its metallic
       reflections tint to black; this reads black but still catches highlights */
    paint: "#2c2c33",
    model: {
      url: "/models/royale.glb",
      yaw: Math.PI,
      repaint: true,
      /* the visible body is the CSR2 paint slots Matte__<hex>__prim/sec
         (authored white #FFFFFFFF + a blue #114182 pinstripe), NOT the
         "coloured"/"textured" layers — paint all of them so the whole car
         reads glossy black like the press shot */
      bodyMaterials: [
        "Matte__FFFFFFFF__prim_env_50_spec",
        "Matte__FF114182__sec_env_50_spec",
        "lavoiturecsr2_coloured__env_50_spec",
        "lavoiturecsr2_textured2a__spec",
        "lavoiturecsr2_textureda__env_50_spec",
      ],
      credit: "Bugatti La Voiture Noire by SINNIK — Sketchfab, CC BY 4.0",
    },
    specs: [
      { value: 1500, unit: "HP", label: "Power", detail: "8.0-litre quad-turbo W16, no electrification." },
      { value: 2.4, decimals: 1, unit: "S", label: "0–100 km/h", detail: "All-wheel drive, 7-speed dual-clutch." },
      { value: 420, unit: "KM/H", label: "Top speed", detail: "Electronically limited, as every Bugatti is." },
      { value: 1600, unit: "NM", label: "Torque", detail: "Peak from 2,000 rpm across the W16." },
      { value: 8.0, decimals: 1, unit: "L", label: "Displacement", detail: "Sixteen cylinders, four turbochargers." },
      { value: 1, unit: "OF 1", label: "Built", detail: "A single coachbuilt car, sold before completion." },
    ],
    gallery: [
      { src: "/cars/royale-g1.jpg", alt: "Black Bugatti La Voiture Noire, front three-quarter", caption: "Front three-quarter" },
      { src: "/cars/royale-g2.jpg", alt: "Black Bugatti La Voiture Noire from the rear", caption: "On location" },
    ],
    track: [
      { label: "Veloce circuit lap", value: "1:11.4", note: "Manufacturer demonstration, slicks" },
      { label: "100–0 km/h", value: "31.5 M", note: "Carbon-ceramic brakes" },
      { label: "Kerb weight", value: "1995 KG", note: "Coachbuilt monocoque" },
    ],
  },
  {
    slug: "furia",
    name: "Ferrari SF90 XX Stradale",
    category: "Hybrid Hypercar",
    price: "€770,000",
    tagline: "Track-bred, road-legal.",
    description:
      "The most powerful road-going Ferrari: a twin-turbo V8 plus three electric motors, with a fixed rear wing borrowed from the race department. The first XX car you can drive on the street.",
    image: "/cars/furia.jpg",
    alt: "Blue Ferrari SF90 XX Stradale with fixed rear wing on display",
    paint: "#1c50d4",
    model: {
      url: "/models/furia.glb",
      repaint: true,
      credit: "2023 Ferrari SF90 XX Stradale by Ddiaz Design — Sketchfab, CC BY 4.0",
    },
    specs: [
      { value: 1030, unit: "HP", label: "System power", detail: "Twin-turbo V8 plus three electric motors." },
      { value: 2.3, decimals: 1, unit: "S", label: "0–100 km/h", detail: "Launch control, 8-speed dual-clutch." },
      { value: 320, unit: "KM/H", label: "Top speed", detail: "Limited — built for the corners, not the straight." },
      { value: 6.5, decimals: 1, unit: "S", label: "0–200 km/h", detail: "Hybrid torque-fill erases the gaps." },
      { value: 3, unit: "MOTORS", label: "Electric drive", detail: "Two front, one rear — assist and recover." },
      { value: 4.0, decimals: 1, unit: "L", label: "Displacement", detail: "Twin-turbo V8, 797 hp on its own." },
    ],
    gallery: [
      { src: "/cars/furia-g1.jpg", alt: "Red Ferrari SF90 XX, front three-quarter", caption: "Front three-quarter" },
      { src: "/cars/furia-g2.jpg", alt: "Blue Ferrari SF90 XX Stradale, rear three-quarter", caption: "Rear aero detail" },
    ],
    track: [
      { label: "Veloce circuit lap", value: "1:14.2", note: "Hybrid boost mapped to qualifying" },
      { label: "100–0 km/h", value: "29.5 M", note: "Carbon-ceramics, regen blended" },
      { label: "Downforce", value: "530 KG", note: "At top speed, fixed wing" },
    ],
  },
  {
    slug: "vento-rs",
    name: "Porsche 911 GT3 RS",
    category: "Track Coupé",
    price: "€229,000",
    tagline: "The race car with plates.",
    description:
      "A 4.0-litre naturally-aspirated flat-six revving to 9,000 rpm, a swan-neck rear wing and DRS active aero making up to 860 kg of downforce. Cooling, suspension and bodywork are all motorsport-grade — a GT3 R you can drive home.",
    image: "/cars/vento-rs.jpg",
    alt: "White Porsche 911 GT3 RS with swan-neck rear wing, parked on a racetrack",
    /* matches the white GT3 RS photos — kept bright so the metallic clearcoat
       still reads white (not grey) under the dark studio lighting */
    paint: "#eef1f4",
    model: {
      url: "/models/vento-rs.glb",
      repaint: true,
      /* only the brake calipers are recolored (orange accent); the wheel keeps
         its authored look — the rim/tyre/disc are one mesh/material and any
         geometry split collapses the wheel, so it's left untouched */
      caliperMaterials: ["Porsche_911GT3_2022_CallipersCalliperA_Zone_Material"],
      caliperColor: "#ff5a1e",
      credit: "2022 Porsche 911 GT3 (992) by Ddiaz Design — Sketchfab, CC BY 4.0",
    },
    specs: [
      { value: 525, unit: "HP", label: "Power", detail: "4.0-litre naturally-aspirated flat-six, motorsport-tuned." },
      { value: 3.2, decimals: 1, unit: "S", label: "0–100 km/h", detail: "PDK only, launch control." },
      { value: 296, unit: "KM/H", label: "Top speed", detail: "Capped by downforce, not by power." },
      { value: 9000, unit: "RPM", label: "Redline", detail: "A motorsport flat-six, revved to the limit." },
      { value: 465, unit: "NM", label: "Torque", detail: "Naturally aspirated — it builds, it doesn't punch." },
      { value: 1450, unit: "KG", label: "Kerb weight", detail: "Carbon everywhere, lightweight glass." },
    ],
    gallery: [
      { src: "/cars/vento-rs-g4.jpg", alt: "White Porsche 911 GT3 RS cornering on a racetrack, elevated front view", caption: "Through the corner" },
      { src: "/cars/vento-rs-g3.jpg", alt: "White Porsche 911 GT3 RS driving on a racetrack, rear view", caption: "On track" },
    ],
    track: [
      { label: "Nürburgring Nordschleife", value: "6:49.3", note: "Lars Kern, Cup 2 R tyres" },
      { label: "100–0 km/h", value: "29.9 M", note: "Steel brakes standard" },
      { label: "Peak downforce", value: "860 KG", note: "At 285 km/h, DRS closed" },
    ],
  },
  {
    slug: "giallo-gt",
    name: "Lamborghini Centenario",
    category: "Limited Hypercar",
    price: "€1,750,000",
    tagline: "One hundred years, forty cars.",
    description:
      "Built for Ferruccio Lamborghini's centenary on a bare carbon monocoque, with rear-wheel steering and the last of the great naturally-aspirated V12s. Forty cars, all sold before reveal.",
    image: "/cars/giallo-gt.jpg",
    alt: "Carbon-grey Lamborghini Centenario with orange accents on the lawn",
    paint: "#34343b",
    model: {
      url: "/models/giallo-gt.glb",
      repaint: true,
      bodyMaterials: ["Carbon_R", "Material"],
      credit: "Lamborghini Centenario LP-770 by SDC PERFORMANCE — Sketchfab, CC BY 4.0",
    },
    specs: [
      { value: 770, unit: "HP", label: "Power", detail: "6.5-litre naturally-aspirated V12." },
      { value: 2.8, decimals: 1, unit: "S", label: "0–100 km/h", detail: "Four-wheel drive, rear-wheel steering." },
      { value: 350, unit: "KM/H", label: "Top speed", detail: "Carbon monocoque, active aero." },
      { value: 690, unit: "NM", label: "Torque", detail: "Peak at 5,500 rpm." },
      { value: 8500, unit: "RPM", label: "Redline", detail: "One of the last atmospheric V12s." },
      { value: 40, unit: "CARS", label: "Production", detail: "Twenty coupés, twenty roadsters." },
    ],
    gallery: [
      { src: "/cars/giallo-gt-g1.jpg", alt: "Grey Lamborghini Centenario, front three-quarter", caption: "Front three-quarter" },
      { src: "/cars/giallo-gt-g2.jpg", alt: "Grey Lamborghini Centenario from the rear", caption: "On location" },
    ],
    track: [
      { label: "Veloce circuit lap", value: "1:12.0", note: "Rear-wheel steering, slicks" },
      { label: "100–0 km/h", value: "30.5 M", note: "Carbon-ceramic brakes" },
      { label: "Peak lateral grip", value: "1.40 G", note: "Active aero engaged" },
    ],
  },
  {
    slug: "notte-v10",
    name: "Audi R8 V10",
    category: "Supercar",
    price: "€186,000",
    tagline: "The everyday exotic.",
    description:
      "A mid-engined 5.2-litre V10 shared with the Lamborghini Huracán, wrapped in an aluminium-and-carbon body and quattro all-wheel drive. Supercar noise, usable every day.",
    image: "/cars/notte-v10-night.jpg",
    alt: "Red Audi R8 V10 performance, front three-quarter at night",
    paint: "#c8102e",
    model: {
      url: "/models/notte-v10.glb",
      repaint: true,
      bodyMaterials: ["Car_Paint", "Car_Paint.001"],
      credit: "Audi R8 by kulonee — Sketchfab, CC BY 4.0",
    },
    specs: [
      { value: 610, unit: "HP", label: "Power", detail: "5.2-litre naturally-aspirated V10 (V10 plus)." },
      { value: 3.2, decimals: 1, unit: "S", label: "0–100 km/h", detail: "quattro all-wheel drive, S tronic." },
      { value: 330, unit: "KM/H", label: "Top speed", detail: "Shares its heart with the Huracán." },
      { value: 560, unit: "NM", label: "Torque", detail: "Peak at 6,500 rpm." },
      { value: 8700, unit: "RPM", label: "Redline", detail: "One of the last naturally-aspirated supercars." },
      { value: 5.2, decimals: 1, unit: "L", label: "Displacement", detail: "Ten cylinders, no turbos." },
    ],
    gallery: [
      { src: "/cars/notte-v10-g1.jpg", alt: "Blue Audi R8 V10 coupé, front three-quarter", caption: "Front three-quarter" },
      { src: "/cars/notte-v10-g2.jpg", alt: "Grey Audi R8 V10 coupé on the street", caption: "On location" },
    ],
    track: [
      { label: "Veloce circuit lap", value: "1:19.9", note: "quattro traction off the line" },
      { label: "100–0 km/h", value: "31.0 M", note: "Steel brakes, perfect pedal" },
      { label: "Peak lateral grip", value: "1.18 G", note: "Balanced, all-wheel drive" },
    ],
  },
  {
    slug: "volt-zero",
    name: "Tesla Roadster",
    category: "Hyper EV",
    price: "€200,000",
    tagline: "The benchmark, electrified.",
    description:
      "Tesla's second-generation Roadster: three motors, all-wheel drive, and a claimed 1.9-second sprint to 60 mph. The numbers it promises would out-drag almost anything with a fuel cap.",
    image: "/cars/volt-zero.jpg",
    alt: "Tesla Roadster at its night unveiling",
    paint: "#dfe4ea",
    model: {
      url: "/models/volt-zero.glb",
      repaint: true,
      credit: "Tesla Roadster 2020 by metarex.4d — Sketchfab, CC BY 4.0",
    },
    specs: [
      { value: 2.1, decimals: 1, unit: "S", label: "0–100 km/h", detail: "Claimed; 1.9 s to 60 mph." },
      { value: 400, unit: "KM/H", label: "Top speed", detail: "Over 250 mph claimed." },
      { value: 1000, unit: "KM", label: "Range", detail: "1,000 km on a single charge, claimed." },
      { value: 3, unit: "MOTORS", label: "Drive", detail: "Three motors, all-wheel drive, torque vectoring." },
      { value: 10000, unit: "NM", label: "Wheel torque", detail: "Quoted at the wheels." },
      { value: 0, unit: "EMISSIONS", label: "Tailpipe", detail: "Fully electric." },
    ],
    gallery: [
      { src: "/cars/volt-zero-2.jpg", alt: "Tesla Roadster at the proving ground", caption: "On location" },
      { src: "/cars/volt-zero-3.jpg", alt: "Tesla Roadster low profile", caption: "Profile" },
    ],
    track: [
      { label: "Veloce circuit lap", value: "1:13.8", note: "Two flying laps before thermal derate" },
      { label: "100–0 km/h", value: "29.8 M", note: "Regen does a third of the work" },
      { label: "Peak lateral grip", value: "1.35 G", note: "Low battery centre of gravity" },
    ],
  },

  /* ── Classic line ──────────────────────────────────────────────
     The original studio (placeholder) 3D models, served from /models-old. */
  {
    slug: "royale-classic",
    name: "Bugatti Bolide",
    category: "Track Hypercar",
    price: "€4,000,000",
    tagline: "The W16, unleashed.",
    description:
      "A track-only interpretation of the quad-turbo W16, stripped to a Le Mans-grade carbon skeleton and tuned to 1,600 PS on racing fuel. Forty built, each one a four-million-euro toy.",
    image: "/cars/royale-classic.jpg",
    alt: "Light-blue Bugatti Bolide track hypercar, front three-quarter at Goodwood",
    /* model ships in a green livery; repaint the body paint slot to the
       Bugatti light-blue of the thumbnail */
    paint: "#a9c4db",
    model: {
      url: "/models-old/royale.glb",
      repaint: true,
      bodyMaterials: ["Bugatti_X16Gold_2024Paint_Material.002"],
      credit: "Bugatti Bolide 2024 — via github.com/Vivekkk-1/3D-Models",
    },
    specs: [
      { value: 1600, unit: "HP", label: "Power", detail: "8.0-litre quad-turbo W16 on racing fuel." },
      { value: 2.2, decimals: 1, unit: "S", label: "0–100 km/h", detail: "Track-only, around 1,450 kg." },
      { value: 1450, unit: "KG", label: "Weight", detail: "A road-car W16 in a race-car body." },
      { value: 1600, unit: "NM", label: "Torque", detail: "Four turbochargers, no electrification." },
      { value: 8.0, decimals: 1, unit: "L", label: "Displacement", detail: "Sixteen cylinders." },
      { value: 40, unit: "CARS", label: "Production", detail: "Forty built, each €4 million." },
    ],
    gallery: [
      { src: "/cars/royale-2.jpg", alt: "Bugatti Bolide front aspect in the garage", caption: "Front aspect" },
      { src: "/cars/royale-3.jpg", alt: "Bugatti Bolide rear wing under studio neon", caption: "Rear wing" },
    ],
    track: [
      { label: "Veloce circuit lap", value: "1:09.8", note: "Track-only, slicks" },
      { label: "Downforce", value: "1800 KG", note: "Claimed peak, full aero" },
      { label: "Power to weight", value: "1103 HP/T", note: "On racing fuel" },
    ],
  },
  {
    slug: "furia-classic",
    name: "Ferrari 599XX",
    category: "Track Special",
    price: "€1,400,000",
    tagline: "Not for the road. For the record.",
    description:
      "A track-only client programme car: a 6.0-litre V12 stripped of restraint, with a fixed rear wing and aggressive aero. One of the first road-car-derived machines to lap the Nürburgring under seven minutes.",
    image: "/cars/furia-classic.jpg",
    alt: "Red-and-yellow Ferrari 599XX race car with large rear wing, in motion",
    paint: "#d11a1f",
    model: {
      url: "/models-old/furia.glb",
      repaint: true,
      credit: "Ferrari 599 — via github.com/Vivekkk-1/3D-Models",
    },
    specs: [
      { value: 700, unit: "HP", label: "Power", detail: "6.0-litre naturally-aspirated V12." },
      { value: 9000, unit: "RPM", label: "Redline", detail: "Race-derived, no road-car restraint." },
      { value: 280, unit: "KG", label: "Downforce", detail: "At 200 km/h; far more flat-out." },
      { value: 6.0, decimals: 1, unit: "L", label: "Displacement", detail: "Twelve cylinders, track-only." },
      { value: 1350, unit: "KG", label: "Weight", detail: "Stripped, caged, slicks-only." },
      { value: 29, unit: "CARS", label: "Programme", detail: "A track-only client programme." },
    ],
    gallery: [
      { src: "/cars/furia-2.jpg", alt: "Ferrari track car", caption: "On track" },
      { src: "/cars/furia-3.jpg", alt: "Ferrari rear aero", caption: "Rear wing" },
    ],
    track: [
      { label: "Nürburgring Nordschleife", value: "6:58.0", note: "599XX, manufacturer figure" },
      { label: "Downforce at Vmax", value: "630 KG", note: "Full aero package" },
      { label: "Redline", value: "9000 RPM", note: "Race V12" },
    ],
  },
  {
    slug: "tempesta-v12-classic",
    name: "Toyota Supra Mk4",
    category: "Sports Coupé",
    price: "€110,000",
    tagline: "The tuner's holy grail.",
    description:
      "The A80 Supra: a 3.0-litre twin-turbo 2JZ-GTE inline-six in a front-engine, rear-drive coupé with a basket-handle rear wing. Famously over-built — the engine bottom end is good for four-figure power.",
    image: "/cars/tempesta-v12-classic.jpg",
    alt: "Red Mk4 Toyota Supra (A80), front three-quarter",
    paint: "#b81f2a",
    model: {
      url: "/models-old/tempesta-v12.glb",
      repaint: true,
      credit: "Toyota Supra MK4 — via github.com/Vivekkk-1/3D-Models",
    },
    specs: [
      { value: 326, unit: "HP", label: "Power", detail: "3.0-litre twin-turbo 2JZ-GTE inline-six." },
      { value: 4.9, decimals: 1, unit: "S", label: "0–100 km/h", detail: "Six-speed Getrag manual." },
      { value: 285, unit: "KM/H", label: "Top speed", detail: "Derestricted; 250 km/h as sold." },
      { value: 451, unit: "NM", label: "Torque", detail: "Sequential twin-turbos, near-flat delivery." },
      { value: 3.0, decimals: 1, unit: "L", label: "Displacement", detail: "The legendary 2JZ." },
      { value: 1570, unit: "KG", label: "Kerb weight", detail: "Front-engine, rear-drive." },
    ],
    gallery: [
      { src: "/cars/tempesta-v12-2.jpg", alt: "Supra side profile", caption: "Profile" },
      { src: "/cars/tempesta-v12-3.jpg", alt: "Supra at a meet", caption: "On location" },
    ],
    track: [
      { label: "Quarter mile", value: "13.1 S", note: "Stock, export turbo" },
      { label: "100–0 km/h", value: "34.0 M", note: "Period road tyres" },
      { label: "Tuning ceiling", value: "1000+ HP", note: "On the standard block" },
    ],
  },
  {
    slug: "notte-v10-classic",
    name: "Dodge Challenger R/T",
    category: "Muscle Car",
    price: "€45,000",
    tagline: "Old-school, on purpose.",
    description:
      "A two-tonne retro brawler: the 5.7-litre HEMI V8 R/T with the cold-air Shaker hood scoop poking through the bonnet. Built to look and sound exactly like a 1970 muscle car, on modern underpinnings.",
    image: "/cars/notte-v10-classic.jpg",
    alt: "Orange Dodge Challenger R/T Shaker, front three-quarter",
    paint: "#e8631a",
    model: {
      url: "/models-old/notte-v10.glb",
      repaint: true,
      bodyMaterials: [
        "dDodge_ChallengerRTShakerF7_2015Paint_Material1",
        "dDodge_ChallengerRTShakerF7_2015Coloured_Material1",
      ],
      credit: "Dodge Challenger R/T — via github.com/Vivekkk-1/3D-Models",
    },
    specs: [
      { value: 375, unit: "HP", label: "Power", detail: "5.7-litre HEMI V8 with Shaker cold-air hood." },
      { value: 5.4, decimals: 1, unit: "S", label: "0–100 km/h", detail: "8-speed auto or 6-speed manual." },
      { value: 250, unit: "KM/H", label: "Top speed", detail: "Electronically governed." },
      { value: 556, unit: "NM", label: "Torque", detail: "Big, lazy, American low-end shove." },
      { value: 5.7, decimals: 1, unit: "L", label: "Displacement", detail: "Two valves per cylinder, all attitude." },
      { value: 1880, unit: "KG", label: "Kerb weight", detail: "A retro muscle coupé." },
    ],
    gallery: [
      { src: "/cars/notte-v10-2.jpg", alt: "Challenger front three-quarter", caption: "Front three-quarter" },
      { src: "/cars/notte-v10-3.jpg", alt: "Challenger interior", caption: "Cabin" },
    ],
    track: [
      { label: "Quarter mile", value: "13.8 S", note: "5.7 HEMI, stock" },
      { label: "100–0 km/h", value: "37.0 M", note: "Two tonnes to stop" },
      { label: "Soundtrack", value: "HEMI V8", note: "The whole point" },
    ],
  },
];

export const getCar = (slug: string) => cars.find((c) => c.slug === slug);
