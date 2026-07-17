import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminGate } from "@/components/admin/AdminShell";
import { createItem, uploadImages } from "@/lib/firestore-products";
import sapphireImg from "@/assets/collection-sapphire.jpg";
import emeraldImg from "@/assets/collection-emerald.jpg";
import rubyImg from "@/assets/collection-ruby.jpg";
import craftImg from "@/assets/craftsmanship.jpg";
import heroSecondary from "@/assets/hero-secondary.jpg";

export const Route = createFileRoute("/admin/seed")({
  head: () => ({ meta: [{ title: "Seed Data — Admin" }] }),
  component: () => (
    <AdminGate>
      <SeedPage />
    </AdminGate>
  ),
});

const GEMSTONE_SEED = [
  {
    name: "Ceylon Blue Sapphire",
    description:
      "A vivid royal-blue Ceylon sapphire from the ancient riverbeds of Ratnapura. Brilliant crown, exceptional saturation, cut to reveal its full velvet glow.",
    price: 18500,
    category: "Sapphire",
    origin: "Ceylon",
    carat: 3.42,
    shape: "Oval",
    color: "Royal Blue",
    cut: "Brilliant",
    clarity: "VVS",
    treatment: "Heat",
    certificate: "GIA",
    stock: 1,
    src: [sapphireImg, heroSecondary, craftImg],
  },
  {
    name: "Pigeon Blood Ruby",
    description:
      "An untreated Mogok ruby of exceptional pedigree — the coveted 'pigeon blood' red, warmed by a subtle inner fluorescence.",
    price: 42000,
    category: "Ruby",
    origin: "Mogok",
    carat: 2.18,
    shape: "Cushion",
    color: "Pigeon Blood",
    cut: "Cushion Brilliant",
    clarity: "VS",
    treatment: "None",
    certificate: "Gübelin",
    stock: 1,
    src: [rubyImg, craftImg, sapphireImg],
  },
  {
    name: "Muzo Emerald",
    description:
      "Colombian emerald from the legendary Muzo mine, cut in a classic step to preserve maximum weight and reveal the crystal's clarity.",
    price: 24500,
    category: "Emerald",
    origin: "Muzo",
    carat: 4.05,
    shape: "Emerald Cut",
    color: "Vivid Green",
    cut: "Step",
    clarity: "SI",
    treatment: "Minor",
    certificate: "SSEF",
    stock: 1,
    src: [emeraldImg, heroSecondary, sapphireImg],
  },
  {
    name: "Padparadscha Sapphire",
    description:
      "A rare unheated padparadscha — the sunset of Sri Lanka held inside a single crystal. Delicate pink-orange, luminous and warm.",
    price: 32000,
    category: "Sapphire",
    origin: "Ceylon",
    carat: 1.55,
    shape: "Oval",
    color: "Pink-Orange",
    cut: "Oval Brilliant",
    clarity: "VVS",
    treatment: "None",
    certificate: "GRS",
    stock: 1,
    src: [sapphireImg, craftImg, rubyImg],
  },
];

const JEWELRY_SEED = [
  {
    name: "Sapphire Solitaire Ring",
    description:
      "Hand-forged 18k white gold band cradling a Ceylon sapphire. A quiet architecture around a singular stone.",
    price: 12800,
    category: "Ring",
    metal: "18k White Gold",
    gemstoneType: "Sapphire",
    size: "US 6 (resizable)",
    stock: 1,
    src: [sapphireImg, heroSecondary],
  },
  {
    name: "Emerald Pendant",
    description:
      "A single pear-cut Muzo emerald suspended on a whisper-thin 18k gold chain.",
    price: 9600,
    category: "Necklace",
    metal: "18k Yellow Gold",
    gemstoneType: "Emerald",
    size: "42 cm chain",
    stock: 1,
    src: [emeraldImg, craftImg],
  },
  {
    name: "Ruby Drop Earrings",
    description: "A matched pair of pear-cut rubies, hand-set with a barely-there halo of old-cut diamonds.",
    price: 15400,
    category: "Earrings",
    metal: "18k Rose Gold",
    gemstoneType: "Ruby",
    size: "Lever back",
    stock: 1,
    src: [rubyImg, heroSecondary],
  },
  {
    name: "Old Mine Diamond Bracelet",
    description: "Twenty-two hand-cut old mine diamonds in a fluid line.",
    price: 28900,
    category: "Bracelet",
    metal: "Platinum",
    gemstoneType: "Diamond",
    size: "17.5 cm",
    stock: 1,
    src: [heroSecondary, craftImg],
  },
];

function SeedPage() {
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  function push(s: string) {
    setLog((l) => [...l, s]);
  }

  async function urlToFile(url: string, name: string): Promise<File> {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], name, { type: blob.type });
  }

  async function run() {
    setBusy(true);
    setLog([]);
    try {
      for (const g of GEMSTONE_SEED) {
        push(`Uploading images for ${g.name}…`);
        const files = await Promise.all(
          g.src.map((u, i) => urlToFile(u, `${g.name.replace(/\s+/g, "-")}-${i}.jpg`))
        );
        const urls = await uploadImages("products/gemstones", files);
        const { src, ...rest } = g;
        await createItem("gemstones", { ...rest, imageUrls: urls });
        push(`✓ ${g.name}`);
      }
      for (const j of JEWELRY_SEED) {
        push(`Uploading images for ${j.name}…`);
        const files = await Promise.all(
          j.src.map((u, i) => urlToFile(u, `${j.name.replace(/\s+/g, "-")}-${i}.jpg`))
        );
        const urls = await uploadImages("products/jewelry", files);
        const { src, ...rest } = j;
        await createItem("jewelry", { ...rest, imageUrls: urls });
        push(`✓ ${j.name}`);
      }
      push("Seed complete.");
    } catch (e: any) {
      push(`Error: ${e?.message || e}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="border-b border-border pb-6">
        <p className="eyebrow">One-time</p>
        <h1 className="mt-2 font-display text-4xl">Seed products</h1>
        <p className="mt-3 text-sm text-muted-foreground max-w-2xl">
          Uploads the bundled sample gemstone and jewelry images into Firebase
          Storage and creates matching Firestore documents. Safe to run once;
          running twice will create duplicates.
        </p>
      </div>

      <button
        onClick={run}
        disabled={busy}
        className="mt-8 bg-onyx px-8 py-4 text-[11px] uppercase tracking-[0.28em] text-ivory hover:bg-onyx/90 disabled:opacity-50"
      >
        {busy ? "Seeding…" : "Run seed"}
      </button>

      {log.length > 0 && (
        <pre className="mt-8 border border-border p-4 text-xs bg-muted/30 overflow-auto max-h-96">
          {log.join("\n")}
        </pre>
      )}
    </div>
  );
}
