import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/luxury/Navbar";
import { Footer } from "@/components/luxury/Footer";
import { Reveal } from "@/components/luxury/Reveal";
import { products, formatPrice } from "@/lib/products";
import sapphireImg from "@/assets/collection-sapphire.jpg";
import emeraldImg from "@/assets/collection-emerald.jpg";
import rubyImg from "@/assets/collection-ruby.jpg";
import craftImg from "@/assets/craftsmanship.jpg";
import heroSecondary from "@/assets/hero-secondary.jpg";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "Collections — Disal Ceylon Gems & Jewelry" },
      {
        name: "description",
        content:
          "Editorial collections of Ceylon gemstones and heirloom jewelry — the Ratnapura Blues, the Ember Ruby edit, and the Muzo emerald archive.",
      },
    ],
  }),
  component: CollectionsPage,
});

const editorials = [
  {
    id: "ratnapura-blues",
    eyebrow: "Vol. I",
    title: "The Ratnapura Blues",
    subtitle: "Ceylon sapphires from the ancient riverbeds.",
    body:
      "A study in blue — from cornflower daylight to midnight velvet. Each stone drawn from the alluvial gravels of Sri Lanka's Sabaragamuwa highlands.",
    hero: sapphireImg,
    filter: (id: string) => id.startsWith("cs") || id === "rg-sap-01" || id === "pd-155",
  },
  {
    id: "ember",
    eyebrow: "Vol. II",
    title: "Ember — The Ruby Edit",
    subtitle: "Untreated Mogok rubies, still warm from the earth.",
    body:
      "Selected for the elusive 'pigeon blood' red and set in whispers of rose gold. A small, deliberate archive.",
    hero: rubyImg,
    filter: (id: string) => id.startsWith("pr") || id === "er-ruby-01",
  },
  {
    id: "muzo",
    eyebrow: "Vol. III",
    title: "The Muzo Archive",
    subtitle: "Colombian emeralds, held to the light.",
    body:
      "A curated series of Muzo emeralds — cut for clarity, set for wear, chosen for the particular green found only there.",
    hero: emeraldImg,
    filter: (id: string) => id.startsWith("em") || id === "nk-em-01",
  },
];

function CollectionsPage() {
  return (
    <div className="bg-background text-foreground">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-[80svh] overflow-hidden">
        <img
          src={heroSecondary}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-onyx/40 via-onyx/30 to-background" />
        <div className="relative mx-auto flex min-h-[80svh] max-w-[1400px] flex-col justify-end px-6 py-24 md:px-10 md:py-32">
          <p className="eyebrow text-ivory/80">The Collections</p>
          <h1 className="mt-6 font-display text-[11vw] md:text-[6vw] xl:text-[88px] leading-[0.95] text-ivory text-balance max-w-4xl">
            Three volumes,<br />
            <span className="italic text-accent">one archive of light.</span>
          </h1>
          <p className="mt-8 max-w-md text-sm text-ivory/80 leading-relaxed">
            Curated editions from the Disal atelier — small, deliberate, and
            renewed by hand each season.
          </p>
        </div>
      </section>

      {/* VOLUMES */}
      {editorials.map((ed, i) => {
        const items = products.filter((p) => ed.filter(p.id)).slice(0, 3);
        return (
          <section
            key={ed.id}
            className={`py-28 md:py-40 ${i % 2 === 1 ? "bg-secondary/60" : ""}`}
          >
            <div className="mx-auto max-w-[1400px] px-6 md:px-10">
              <div className="grid gap-14 md:grid-cols-12 md:items-end">
                <Reveal className="md:col-span-6">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={ed.hero}
                      alt={ed.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-onyx/60 to-transparent text-ivory">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-ivory/70">
                        {ed.eyebrow}
                      </p>
                      <p className="mt-2 font-display text-2xl">{ed.title}</p>
                    </div>
                  </div>
                </Reveal>

                <div className="md:col-span-6">
                  <Reveal>
                    <p className="eyebrow">{ed.eyebrow}</p>
                    <h2 className="mt-4 font-display text-4xl md:text-6xl leading-[1.02] text-balance">
                      {ed.title}
                    </h2>
                    <p className="mt-4 font-display italic text-xl md:text-2xl text-accent/90">
                      {ed.subtitle}
                    </p>
                    <p className="mt-8 max-w-lg text-sm leading-relaxed text-muted-foreground">
                      {ed.body}
                    </p>
                  </Reveal>
                </div>
              </div>

              <div className="mt-16 grid gap-6 md:grid-cols-3">
                {items.map((p, idx) => (
                  <Reveal key={p.id} delay={idx * 0.08}>
                    <Link
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
                      </div>
                      <div className="mt-5 flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-display text-xl leading-tight">
                            {p.name}
                          </h3>
                          <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                            {p.carat} ct · {p.origin}
                          </p>
                        </div>
                        <span className="text-[11px] uppercase tracking-[0.24em] text-accent">
                          {formatPrice(p.priceUSD)}
                        </span>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* CRAFT CTA */}
      <section className="mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
        <div className="grid gap-14 md:grid-cols-12 md:items-center">
          <Reveal className="md:col-span-7">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={craftImg}
                alt="Atelier craftsmanship"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <div className="md:col-span-5">
            <Reveal>
              <p className="eyebrow">Bespoke</p>
              <h2 className="mt-4 font-display text-4xl md:text-5xl leading-[1.05] text-balance">
                Don't see the one? We'll draw it.
              </h2>
              <p className="mt-8 text-sm text-muted-foreground leading-relaxed">
                Every Disal piece can be commissioned. Bring a stone or an
                idea; leave with an heirloom.
              </p>
              <Link
                to="/appointment"
                className="mt-10 inline-flex items-center gap-3 bg-onyx px-8 py-4 text-[11px] uppercase tracking-[0.28em] text-ivory hover:bg-onyx/90"
              >
                Commission a piece
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
