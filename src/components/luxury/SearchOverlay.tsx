import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { products } from "@/lib/products";

type Props = { open: boolean; onClose: () => void };

const collections = [
  { id: "ceylon-sapphire", name: "Ceylon Sapphire Collection", to: "/collections" },
  { id: "pigeon-ruby", name: "Pigeon Blood Rubies", to: "/collections" },
  { id: "muzo-emerald", name: "Muzo Emeralds", to: "/collections" },
];

export function SearchOverlay({ open, onClose }: Props) {
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return { gems: [], jewelry: [], cols: [] as typeof collections };
    const match = (p: typeof products[number]) =>
      p.name.toLowerCase().includes(term) ||
      p.type.toLowerCase().includes(term) ||
      p.color.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.origin.toLowerCase().includes(term);
    return {
      gems: products.filter((p) => p.category === "Gemstone" && match(p)).slice(0, 6),
      jewelry: products.filter((p) => p.category !== "Gemstone" && match(p)).slice(0, 6),
      cols: collections.filter((c) => c.name.toLowerCase().includes(term)),
    };
  }, [q]);

  const empty =
    q.trim() &&
    results.gems.length === 0 &&
    results.jewelry.length === 0 &&
    results.cols.length === 0;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl"
          onClick={onClose}
        >
          <div
            className="mx-auto flex h-full max-w-[1200px] flex-col px-6 pt-24 pb-10 md:px-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <p className="eyebrow">Search the maison</p>
              <button
                onClick={onClose}
                aria-label="Close search"
                className="hover:text-accent transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-8 flex items-center gap-4 border-b border-border pb-4">
              <Search className="h-6 w-6 text-muted-foreground" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Sapphire, ruby, necklace…"
                className="w-full bg-transparent font-display text-3xl md:text-5xl outline-none placeholder:text-muted-foreground/40"
              />
            </div>

            <div className="mt-10 flex-1 overflow-y-auto">
              {!q.trim() && (
                <p className="text-sm text-muted-foreground">
                  Try “sapphire”, “ruby”, “Ceylon”, or “necklace”.
                </p>
              )}

              {empty && (
                <p className="text-sm text-muted-foreground">
                  No matches for “{q}”. Write to our atelier for private enquiries.
                </p>
              )}

              {results.cols.length > 0 && (
                <Section title="Collections">
                  {results.cols.map((c) => (
                    <Link
                      key={c.id}
                      to={c.to}
                      onClick={onClose}
                      className="block py-3 border-b border-border/50 text-sm hover:text-accent"
                    >
                      {c.name}
                    </Link>
                  ))}
                </Section>
              )}

              {results.gems.length > 0 && (
                <Section title="Gemstones">
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {results.gems.map((p) => (
                      <ResultCard key={p.id} p={p} onClose={onClose} />
                    ))}
                  </div>
                </Section>
              )}

              {results.jewelry.length > 0 && (
                <Section title="Jewelry">
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {results.jewelry.map((p) => (
                      <ResultCard key={p.id} p={p} onClose={onClose} />
                    ))}
                  </div>
                </Section>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <p className="eyebrow mb-4">{title}</p>
      {children}
    </div>
  );
}

function ResultCard({
  p,
  onClose,
}: {
  p: (typeof products)[number];
  onClose: () => void;
}) {
  return (
    <Link
      to="/product/$id"
      params={{ id: p.id }}
      onClick={onClose}
      className="group block"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={p.images[0]}
          alt={p.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="mt-3">
        <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          {p.category} · {p.origin}
        </p>
        <p className="mt-1 font-display text-lg">{p.name}</p>
      </div>
    </Link>
  );
}
