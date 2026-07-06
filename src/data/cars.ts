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
    alt: "Black Bugatti La Voiture Noire, elevated front three-quarter studio shot",
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
      /* white rear BUGATTI script + silver EB deck badge (press-shot look).
         The visible glyphs are the "light" slot's 7 overlay islands — the
         "coloured" slot ALSO has letter bases + the hex backing band in the
         same region, which must stay dark (painting them reads as a silver
         band behind the letters, not white lettering). The EB badge is one
         379-tri island in "coloured" at y 15–16.6. Boxes are in the GLB's
         raw space, measured via cluster probe. Emissive lift because the
         rear-facing glyph faces get almost no scene light. */
      partRecolor: [
        {
          material: "lavoiturecsr2_light__env_50_spec",
          box: [[-13, 6.5, 98.5], [13, 10.2, 102.5]],
          color: "#C0C0C0",
          metalness: 0.2,
          roughness: 0.45,
          emissive: 0.25,
        },
        {
          material: "lavoiturecsr2_coloured__env_50_spec",
          box: [[-3, 14.5, 100], [3.5, 16.6, 103.6]],
          color: "#C0C0C0",
          metalness: 0.6,
          roughness: 0.35,
          emissive: 0.1,
        },
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
      { src: "/cars/royale-mood.jpg", alt: "Black Bugatti La Voiture Noire rear, glowing full-width taillight in the dark", caption: "Out of the dark" },
      { src: "/cars/royale-spine.jpg", alt: "Black Bugatti La Voiture Noire from a high rear angle, carbon roof and dorsal spine", caption: "From above" },
    ],
    track: [
      { label: "Veloce circuit lap", value: "1:11.4", note: "Manufacturer demonstration, slicks" },
      { label: "100–0 km/h", value: "31.5 M", note: "Carbon-ceramic brakes" },
      { label: "Kerb weight", value: "1995 KG", note: "Coachbuilt monocoque" },
    ],
    highlights: [
      {
        title: "All black, all carbon",
        copy: "Every panel is bare carbon fibre laid by hand, then lacquered in a black so deep it reads as liquid. No badges, no chrome — only surface.",
        image: "/cars/royale-top.jpg",
      },
      {
        title: "The W16, untouched",
        copy: "Eight litres, sixteen cylinders, four turbochargers and zero electrification. 1,500 hp delivered the old way, through all four wheels.",
        image: "/cars/royale-rear34.jpg",
      },
      {
        title: "Coachbuilt, once",
        copy: "A single commission, bodied entirely by Bugatti's atelier over months — the most expensive new car ever sold, and the only one of its kind.",
        image: "/cars/royale-location.jpg",
      },
      {
        title: "Named for a legend",
        copy: "A tribute to the lost Type 57 SC Atlantic — the voiture noire that vanished in 1938 and has never been found.",
        image: "/cars/royale-head-on.jpg",
      },
    ],
    features: [
      {
        title: "Sixteen cylinders, four turbos",
        copy: "The W16 folds two narrow-angle V8s into one block, fed by four turbochargers spooling in pairs. Peak torque arrives at 2,000 rpm and holds flat to the limiter — relentless, seamless, unmistakably Bugatti.",
        image: "/cars/royale-rear.jpg",
        stat: { value: "1,600 NM", label: "from 2,000 rpm" },
      },
      {
        title: "A monocoque, sculpted by hand",
        copy: "Beneath the lacquer is a carbon-fibre monocoque finished to a mirror, with six tailpipes machined from titanium. Every join was dressed by hand until the body read as one unbroken surface.",
        image: "/cars/royale-exhaust.jpg",
        stat: { value: "1,995 KG", label: "coachbuilt kerb weight" },
      },
      {
        title: "One of one, sold before completion",
        copy: "La Voiture Noire was commissioned, built and delivered as a unique piece — the modern heir to Jean Bugatti's Atlantic. There will not be a second.",
        image: "/cars/royale-detail.jpg",
        stat: { value: "1 of 1", label: "ever built" },
      },
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
    image: "/cars/furia-front.jpg",
    alt: "Silver Ferrari SF90 XX Stradale with fixed rear wing on a racetrack",
    /* SF90 XX launch livery is a light cool silver; tuned bright so the 0.85-metalness
       repaint reads as silver (not grey) under the dark, blue-lit studio scene */
    paint: "#d2d6da",
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
      { src: "/cars/furia-nose.jpg", alt: "Silver Ferrari SF90 XX Stradale head-on on a racetrack", caption: "Head-on" },
      { src: "/cars/furia-cabin.jpg", alt: "Ferrari SF90 XX Stradale carbon bucket seats with racing harnesses", caption: "Inside the XX" },
    ],
    track: [
      { label: "Veloce circuit lap", value: "1:14.2", note: "Hybrid boost mapped to qualifying" },
      { label: "100–0 km/h", value: "29.5 M", note: "Carbon-ceramics, regen blended" },
      { label: "Downforce", value: "530 KG", note: "At top speed, fixed wing" },
    ],
    highlights: [
      {
        title: "The first street-legal XX",
        copy: "XX cars were always track-only toys, reserved for Ferrari's most trusted clients. The SF90 XX Stradale is the first you can register, insure and drive on the road.",
        image: "/cars/furia-nose.jpg",
      },
      {
        title: "A wing from the race department",
        copy: "The fixed carbon rear wing and S-Duct are lifted straight from competition thinking — together they make 530 kg of downforce, the most of any road-going Ferrari.",
        image: "/cars/furia-rear.jpg",
      },
      {
        title: "Eight cylinders, three motors",
        copy: "A 797 hp twin-turbo V8 works with three electric motors. Torque-fill from the hybrid system erases the turbo lag entirely, for a shove that never lets up.",
        image: "/cars/furia-top.jpg",
      },
      {
        title: "Assetto Fiorano, as standard",
        copy: "Multimatic dampers, more carbon, less weight and sharper aero — the track-focused package the road cars charge extra for is simply how the XX is built.",
        image: "/cars/furia-cabin.jpg",
      },
    ],
    features: [
      {
        title: "1,030 hp, split four ways",
        copy: "The twin-turbo V8 drives the rear; two motors drive the front and one fills in between gears. Power flows to whichever wheel can use it, metered thousands of times a second.",
        image: "/cars/furia-top.jpg",
        stat: { value: "1,030 HP", label: "combined system output" },
      },
      {
        title: "Downforce you can feel",
        copy: "A fixed rear wing, S-Duct and reworked underbody generate 530 kg at top speed — enough to pin the nose flat through a long corner where lesser cars start to float.",
        image: "/cars/furia-rear.jpg",
        stat: { value: "530 KG", label: "downforce at top speed" },
      },
      {
        title: "Race rubber, road plates",
        copy: "Built around Ferrari's XX track programme but homologated for the street, it sprints to 100 km/h in 2.3 seconds and keeps the lap-time obsession of a car you're not supposed to drive home.",
        image: "/cars/furia-cockpit.jpg",
        stat: { value: "2.3 S", label: "0–100 km/h" },
      },
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
      { src: "/cars/vento-rs-straight.jpg", alt: "White Porsche 911 GT3 RS accelerating down a racetrack straight, rear view", caption: "Down the straight" },
      { src: "/cars/vento-rs-grid.jpg", alt: "White Porsche 911 GT3 RS at the pit-lane start line, elevated rear view", caption: "On the grid" },
    ],
    track: [
      { label: "Nürburgring Nordschleife", value: "6:49.3", note: "Lars Kern, Cup 2 R tyres" },
      { label: "100–0 km/h", value: "29.9 M", note: "Steel brakes standard" },
      { label: "Peak downforce", value: "860 KG", note: "At 285 km/h, DRS closed" },
    ],
    highlights: [
      {
        title: "Downforce, not power",
        copy: "The GT3 RS is the rare car capped by its aerodynamics, not its engine: 860 kg of downforce hold it to the road so hard that top speed actually falls — and it laps quicker for it.",
        image: "/cars/vento-rs-rear.jpg",
      },
      {
        title: "A flat-six to 9,000 rpm",
        copy: "Four litres, naturally aspirated, motorsport-derived — no turbos, no hybrid. It builds and builds to a 9,000 rpm scream that no forced-induction engine can imitate.",
        image: "/cars/vento-rs-g4.jpg",
      },
      {
        title: "Aero you adjust from the wheel",
        copy: "A drag-reduction system opens the swan-neck wing flat-out for speed and slams it shut under braking for grip — Formula 1 thinking, on a car with number plates.",
        image: "/cars/vento-rs-g3.jpg",
      },
      {
        title: "A GT3 R you can drive home",
        copy: "Centre-mounted radiator, teardrop intakes, double-wishbone front suspension in the airstream — the cooling and chassis are pure race car, wrapped in road-legal bodywork.",
        image: "/cars/vento-rs-side.jpg",
      },
    ],
    features: [
      {
        title: "The swan-neck wing",
        copy: "Mounted from above so the clean underside does the work, the rear wing pairs with front diveplanes and a flat floor to make 860 kg of downforce at 285 km/h — a first for a road-going 911.",
        image: "/cars/vento-rs-rear.jpg",
        stat: { value: "860 KG", label: "peak downforce" },
      },
      {
        title: "Cooled like a race car",
        copy: "The central radiator moves to the nose in a single angled stack, Le Mans-style, freeing the front corners for ducting and putting the wishbones into the airflow as aero elements.",
        image: "/cars/vento-rs-corner.jpg",
        stat: { value: "9,000 RPM", label: "redline" },
      },
      {
        title: "Every gram fought for",
        copy: "Carbon doors, roof and front wings, lightweight glass and optional magnesium wheels keep a car this aggressive down to 1,450 kg — so the downforce has less to fight.",
        image: "/cars/vento-rs-cabin.jpg",
        stat: { value: "1,450 KG", label: "kerb weight" },
      },
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
    alt: "Carbon-fibre Lamborghini Centenario with yellow accents, elevated front three-quarter studio shot",
    paint: "#34343b",
    model: {
      url: "/models/giallo-gt.glb",
      repaint: true,
      bodyMaterials: ["Carbon_R", "Material"],
      credit: "Lamborghini Centenario LP-770 by SDC PERFORMANCE — Sketchfab, CC BY 4.0",
    },
    specs: [
      { value: 770, unit: "HP", label: "Power", detail: "6.5-litre naturally-aspirated V12 — 566 kW at 8,500 rpm." },
      { value: 2.8, decimals: 1, unit: "S", label: "0–100 km/h", detail: "Haldex IV all-wheel drive with rear-wheel steering." },
      { value: 350, unit: "KM/H", label: "Top speed", detail: "Beyond 350 km/h; three-position active rear spoiler." },
      { value: 690, unit: "NM", label: "Torque", detail: "507 lb-ft, peak at 5,500 rpm." },
      { value: 8500, unit: "RPM", label: "Redline", detail: "One of the last atmospheric V12s — 11.8:1 compression." },
      { value: 40, unit: "CARS", label: "Production", detail: "Twenty coupés, twenty roadsters — all sold before reveal." },
    ],
    gallery: [
      { src: "/cars/giallo-gt-track-front.jpg", alt: "Carbon Lamborghini Centenario on track, front three-quarter cornering over the kerbs", caption: "Through the corner" },
      { src: "/cars/giallo-gt-track-rear.jpg", alt: "Carbon Lamborghini Centenario on track at speed, rear three-quarter with rear wing raised", caption: "On the limit" },
    ],
    track: [
      { label: "Veloce circuit lap", value: "1:12.0", note: "Rear-wheel steering, slicks" },
      { label: "100–0 km/h", value: "30.0 M", note: "Carbon-ceramic brakes, 400 mm front discs" },
      { label: "Peak lateral grip", value: "1.40 G", note: "Active aero engaged" },
    ],
    highlights: [
      {
        title: "One hundred years, forty cars",
        copy: "Built to mark the centenary of Ferruccio Lamborghini's birth, the Centenario ran to just forty cars — twenty coupés, twenty roadsters — every one sold before the covers came off.",
        image: "/cars/giallo-gt-headon.jpg",
      },
      {
        title: "The last great atmospheric V12",
        copy: "Six and a half litres, 770 hp, 8,500 rpm — no turbos, no electric assistance. One of the final naturally-aspirated V12s Lamborghini would ever build.",
        image: "/cars/giallo-gt-rear.jpg",
      },
      {
        title: "A bare carbon monocoque",
        copy: "Body and tub alike are finished in exposed carbon fibre. The Centenario is a design study made real — a concept car you are allowed to drive.",
        image: "/cars/giallo-gt-rear-road.jpg",
      },
      {
        title: "It steers from the rear, too",
        copy: "Rear-wheel steering turns the back wheels against the fronts to shrink the car in tight corners, then with them to plant it on the straight.",
        image: "/cars/giallo-gt-storm.jpg",
      },
    ],
    features: [
      {
        title: "770 hp, naturally aspirated",
        copy: "The most powerful V12 Lamborghini had built at the time draws breath through twelve throttle bodies and revs to 8,500 rpm — the engine that defined the marque, at its peak.",
        image: "/cars/giallo-gt-exhaust.jpg",
        stat: { value: "770 HP", label: "at 8,500 rpm" },
      },
      {
        title: "Rear-wheel steering",
        copy: "Below 60 km/h the rear axle counter-steers for agility; above it the wheels align for stability. The result is a 4.9-metre hypercar that hides its size in your hands.",
        image: "/cars/giallo-gt-side.jpg",
        stat: { value: "2.8 S", label: "0–100 km/h" },
      },
      {
        title: "A rolling design manifesto",
        copy: "Hexagonal motifs, a glass cover over the V12 and a body sculpted in raw carbon previewed the language Lamborghini's later cars would speak — built in a run of just forty.",
        image: "/cars/giallo-gt-cabin.jpg",
        stat: { value: "40", label: "cars built" },
      },
      {
        title: "Lamborghini's first touchscreen",
        copy: "The Centenario broke with tradition inside: a portrait infotainment display set into a carbon console, Apple CarPlay, and the ANIMA rocker that snaps between Strada, Sport and Corsa. A hypercar that finally learned to talk.",
        image: "/cars/giallo-gt-console.jpg",
        stat: { value: "3", label: "ANIMA drive modes" },
      },
      {
        title: "Hexagons, all the way down",
        copy: "A full TFT instrument binnacle carries the hexagon motif that repeats across the whole car — the tachometer sweeping toward 8,500 rpm with gear, speed and telemetry layered over a honeycomb field.",
        image: "/cars/giallo-gt-cluster.jpg",
        stat: { value: "8,500", label: "rpm to the limiter" },
      },
    ],
  },
  {
    slug: "gemera",
    name: "Koenigsegg Gemera",
    category: "Four-Seat Mega-GT",
    price: "€1,700,000",
    tagline: "Four seats. Four hundred km/h.",
    description:
      "Koenigsegg's first four-seater — a Mega-GT built around a camless 2.0-litre twin-turbo three-cylinder and three electric motors. 1,700 hp, a 1.9-second launch, and room for the whole family behind two dihedral doors.",
    image: "/cars/gemera.jpg",
    alt: "Grey Koenigsegg Gemera, front head-on with both dihedral doors raised on a dark stand",
    /* Graphite grey — the model's Paint_Material is authored near-black, so a
       light metallic grey reads as silver-grey under the dark studio lighting */
    paint: "#9aa0a6",
    model: {
      url: "/models/gemera.glb",
      repaint: true,
      bodyMaterials: ["Koenigsegg_Gemera_2021Paint_Material"],
      credit: "2021 Koenigsegg Gemera by Ddiaz Design — Sketchfab, CC BY 4.0",
    },
    specs: [
      { value: 1700, unit: "HP", label: "Combined power", detail: "600 hp triple plus three electric motors." },
      { value: 1.9, decimals: 1, unit: "S", label: "0–100 km/h", detail: "All-wheel drive, launch control." },
      { value: 400, unit: "KM/H", label: "Top speed", detail: "A four-seater that still runs to 400." },
      { value: 3500, unit: "NM", label: "Torque", detail: "Combined, measured at the wheels." },
      { value: 2.0, decimals: 1, unit: "L", label: "Displacement", detail: "Twin-turbo three-cylinder, camless Freevalve." },
      { value: 4, unit: "SEATS", label: "Cabin", detail: "Four adults, four sets of luggage." },
    ],
    gallery: [
      { src: "/cars/gemera-g1.jpg", alt: "Grey Koenigsegg Gemera cornering on a damp track, rear three-quarter", caption: "On the limit" },
      { src: "/cars/gemera-g2.jpg", alt: "Green Koenigsegg Gemera at speed on a test track", caption: "On the move" },
      { src: "/cars/gemera-g3.jpg", alt: "Green Koenigsegg Gemera, rear, on an airfield runway", caption: "Down the runway" },
      { src: "/cars/gemera-g4.jpg", alt: "Grey Koenigsegg Gemera, front three-quarter on a dark motor-show stand", caption: "On the stand" },
    ],
    track: [
      { label: "0–100 km/h", value: "1.9 S", note: "Launch control, all-wheel drive" },
      { label: "Combined range", value: "1000 KM", note: "Petrol plus electric, claimed" },
      { label: "Kerb weight", value: "1850 KG", note: "Four seats included" },
    ],
    highlights: [
      {
        title: "Four seats, no apology",
        copy: "Koenigsegg's first four-seater. Two dihedral synchro-helix doors swing up to a genuine 2+2 cabin — room for the family in a car that still runs to 400 km/h.",
        image: "/cars/gemera-doors.jpg",
      },
      {
        title: "A true 2+2",
        copy: "Four sculpted, heated seats — not two plus luggage. The Gemera carries four adults and their bags at a pace that shames most two-seat hypercars.",
        image: "/cars/gemera-seats.jpg",
      },
      {
        title: "Direct Drive, no gearbox",
        copy: "The Koenigsegg Direct Drive system deletes the conventional gearbox, coupling engine and motors straight to the wheels — seamless, relentless and light.",
        image: "/cars/gemera-rear.jpg",
      },
      {
        title: "A grand tourer, weaponised",
        copy: "1,700 hp and a 1.9-second launch wrapped around a four-seat cabin and a boot. The everyday hypercar, finally made real.",
        image: "/cars/gemera-profile.jpg",
      },
    ],
    features: [
      {
        title: "1,700 hp — three cylinders, three motors",
        copy: "The \"Tiny Friendly Giant\" — a camless 2.0-litre twin-turbo three-cylinder — drives one axle while three electric motors fill every gap. Power flows to whichever wheel can use it, metered thousands of times a second.",
        image: "/cars/gemera-engine.jpg",
        stat: { value: "1,700 HP", label: "combined output" },
      },
      {
        title: "A cabin built around four",
        copy: "Two synchro-helix doors open onto four sculpted seats, four cupholders and four screens — a hypercar you can genuinely share with three other people.",
        image: "/cars/gemera-cabin.jpg",
        stat: { value: "4 SEATS", label: "four full-size adults" },
      },
      {
        title: "A cockpit that wraps the driver",
        copy: "Ahead of the wheel sits a curved digital cluster; the controls that matter live on the alcantara rim, and everything else is a swipe away — calm at 400 km/h, calm on the school run.",
        image: "/cars/gemera-cockpit.jpg",
        stat: { value: "1.9 S", label: "0–100 km/h" },
      },
      {
        title: "Camless, by design",
        copy: "A single round tailpipe vents a lightweight exhaust. With Freevalve actuation opening each valve on demand — no camshafts at all — the triple revs hard and sings loud.",
        image: "/cars/gemera-exhaust.jpg",
        stat: { value: "0 CAMSHAFTS", label: "Freevalve actuation" },
      },
      {
        title: "Wing mirrors, deleted",
        copy: "Slim camera stalks replace the door mirrors, feeding in-cabin screens and shaving drag off the shoulders — a cleaner line, a quieter cabin, sharper aero.",
        image: "/cars/gemera-mirror.jpg",
        stat: { value: "2 CAMERAS", label: "digital side view" },
      },
      {
        title: "Four screens, four passengers",
        copy: "Each occupant gets their own display and climate zone, while the centre console floats twin touchscreens above a wireless-charging deck. A hypercar built to be shared.",
        image: "/cars/gemera-screens.jpg",
        stat: { value: "4 SCREENS", label: "one for every seat" },
      },
    ],
  },
  {
    slug: "huayra",
    name: "Pagani Huayra BC",
    category: "Track Hypercar",
    price: "€3,000,000",
    tagline: "The last of the analogue hypercars.",
    description:
      "Pagani's track-honed masterwork — a hand-built 6.0-litre twin-turbo AMG V12, a carbo-titanium tub, active aerodynamics, and a cabin finished like a Swiss watch, exposed gear linkage and all.",
    image: "/cars/huayra.jpg",
    alt: "Silver Pagani Huayra BC, front head-on in a dark hall",
    /* silver aluminium body: Paint_Material is authored mid-grey (rgb 89), so the
       0.85-metalness repaint reads as bright silver; the big Carbon1 panels keep
       their exposed carbon and RED_PAINT keeps the red pinstripe. */
    paint: "#c9cccd",
    model: {
      url: "/models/huayra.glb",
      repaint: true,
      bodyMaterials: ["Pagani_HuayraBCRoadsterLS_2019Paint_Material"],
      credit: "2020 Pagani Huayra Roadster BC by Ddiaz Design — Sketchfab, CC BY-NC-SA 4.0",
    },
    specs: [
      { value: 800, unit: "HP", label: "Power", detail: "Hand-built AMG 6.0-litre twin-turbo V12." },
      { value: 2.8, decimals: 1, unit: "S", label: "0–100 km/h", detail: "Xtrac 7-speed sequential, rear drive." },
      { value: 350, unit: "KM/H", label: "Top speed", detail: "Downforce-limited — built for corners." },
      { value: 1050, unit: "NM", label: "Torque", detail: "Twin-turbo, near-flat delivery." },
      { value: 6.0, decimals: 1, unit: "L", label: "Displacement", detail: "Twelve cylinders, two turbos, no hybrid." },
      { value: 1250, unit: "KG", label: "Dry weight", detail: "Carbo-titanium monocoque." },
    ],
    gallery: [
      { src: "/cars/huayra-g1.jpg", alt: "Silver Pagani Huayra BC at speed on a road, front three-quarter", caption: "On the move" },
      { src: "/cars/huayra-g2.jpg", alt: "Pagani Huayra BC rear at speed on an open road", caption: "Down the road" },
    ],
    track: [
      { label: "0–100 km/h", value: "2.8 S", note: "Rear drive, sequential box" },
      { label: "Downforce", value: "500+ KG", note: "Active aero, at speed" },
      { label: "Dry weight", value: "1250 KG", note: "Carbo-titanium tub" },
    ],
    highlights: [
      {
        title: "Homologated for the track",
        copy: "Race numbers on the flanks, Pirelli Trofeo R tyres and a rear wing — the BC is the Huayra sharpened into a track weapon that still wears plates.",
        image: "/cars/huayra-track.jpg",
      },
      {
        title: "Gullwing theatre",
        copy: "Both doors swing skyward on gas struts, carbon vanes and all. The Huayra's entrance is choreographed as carefully as its bodywork.",
        image: "/cars/huayra-gullwing.jpg",
      },
      {
        title: "The best view is the last one",
        copy: "Four titanium tailpipes clustered dead centre, a carbon diffuser and hexagonal lights framed by the active wing — the Huayra saves some of its finest theatre for the moment it leaves.",
        image: "/cars/huayra-wind.jpg",
      },
      {
        title: "Aerodynamics that think",
        copy: "Four active flaps and a swan-neck wing trim downforce corner by corner, keeping the BC planted as it disappears down the road.",
        image: "/cars/huayra-aero.jpg",
      },
    ],
    features: [
      {
        title: "800 hp, hand-built by AMG",
        copy: "Mercedes-AMG assembles each V12 by hand for Pagani alone. Twin-turbocharged, naturally theatrical, untouched by any electric motor — the last of a breed.",
        image: "/cars/huayra-engine.jpg",
        stat: { value: "800 HP", label: "6.0 twin-turbo V12" },
      },
      {
        title: "Finished like jewellery",
        copy: "Chromed intake trumpets, machined cam covers and exposed hardware — Pagani treats the engine bay as a display case, not a cover to bolt shut.",
        image: "/cars/huayra-jewel.jpg",
        stat: { value: "BY HAND", label: "machined + polished" },
      },
      {
        title: "Nothing left hidden",
        copy: "Lift the rear clam and the whole car is on show: the V12, the pushrod suspension, the titanium exhaust and the diffuser — every part made to be seen.",
        image: "/cars/huayra-bay.jpg",
        stat: { value: "V12", label: "mid-mounted" },
      },
      {
        title: "A cockpit machined like a watch",
        copy: "Toggle switches, a jewelled instrument binnacle and aluminium milled from solid — every surface finished as if it were the face of a chronograph.",
        image: "/cars/huayra-cockpit.jpg",
        stat: { value: "TOGGLES", label: "aircraft switchgear" },
      },
      {
        title: "Two seats, tailored in leather",
        copy: "Hand-stitched leather over carbon shells and Pagani four-point harnesses, in a colourway chosen by the owner. A cabin built once, for one car.",
        image: "/cars/huayra-cabin.jpg",
        stat: { value: "2 SEATS", label: "bespoke to the owner" },
      },
      {
        title: "Track rubber, road plates",
        copy: "Pirelli Trofeo R tyres, carbon-ceramic Brembos and forged wheels under a road-legal body — a homologated racing car in all but name.",
        image: "/cars/huayra-wheels.jpg",
        stat: { value: "1,250 KG", label: "dry weight" },
      },
      {
        title: "Aero, worked into the body",
        copy: "Front and rear flaps and a swan-neck wing move with speed and braking to keep the BC glued down — without wrecking the lines Horacio drew.",
        image: "/cars/huayra-flaps.jpg",
        stat: { value: "ACTIVE", label: "front + rear flaps" },
      },
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
    image: "/cars/royale-classic-hero.jpg",
    alt: "Blue Bugatti Bolide, low front three-quarter in dramatic light",
    /* model ships in an "X16 Gold" green livery; repaint the body to a brighter,
       more saturated Bugatti blue to match the vivid sky-blue hero + gallery
       photos. The model's only stray accent material is a neon-green
       "SeatBelt" (#00ff00) reused for the harnesses AND the brake/wheel arcs —
       recolour it near-black so nothing fights the blue/dark theme. */
    paint: "#38a8ef",
    model: {
      // wheel-texture green stripes recoloured to near-black (tools/fix-bolide-wheels.mjs);
      // original /models-old/royale.glb left intact.
      url: "/models-old/royale-classic.glb",
      repaint: true,
      bodyMaterials: ["Bugatti_X16Gold_2024Paint_Material.002"],
      recolor: [
        { materials: ["Bugatti_X16Gold_2024SeatBelt_Material.002"], color: "#0c0c0d" },
      ],
      credit: "Bugatti Bolide 2024 — via github.com/Vivekkk-1/3D-Models",
    },
    specs: [
      { value: 1600, unit: "HP", label: "Power", detail: "8.0-litre quad-turbo W16, 1,600 hp @ 7,050 rpm." },
      { value: 2.2, decimals: 1, unit: "S", label: "0–100 km/h", detail: "Track-only, around 1,450 kg." },
      { value: 380, unit: "KM/H", label: "Top speed", detail: "Limited — built for downforce, not vmax." },
      { value: 1450, unit: "KG", label: "Weight", detail: "A road-car W16 in a race-car body." },
      { value: 1600, unit: "NM", label: "Torque", detail: "Four turbochargers, no electrification." },
      { value: 8.0, decimals: 1, unit: "L", label: "Displacement", detail: "Sixteen cylinders." },
      { value: 40, unit: "CARS", label: "Production", detail: "Forty built, each €4 million." },
    ],
    gallery: [
      { src: "/cars/royale-classic-corner.jpg", alt: "Blue Bugatti Bolide cornering on a racetrack", caption: "Into the corner" },
      { src: "/cars/royale-classic-pov.jpg", alt: "View from inside the Bugatti Bolide cockpit, hands on the wheel", caption: "From the seat" },
    ],
    track: [
      { label: "Veloce circuit lap", value: "1:09.8", note: "Track-only, slicks" },
      { label: "Downforce", value: "1800 KG", note: "Claimed peak, full aero" },
      { label: "Power to weight", value: "1103 HP/T", note: "On racing fuel" },
    ],
    highlights: [
      {
        title: "A Le Mans skeleton",
        copy: "Beneath the dimpled skin sit a carbon monocoque and a pair of fixed buckets built to endurance-racing standards — the architecture of a prototype, wearing Bugatti's tailoring.",
        image: "/cars/royale-classic-seats.jpg",
      },
      {
        title: "A cockpit stripped for work",
        copy: "Two carbon seats, a removable wheel and only the controls that matter. Everything the driver needs to lap the car, and not a gram more.",
        image: "/cars/royale-classic-cockpit.jpg",
      },
      {
        title: "Every surface earns its keep",
        copy: "Louvres, ducts and the X-shaped tail channel air from nose to diffuser — turning the bodywork itself into one continuous aerodynamic device.",
        image: "/cars/royale-classic-aero.jpg",
      },
      {
        title: "Forty toys, four million each",
        copy: "A sold-out run of forty, each one laid up and finished by hand — a four-million-euro machine bought to be lapped, never registered.",
        image: "/cars/royale-classic-panel.jpg",
      },
    ],
    features: [
      {
        title: "1,600 PS, race fuel only",
        copy: "The familiar 8.0-litre quad-turbo W16, fed 110-octane and stripped of road-car restraint. Peak torque lands early and holds flat — relentless, with nothing held back.",
        image: "/cars/royale-classic-exhaust.jpg",
        stat: { value: "1,600 HP", label: "on racing fuel" },
      },
      {
        title: "Downforce you can see",
        copy: "A fixed swan-neck wing, a full-length diffuser and Michelin racing slicks turn raw power into grip — up to 1,800 kg of downforce pressing the Bolide into the track.",
        image: "/cars/royale-classic-wing.jpg",
        stat: { value: "1,800 KG", label: "claimed peak downforce" },
      },
      {
        title: "Built to be lapped",
        copy: "No plates, no comfort, no compromise — about 1,450 kg carrying 1,600 PS, a power-to-weight figure straight from the LMP rulebook. A car that exists only for the circuit.",
        image: "/cars/royale-classic-rear.jpg",
        stat: { value: "1,450 KG", label: "track weight" },
      },
      {
        title: "A wheel that runs the car",
        copy: "A removable, motorsport-grade steering wheel carries the car's whole nervous system — paddle shifts, drive modes and a colour telemetry screen — so the W16 is commanded the way a prototype racer would.",
        image: "/cars/royale-classic-wheel.jpg",
        stat: { value: "7-SPEED", label: "sequential dual-clutch" },
      },
    ],
  },
  {
    slug: "furia-classic",
    name: "Ferrari 599XX",
    category: "Track Special",
    price: "€1,400,000",
    tagline: "Not for the road. For the record.",
    description:
      "A track-only car from Ferrari's Corse Clienti programme: the 599's 6.0-litre V12 freed to 700 cv at 9,000 rpm and wrapped in Actiflow active aerodynamics. In 2010 it became the first production-derived car to lap the Nürburgring Nordschleife under seven minutes, at 6:58.16.",
    image: "/cars/furia-classic-headon.jpg",
    alt: "Red Ferrari 599XX, front head-on in the pit complex",
    paint: "#d11a1f",
    model: {
      url: "/models-old/furia.glb",
      repaint: true,
      credit: "Ferrari 599 — via github.com/Vivekkk-1/3D-Models",
    },
    specs: [
      { value: 700, unit: "CV", label: "Power", detail: "6.0-litre naturally-aspirated V12 at 9,000 rpm." },
      { value: 2.9, decimals: 1, unit: "S", label: "0–100 km/h", detail: "60-millisecond race-sequential shifts." },
      { value: 315, unit: "KM/H", label: "Top speed", detail: "Redline-limited — built for downforce, not Vmax." },
      { value: 280, unit: "KG", label: "Downforce", detail: "At 200 km/h; 630 kg at 300 km/h." },
      { value: 6.0, decimals: 1, unit: "L", label: "Displacement", detail: "Tipo F140 V12, track-only tune." },
      { value: 29, unit: "CARS", label: "Programme", detail: "Built for Ferrari's Corse Clienti clients." },
    ],
    gallery: [
      { src: "/cars/furia-classic-track-front.jpg", alt: "Ferrari 599XX cornering on track, front three-quarter", caption: "Through the corner" },
      { src: "/cars/furia-classic-rear.jpg", alt: "Ferrari 599XX rear three-quarter, fixed wing and diffuser", caption: "Wing and diffuser" },
    ],
    track: [
      { label: "Nürburgring Nordschleife", value: "6:58.16", note: "First production-derived car under 7:00 (2010)" },
      { label: "Downforce at 300 km/h", value: "630 KG", note: "280 kg at 200 km/h — Actiflow active aero" },
      { label: "Gearchange", value: "60 MS", note: "Race-sequential transmission" },
    ],
    highlights: [
      {
        title: "Six litres, nine thousand rpm",
        copy: "The 599's 6.0-litre V12 stripped of every restraint — a race-grade valvetrain, freer breathing and 700 cv arriving at a screaming 9,000 rpm.",
        image: "/cars/furia-classic-engine.jpg",
      },
      {
        title: "A dashboard from the pit wall",
        copy: "A digital race display replaces the road car's dials — gear and revs across the top, an on-board performance timer, oil and water temperatures, and the live traction, damper and RACE-mode settings, all read at a glance.",
        image: "/cars/furia-classic-cluster.jpg",
      },
      {
        title: "Caged for the driver",
        copy: "A bolted-in racing seat, a six-point harness and a welded roll cage wrap the cockpit, with a suede-rimmed wheel carrying the controls. Everything that doesn't make the car faster has been stripped out.",
        image: "/cars/furia-classic-cockpit.jpg",
      },
      {
        title: "Actiflow active aerodynamics",
        copy: "A fixed rear wing, an aggressive splitter and the Actiflow system — a porous diffuser and two boot-mounted fans — generate around 280 kg of downforce at 200 km/h, and 630 kg at 300.",
        image: "/cars/furia-classic-rear.jpg",
      },
    ],
    features: [
      {
        title: "A V12 unleashed",
        copy: "Six litres, 700 cv and a race-derived valvetrain spinning to 9,000 rpm. With no emissions or noise limits to meet, the engine breathes exactly as the engineers intended.",
        image: "/cars/furia-classic-track-side.jpg",
        stat: { value: "9,000 RPM", label: "redline" },
      },
      {
        title: "A cockpit stripped for work",
        copy: "Carbon, suede and switchgear in place of comfort — a manettino and rotary controls on a bare console, everything that doesn't make the car faster taken out and caged over.",
        image: "/cars/furia-classic-cabin.jpg",
        stat: { value: "60 MS", label: "race gearshift" },
      },
      {
        title: "A programme, not a model",
        copy: "Twenty-nine cars, built for Ferrari's Corse Clienti programme and maintained by the factory itself. Owners simply turned up; Ferrari ran the cars.",
        image: "/cars/furia-classic-detail.jpg",
        stat: { value: "1,350 KG", label: "stripped weight" },
      },
      {
        title: "A rolling laboratory",
        copy: "Behind the nose, a welded roll cage and banks of data-acquisition electronics fill what would be the luggage bay. The 599XX was Ferrari's rolling test bed — the systems proven here shaped the road cars that followed.",
        image: "/cars/furia-classic-rollcage.jpg",
        stat: { value: "29", label: "development cars" },
      },
    ],
  },
];

export const getCar = (slug: string) => cars.find((c) => c.slug === slug);
