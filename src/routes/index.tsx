import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, ShieldCheck, Sparkles, Gem, Globe2 } from "lucide-react";

import { Navbar } from "@/components/luxury/Navbar";
import { Footer } from "@/components/luxury/Footer";
import { Reveal } from "@/components/luxury/Reveal";

import sapphireImg from "@/assets/collection-sapphire.jpg";
import emeraldImg from "@/assets/collection-emerald.jpg";
import rubyImg from "@/assets/collection-ruby.jpg";
import craftImg from "@/assets/craftsmanship.jpg";
import heroSecondary from "@/assets/hero-secondary.jpg";
import heroEditorial from "@/assets/hero-editorial.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Disal Ceylon Gems & Jewelry — Exceptional Gems, Timeless Elegance" },
      {
        name: "description",
        content:
          "Rare Ceylon sapphires, rubies, emeralds and heirloom jewelry, sourced and crafted in Sri Lanka by the Disal atelier.",
      },
      { property: "og:title", content: "Disal Ceylon Gems & Jewelry" },
      {
        property: "og:description",
        content: "Exceptional Ceylon gemstones and timeless jewelry, hand-crafted by the Disal atelier.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="bg-background text-foreground">
      <Navbar />
      <Hero />
      <Marquee />
      <Categories />
      <Signature />
      <Craft />
      <WhyDisal />
      <Journal />
      <Footer />
    </div>
  );
}

/* ------------------------------- HERO ------------------------------- */

const easeLux = [0.2, 0.7, 0.2, 1] as const;

function Hero() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-background">
      <div className="mx-auto grid min-h-[100svh] max-w-[1500px] grid-cols-1 gap-0 px-6 pt-32 pb-16 md:px-10 md:pt-40 md:pb-24 lg:grid-cols-12 lg:gap-16 lg:items-center">
        <div className="lg:col-span-6 xl:col-span-5 relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: easeLux }}
            className="eyebrow mb-8 flex items-center gap-3"
          >
            <span className="inline-block h-px w-8 bg-accent" />
            Est. Ceylon · Ratnapura
          </motion.p>

          <h1 className="font-display text-[13vw] leading-[0.92] tracking-[-0.02em] md:text-[7vw] lg:text-[5.5vw] xl:text-[84px] text-balance">
            <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease: easeLux }} className="block">
              Exceptional
            </motion.span>
            <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 1.1, ease: easeLux }} className="block italic text-accent/90">
              Gems.
            </motion.span>
            <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 1.1, ease: easeLux }} className="block">
              Timeless Elegance.
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 1, ease: easeLux }}
            className="mt-10 max-w-md text-sm leading-relaxed text-muted-foreground"
          >
            For three generations, Disal has sourced the world's finest Ceylon
            sapphires, rubies and emeralds — and shaped them into heirlooms
            that outlast the wearer.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1, ease: easeLux }}
            className="mt-12 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/collections"
              className="group inline-flex items-center gap-3 bg-onyx px-8 py-4 text-[11px] uppercase tracking-[0.28em] text-ivory transition-all hover:bg-onyx/90"
            >
              Explore Collection
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 border border-onyx/30 px-8 py-4 text-[11px] uppercase tracking-[0.28em] text-onyx transition-all hover:border-accent hover:text-accent"
            >
              Contact Us
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </motion.div>
        </div>

        <div className="lg:col-span-6 xl:col-span-7 relative">
          <motion.div
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={{ clipPath: "inset(0% 0 0 0)" }}
            transition={{ duration: 1.6, ease: easeLux, delay: 0.2 }}
            className="relative aspect-[4/5] w-full overflow-hidden bg-muted"
          >
            <motion.img
              src={heroEditorial}
              alt="A luxury Ceylon sapphire and diamond necklace worn on ivory silk"
              width={1600}
              height={1920}
              className="h-full w-full object-cover"
              initial={{ scale: 1.15 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2.2, ease: easeLux, delay: 0.2 }}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx/25 via-transparent to-transparent" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="absolute -bottom-4 left-0 right-0 flex items-center justify-between text-[10px] uppercase tracking-[0.4em] text-muted-foreground md:-bottom-8"
          >
            <span>Campaign N°01 — MMXXVI</span>
            <span className="hidden md:inline">Ceylon Blue Heritage</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


/* ------------------------------ MARQUEE ----------------------------- */

function Marquee() {
  const words = ["Sapphire", "·", "Ruby", "·", "Emerald", "·", "Diamond", "·", "Padparadscha", "·", "Alexandrite", "·"];
  const line = [...words, ...words, ...words];
  return (
    <section className="border-y border-border/60 bg-background py-6 overflow-hidden">
      <motion.div
        className="flex gap-10 whitespace-nowrap font-display text-3xl md:text-4xl text-onyx/50"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {line.map((w, i) => (
          <span key={i} className={w === "·" ? "text-accent" : "italic"}>
            {w}
          </span>
        ))}
      </motion.div>
    </section>
  );
}

/* ---------------------------- CATEGORIES ---------------------------- */

const categories = [
  { title: "Natural Gemstones", tag: "Origin Ceylon", to: "/gemstones", img: sapphireImg },
  { title: "Luxury Jewelry", tag: "The Maison", to: "/jewelry", img: emeraldImg },
  { title: "Bespoke Commissions", tag: "By Appointment", to: "/appointment", img: rubyImg },
];

