import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  Send,
} from "lucide-react";
import { Navbar } from "@/components/luxury/Navbar";
import { Footer } from "@/components/luxury/Footer";
import contactHero from "@/assets/contact-hero.jpg";

const WHATSAPP_NUMBER = "94764837777";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Disal Ceylon Gems & Jewelry" },
      {
        name: "description",
        content:
          "Speak with the Disal atelier in Colombo. Private appointments, gem sourcing and heirloom commissions.",
      },
      { property: "og:title", content: "Contact — Disal Ceylon Gems & Jewelry" },
    ],
  }),
  component: ContactPage,
});

// TikTok inline icon (lucide has no TikTok)
function TikTok({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M19.6 6.3a4.9 4.9 0 0 1-3.4-1.4A4.9 4.9 0 0 1 14.8 2h-3.2v13.1a2.7 2.7 0 1 1-1.9-2.6V9.2a5.9 5.9 0 1 0 5.1 5.8V9.1a8 8 0 0 0 4.8 1.6z" />
    </svg>
  );
}

const socials = [
  { Icon: Instagram, label: "Instagram", href: "https://instagram.com/" },
  { Icon: Facebook, label: "Facebook", href: "https://facebook.com/" },
  { Icon: TikTok, label: "TikTok", href: "https://tiktok.com/" },
  { Icon: Youtube, label: "YouTube", href: "https://youtube.com/" },
  {
    Icon: MessageCircle,
    label: "WhatsApp",
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
  },
];

function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const lines = [
      `Hello Disal Ceylon Gems & Jewelry,`,
      ``,
      `Enquiry from the website.`,
      ``,
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Subject: ${form.subject}`,
      ``,
      `Message:`,
      form.message,
      ``,
      `Thank you.`,
    ];
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      lines.join("\n")
    )}`;
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setSent(true);
  }

  return (
    <div className="bg-background text-foreground">
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-[70svh] overflow-hidden">
        <motion.img
          src={contactHero}
          alt="Disal atelier salon"
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: [0.2, 0.7, 0.2, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-onyx/45 via-onyx/30 to-background" />
        <div className="relative mx-auto flex min-h-[70svh] max-w-[1400px] flex-col justify-end px-6 py-20 md:px-10 md:py-28">
          <p className="eyebrow text-ivory/80">Contact</p>
          <h1 className="mt-6 font-display text-[10vw] md:text-[6vw] xl:text-[84px] leading-[0.95] text-ivory text-balance max-w-4xl">
            The atelier is open <span className="italic text-accent">by appointment.</span>
          </h1>
          <p className="mt-6 max-w-md text-sm text-ivory/80 leading-relaxed">
            Send us a note, or reach us directly on WhatsApp — you'll speak
            with the family, not a call centre.
          </p>
        </div>
      </section>

      {/* CONTACT + FORM */}
      <section className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
        <div className="grid gap-16 lg:grid-cols-12">
          {/* Info */}
          <div className="lg:col-span-5 space-y-10">
            <div>
              <p className="eyebrow">01 — Reach us directly</p>
              <div className="mt-8 space-y-6">
                <InfoRow Icon={MapPin} label="Atelier" value="No. 42, Sir Baron Jayatilaka Mawatha, Colombo 01, Sri Lanka" />
                <InfoRow
                  Icon={Phone}
                  label="Phone"
                  value="+94 76 483 7777"
                  href="tel:+94764837777"
                />
                <InfoRow
                  Icon={MessageCircle}
                  label="WhatsApp"
                  value="+94 76 483 7777"
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                />
                <InfoRow
                  Icon={Mail}
                  label="Email"
                  value="atelier@disalceylon.com"
                  href="mailto:atelier@disalceylon.com"
                />
              </div>
            </div>

            <div>
              <p className="eyebrow">02 — Business Hours</p>
              <div className="mt-6 space-y-3 text-sm">
                <HourRow Icon={Clock} day="Monday — Friday" time="10:00 — 18:00" />
                <HourRow Icon={Clock} day="Saturday" time="11:00 — 16:00" />
                <HourRow Icon={Clock} day="Sunday" time="By private appointment" />
              </div>
            </div>

            <div>
              <p className="eyebrow">03 — Follow the maison</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="group flex h-12 w-12 items-center justify-center border border-onyx/20 text-onyx transition-all hover:border-accent hover:text-accent"
                  >
                    <s.Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="border border-border p-8 md:p-12">
              <p className="eyebrow">Write to us</p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl">
                A note to the atelier.
              </h2>
              {sent ? (
                <div className="mt-10 border border-accent/30 bg-accent/5 p-8 text-center">
                  <p className="font-display text-2xl">Thank you.</p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    A WhatsApp conversation has been opened with the atelier.
                    We reply within one business day.
                  </p>
                </div>
              ) : (
                <form onSubmit={submit} className="mt-8 space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Full name" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
                    <Field label="Email" type="email" required value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Phone (with country code)" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
                    <Field label="Subject" value={form.subject} onChange={(v) => setForm({ ...form, subject: v })} />
                  </div>
                  <label className="block">
                    <span className="eyebrow">Message *</span>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-accent focus:outline-none"
                      placeholder="Tell us what you're looking for."
                    />
                  </label>
                  <button
                    type="submit"
                    className="group inline-flex w-full items-center justify-center gap-3 bg-onyx px-8 py-4 text-[11px] uppercase tracking-[0.28em] text-ivory hover:bg-onyx/90"
                  >
                    <Send className="h-4 w-4" /> Send message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
          <div className="mb-10">
            <p className="eyebrow">The Location</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">
              Colombo · Sri Lanka
            </h2>
          </div>
          <div className="relative aspect-[16/9] overflow-hidden border border-border">
            <iframe
              title="Disal atelier location"
              src="https://www.google.com/maps?q=Colombo,+Sri+Lanka&output=embed"
              className="h-full w-full grayscale-[40%]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function InfoRow({
  Icon,
  label,
  value,
  href,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <>
      <div className="flex h-10 w-10 items-center justify-center border border-onyx/20 text-accent">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-sm">{value}</p>
      </div>
    </>
  );
  if (href)
    return (
      <a href={href} className="flex items-start gap-4 group">
        {inner}
      </a>
    );
  return <div className="flex items-start gap-4">{inner}</div>;
}

function HourRow({
  Icon,
  day,
  time,
}: {
  Icon: React.ComponentType<{ className?: string }>;
  day: string;
  time: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-3">
      <span className="flex items-center gap-3 text-foreground">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" /> {day}
      </span>
      <span className="text-muted-foreground">{time}</span>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="eyebrow">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm focus:border-accent focus:outline-none"
      />
    </label>
  );
}
