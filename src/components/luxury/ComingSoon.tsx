import { Navbar } from "@/components/luxury/Navbar";
import { Footer } from "@/components/luxury/Footer";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

export function ComingSoon({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="bg-background text-foreground">
      <Navbar />
      <section className="mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-center px-6 py-40 md:px-10">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-6 font-display text-5xl md:text-7xl leading-[1.02] text-balance max-w-3xl">
          {title}
        </h1>
        <p className="mt-8 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {copy}
        </p>
        <div className="mt-12 flex gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-3 border border-onyx/30 px-8 py-4 text-[11px] uppercase tracking-[0.28em] hover:border-accent hover:text-accent transition-colors"
          >
            Return home
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-3 bg-onyx px-8 py-4 text-[11px] uppercase tracking-[0.28em] text-ivory hover:bg-onyx/90"
          >
            Enquire
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
