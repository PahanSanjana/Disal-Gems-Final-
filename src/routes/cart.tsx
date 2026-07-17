import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, X, ArrowUpRight, ShoppingBag } from "lucide-react";
import { Navbar } from "@/components/luxury/Navbar";
import { Footer } from "@/components/luxury/Footer";
import { useCart } from "@/lib/store";
import { formatPrice } from "@/lib/products";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [{ title: "Your Cart — Disal Ceylon Gems & Jewelry" }],
  }),
  component: CartPage,
});

function CartPage() {
  const cart = useCart();

  return (
    <div className="bg-background text-foreground">
      <Navbar />
      <section className="mx-auto max-w-[1400px] px-6 pt-32 pb-24 md:px-10">
        <div className="flex items-end justify-between mb-14 border-b border-border pb-8">
          <div>
            <p className="eyebrow">Your selection</p>
            <h1 className="mt-3 font-display text-5xl md:text-6xl">
              The Vault
            </h1>
          </div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            {cart.count} {cart.count === 1 ? "piece" : "pieces"}
          </p>
        </div>

        {cart.items.length === 0 ? (
          <div className="py-24 text-center">
            <ShoppingBag className="mx-auto h-8 w-8 text-muted-foreground" strokeWidth={1} />
            <h2 className="mt-6 font-display text-3xl">Your vault is empty.</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              The finest pieces of Ceylon await your eye.
            </p>
            <Link
              to="/gemstones"
              className="mt-10 inline-flex items-center gap-3 border border-onyx/30 px-8 py-4 text-[11px] uppercase tracking-[0.28em] hover:border-accent hover:text-accent"
            >
              Discover gemstones
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <ul className="divide-y divide-border">
                {cart.items.map((item) => (
                  <li key={item.id} className="flex gap-6 py-8">
                    <Link
                      to="/product/$id"
                      params={{ id: item.id }}
                      className="block w-28 sm:w-36 aspect-square overflow-hidden bg-muted flex-shrink-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </Link>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <Link
                            to="/product/$id"
                            params={{ id: item.id }}
                            className="font-display text-2xl gold-underline"
                          >
                            {item.name}
                          </Link>
                          <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                            Ref. {item.id.toUpperCase()}
                          </p>
                        </div>
                        <button
                          onClick={() => cart.remove(item.id)}
                          aria-label="Remove"
                          className="text-muted-foreground hover:text-accent"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="inline-flex items-center border border-border">
                          <button
                            onClick={() => cart.update(item.id, item.qty - 1)}
                            className="px-3 py-2 hover:bg-muted"
                            aria-label="Decrease"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-10 text-center text-sm">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => cart.update(item.id, item.qty + 1)}
                            className="px-3 py-2 hover:bg-muted"
                            aria-label="Increase"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="font-display text-xl text-accent">
                          {formatPrice(item.priceUSD * item.qty)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="lg:col-span-4">
              <div className="border border-border p-8 lg:sticky lg:top-32">
                <p className="eyebrow">Order Summary</p>
                <dl className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd>{formatPrice(cart.total)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">
                      Insured shipping
                    </dt>
                    <dd className="text-accent">Complimentary</dd>
                  </div>
                  <div className="hairline my-4" />
                  <div className="flex justify-between items-baseline">
                    <dt className="eyebrow">Total</dt>
                    <dd className="font-display text-3xl text-accent">
                      {formatPrice(cart.total)}
                    </dd>
                  </div>
                </dl>
                <Link
                  to="/checkout"
                  className="group mt-8 inline-flex w-full items-center justify-center gap-3 bg-onyx px-8 py-4 text-[11px] uppercase tracking-[0.28em] text-ivory hover:bg-onyx/90"
                >
                  Proceed to checkout
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                </Link>
                <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
                  Orders are confirmed personally through WhatsApp with our
                  atelier concierge.
                </p>
              </div>
            </aside>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
}
