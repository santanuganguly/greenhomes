export interface BlueprintLayer {
  index: string;
  title: string;
  subtitle: string;
  key: "full" | "walls" | "floor" | "roof" | "pillars" | "stairs" | "openings";
}

export const BRAND_NAME = "GREEN HOMES";
export const BRAND_PARENT = "By Green Hill Group";
export const BRAND_TAGLINE = "From Land to Landmark.";
export const BRAND_SUBTITLE =
  "Design-to-build turnkey home construction in Siliguri and North Bengal. Transparent pricing, 470+ quality checks, on-time delivery.";

export const CONTACT_INFO = {
  phoneDisplay: "+91 9046665257",
  phoneHref: "tel:+919046665257",
  whatsappPrimaryHref: "https://wa.me/919046665254",
  whatsappConsultHref:
    "https://wa.me/919046665257?text=Hi%2C%20I%20would%20like%20to%20discuss%20a%20turnkey%20home%20construction%20project",
  email: "contact@thegreen.homes",
  emailHref: "mailto:contact@thegreen.homes",
  officeAddress:
    "5th Floor Centerio Building, near Payel Cinema Hall, Sevoke Road, Siliguri, 734001",
  officeHours: "Mon–Sat · 10:00 AM – 7:00 PM IST",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=26.728583,88.430222",
  dashboardUrl: "https://app.thegreen.homes",
  parentGroupUrl: "https://greenhillgroup.in",
  facebookUrl: "https://www.facebook.com/profile.php?id=61593082011180",
  instagramUrl: "https://www.instagram.com/greenhomessprojects/",
  legalEntity: "DARSH INFRACOM LLP",
};

export const BLUEPRINT_LAYERS: BlueprintLayer[] = [
  {
    index: "01",
    title: "Full Turnkey Structure",
    subtitle: "2D/3D architectural plans, municipal approvals & single-point engineering",
    key: "full",
  },
  {
    index: "02",
    title: "Walls & Masonry",
    subtitle: "Standard & premium brickwork, plastering, waterproofing & damp protection",
    key: "walls",
  },
  {
    index: "03",
    title: "Slabs & Plinth",
    subtitle: "Design-mix concrete slabs & soil-tested foundation milestones",
    key: "floor",
  },
  {
    index: "04",
    title: "Roof & Parapet",
    subtitle: "Weatherproofed terrace slab, heat-shield coating & parapet finishes",
    key: "roof",
  },
  {
    index: "05",
    title: "IS 1893 RCC Frame",
    subtitle: "Seismic-compliant pillars with tested Fe550 structural steel",
    key: "pillars",
  },
  {
    index: "06",
    title: "Staircases & Core",
    subtitle: "Precision shuttered vertical circulation verified at every floor",
    key: "stairs",
  },
  {
    index: "07",
    title: "Openings & MEP",
    subtitle: "Doors, windows, concealed plumbing & 3-phase electrical continuity",
    key: "openings",
  },
];

export type PhotoVariant =
  | "hero-villa"
  | "about-home-daytime"
  | "about-home-evening"
  | "service-home-construction"
  | "service-renovation"
  | "service-commercial"
  | "service-consultation";

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function withBasePath(path: string): string {
  return `${BASE_PATH}${path}`;
}

export interface PhotoMeta {
  src: string;
  webp: string;
  webp640: string;
  width: number;
  height: number;
}

export const PHOTO_META: Record<PhotoVariant, PhotoMeta> = {
  "hero-villa": {
    src: withBasePath("/images/hero-villa.jpg"),
    webp: withBasePath("/images/hero-villa.webp"),
    webp640: withBasePath("/images/hero-villa-640.webp"),
    width: 1024,
    height: 685,
  },
  "about-home-daytime": {
    src: withBasePath("/images/about-home-daytime.jpg"),
    webp: withBasePath("/images/about-home-daytime.webp"),
    webp640: withBasePath("/images/about-home-daytime-640.webp"),
    width: 1024,
    height: 682,
  },
  "about-home-evening": {
    src: withBasePath("/images/about-home-evening.jpg"),
    webp: withBasePath("/images/about-home-evening.webp"),
    webp640: withBasePath("/images/about-home-evening-640.webp"),
    width: 682,
    height: 1024,
  },
  "service-home-construction": {
    src: withBasePath("/images/service-home-construction.jpg"),
    webp: withBasePath("/images/service-home-construction.webp"),
    webp640: withBasePath("/images/service-home-construction-640.webp"),
    width: 819,
    height: 1024,
  },
  "service-renovation": {
    src: withBasePath("/images/service-renovation.jpg"),
    webp: withBasePath("/images/service-renovation.webp"),
    webp640: withBasePath("/images/service-renovation-640.webp"),
    width: 1024,
    height: 680,
  },
  "service-commercial": {
    src: withBasePath("/images/service-commercial.jpg"),
    webp: withBasePath("/images/service-commercial.webp"),
    webp640: withBasePath("/images/service-commercial-640.webp"),
    width: 1024,
    height: 683,
  },
  "service-consultation": {
    src: withBasePath("/images/service-consultation.jpg"),
    webp: withBasePath("/images/service-consultation.webp"),
    webp640: withBasePath("/images/service-consultation-640.webp"),
    width: 1024,
    height: 685,
  },
};

