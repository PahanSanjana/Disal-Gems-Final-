import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchOverlay } from "./SearchOverlay";

const links = [
  { to: "/collections", label: "Collections" },
  { to: "/gemstones", label: "Gemstones" },
  { to: "/jewelry", label: "Jewelry" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Us" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border/60"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10">
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden text-foreground"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.22em] text-foreground/80">
          {links.slice(0, 3).map((l) => (
            <Link key={l.to} to={l.to} className="gold-underline hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>

        <Link to="/" className="flex flex-col items-center leading-none">
          <span className="font-display text-2xl md:text-[28px] tracking-[0.02em]">
            DISAL
          </span>
          <span className="mt-1 text-[9px] uppercase tracking-[0.4em] text-muted-foreground">
            Ceylon Gems &amp; Jewelry
          </span>
        </Link>

        <div className="flex items-center gap-5">
          <nav className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.22em] text-foreground/80">
            {links.slice(3).map((l) => (
              <Link key={l.to} to={l.to} className="gold-underline hover:text-foreground">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4 text-foreground/80">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="hover:text-accent transition-colors"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>
            <Link to="/account" aria-label="Account" className="hidden sm:block hover:text-accent transition-colors">
              <User className="h-[18px] w-[18px]" />
            </Link>
            <Link to="/wishlist" aria-label="Wishlist" className="hidden sm:block hover:text-accent transition-colors">
              <Heart className="h-[18px] w-[18px]" />
            </Link>
            <Link to="/cart" aria-label="Cart" className="hover:text-accent transition-colors">
              <ShoppingBag className="h-[18px] w-[18px]" />
            </Link>
          </div>
        </div>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background lg:hidden"
          >
            <div className="flex items-center justify-between px-6 py-5">
              <span className="font-display text-2xl">DISAL</span>
              <button onClick={() => setOpen(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-10 flex flex-col items-center gap-8">
              {links.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.5 }}
                >
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="font-display text-4xl"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
