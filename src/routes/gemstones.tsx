import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { Navbar } from "@/components/luxury/Navbar";
import { Footer } from "@/components/luxury/Footer";
import { gemstoneProducts, filterOptions, formatPrice } from "@/lib/products";

export const Route = createFileRoute("/gemstones")({
  head: () => ({
    meta: [
      { title: "Gemstones — Disal Ceylon Gems & Jewelry" },
      {
        name: "description",
        content:
          "Rare Ceylon sapphires, Mogok rubies, Muzo emeralds and more — filter by type, color, shape, carat, origin, treatment and certification.",
      },
    ],
  }),
  component: GemstonesPage,
});

type Facet = keyof typeof filterOptions;
type FiltersState = Record<Facet, string[]>;

const emptyFilters: FiltersState = {
  type: [],
  color: [],
  shape: [],
  origin: [],
  treatment: [],
  certification: [],
};

function GemstonesPage() {
  const [filters, setFilters] = useState<FiltersState>(emptyFilters);
  const [carat, setCarat] = useState<[number, number]>([0, 10]);
  const [price, setPrice] = useState<[number, number]>([0, 100000]);
  const [openMobile, setOpenMobile] = useState(false);

  const filtered = useMemo(() => {
    return gemstoneProducts.filter((p) => {
      for (const key of Object.keys(filters) as Facet[]) {
        const sel = filters[key];
        if (sel.length && !sel.includes(p[key as keyof typeof p] as string)) {
          return false;
        }
      }
      if (p.carat < carat[0] || p.carat > carat[1]) return false;
      if (p.priceUSD < price[0] || p.priceUSD > price[1]) return false;
      return true;
    });
  }, [filters, carat, price]);

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
    setCarat([0, 10]);
    setPrice([0, 100000]);
  }

  const activeCount =
    Object.values(filters).reduce((n, arr) => n + arr.length, 0) +
    (carat[0] > 0 || carat[1] < 10 ? 1 : 0) +
    (price[0] > 0 || price[1] < 100000 ? 1 : 0);

  const Filters = (
    <div className="space-y-10">
      {(Object.keys(filterOptions) as Facet[]).map((facet) => (
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
            {filterOptions[facet].map((opt) => {
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
        <p className="eyebrow">Carat</p>
        <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
          <span>{carat[0].toFixed(1)}</span>
          <input
            type="range"
            min={0}
            max={10}
            step={0.1}
            value={carat[1]}
            onChange={(e) => setCarat([carat[0], parseFloat(e.target.value)])}
            className="w-full accent-[color:var(--color-gold)]"
          />
          <span>{carat[1].toFixed(1)}</span>
        </div>
      </div>

      <div>
        <p className="eyebrow">Price (USD)</p>
        <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
          <span>${price[0].toLocaleString()}</span>
          <input
            type="range"
            min={0}
            max={100000}
            step={1000}
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
        <div className="grid gap-14 lg:grid-cols-12">
          {/* SIDEBAR */}
          <aside className="hidden lg:col-span-3 lg:block">
            <div className="sticky top-28">{Filters}</div>
          </aside>

          {/* MOBILE FILTERS TOGGLE */}
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
              {filtered.length} of {gemstoneProducts.length}
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

          {/* GRID */}
          <div className="lg:col-span-9">
            <div className="hidden lg:flex items-center justify-between pb-6">
              <p className="text-xs text-muted-foreground">
                {filtered.length} stones
              </p>
            </div>

            {filtered.length === 0 ? (
              <div className="border border-dashed border-border py-24 text-center">
                <p className="font-display text-2xl">No stones match.</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try loosening a filter, or ask our atelier to source it for you.
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
                {filtered.map((p) => (
                  <Link
                    key={p.id}
                    to="/product/$id"
                    params={{ id: p.id }}
                    className="group block"
                  >
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
                      />
                      <div className="absolute left-3 top-3 bg-ivory/90 px-2 py-1 text-[9px] uppercase tracking-[0.24em]">
                        {p.certification}
                      </div>
                    </div>
                    <div className="mt-5 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-xl leading-tight">
                          {p.name}
                        </h3>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                          {p.carat} ct · {p.shape} · {p.origin}
                        </p>
                      </div>
                      <span className="text-[11px] uppercase tracking-[0.24em] text-accent whitespace-nowrap">
                        {formatPrice(p.priceUSD)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