export const PHOTO_SOURCES: Record<PhotoVariant, string> = {
  "hero-villa": PHOTO_META["hero-villa"].src,
  "about-home-daytime": PHOTO_META["about-home-daytime"].src,
  "about-home-evening": PHOTO_META["about-home-evening"].src,
  "service-home-construction": PHOTO_META["service-home-construction"].src,
  "service-renovation": PHOTO_META["service-renovation"].src,
  "service-commercial": PHOTO_META["service-commercial"].src,
  "service-consultation": PHOTO_META["service-consultation"].src,
};

export const ABOUT_SLIDES: { variant: PhotoVariant; alt: string; caption: string }[] = [
  {
    variant: "about-home-daytime",
    alt: "Modern residential home courtyard and exterior in North Bengal",
    caption: "Daylight courtyard & sliding glazing",
  },
  {
    variant: "about-home-evening",
    alt: "Turnkey custom villa architecture in Siliguri at dusk",
    caption: "Evening architectural lighting & timber soffits",
  },
  {
    variant: "service-home-construction",
    alt: "Multi-story residential home construction in North Bengal",
    caption: "On-site RCC structure & slab execution",
  },
  {
    variant: "service-renovation",
    alt: "Modern residential kitchen renovation and remodeling",
    caption: "Modular kitchen & interior modernization",
  },
  {
    variant: "service-commercial",
    alt: "Modern corporate office interior construction and fit-out",
    caption: "Commercial glass partitions & fit-out",
  },
  {
    variant: "service-consultation",
    alt: "Turnkey commercial and residential architecture in North Bengal",
    caption: "Precision facade & structural elevation",
  },
  {
    variant: "hero-villa",
    alt: "Modern luxury custom villa design and construction in Siliguri",
    caption: "Turnkey custom villa elevation",
  },
];

export const APPROACH_PILLARS = [
  {
    title: "Thoughtful Planning",
    description: "Every detail is considered before construction begins.",
  },
  {
    title: "Dedicated Management",
    description: "We coordinate materials, teams, and on-site work.",
  },
  {
    title: "Complete Transparency",
    description: "Clear costing and regular project updates.",
  },
  {
    title: "Quality at Every Stage",
    description: "Attention to workmanship and finishing throughout.",
  },
];

export const FOUR_PROMISES = [
  {
    number: "01",
    title: "Transparent pricing",
    description:
      "Per-sqft rates and a complete bill of materials up front. No surprise change orders, ever.",
    metric: "Locked BOM",
  },
  {
    number: "02",
    title: "Quality at every stage",
    description:
      "470+ documented quality checks per floor, with photos and sign-offs in your dashboard.",
    metric: "470+ Checks",
  },
  {
    number: "03",
    title: "On-time handover",
    description:
      "Milestone-tracked schedule with daily site photos. Delays trigger credit, not excuses.",
    metric: "Delay Credit",
  },
  {
    number: "04",
    title: "5 years warranty",
    description:
      "Complete peace of mind with a comprehensive 5-year warranty on structure and workmanship for your home.",
    metric: "5-Year Cover",
  },
];

export interface TurnkeyService {
  id: "home" | "renovation" | "commercial";
  eyebrow: string;
  lines: [string, string];
  title: string;
  copy: string;
  tags: string;
  variant: PhotoVariant;
  alt: string;
  ctaLabel: string;
  checklist: string[];
}

