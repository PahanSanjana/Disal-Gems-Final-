import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Youtube, MessageCircle } from "lucide-react";

function TikTok({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M19.6 6.3a4.9 4.9 0 0 1-3.4-1.4A4.9 4.9 0 0 1 14.8 2h-3.2v13.1a2.7 2.7 0 1 1-1.9-2.6V9.2a5.9 5.9 0 1 0 5.1 5.8V9.1a8 8 0 0 0 4.8 1.6z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-onyx text-ivory">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-20">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="font-display text-3xl">Disal</div>
            <p className="mt-2 text-[10px] uppercase tracking-[0.4em] text-ivory/60">
              Ceylon Gems &amp; Jewelry
            </p>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-ivory/70">
              Rare gemstones from the highlands of Ceylon, crafted into
              timeless heirlooms by hand.
            </p>
            <div className="mt-8 flex gap-4 text-ivory/70">
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-accent"><Instagram className="h-4 w-4" /></a>
              <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-accent"><Facebook className="h-4 w-4" /></a>
              <a href="https://tiktok.com/" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="hover:text-accent"><TikTok className="h-4 w-4" /></a>
              <a href="https://youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-accent"><Youtube className="h-4 w-4" /></a>
              <a href="https://wa.me/94764837777" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-accent"><MessageCircle className="h-4 w-4" /></a>
            </div>
          </div>

          <FooterCol title="Discover" links={[
            ["/collections", "Collections"],
            ["/gemstones", "Gemstones"],
            ["/jewelry", "Jewelry"],
            ["/appointment", "Private Appointment"],
          ]} />
          <FooterCol title="Maison" links={[
            ["/about", "About Us"],
            ["/contact", "Contact Us"],
            ["/account", "Account"],
            ["/wishlist", "Wishlist"],
          ]} />
          <FooterCol title="Care" links={[
            ["/contact", "Jewelry Care"],
            ["/contact", "Certification"],
            ["/contact", "Shipping"],
            ["/contact", "Client Services"],
          ]} />
        </div>

        <div className="mt-16 hairline" />
        <div className="mt-8 flex flex-col gap-3 text-xs text-ivory/50 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} Disal Ceylon Gems &amp; Jewelry. All rights reserved.</p>
          <p className="tracking-[0.2em] uppercase">Colombo · Sri Lanka</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div className="md:col-span-2">
      <h4 className="eyebrow text-ivory/80">{title}</h4>
      <ul className="mt-5 space-y-3 text-sm text-ivory/70">
        {links.map(([to, label]) => (
          <li key={label}>
            <Link to={to} className="hover:text-accent transition-colors">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
