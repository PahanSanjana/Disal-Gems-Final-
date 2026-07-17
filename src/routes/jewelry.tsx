import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Heart, X, SlidersHorizontal, ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/luxury/Navbar";
import { Footer } from "@/components/luxury/Footer";
import {
  jewelryProducts,
  jewelryFilterOptions,
  formatPrice,
  type Product,
} from "@/lib/products";
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
      {
        property: "og:description",
        content: "Heirloom Ceylon jewelry hand-crafted in Sri Lanka.",
      },
    ],
  }),
  component: JewelryPage,
});

type Facet = keyof typeof jewelryFilterOptions;
type FiltersState = Record<Facet, string[]>;

const emptyFilters: FiltersState = {
  category: [],
  type: [],
  metal: [],
  collection: [],
  gender: [],
  availability: [],
};

const shortDesc = (p: Product) =>
  `${p.metal ?? ""} · ${p.type} · ${p.origin}`.replace(/^ · /, "");

function JewelryPage() {
  const [filters, setFilters] = useState<FiltersState>(emptyFilters);
  const [price, setPrice] = useState<[number, number]>([0, 40000]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"featured" | "priceAsc" | "priceDesc" | "name">(
    "featured"
  );
  const [openMobile, setOpenMobile] = useState(false);
  const wish = useWishlist();

  const filtered = useMemo(() => {
    let list = jewelryProducts.filter((p) => {
      for (const key of Object.keys(filters) as Facet[]) {
        const sel = filters[key];
        if (!sel.length) continue;
        const value = (p as unknown as Record<string, string | undefined>)[key];
        if (!value || !sel.includes(value)) return false;
      }
      if (p.priceUSD < price[0] || p.priceUSD > price[1]) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const hay = `${p.name} ${p.type} ${p.metal ?? ""} ${p.collection ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    switch (sort) {
      case "priceAsc":
        list = [...list].sort((a, b) => a.priceUSD - b.priceUSD);
        break;
      case "priceDesc":
        list = [...list].sort((a, b) => b.priceUSD - a.priceUSD);
        break;
      case "name":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return list;
  }, [filters, price, query, sort]);

  function toggle(facet: Facet, value: string) {
    setFilters((prev) => {
      const cur = prev[facet];
      return {
        ...prev,
        [facet]: cur.includes(value)
          ? cur.filter((v) => v !== value)
          : [...cur, value],
      };
    });
  }

  function reset() {
    setFilters(emptyFilters);
    setPrice([0, 40000]);
    setQuery("");
    setSort("featured");
  }

  const activeCount =
    Object.values(filters).reduce((n, arr) => n + arr.length, 0) +
    (price[0] > 0 || price[1] < 40000 ? 1 : 0);

  const Filters = (
    <div className="space-y-10">
      <div>
        <p className="eyebrow">Search</p>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search jewelry…"
          className="mt-3 w-full border-b border-border bg-transparent py-2 text-sm focus:border-accent focus:outline-none"
        />
      </div>

      {(Object.keys(jewelryFilterOptions) as Facet[]).map((facet) => (
        <div key={facet}>
          <div className="flex items-center justify-between">
            <p className="eyebrow">{facet}</p>
            {filters[facet].length > 0 && (
              <button
                onClick={() => setFilters((p) => ({ ...p, [facet]: [] }))}
                className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground hover:text-accent"
              >
                Clear
              </button>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {jewelryFilterOptions[facet].map((opt) => {
              const active = filters[facet].includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => toggle(facet, opt)}
                  className={`border px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] transition-colors ${
                    active
                      ? "border-onyx bg-onyx text-ivory"
                      : "border-border text-foreground/70 hover:border-accent hover:text-accent"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div>
        <p className="eyebrow">Price (USD)</p>
        <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
          <span>${price[0].toLocaleString()}</span>
          <input
            type="range"
            min={0}
            max={40000}
            step={500}
            value={price[1]}
            onChange={(e) => setPrice([price[0], parseInt(e.target.value)])}
            className="w-full accent-[color:var(--color-gold)]"
          />
          <span>${price[1].toLocaleString()}</span>
        </div>
      </div>

      <button
        onClick={reset}
        className="w-full border border-onyx/30 px-6 py-3 text-[11px] uppercase tracking-[0.24em] hover:border-accent hover:text-accent"
      >
        Reset all
      </button>
    </div>
  );

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
        <div className="grid gap-14 lg:grid-cols-12">
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-28">{Filters}</div>
          </aside>

          <div className="lg:hidden mb-2 flex items-center justify-between">
            <button
              onClick={() => setOpenMobile(true)}
              className="inline-flex items-center gap-2 border border-onyx/30 px-4 py-2 text-[11px] uppercase tracking-[0.22em]"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
              {activeCount > 0 && (
                <span className="ml-1 rounded-full bg-accent px-2 py-0.5 text-onyx text-[10px]">
                  {activeCount}
                </span>
              )}
            </button>
            <p className="text-xs text-muted-foreground">
              {filtered.length} of {jewelryProducts.length}
            </p>
          </div>

          {openMobile && (
            <div className="fixed inset-0 z-50 bg-background lg:hidden overflow-y-auto">
              <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                <p className="font-display text-2xl">Filters</p>
                <button onClick={() => setOpenMobile(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6">{Filters}</div>
              <div className="sticky bottom-0 border-t border-border bg-background p-4">
                <button
                  onClick={() => setOpenMobile(false)}
                  className="w-full bg-onyx px-6 py-4 text-[11px] uppercase tracking-[0.28em] text-ivory"
                >
                  Show {filtered.length} results
                </button>
              </div>
            </div>
          )}

          <div className="lg:col-span-9">
            <div className="hidden lg:flex items-center justify-between pb-6">
              <p className="text-xs text-muted-foreground">
                {filtered.length} pieces
              </p>
              <label className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground flex items-center gap-3">
                Sort
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                  className="border-b border-border bg-transparent py-1 focus:border-accent focus:outline-none text-foreground"
                >
                  <option value="featured">Featured</option>
                  <option value="priceAsc">Price · Low to High</option>
                  <option value="priceDesc">Price · High to Low</option>
                  <option value="name">Name A–Z</option>
                </select>
              </label>
            </div>

            {filtered.length === 0 ? (
              <div className="border border-dashed border-border py-24 text-center">
                <p className="font-display text-2xl">Nothing matches.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Loosen a filter, or ask our atelier to commission it.
                </p>
                <button
                  onClick={reset}
                  className="mt-6 border border-onyx/30 px-6 py-3 text-[11px] uppercase tracking-[0.24em] hover:border-accent hover:text-accent"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((p) => {
                  const wished = wish.has(p.id);
                  return (
                    <div key={p.id} className="group block">
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        <Link to="/product/$id" params={{ id: p.id }}>
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
                          />
                        </Link>
                        {p.availability && (
                          <div className="absolute left-3 top-3 bg-ivory/90 px-2 py-1 text-[9px] uppercase tracking-[0.24em]">
                            {p.availability}
                          </div>
                        )}
                        <button
                          onClick={() => wish.toggle(p.id)}
                          aria-label="Wishlist"
                          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/90 backdrop-blur transition-colors ${
                            wished ? "text-accent" : "text-onyx hover:text-accent"
                          }`}
                        >
                          <Heart
                            className={`h-4 w-4 ${wished ? "fill-accent" : ""}`}
                          />
                        </button>
                      </div>
                      <div className="mt-5">
                        <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                          {p.category} · {p.collection ?? "Maison"}
                        </p>
                        <div className="mt-2 flex items-start justify-between gap-4">
                          <Link
                            to="/product/$id"
                            params={{ id: p.id }}
                            className="font-display text-xl leading-tight gold-underline"
                          >
                            {p.name}
                          </Link>
                          <span className="text-[11px] uppercase tracking-[0.24em] text-accent whitespace-nowrap">
                            {formatPrice(p.priceUSD)}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {shortDesc(p)}
                        </p>
                        <Link
                          to="/product/$id"
                          params={{ id: p.id }}
                          className="mt-4 inline-flex items-center gap-2 border-b border-onyx/40 pb-1 text-[10px] uppercase tracking-[0.28em] transition-colors hover:border-accent hover:text-accent"
                        >
                          View details
                          <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