export const TURNKEY_SERVICES: TurnkeyService[] = [
  {
    id: "home",
    eyebrow: "01 · Home Construction",
    lines: ["Design-to-build", "custom homes."],
    title: "Residential Construction",
    copy: "Villas, duplexes, and independent bungalows built on your land with a locked per-sqft contract and a certified project engineer from site survey to key handover.",
    tags: "2D/3D Plans · IS 1893 Seismic Design · SMC/SJDA Sanctions · 5-Year Warranty",
    variant: "service-home-construction",
    alt: "Multi-story residential home construction in North Bengal",
    ctaLabel: "Explore home builds",
    checklist: [
      "2D architectural layouts & 3D elevations",
      "IS 1893 seismic-compliant structural design",
      "SMC and regional municipal sanction drawings",
      "Tested Fe550 steel & design-mix concrete",
      "Daily progress photos & inspection logs",
      "470 documented quality checks per floor",
      "5-year written structural warranty",
      "Documented till we hand you the house",
    ],
  },
  {
    id: "renovation",
    eyebrow: "02 · Renovation & Remodeling",
    lines: ["Structural upgrades", "& modern layouts."],
    title: "Renovation & Vertical Expansion",
    copy: "Upgrade your old house with extra rooms, pillar strengthening, modern layouts, waterproofing, and complete repairs — all managed smoothly room by room.",
    tags: "Pillar Strengthening · Extra Floors · Waterproofing · Minimal Disruption",
    variant: "service-renovation",
    alt: "Modern residential kitchen renovation and remodeling",
    ctaLabel: "Plan a renovation",
    checklist: [
      "Safety checks & pillar strengthening before adding new floors",
      "Adding extra floors & covered terraces to expand your living space",
      "Complete bathroom & kitchen modernization",
      "Modern front makeovers & complete waterproofing against damp walls",
      "Re-wiring, concealed plumbing & drainage",
      "Heat & noise protection to keep rooms cooler and quieter",
      "Restoring old family homes without losing their original charm",
      "Room-by-room work so your family can keep living inside comfortably",
    ],
  },
  {
    id: "commercial",
    eyebrow: "03 · Commercial Construction",
    lines: ["Offices, clinics", "& retail builds."],
    title: "Commercial Construction",
    copy: "Retail stores, clinics, corporate offices, and commercial complexes built on time and compliant with West Bengal fire safety and building bylaws.",
    tags: "HVAC & 3-Phase Power · Fire Compliance · SJDA Approvals · Floor-by-Floor Handover",
    variant: "service-commercial",
    alt: "Modern corporate office interior construction and fit-out",
    ctaLabel: "Review commercial work",
    checklist: [
      "Site survey & commercial viability analysis",
      "Bylaw-compliant architectural design",
      "HVAC ducting & 3-phase electrical installation",
      "Fire detection & emergency exit compliance",
      "Commercial plumbing & sanitary infrastructure",
      "Floor-by-floor handover so your business can open early",
      "SJDA and municipal statutory approvals",
      "Ongoing building maintenance even after we hand over the keys",
    ],
  },
];

export interface ProcessStep {
  num: string;
  code: string;
  title: string;
  summary: string;
  deliverables: string[];
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    num: "01",
    code: "Stage 01 · Requirement",
    title: "Share your requirement",
    summary:
      "20-minute call or a quick form. We listen first, no sales pitch. You tell us about your plot, your family, your must-haves, and your timeline.",
    deliverables: [
      "20-minute discovery call or form",
      "Plot, family & timeline review",
      "Honest fit & feasibility assessment",
    ],
  },
  {
    num: "02",
    code: "Stage 02 · Design",
    title: "Site visit & design",
    summary:
      "Our architect visits the plot, measures, and prepares concept drawings and 2D/3D plans. Two rounds of revisions are included before we lock the design.",
    deliverables: [
      "On-site plot inspection & measurements",
      "Concept drawings & 2D/3D floor plans",
      "Two revision rounds included",
    ],
  },
  {
    num: "03",
    code: "Stage 03 · Contract",
    title: "Fixed-price contract",
    summary:
      "You receive a per-sqft quote with a complete bill of materials, a milestone payment schedule, and a guaranteed handover date with a named project manager.",
    deliverables: [
      "Per-sqft quote with complete bill of materials",
      "Milestone-based payment schedule",
      "Named project manager & handover date",
    ],
  },
  {
    num: "04",
    code: "Stage 04 · Construction",
    title: "Construction",
    summary:
      "Daily site photos and weekly quality-check reports land in your dashboard. Material deliveries are photographed on arrival and payments release only on your sign-off.",
    deliverables: [
      "Daily site photos & weekly quality reports",
      "Delivery verification photographs",
      "Payments release only after your sign-off",
    ],
  },
  {
    num: "05",
    code: "Stage 05 · Audit",
    title: "Independent quality audit",
    summary:
      "Before handover, an independent auditor runs 470+ quality checks covering concrete, steel, plumbing pressure, electrical, waterproofing, and finishes.",
    deliverables: [
      "470+ independent quality check points",
      "Concrete, plumbing, electrical & waterproofing",
      "All snags rectified at our cost",
    ],
  },
  {
    num: "06",
    code: "Stage 06 · Handover",
    title: "Move in & warranty",
    summary:
      "Keys, appliance manuals, finish schedules, and warranty cards — backed by a comprehensive 5-year warranty and a direct phone line to your PM for year one.",
    deliverables: [
      "Keys, appliance manuals & finish schedules",
      "Comprehensive 5-year warranty",
      "Direct phone line to your PM for year one",
    ],
  },
];