function Categories() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
      <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">01 — Universe</p>
          <h2 className="mt-4 font-display text-4xl md:text-6xl text-balance max-w-2xl">
            Three worlds, one heritage of light.
          </h2>
        </div>
        <p className="max-w-sm text-sm text-muted-foreground">
          From loose stones fresh from the mines of Ratnapura to finished
          pieces set by hand — every path begins with the gem.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {categories.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.1}>
            <Link to={c.to} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <img
                  src={c.img}
                  alt={c.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-onyx/50 via-transparent to-transparent opacity-70" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-ivory">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-ivory/70">
                    {c.tag}
                  </p>
                  <h3 className="mt-2 font-display text-3xl">{c.title}</h3>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-foreground/70">
                <span>Discover</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* --------------------------- SIGNATURE ------------------------------ */

const signature = [
  { name: "Ceylon Sapphire", carat: "3.42 ct", origin: "Ratnapura", price: "On request" },
  { name: "Pigeon Blood Ruby", carat: "2.18 ct", origin: "Mogok", price: "On request" },
  { name: "Colombian Emerald", carat: "4.05 ct", origin: "Muzo", price: "On request" },
  { name: "Old Mine Diamond", carat: "1.87 ct", origin: "Antwerp", price: "On request" },
];

function Signature() {
  return (
    <section className="bg-onyx text-ivory py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-ivory/60">02 — Signature Stones</p>
            <h2 className="mt-4 font-display text-4xl md:text-6xl">
              The vault.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-ivory/60">
            A rotating selection of extraordinary stones held in our private
            atelier. Each accompanied by a GIA or Gübelin certificate.
          </p>
        </div>

        <div className="mt-16 grid gap-px bg-ivory/10 md:grid-cols-4">
          {signature.map((s, i) => (
            <Reveal key={s.name} delay={i * 0.08}>
              <div className="group relative h-full bg-onyx p-8 transition-colors hover:bg-onyx/70">
                <div className="mb-16 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-ivory/50">
                  <span>N° {String(i + 1).padStart(2, "0")}</span>
                  <span>{s.carat}</span>
                </div>
                <h3 className="font-display text-3xl leading-tight">{s.name}</h3>
                <p className="mt-2 text-sm text-ivory/60">{s.origin}</p>
                <div className="mt-10 flex items-end justify-between">
                  <span className="text-[11px] uppercase tracking-[0.24em] text-accent">
                    {s.price}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-ivory/40 transition-all group-hover:text-accent group-hover:-translate-y-0.5" />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- CRAFT -------------------------------- */

function Craft() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
      <div className="grid gap-14 md:grid-cols-12 md:items-center">
        <Reveal className="md:col-span-7">
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src={craftImg}
              alt="Master artisan setting a Ceylon sapphire"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </Reveal>

        <div className="md:col-span-5">
          <Reveal>
            <p className="eyebrow">03 — Craft</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl leading-[1.05] text-balance">
              Every gemstone carries a story. Our artisans give it a form.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 text-sm leading-relaxed text-muted-foreground">
              In our Colombo atelier, a piece can spend more than a hundred
              hours under a loupe. Nothing is machined. Nothing is rushed.
              Every setting is drawn, wax-carved, cast and finished by hand —
              in the tradition of Ceylon jewelers who taught our founder six
              decades ago.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <Link
              to="/about"
              className="mt-10 inline-flex items-center gap-3 border-b border-onyx/40 pb-2 text-[11px] uppercase tracking-[0.28em] transition-colors hover:border-accent hover:text-accent"
            >
              Inside the atelier
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- WHY DISAL ------------------------------ */

const pillars = [
  { icon: ShieldCheck, title: "Certified Gemstones", body: "Every stone independently graded by GIA, Gübelin or SSEF." },
  { icon: Gem, title: "Ceylon Heritage", body: "Sourced from the family-run mines we've partnered with for 40 years." },
  { icon: Sparkles, title: "Master Craftsmanship", body: "Hand-set in our Colombo atelier by artisans of three generations." },
  { icon: Globe2, title: "Worldwide Service", body: "White-glove delivery and private appointments in over 30 countries." },
];

function WhyDisal() {
  return (
    <section className="bg-secondary/60 py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <Reveal>
              <p className="eyebrow">04 — The Maison</p>
              <h2 className="mt-4 font-display text-4xl md:text-5xl leading-[1.05]">
                A house built on quiet certainty.
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-8 grid gap-px bg-border sm:grid-cols-2">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="h-full bg-background p-8">
                  <p.icon className="h-5 w-5 text-accent" strokeWidth={1.25} />
                  <h3 className="mt-6 font-display text-2xl">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- JOURNAL PREVIEW ------------------------ */

function Journal() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
      <div className="grid gap-14 md:grid-cols-12 md:items-end">
        <div className="md:col-span-5">
          <p className="eyebrow">05 — Journal</p>
          <h2 className="mt-4 font-display text-4xl md:text-5xl leading-[1.05]">
            Notes from the atelier.
          </h2>
          <p className="mt-6 max-w-sm text-sm text-muted-foreground">
            Studies on gems, letters from Ratnapura, and the quiet
            disciplines of the trade.
          </p>
          <Link
            to="/about"
            className="mt-10 inline-flex items-center gap-3 border-b border-onyx/40 pb-2 text-[11px] uppercase tracking-[0.28em] transition-colors hover:border-accent hover:text-accent"
          >
            Read our story
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <Reveal className="md:col-span-7">
          <div className="relative aspect-[5/4] overflow-hidden">
            <img
              src={heroSecondary}
              alt="Diamond bracelet on ivory silk"
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-onyx/70 to-transparent text-ivory">
              <p className="text-[10px] uppercase tracking-[0.3em] text-ivory/70">
                Field Notes · Vol. 07
              </p>
              <h3 className="mt-2 font-display text-2xl md:text-3xl max-w-md">
                How to read a Ceylon sapphire under morning light.
              </h3>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
