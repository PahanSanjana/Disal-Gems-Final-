import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Navbar } from "@/components/luxury/Navbar";
import { Footer } from "@/components/luxury/Footer";
import { useGemstones, formatPrice } from "@/lib/products";

export const Route = createFileRoute("/gemstones")({
  head: () => ({
    meta: [
      { title: "Gemstones — Disal Ceylon Gems & Jewelry" },
      {
        name: "description",
        content:
          "Rare Ceylon sapphires, Mogok rubies, Muzo emeralds and more — every gemstone in the Disal vault, updated live from our atelier.",
      },
    ],
  }),
  component: GemstonesPage,
});

function GemstonesPage() {
  const items = useGemstones();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("");

  const categories = useMemo(() => {
    if (!items) return [];
    return Array.from(new Set(items.map((i) => i.category).filter(Boolean))) as string[];
  }, [items]);

  const filtered = useMemo(() => {
    if (!items) return [];
    const s = q.trim().toLowerCase();
    return items.filter((p) => {
      if (cat && p.category !== cat) return false;
      if (!s) return true;
      const hay = `${p.name} ${p.category ?? ""} ${p.origin ?? ""} ${p.color ?? ""} ${p.shape ?? ""}`.toLowerCase();
      return hay.includes(s);
    });
  }, [items, q, cat]);

  return (
    <div className="bg-background text-foreground">
      <Navbar />

      <section className="mx-auto max-w-[1400px] px-6 pt-40 pb-10 md:px-10">
        <p className="eyebrow">The Marketplace</p>
        <h1 className="mt-4 font-display text-5xl md:text-7xl leading-[1.02] text-balance max-w-3xl">
          Gemstones — held by the light.
        </h1>
        <p className="mt-6 max-w-lg text-sm text-muted-foreground">
          Loose stones from Disal's private vault. Every gem is certified and
          traceable to its origin.
        </p>
      </section>

      <div className="hairline mx-6 md:mx-10" />

      <section className="mx-auto max-w-[1400px] px-6 py-14 md:px-10">
        <div className="mb-10 flex flex-wrap items-center gap-4 justify-between">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search gemstones…"
            className="w-full max-w-sm border-b border-border bg-transparent py-2 text-sm focus:border-accent focus:outline-none"
          />
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <FilterChip active={cat === ""} onClick={() => setCat("")}>All</FilterChip>
              {categories.map((c) => (
                <FilterChip key={c} active={cat === c} onClick={() => setCat(c)}>
                  {c}
                </FilterChip>
              ))}
            </div>
          )}
        </div>

        {items === null ? (
          <div className="py-24 text-center text-sm text-muted-foreground">Loading the vault…</div>
        ) : filtered.length === 0 ? (
          <div className="border border-dashed border-border py-24 text-center">
            <p className="font-display text-2xl">
              {items.length === 0 ? "The vault is being curated." : "No stones match."}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {items.length === 0
                ? "New gemstones will appear here as our atelier adds them."
                : "Try a different search, or ask our atelier to source it for you."}
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <Link
                key={p.id}
                to="/product/$id"
                params={{ id: p.id }}
                className="group block"
              >
                <div className="relative aspect-square overflow-hidden bg-muted">
                  {p.imageUrls[0] ? (
                    <img
                      src={p.imageUrls[0]}
                      alt={p.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                      No image
                    </div>
                  )}
                  {p.certificate && (
                    <div className="absolute left-3 top-3 bg-ivory/90 px-2 py-1 text-[9px] uppercase tracking-[0.24em]">
                      {p.certificate}
                    </div>
                  )}
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-xl leading-tight">{p.name}</h3>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                      {[p.carat ? `${p.carat} ct` : null, p.shape, p.origin]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.24em] text-accent whitespace-nowrap">
                    {formatPrice(p.price)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`border px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] transition-colors ${
        active
          ? "border-onyx bg-onyx text-ivory"
          : "border-border text-foreground/70 hover:border-accent hover:text-accent"
      }`}
    >
      {children}
    </button>
  );
}
