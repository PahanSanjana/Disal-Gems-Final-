import sapphireImg from "@/assets/collection-sapphire.jpg";
import emeraldImg from "@/assets/collection-emerald.jpg";
import rubyImg from "@/assets/collection-ruby.jpg";
import craftImg from "@/assets/craftsmanship.jpg";
import heroSecondary from "@/assets/hero-secondary.jpg";

export type Product = {
  id: string;
  name: string;
  category: "Gemstone" | "Ring" | "Necklace" | "Earrings" | "Bracelet";
  type: "Sapphire" | "Ruby" | "Emerald" | "Diamond" | "Padparadscha" | "Alexandrite";
  color: string;
  shape: "Oval" | "Cushion" | "Round" | "Emerald Cut" | "Pear" | "Marquise";
  carat: number;
  origin: "Ceylon" | "Mogok" | "Muzo" | "Kashmir" | "Madagascar";
  treatment: "None" | "Heat" | "Minor";
  certification: "GIA" | "Gübelin" | "SSEF" | "GRS";
  priceUSD: number;
  images: string[];
  description: string;
  specs: Record<string, string>;
  // Jewelry-only optional fields
  metal?: "18k Yellow Gold" | "18k White Gold" | "18k Rose Gold" | "Platinum";
  gender?: "Women" | "Men" | "Unisex";
  collection?: "Ratnapura Blues" | "Ember" | "Muzo Archive" | "Heritage";
  availability?: "In Stock" | "Made to Order" | "On Request";
};

const IMG = [sapphireImg, emeraldImg, rubyImg, craftImg, heroSecondary];

