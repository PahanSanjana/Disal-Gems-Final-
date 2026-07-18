import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Heart } from "lucide-react";
import { Navbar } from "@/components/luxury/Navbar";
import { Footer } from "@/components/luxury/Footer";
import { useJewelry, formatPrice } from "@/lib/products";
import { useWishlist } from "@/lib/store";

export const Route = createFileRoute("/jewelry")({
  head: () => ({
    meta: [
      { title: "Jewelry — Disal Ceylon Gems & Jewelry" },
      {
        name: "description",
        content:
          "Heirloom Ceylon jewelry — sapphire rings, emerald pendants, ruby earrings and diamond bracelets, hand-crafted in Sri Lanka.",
      },
      { property: "og:title", content: "Jewelry — Disal Ceylon Gems & Jewelry" },
      { property: "og:description", content: "Heirloom Ceylon jewelry hand-crafted in Sri Lanka." },
    ],
  }),
  component: JewelryPage,
});

function JewelryPage() {
  const items = useJewelry();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("");
  const wish = useWishlist();

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
      const hay = `${p.name} ${p.category ?? ""} ${p.metal ?? ""} ${p.gemstoneType ?? ""}`.toLowerCase();
      return hay.includes(s);
    });
  }, [items, q, cat]);

  return (
    <div className="bg-background text-foreground">
      <Navbar />

      <section className="mx-auto max-w-[1400px] px-6 pt-40 pb-10 md:px-10">
        <p className="eyebrow">The Maison</p>
        <h1 className="mt-4 font-display text-5xl md:text-7xl leading-[1.02] text-balance max-w-3xl">
          Jewelry — the stone, finished.
        </h1>
        <p className="mt-6 max-w-lg text-sm text-muted-foreground">
          Rings, necklaces, earrings and bracelets — each hand-set in our
          Colombo atelier around a single, certified Ceylon gemstone.
        </p>
      </section>

      <div className="hairline mx-6 md:mx-10" />

      <section className="mx-auto max-w-[1400px] px-6 py-14 md:px-10">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search jewelry…"
            className="w-full max-w-sm border-b border-border bg-transparent py-2 text-sm focus:border-accent focus:outline-none"
          />
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Chip active={cat === ""} onClick={() => setCat("")}>All</Chip>
              {categories.map((c) => (
                <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>
              ))}
            </div>
          )}
        </div>

        {items === null ? (
          <div className="py-24 text-center text-sm text-muted-foreground">Loading the atelier…</div>
        ) : filtered.length === 0 ? (
          <div className="border border-dashed border-border py-24 text-center">
            <p className="font-display text-2xl">
              {items.length === 0 ? "The atelier is preparing its first pieces." : "Nothing matches."}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {items.length === 0
                ? "New jewelry will appear here as it is finished."
                : "Try a different search."}
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => {
              const wished = wish.has(p.id);
              return (
                <div key={p.id} className="group block">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <Link to="/product/$id" params={{ id: p.id }}>
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
                    </Link>
                    <button
                      onClick={() =>
                        wish.toggle({
                          id: p.id,
                          kind: "jewelry",
                          name: p.name,
                          priceUSD: p.price,
                          image: p.imageUrls[0] ?? "",
                        })
                      }
                      aria-label="Wishlist"
                      className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/90 ${
                        wished ? "text-accent" : "text-onyx hover:text-accent"
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${wished ? "fill-accent" : ""}`} />
                    </button>
                  </div>
                  <Link to="/product/$id" params={{ id: p.id }} className="block">
                    <div className="mt-5 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-xl leading-tight">{p.name}</h3>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                          {[p.category, p.metal].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                      <span className="text-[11px] uppercase tracking-[0.24em] text-accent whitespace-nowrap">
                        {formatPrice(p.price)}
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

function Chip({
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
