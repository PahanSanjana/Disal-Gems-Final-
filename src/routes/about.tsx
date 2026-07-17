import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/luxury/Navbar";
import { Footer } from "@/components/luxury/Footer";
import { Reveal } from "@/components/luxury/Reveal";
import aboutHero from "@/assets/about-hero.jpg";
import craftImg from "@/assets/craftsmanship.jpg";
import sapphireImg from "@/assets/collection-sapphire.jpg";
import heroSecondary from "@/assets/hero-secondary.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Disal Ceylon Gems & Jewelry" },
      {
        name: "description",
        content:
          "Three generations of Ceylon gem tradition — the story, the craft, and the promise behind Disal Ceylon Gems & Jewelry.",
      },
      { property: "og:title", content: "About — Disal Ceylon Gems & Jewelry" },
      {
        property: "og:description",
        content: "Three generations of Ceylon gem tradition and craft.",
      },
      { property: "og:image", content: "/social-og.jpg" },
    ],
  }),
  component: AboutPage,
});

const easeLux = [0.2, 0.7, 0.2, 1] as const;

function AboutPage() {
  return (
    <div className="bg-background text-foreground">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-[85svh] overflow-hidden">
        <motion.img
          src={aboutHero}
          alt="Master jeweler setting a Ceylon sapphire by hand"
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: easeLux }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-onyx/40 via-onyx/30 to-background" />
        <div className="relative mx-auto flex min-h-[85svh] max-w-[1400px] flex-col justify-end px-6 py-24 md:px-10 md:py-32">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1, ease: easeLux }}
            className="eyebrow text-ivory/80"
          >
            The Maison
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 1.1, ease: easeLux }}
            className="mt-6 font-display text-[11vw] md:text-[6vw] xl:text-[88px] leading-[0.95] text-ivory text-balance max-w-4xl"
          >
            A house built on <span className="italic text-accent">light,</span>
            <br /> patience, and Ceylon earth.
          </motion.h1>
        </div>
      </section>

      {/* STORY */}
      <section className="mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <Reveal>
              <p className="eyebrow">01 — Brand Story</p>
              <h2 className="mt-4 font-display text-4xl md:text-5xl leading-[1.05]">
                Three generations of gems.
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-8 space-y-6 text-base leading-relaxed text-foreground/80 font-display">
            <Reveal>
              <p>
                Disal Ceylon Gems &amp; Jewelry was founded on a promise made
                between a father and his son in a small workshop in Ratnapura —
                the city of gems — more than sixty years ago.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                Since then, the house has grown quietly. From a single loupe on
                a wooden table to a private atelier in Colombo, three
                generations of the family have devoted themselves to a single
                idea: that a gemstone, chosen and cut with respect, becomes
                more than an object — it becomes an heirloom.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* HERITAGE */}
      <section className="bg-onyx text-ivory py-28 md:py-40">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid gap-14 md:grid-cols-12 md:items-center">
          <Reveal className="md:col-span-6">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={sapphireImg}
                alt="Ceylon sapphires held to the light"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <div className="md:col-span-6">
            <Reveal>
              <p className="eyebrow text-ivory/60">02 — Ceylon Heritage</p>
              <h2 className="mt-4 font-display text-4xl md:text-5xl leading-[1.05]">
                Every stone begins in Ratnapura.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 text-sm text-ivory/70 leading-relaxed">
                For more than two thousand years, Sri Lanka — Serendib to the
                ancients — has yielded the world's most storied sapphires. The
                blue of a Ceylon stone is a shade you recognise before you name
                it: cornflower at dawn, velvet at dusk.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-4 text-sm text-ivory/70 leading-relaxed">
                Disal partners directly with family-run mines in Ratnapura,
                Elahera and Balangoda. We select every rough by hand — not by
                catalogue — and follow it from the riverbed to the setting.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CRAFT */}
      <section className="mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
        <div className="grid gap-14 md:grid-cols-12 md:items-center">
          <div className="md:col-span-5 order-2 md:order-1">
            <Reveal>
              <p className="eyebrow">03 — Our Craftsmanship</p>
              <h2 className="mt-4 font-display text-4xl md:text-5xl leading-[1.05]">
                A hundred hours under a loupe.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 text-sm text-muted-foreground leading-relaxed">
                In our Colombo atelier, nothing is machined and nothing is
                rushed. Every setting is drawn, wax-carved, cast and finished
                by hand — in the same tradition our founder learned from the
                Ceylon jewelers of the 1960s.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                A single ring can spend more than a hundred hours in an
                artisan's hands before it reaches the client's.
              </p>
            </Reveal>
          </div>
          <Reveal className="md:col-span-7 order-1 md:order-2">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={craftImg}
                alt="Atelier craftsmanship"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* QUALITY */}
      <section className="bg-secondary/60 py-28 md:py-40">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <div className="mb-16 max-w-2xl">
            <Reveal>
              <p className="eyebrow">04 — The Quality Promise</p>
              <h2 className="mt-4 font-display text-4xl md:text-6xl leading-[1.02]">
                Certified. Traceable. Untouched by shortcut.
              </h2>
            </Reveal>
          </div>
          <div className="grid gap-px bg-border md:grid-cols-3">
            {[
              {
                k: "Independent Certification",
                v: "Every gemstone accompanied by a GIA, Gübelin, SSEF or GRS laboratory report — no exceptions.",
              },
              {
                k: "Traceable Origin",
                v: "From the riverbed to the setting, we can name the mine, the miner, and the month.",
              },
              {
                k: "Ethical Practice",
                v: "Fair-partner mining, artisan-run polishing, and a lifetime service guarantee for every piece.",
              },
            ].map((b, i) => (
              <Reveal key={b.k} delay={i * 0.08}>
                <div className="h-full bg-background p-10">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-accent">
                    N° {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-6 font-display text-2xl">{b.k}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {b.v}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY TRUST */}
      <section className="mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
        <div className="grid gap-14 md:grid-cols-12 md:items-end">
          <div className="md:col-span-5">
            <Reveal>
              <p className="eyebrow">05 — Why Clients Return</p>
              <h2 className="mt-4 font-display text-4xl md:text-5xl leading-[1.05]">
                A quiet certainty — for those who know the difference.
              </h2>
              <p className="mt-8 text-sm text-muted-foreground leading-relaxed max-w-md">
                Our clients arrive by referral. They stay because the pieces
                outlast the season — and because the atelier answers the
                phone, always, in person.
              </p>
              <Link
                to="/contact"
                className="mt-10 inline-flex items-center gap-3 bg-onyx px-8 py-4 text-[11px] uppercase tracking-[0.28em] text-ivory hover:bg-onyx/90"
              >
                Speak with the atelier
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Reveal>
          </div>
          <Reveal className="md:col-span-7">
            <div className="relative aspect-[5/4] overflow-hidden">
              <img
                src={heroSecondary}
                alt="Heirloom Ceylon jewelry"
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
