import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, ArrowUpRight, X } from "lucide-react";
import { Navbar } from "@/components/luxury/Navbar";
import { Footer } from "@/components/luxury/Footer";
import { useWishlist } from "@/lib/store";
import { findProduct, formatPrice } from "@/lib/products";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — Disal Ceylon Gems & Jewelry" }] }),
  component: WishlistPage,
});

function WishlistPage() {
  const wish = useWishlist();
  const { user } = useAuth();
  const items = wish.ids.map(findProduct).filter(Boolean) as NonNullable<
    ReturnType<typeof findProduct>
  >[];

  return (
    <div className="bg-background text-foreground">
      <Navbar />
      <section className="mx-auto max-w-[1400px] px-6 pt-40 pb-24 md:px-10">
        <div className="flex items-end justify-between border-b border-border pb-8 mb-14">
          <div>
            <p className="eyebrow">Your wishlist</p>
            <h1 className="mt-3 font-display text-5xl md:text-6xl">Saved pieces</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {user
                ? "Synced to your account. Available on any device you sign in from."
                : "Saved on this device. Sign in to sync across devices."}
            </p>
          </div>
          {!user && (
            <Link
              to="/auth"
              className="hidden md:inline-flex items-center gap-2 border border-onyx/30 px-6 py-3 text-[11px] uppercase tracking-[0.24em] hover:border-accent hover:text-accent"
            >
              Sign in to sync
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          )}
        </div>

        {items.length === 0 ? (
          <div className="py-24 text-center">
            <Heart className="mx-auto h-8 w-8 text-muted-foreground" strokeWidth={1} />
            <h2 className="mt-6 font-display text-3xl">Nothing saved yet.</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Save gemstones and jewelry as you browse — they'll wait here.
            </p>
            <div className="mt-10 flex justify-center gap-3">
              <Link
                to="/gemstones"
                className="border border-onyx/30 px-6 py-3 text-[11px] uppercase tracking-[0.24em] hover:border-accent hover:text-accent"
              >
                Browse gemstones
              </Link>
              <Link
                to="/jewelry"
                className="border border-onyx/30 px-6 py-3 text-[11px] uppercase tracking-[0.24em] hover:border-accent hover:text-accent"
              >
                Browse jewelry
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
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
                  <button
                    onClick={() => wish.remove(p.id)}
                    aria-label="Remove from wishlist"
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/90 text-onyx hover:text-accent"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-5">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                    {p.category} · {p.origin}
                  </p>
                  <div className="mt-2 flex items-start justify-between gap-4">
                    <Link
                      to="/product/$id"
                      params={{ id: p.id }}
                      className="font-display text-xl gold-underline"
                    >
                      {p.name}
                    </Link>
                    <span className="text-[11px] uppercase tracking-[0.24em] text-accent whitespace-nowrap">
                      {formatPrice(p.priceUSD)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