export const products: Product[] = [
  {
    id: "cs-342",
    name: "Ceylon Blue Sapphire",
    category: "Gemstone",
    type: "Sapphire",
    color: "Royal Blue",
    shape: "Oval",
    carat: 3.42,
    origin: "Ceylon",
    treatment: "Heat",
    certification: "GIA",
    priceUSD: 18500,
    images: [sapphireImg, heroSecondary, craftImg],
    description:
      "A vivid royal-blue Ceylon sapphire from the ancient riverbeds of Ratnapura. Brilliant crown, exceptional saturation, cut to reveal its full velvet glow.",
    specs: {
      Clarity: "VVS",
      Cut: "Brilliant",
      Dimensions: "9.8 × 7.6 × 5.1 mm",
      Refractive: "1.762 – 1.770",
    },
  },
  {
    id: "pr-218",
    name: "Pigeon Blood Ruby",
    category: "Gemstone",
    type: "Ruby",
    color: "Pigeon Blood",
    shape: "Cushion",
    carat: 2.18,
    origin: "Mogok",
    treatment: "None",
    certification: "Gübelin",
    priceUSD: 42000,
    images: [rubyImg, craftImg, sapphireImg],
    description:
      "An untreated Mogok ruby of exceptional pedigree — the coveted 'pigeon blood' red, warmed by a subtle inner fluorescence.",
    specs: {
      Clarity: "VS",
      Cut: "Cushion Brilliant",
      Dimensions: "7.6 × 6.9 × 4.2 mm",
      Fluorescence: "Strong Red",
    },
  },
  {
    id: "em-405",
    name: "Muzo Emerald",
    category: "Gemstone",
    type: "Emerald",
    color: "Vivid Green",
    shape: "Emerald Cut",
    carat: 4.05,
    origin: "Muzo",
    treatment: "Minor",
    certification: "SSEF",
    priceUSD: 24500,
    images: [emeraldImg, heroSecondary, sapphireImg],
    description:
      "Colombian emerald from the legendary Muzo mine, cut in a classic step to preserve maximum weight and reveal the crystal's clarity.",
    specs: {
      Clarity: "SI",
      Cut: "Step / Emerald",
      Dimensions: "10.4 × 8.1 × 5.6 mm",
      Origin: "Muzo, Colombia",
    },
  },
  {
    id: "pd-155",
    name: "Padparadscha Sapphire",
    category: "Gemstone",
    type: "Padparadscha",
    color: "Pink-Orange",
    shape: "Oval",
    carat: 1.55,
    origin: "Ceylon",
    treatment: "None",
    certification: "GRS",
    priceUSD: 32000,
    images: [sapphireImg, craftImg, rubyImg],
    description:
      "A rare unheated padparadscha — the sunset of Sri Lanka held inside a single crystal. Delicate pink-orange, luminous and warm.",
    specs: {
      Clarity: "VVS",
      Cut: "Oval Brilliant",
      Dimensions: "7.1 × 5.8 × 3.9 mm",
      Fluorescence: "Weak",
    },
  },
  {
    id: "rg-sap-01",
    name: "Sapphire Solitaire Ring",
    category: "Ring",
    type: "Sapphire",
    color: "Royal Blue",
    shape: "Oval",
    carat: 2.8,
    origin: "Ceylon",
    treatment: "Heat",
    certification: "GIA",
    priceUSD: 12800,
    images: [sapphireImg, heroSecondary],
    description:
      "Hand-forged 18k white gold band cradling a Ceylon sapphire. A quiet architecture around a singular stone.",
    specs: {
      Metal: "18k White Gold",
      "Band Width": "2.4 mm",
      Setting: "Six-prong",
      Size: "US 6 (resizable)",
    },
    metal: "18k White Gold",
    gender: "Women",
    collection: "Ratnapura Blues",
    availability: "In Stock",
  },
  {
    id: "nk-em-01",
    name: "Emerald Pendant",
    category: "Necklace",
    type: "Emerald",
    color: "Vivid Green",
    shape: "Pear",
    carat: 1.9,
    origin: "Muzo",
    treatment: "Minor",
    certification: "SSEF",
    priceUSD: 9600,
    images: [emeraldImg, craftImg],
    description:
      "A single pear-cut Muzo emerald suspended on a whisper-thin 18k gold chain. Understated, luminous, endlessly wearable.",
    specs: {
      Metal: "18k Yellow Gold",
      "Chain Length": "42 cm",
      Setting: "Bezel",
    },
    metal: "18k Yellow Gold",
    gender: "Women",
    collection: "Muzo Archive",
    availability: "In Stock",
  },
  {
    id: "er-ruby-01",
    name: "Ruby Drop Earrings",
    category: "Earrings",
    type: "Ruby",
    color: "Pigeon Blood",
    shape: "Pear",
    carat: 2.4,
    origin: "Mogok",
    treatment: "Heat",
    certification: "GRS",
    priceUSD: 15400,
    images: [rubyImg, heroSecondary],
    description:
      "A matched pair of pear-cut rubies, hand-set with a barely-there halo of old-cut diamonds.",
    specs: {
      Metal: "18k Rose Gold",
      "Diamond Total": "0.32 ct",
      Closure: "Lever back",
    },
    metal: "18k Rose Gold",
    gender: "Women",
    collection: "Ember",
    availability: "Made to Order",
  },
  {
    id: "br-di-01",
    name: "Old Mine Diamond Bracelet",
    category: "Bracelet",
    type: "Diamond",
    color: "White",
    shape: "Round",
    carat: 5.8,
    origin: "Madagascar",
    treatment: "None",
    certification: "GIA",
    priceUSD: 28900,
    images: [heroSecondary, craftImg],
    description:
      "Twenty-two hand-cut old mine diamonds in a fluid line, articulated to move like silk against the wrist.",
    specs: {
      Metal: "Platinum",
      Length: "17.5 cm",
      Closure: "Hidden box clasp",
    },
    metal: "Platinum",
    gender: "Unisex",
    collection: "Heritage",
    availability: "On Request",
  },
];

export const gemstoneProducts = products.filter((p) => p.category === "Gemstone");
export const jewelryProducts = products.filter((p) => p.category !== "Gemstone");

export const findProduct = (id: string) => products.find((p) => p.id === id);

export function formatPrice(usd: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(usd);
}

export const filterOptions = {
  type: ["Sapphire", "Ruby", "Emerald", "Diamond", "Padparadscha", "Alexandrite"],
  color: ["Royal Blue", "Pigeon Blood", "Vivid Green", "Pink-Orange", "White"],
  shape: ["Oval", "Cushion", "Round", "Emerald Cut", "Pear", "Marquise"],
  origin: ["Ceylon", "Mogok", "Muzo", "Kashmir", "Madagascar"],
  treatment: ["None", "Heat", "Minor"],
  certification: ["GIA", "Gübelin", "SSEF", "GRS"],
} as const;

export const jewelryFilterOptions = {
  category: ["Ring", "Necklace", "Earrings", "Bracelet"],
  type: ["Sapphire", "Ruby", "Emerald", "Diamond", "Padparadscha", "Alexandrite"],
  metal: ["18k Yellow Gold", "18k White Gold", "18k Rose Gold", "Platinum"],
  collection: ["Ratnapura Blues", "Ember", "Muzo Archive", "Heritage"],
  gender: ["Women", "Men", "Unisex"],
  availability: ["In Stock", "Made to Order", "On Request"],
} as const;

export { IMG };
