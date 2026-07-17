import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Heart,
  ShieldCheck,
  Truck,
  Gem,
  ZoomIn,
  Check,
} from "lucide-react";
import { Navbar } from "@/components/luxury/Navbar";
import { Footer } from "@/components/luxury/Footer";
import { Reveal } from "@/components/luxury/Reveal";
import { findProduct, products, formatPrice } from "@/lib/products";
import { useCart, useWishlist } from "@/lib/store";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = findProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `${loaderData.product.name} — Disal Ceylon Gems & Jewelry`
          : "Piece — Disal",
      },
      {
        name: "description",
        content:
          loaderData?.product.description ??
          "A rare piece from the Disal atelier.",
      },
      loaderData
        ? { property: "og:image", content: loaderData.product.images[0] }
        : { property: "og:image", content: "" },
    ],
  }),
  notFoundComponent: () => (
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
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [added, setAdded] = useState(false);
  const cart = useCart();
  const wish = useWishlist();
  const wished = wish.has(product.id);

  const related = products
    .filter((p) => p.id !== product.id && p.type === product.type)
    .slice(0, 3);

  function handleZoom(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  }

  function addToCart() {
    cart.add({
      id: product.id,
      name: product.name,
      priceUSD: product.priceUSD,
      image: product.images[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="bg-background text-foreground">
      <Navbar />

      <section className="mx-auto max-w-[1400px] px-6 pt-32 pb-6 md:px-10">
        <nav className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          <Link to="/" className="hover:text-accent">Home</Link>
          <span className="mx-2">/</span>
          <Link
            to={product.category === "Gemstone" ? "/gemstones" : "/jewelry"}
            className="hover:text-accent"
          >
            {product.category === "Gemstone" ? "Gemstones" : "Jewelry"}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground/80">{product.name}</span>
        </nav>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 pb-24 md:px-10">
        <div className="grid gap-14 lg:grid-cols-12">
          {/* GALLERY */}
          <div className="lg:col-span-7">
            <div
              className="group relative aspect-square overflow-hidden bg-muted cursor-zoom-in"
              onMouseMove={handleZoom}
              onMouseLeave={() => setZoom(null)}
            >
              <img
                src={product.images[active]}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500"
                style={
                  zoom
                    ? {
                        transform: "scale(2)",
                        transformOrigin: `${zoom.x}% ${zoom.y}%`,
                      }
                    : undefined
                }
              />
              <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-ivory/90 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em]">
                <ZoomIn className="h-3 w-3" /> Hover to zoom
              </div>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images.map((src: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`relative aspect-square overflow-hidden border ${
                    active === i ? "border-accent" : "border-transparent"
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* DETAILS */}
          <div className="lg:col-span-5">
            <p className="eyebrow">
              {product.category} · {product.origin}
            </p>
            <h1 className="mt-3 font-display text-4xl md:text-5xl leading-[1.02]">
              {product.name}
            </h1>
            <div className="mt-4 flex items-center gap-4">
              <span className="font-display text-2xl text-accent">
                {formatPrice(product.priceUSD)}
              </span>
              <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                {product.carat} ct · {product.shape}
              </span>
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
                  <>
                    <Check className="h-4 w-4" /> Added to cart
                  </>
                ) : (
                  <>
                    Add to cart
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
                  </>
                )}
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => wish.toggle(product.id)}
                  className={`inline-flex items-center justify-center gap-2 border px-4 py-4 text-[11px] uppercase tracking-[0.24em] transition-colors ${
                    wished
                      ? "border-accent text-accent"
                      : "border-onyx/30 hover:border-accent hover:text-accent"
                  }`}
                >
                  <Heart
                    className={`h-4 w-4 ${wished ? "fill-accent" : ""}`}
                  />
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

            {/* SPECS */}
            <div className="mt-10">
              <p className="eyebrow flex items-center gap-2">
                <Gem className="h-3 w-3" /> Gem Specifications
              </p>
              <dl className="mt-4 grid grid-cols-2 gap-y-3 border-t border-border pt-4 text-sm">
                <SpecRow k="Type" v={product.type} />
                <SpecRow k="Color" v={product.color} />
                <SpecRow k="Shape" v={product.shape} />
                <SpecRow k="Carat" v={`${product.carat} ct`} />
                <SpecRow k="Origin" v={product.origin} />
                <SpecRow k="Treatment" v={product.treatment} />
                {Object.entries(product.specs).map(([k, v]) => (
                  <SpecRow key={k} k={k} v={String(v)} />
                ))}
              </dl>
            </div>

            {/* CERT */}
            <div className="mt-8 border border-border p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" strokeWidth={1.25} />
                <div>
                  <p className="text-sm font-medium">
                    Certified by {product.certification}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    Independent laboratory report accompanies every gemstone,
                    detailing species, origin and treatment history.
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
          </div>
        </div>
      </section>

      {/* RELATED */}
      {related.length > 0 && (
        <section className="border-t border-border py-24 md:py-32">
          <div className="mx-auto max-w-[1400px] px-6 md:px-10">
            <div className="flex items-end justify-between mb-14">
              <div>
                <p className="eyebrow">Also from the vault</p>
                <h2 className="mt-3 font-display text-3xl md:text-5xl">
                  You may also love.
                </h2>
              </div>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.08}>
                  <Link
                    to="/product/$id"
                    params={{ id: p.id }}
                    className="group block"
                  >
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <motion.img
                        src={p.images[0]}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 1.2, ease: [0.2, 0.7, 0.2, 1] }}
                      />
                    </div>
                    <div className="mt-5 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-xl">{p.name}</h3>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                          {p.carat} ct · {p.origin}
                        </p>
                      </div>
                      <span className="text-[11px] uppercase tracking-[0.24em] text-accent whitespace-nowrap">
                        {formatPrice(p.priceUSD)}
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

function SpecRow({ k, v }: { k: string; v: string }) {
  return (
    <>
      <dt className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        {k}
      </dt>
      <dd className="text-sm text-foreground">{v}</dd>
    </>
  );
}
