import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowUpRight,
  Heart,
  ShieldCheck,
  Truck,
  Gem,
  Check,
} from "lucide-react";
import { Navbar } from "@/components/luxury/Navbar";
import { Footer } from "@/components/luxury/Footer";
import { useProduct, formatPrice, type StoreProduct } from "@/lib/products";
import { useCart, useWishlist } from "@/lib/store";

export const Route = createFileRoute("/product/$id")({
  head: () => ({
    meta: [{ title: "Piece — Disal Ceylon Gems & Jewelry" }],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { id } = Route.useParams();
  const { loading, product } = useProduct(id);

  if (loading) {
    return (
      <div className="bg-background text-foreground">
        <Navbar />
        <section className="mx-auto max-w-[1400px] px-6 py-40 md:px-10 text-center">
          <p className="eyebrow">Loading</p>
          <h1 className="mt-4 font-display text-3xl">One moment…</h1>
        </section>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-background text-foreground">
        <Navbar />
        <section className="mx-auto max-w-[1400px] px-6 py-40 md:px-10 text-center">
          <p className="eyebrow">Not found</p>
          <h1 className="mt-4 font-display text-5xl">The piece has moved on.</h1>
          <Link
            to="/gemstones"
            className="mt-10 inline-flex items-center gap-3 border border-onyx/30 px-8 py-4 text-[11px] uppercase tracking-[0.28em] hover:border-accent hover:text-accent"
          >
            Browse gemstones
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </section>
        <Footer />
      </div>
    );
  }

  return <ProductView product={product} />;
}

function ProductView({ product }: { product: StoreProduct }) {
  const [active, setActive] = useState(0);
  const [added, setAdded] = useState(false);
  const cart = useCart();
  const wish = useWishlist();
  const wished = wish.has(product.id);
  const images = product.imageUrls.length > 0 ? product.imageUrls : [""];

  function addToCart() {
    cart.add({
      id: product.id,
      name: product.name,
      priceUSD: product.price,
      image: images[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  function toggleWish() {
    wish.toggle({
      id: product.id,
      kind: product.kind,
      name: product.name,
      priceUSD: product.price,
      image: images[0],
    });
  }

  const specs: [string, string | undefined][] = product.kind === "gemstone"
    ? [
        ["Category", product.category],
        ["Origin", product.origin],
        ["Carat", product.carat ? `${product.carat} ct` : undefined],
        ["Shape", product.shape],
        ["Color", product.color],
        ["Cut", product.cut],
        ["Clarity", product.clarity],
        ["Treatment", product.treatment],
      ]
    : [
        ["Category", product.category],
        ["Metal", product.metal],
        ["Gemstone", product.gemstoneType],
        ["Size", product.size],
      ];

  return (
    <div className="bg-background text-foreground">
      <Navbar />

      <section className="mx-auto max-w-[1400px] px-6 pt-32 pb-6 md:px-10">
        <nav className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          <Link to="/" className="hover:text-accent">Home</Link>
          <span className="mx-2">/</span>
          <Link
            to={product.kind === "gemstone" ? "/gemstones" : "/jewelry"}
            className="hover:text-accent"
          >
            {product.kind === "gemstone" ? "Gemstones" : "Jewelry"}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground/80">{product.name}</span>
        </nav>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-24 md:px-10">
        <div className="grid gap-14 lg:grid-cols-12">
          {/* GALLERY */}
          <div className="lg:col-span-7">
            <div className="relative aspect-square overflow-hidden bg-muted">
              {images[active] ? (
                <img
                  src={images[active]}
                  alt={product.name}
                  className="h-full w-full object-cover transition-opacity duration-500"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                  No image available
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-3">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`relative aspect-square overflow-hidden border transition-colors ${
                      active === i ? "border-accent" : "border-transparent hover:border-border"
                    }`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DETAILS */}
          <div className="lg:col-span-5">
            <p className="eyebrow">
              {product.kind === "gemstone" ? "Gemstone" : "Jewelry"}
              {product.origin ? ` · ${product.origin}` : ""}
            </p>
            <h1 className="mt-3 font-display text-4xl md:text-5xl leading-[1.02]">
              {product.name}
            </h1>
            <div className="mt-4 flex items-center gap-4">
              <span className="font-display text-2xl text-accent">
                {formatPrice(product.price)}
              </span>
              {(product.carat || product.shape) && (
                <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                  {[product.carat ? `${product.carat} ct` : null, product.shape]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              )}
            </div>

            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={addToCart}
                className="group inline-flex items-center justify-center gap-3 bg-onyx px-8 py-4 text-[11px] uppercase tracking-[0.28em] text-ivory hover:bg-onyx/90"
              >
                {added ? (
                  <><Check className="h-4 w-4" /> Added to cart</>
                ) : (
                  <>Add to cart <ArrowUpRight className="h-4 w-4" /></>
                )}
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={toggleWish}
                  className={`inline-flex items-center justify-center gap-2 border px-4 py-4 text-[11px] uppercase tracking-[0.24em] transition-colors ${
                    wished
                      ? "border-accent text-accent"
                      : "border-onyx/30 hover:border-accent hover:text-accent"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${wished ? "fill-accent" : ""}`} />
                  {wished ? "Saved" : "Wishlist"}
                </button>
                <Link
                  to="/appointment"
                  className="inline-flex items-center justify-center gap-2 border border-onyx/30 px-4 py-4 text-[11px] uppercase tracking-[0.24em] hover:border-accent hover:text-accent"
                >
                  Book viewing
                </Link>
              </div>
            </div>

            <div className="mt-10">
              <p className="eyebrow flex items-center gap-2">
                <Gem className="h-3 w-3" /> Specifications
              </p>
              <dl className="mt-4 grid grid-cols-2 gap-y-3 border-t border-border pt-4 text-sm">
                {specs
                  .filter(([, v]) => !!v)
                  .map(([k, v]) => (
                    <div key={k} className="col-span-2 flex justify-between gap-4 border-b border-border/50 pb-2">
                      <dt className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{k}</dt>
                      <dd className="text-right">{v}</dd>
                    </div>
                  ))}
              </dl>
            </div>

            {product.certificate && (
              <div className="mt-8 border border-border p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" strokeWidth={1.25} />
                  <div>
                    <p className="text-sm font-medium">Certified by {product.certificate}</p>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      Independent laboratory report accompanies every gemstone.
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-start gap-3 border-t border-border pt-4">
                  <Truck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" strokeWidth={1.25} />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Insured, signature-delivered worldwide within 5 working days.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