export const ESTIMATOR_TYPES = [
  { id: "2BHK", title: "2 BHK", sub: "~1,000–1,300 sqft", defaultSqft: 1200 },
  { id: "3BHK", title: "3 BHK", sub: "~1,500–2,000 sqft", defaultSqft: 1800 },
  { id: "4BHK+", title: "4 BHK +", sub: "~2,500+ sqft", defaultSqft: 2600 },
  { id: "villa", title: "Villa", sub: "3 floors, custom", defaultSqft: 3200 },
  { id: "duplex", title: "Duplex", sub: "2 units, 1 plot", defaultSqft: 2800 },
  { id: "custom", title: "Custom / other", sub: "Tell us more", defaultSqft: 2000 },
] as const;

export const ESTIMATOR_PACKAGES = [
  {
    id: "essential",
    name: "Essential Plan",
    rate: 1950,
    popular: false,
    bullets: [
      "Affordable, Reliable & Functional",
      "Standard brick, sand & cement",
      "Inclusive of GST",
    ],
  },
  {
    id: "comfort",
    name: "Comfort Plan",
    rate: 2100,
    popular: true,
    bullets: [
      "Balanced Design & Quality",
      "Premium sand, cement & steel",
      "Inclusive of GST",
    ],
  },
  {
    id: "elegance",
    name: "Elegance Plan",
    rate: 2250,
    popular: false,
    bullets: [
      "Stylish, High Quality Finishes",
      "Full modular kitchen & chimneys",
      "Inclusive of GST",
    ],
  },
  {
    id: "signature",
    name: "Signature Plan",
    rate: 2500,
    popular: false,
    bullets: [
      "Premium Stylish & High Quality Finishes",
      "Smart home automation & luxury fittings",
      "Inclusive of GST",
    ],
  },
] as const;

export const ESTIMATOR_CITIES = [
  "Siliguri",
  "Matigara",
  "Bagdogra",
  "Jalpaiguri",
  "Malbazar",
  "Alipurduar",
  "Darjeeling",
  "Kurseong",
  "Kalimpong",
  "Other",
] as const;

export const FAQ_ITEMS = [
  {
    question: "What is included in a per-sqft quote?",
    answer:
      "Everything: design, materials, labor, plumbing & electrical, doors & windows, finishes, and project management. We send a line-item breakdown with your contract so you can see exactly what you are paying for.",
  },
  {
    question: "Do I need to have an architectural plan ready before contacting Green Homes?",
    answer:
      "No. Green Homes can help you with the planning and design process, subject to the agreed scope of services.",
  },
  {
    question: "How are payments structured?",
    answer:
      "Milestone-based: a small booking amount, then payments tied to foundation, plinth, lintel, slab, and handover. We do not ask for large advances.",
  },
  {
    question: "Do you handle permits and approvals?",
    answer:
      "Yes, building permits, municipal drawings, and structural-engineer certification. We work with your local body in Siliguri, Jalpaiguri, and Darjeeling district.",
  },
  {
    question: "What about quality checks?",
    answer:
      "470+ checks per floor: concrete grade, steel binding, plumbing pressure, electrical continuity, waterproofing, and finish. Every check is photographed and uploaded to your dashboard.",
  },
  {
    question: "How long does a typical home take?",
    answer:
      "A 2,000 sqft home in our Classic package typically takes 7 to 9 months from breaking ground, weather permitting. Your contract states a guaranteed handover date with delay credits.",
  },
  {
    question: "Can I supply my own materials?",
    answer:
      "Yes, with our quality team signing off on each batch. We will adjust your contract accordingly. Most clients prefer our supply chain, as it is usually 8 to 12% cheaper than buying retail.",
  },
  {
    question: "What warranty do you offer?",
    answer:
      "A 5-year warranty on structure and workmanship, along with manufacturer warranties on hardware and fittings, all transferable.",
  },
  {
    question: "Do you work outside Siliguri?",
    answer:
      "Yes, across North Bengal: Jalpaiguri, Malbazar, Alipurduar, Darjeeling, Kurseong, Kalimpong, and the Dooars. Travel is included in contracts above 1,800 sqft.",
  },
];
