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
    highlights: [
      {
        title: "One hundred years, forty cars",
        copy: "Built to mark the centenary of Ferruccio Lamborghini's birth, the Centenario ran to just forty cars — twenty coupés, twenty roadsters — every one sold before the covers came off.",
        image: "/cars/giallo-gt.jpg",
      },
      {
        title: "The last great atmospheric V12",
        copy: "Six and a half litres, 770 hp, 8,500 rpm — no turbos, no electric assistance. One of the final naturally-aspirated V12s Lamborghini would ever build.",
        image: "/cars/giallo-gt-g1.jpg",
      },
      {
        title: "A bare carbon monocoque",
        copy: "Body and tub alike are finished in exposed carbon fibre. The Centenario is a design study made real — a concept car you are allowed to drive.",
        image: "/cars/giallo-gt-g2.jpg",
      },
      {
        title: "It steers from the rear, too",
        copy: "Rear-wheel steering turns the back wheels against the fronts to shrink the car in tight corners, then with them to plant it on the straight.",
        image: "/cars/giallo-gt.jpg",
      },
    ],
    features: [
      {
        title: "770 hp, naturally aspirated",
        copy: "The most powerful V12 Lamborghini had built at the time draws breath through twelve throttle bodies and revs to 8,500 rpm — the engine that defined the marque, at its peak.",
        image: "/cars/giallo-gt-g1.jpg",
        stat: { value: "770 HP", label: "at 8,500 rpm" },
      },
      {
        title: "Rear-wheel steering",
        copy: "Below 60 km/h the rear axle counter-steers for agility; above it the wheels align for stability. The result is a 4.9-metre hypercar that hides its size in your hands.",
        image: "/cars/giallo-gt-g2.jpg",
        stat: { value: "2.8 S", label: "0–100 km/h" },
      },
      {
        title: "A rolling design manifesto",
        copy: "Hexagonal motifs, a glass cover over the V12 and a body sculpted in raw carbon previewed the language Lamborghini's later cars would speak — built in a run of just forty.",
        image: "/cars/giallo-gt.jpg",
        stat: { value: "40", label: "cars built" },
      },
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
    highlights: [
      {
        title: "A Huracán's heart",
        copy: "Mid-mounted behind the cabin is the same 5.2-litre V10 as the Lamborghini Huracán — exotic noise and response, in a car calm enough for the daily commute.",
        image: "/cars/notte-v10-night.jpg",
      },
      {
        title: "Naturally aspirated, to 8,700 rpm",
        copy: "No turbos, no hybrid, no synthesised sound. Just ten cylinders climbing to a 8,700 rpm howl — one of the last supercars to make power the old way.",
        image: "/cars/notte-v10-g1.jpg",
      },
      {
        title: "quattro, all the time",
        copy: "Permanent all-wheel drive turns a 610 hp supercar into something you can use in the cold, in the wet, on the school run — confidence the rivals reserve for dry days.",
        image: "/cars/notte-v10-g2.jpg",
      },
      {
        title: "An aluminium-and-carbon spaceframe",
        copy: "The Audi Space Frame mixes aluminium and carbon to stay light and rigid without theatre, giving the R8 its trademark composure at any speed.",
        image: "/cars/notte-v10-night.jpg",
      },
    ],
    features: [
      {
        title: "Ten cylinders, no turbos",
        copy: "The 5.2-litre V10 sits low and central, breathing naturally to 8,700 rpm. It is the same unit that powers Lamborghini's Huracán — and one of the last of its breed on sale.",
        image: "/cars/notte-v10-g1.jpg",
        stat: { value: "8,700 RPM", label: "redline" },
      },
      {
        title: "Everyday all-wheel drive",
        copy: "quattro sends torque to whichever axle has grip, so the R8 launches to 100 km/h in 3.2 seconds and does it again in the rain, without drama or waiting for summer.",
        image: "/cars/notte-v10-g2.jpg",
        stat: { value: "3.2 S", label: "0–100 km/h" },
      },
      {
        title: "Built beside the race car",
        copy: "The road R8 shares its assembly line and much of its structure with the R8 LMS GT3 that races worldwide — a rare case of the showroom car and the racer being true siblings.",
        image: "/cars/notte-v10-night.jpg",
        stat: { value: "610 HP", label: "at 8,250 rpm" },
      },
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
    highlights: [
      {
        title: "Under two seconds, claimed",
        copy: "Tesla quotes 1.9 seconds to 60 mph — a figure that would out-drag almost anything with a fuel cap, delivered in silence and without a gearchange.",
        image: "/cars/volt-zero.jpg",
      },
      {
        title: "A thousand kilometres a charge",
        copy: "A claimed 1,000 km of range turns the supercar from a weekend indulgence into something you could genuinely live with, every day of the week.",
        image: "/cars/volt-zero-2.jpg",
      },
      {
        title: "Three motors, all-wheel drive",
        copy: "One motor at the front, two at the rear, torque-vectored across the axle — instant, relentless thrust that never pauses to shift or catch its breath.",
        image: "/cars/volt-zero-3.jpg",
      },
      {
        title: "Silent by design",
        copy: "No exhaust, no gearbox, no emissions. The Roadster makes its case with a wall of torque from zero rpm and the quiet that comes with it.",
        image: "/cars/volt-zero.jpg",
      },
    ],
    features: [
      {
        title: "Instant torque, all of it",
        copy: "Electric motors make peak twist from a standstill — no revving, no waiting. Tesla quotes 10,000 Nm measured at the wheels, which is what flings the Roadster down the road.",
        image: "/cars/volt-zero-2.jpg",
        stat: { value: "10,000 NM", label: "wheel torque" },
      },
      {
        title: "Range without compromise",
        copy: "A large battery laid flat in the floor gives a claimed 1,000 km and drops the centre of gravity below anything with a fuel tank — so it corners as hard as it accelerates.",
        image: "/cars/volt-zero-3.jpg",
        stat: { value: "1,000 KM", label: "claimed range" },
      },
      {
        title: "Zero at the tailpipe",
        copy: "There is no tailpipe. The only thing the Roadster leaves behind is the air it shoves aside — performance and a clean conscience in the same package.",
        image: "/cars/volt-zero.jpg",
        stat: { value: "0", label: "tailpipe emissions" },
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
    highlights: [
      {
        title: "The W16, with the leash off",
        copy: "Track-only means no road rules: 1,600 PS on racing fuel, no electrification, no speed limiter. The same quad-turbo W16, freed of every compromise the road imposes.",
        image: "/cars/royale-classic.jpg",
      },
      {
        title: "A Le Mans skeleton",
        copy: "Beneath the dimpled skin is a carbon monocoque built to endurance-racing standards — the architecture of a prototype, wearing Bugatti's tailoring.",
        image: "/cars/royale-2.jpg",
      },
      {
        title: "Forty toys, four million each",
        copy: "A tiny, sold-out run of pure track cars for Bugatti's most committed owners — a machine bought to be lapped, never registered.",
        image: "/cars/royale-3.jpg",
      },
      {
        title: "The numbers of a prototype",
        copy: "1,600 PS in roughly 1,450 kg gives a power-to-weight figure from the LMP rulebook — straight-line and cornering performance a road W16 can only dream of.",
        image: "/cars/royale-classic.jpg",
      },
    ],
    features: [
      {
        title: "1,600 PS, race fuel only",
        copy: "The familiar 8.0-litre quad-turbo W16, fed 110-octane and stripped of road-car restraint. Peak torque lands early and holds flat — relentless, with nothing held back.",
        image: "/cars/royale-2.jpg",
        stat: { value: "1,600 HP", label: "on racing fuel" },
      },
      {
        title: "Morphable aero skin",
        copy: "The roof scoop's surface raises a field of dimples at speed to cut drag, then smooths at low speed for cooling — active aerodynamics with no moving parts to fail.",
        image: "/cars/royale-3.jpg",
        stat: { value: "1,800 KG", label: "claimed peak downforce" },
      },
      {
        title: "Stripped to the essential",
        copy: "No infotainment, no luxury, no excess — a carbon shell, a roll structure and the W16. Every kilogram that does not make it faster has been left behind.",
        image: "/cars/royale-classic.jpg",
        stat: { value: "1,450 KG", label: "track weight" },
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
    highlights: [
      {
        title: "Not for the road, for the record",
        copy: "A track-only client car, never road-registered. The 599XX was among the first road-derived machines to lap the Nürburgring Nordschleife under seven minutes.",
        image: "/cars/furia-classic.jpg",
      },
      {
        title: "Six litres, nine thousand rpm",
        copy: "The road car's V12 stripped of every restraint — a race-grade bottom end, freer breathing and a ceiling raised to a screaming 9,000 rpm.",
        image: "/cars/furia-2.jpg",
      },
      {
        title: "Aero borrowed from the pit lane",
        copy: "A fixed rear wing, aggressive splitter and managed underbody trade road manners for genuine downforce — this car was shaped by the stopwatch, not the showroom.",
        image: "/cars/furia-3.jpg",
      },
      {
        title: "A laboratory on slicks",
        copy: "The 599XX was Ferrari's rolling test bed; the electronics and aerodynamics proven here went on to shape the road cars that followed.",
        image: "/cars/furia-classic.jpg",
      },
    ],
    features: [
      {
        title: "A V12 unleashed",
        copy: "Six litres, 700 hp and a race-derived valvetrain spinning to 9,000 rpm. With no emissions or noise limits to meet, the engine breathes exactly as the engineers wanted.",
        image: "/cars/furia-2.jpg",
        stat: { value: "9,000 RPM", label: "redline" },
      },
      {
        title: "Actiflow aerodynamics",
        copy: "Fender vents and a rear-mounted fan actively managed airflow for around 280 kg of downforce at 200 km/h — and far more at full speed — keeping the car planted through fast corners.",
        image: "/cars/furia-3.jpg",
        stat: { value: "280 KG", label: "downforce at 200 km/h" },
      },
      {
        title: "A programme, not a model",
        copy: "Twenty-nine cars, built for a track-only client programme and maintained by Ferrari itself. Owners simply turned up; the factory ran the cars.",
        image: "/cars/furia-classic.jpg",
        stat: { value: "1,350 KG", label: "stripped weight" },
      },
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
    highlights: [
      {
        title: "The legend is the engine",
        copy: "The 2JZ-GTE: a cast-iron 3.0-litre straight-six so over-built it shrugs off four-figure power on its standard block. No engine has earned more respect from tuners.",
        image: "/cars/tempesta-v12-classic.jpg",
      },
      {
        title: "Sequential twin turbos",
        copy: "Two turbochargers hand off one to the next — the first for low-down response, the second for top-end punch — giving boost early and a torque curve that barely dips.",
        image: "/cars/tempesta-v12-2.jpg",
      },
      {
        title: "The tuner's holy grail",
        copy: "No car has been modified more often or more famously. The A80 is the blank canvas of the import scene, as desirable stock as it is built.",
        image: "/cars/tempesta-v12-3.jpg",
      },
      {
        title: "Front engine, rear drive, basket handle",
        copy: "A classic grand-touring layout under that unmistakable basket-handle wing — long bonnet, driven rear wheels, and balance that flatters every driver.",
        image: "/cars/tempesta-v12-classic.jpg",
      },
    ],
    features: [
      {
        title: "An engine built for ten times its job",
        copy: "The 2JZ's closed-deck iron block and forged internals were engineered with enormous margin. Where it left the factory at 326 hp, tuners routinely find 1,000-plus on the original block.",
        image: "/cars/tempesta-v12-2.jpg",
        stat: { value: "1,000+ HP", label: "on the standard block" },
      },
      {
        title: "Sequential boost",
        copy: "The twin turbos spool in sequence — one for instant response, the second taking over up top — so torque arrives early and never sags through the rev range.",
        image: "/cars/tempesta-v12-3.jpg",
        stat: { value: "451 NM", label: "near-flat delivery" },
      },
      {
        title: "Built like an anvil",
        copy: "A Getrag six-speed manual, rear-drive balance and a deliberately over-engineered chassis are why the A80 became a thirty-year icon rather than a footnote.",
        image: "/cars/tempesta-v12-classic.jpg",
        stat: { value: "1,570 KG", label: "kerb weight" },
      },
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
    highlights: [
      {
        title: "Old-school, on purpose",
        copy: "Styled, tuned and trimmed to look, sound and feel like a 1970 muscle car — riding on thoroughly modern underpinnings that the period car could never have dreamed of.",
        image: "/cars/notte-v10-classic.jpg",
      },
      {
        title: "The Shaker hood",
        copy: "A cold-air scoop bolted straight to the engine pokes through the bonnet and shakes with every blip of the V8 — function and theatre in one defiantly retro gesture.",
        image: "/cars/notte-v10-2.jpg",
      },
      {
        title: "HEMI V8, the real thing",
        copy: "5.7 litres of hemispherical-head V8 delivering the lazy, bottomless low-end shove that only big American iron provides — and a soundtrack to match.",
        image: "/cars/notte-v10-3.jpg",
      },
      {
        title: "Two tonnes of attitude",
        copy: "Big, heavy and utterly unbothered. The Challenger drives exactly the way it looks — a wide-shouldered coupé that makes no apology for any of it.",
        image: "/cars/notte-v10-classic.jpg",
      },
    ],
    features: [
      {
        title: "5.7 litres of HEMI",
        copy: "Two valves per cylinder, hemispherical combustion chambers and a fat, early-arriving torque curve. The numbers are honest; the noise is the entire point.",
        image: "/cars/notte-v10-2.jpg",
        stat: { value: "556 NM", label: "low-end torque" },
      },
      {
        title: "The Shaker, back from 1970",
        copy: "The scoop is mounted to the engine, not the bonnet, so it shudders visibly with every throttle blip — a faithful revival of a muscle-car icon that genuinely feeds cold air to the intake.",
        image: "/cars/notte-v10-3.jpg",
        stat: { value: "375 HP", label: "5.7 HEMI V8" },
      },
      {
        title: "Retro by design",
        copy: "The proportions, the deep-set gauges and the planted stance are all deliberately period-correct. The Challenger is modern only where it has to be — and old-school everywhere it counts.",
        image: "/cars/notte-v10-classic.jpg",
        stat: { value: "1,880 KG", label: "kerb weight" },
      },
    ],
  },
];

export const getCar = (slug: string) => cars.find((c) => c.slug === slug);
