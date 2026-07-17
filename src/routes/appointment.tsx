import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MessageCircle, Check, Calendar } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Navbar } from "@/components/luxury/Navbar";
import { Footer } from "@/components/luxury/Footer";
import { getFirebaseDb } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";

const WHATSAPP_NUMBER = "94764837777";

export const Route = createFileRoute("/appointment")({
  head: () => ({ meta: [{ title: "Private Appointment — Disal Ceylon Gems & Jewelry" }] }),
  component: AppointmentPage,
});

type Form = {
  fullName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  type: string;
  message: string;
};

const consultationTypes = [
  "Gemstone Viewing",
  "Custom Design Consultation",
  "Jewelry Enquiry",
  "Investment Advisory",
  "Repair & Restoration",
];

function AppointmentPage() {
  const { user, profile } = useAuth();
  const [form, setForm] = useState<Form>({
    fullName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    type: consultationTypes[0],
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setForm((f) => ({
        ...f,
        fullName: f.fullName || profile.fullName,
        email: f.email || profile.email,
        phone: f.phone || profile.phone,
      }));
    }
  }, [profile]);

  function buildMessage() {
    return [
      "Hello Disal Ceylon Gems & Jewelry,",
      "",
      "I would like to request a private consultation.",
      "",
      "Appointment Details:",
      `Name: ${form.fullName}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone}`,
      `Date: ${form.date}`,
      `Time: ${form.time}`,
      `Consultation Type: ${form.type}`,
      `Message: ${form.message || "—"}`,
      "",
      "Thank you.",
      "I look forward to your response.",
    ].join("\n");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const db = getFirebaseDb();
      if (db) {
        await addDoc(collection(db, "appointments"), {
          userId: user?.uid ?? null,
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          date: form.date,
          time: form.time,
          type: form.type,
          message: form.message,
          status: "pending",
          createdAt: serverTimestamp(),
        });
      }
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        buildMessage()
      )}`;
      { const a = document.createElement("a"); a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer"; document.body.appendChild(a); a.click(); a.remove(); }
      setSent(true);
    } catch (e: unknown) {
      console.error(e);
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      setError(
        `Could not save appointment (${msg}). WhatsApp will still open so you can reach us.`
      );
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        buildMessage()
      )}`;
      { const a = document.createElement("a"); a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer"; document.body.appendChild(a); a.click(); a.remove(); }
      setSent(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-background text-foreground">
      <Navbar />
      <section className="mx-auto max-w-3xl px-6 pt-40 pb-24 md:px-10">
        <div className="text-center border-b border-border pb-10 mb-14">
          <p className="eyebrow">Private Consultation</p>
          <h1 className="mt-4 font-display text-5xl md:text-6xl">
            An appointment with the atelier.
          </h1>
          <p className="mt-6 max-w-xl mx-auto text-sm text-muted-foreground leading-relaxed">
            A private viewing in Colombo, a video call, or a bespoke design
            consultation. Choose a date and time; we confirm within the day.
          </p>
        </div>

        {sent ? (
          <div className="border border-accent/40 bg-accent/5 p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent text-onyx">
              <Check className="h-5 w-5" />
            </div>
            <h2 className="mt-6 font-display text-3xl">Request received.</h2>
            <p className="mt-4 text-sm text-muted-foreground">
              A WhatsApp conversation has opened with our concierge to confirm
              the details. Your appointment is saved in our diary.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <Input label="Full name *" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} required />
              <Input label="Email *" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
            </div>
            <Input label="Phone (with country code) *" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
            <div className="grid gap-6 sm:grid-cols-2">
              <Input label="Preferred date *" type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} required />
              <Input label="Preferred time *" type="time" value={form.time} onChange={(v) => setForm({ ...form, time: v })} required />
            </div>
            <label className="block">
              <span className="eyebrow">Consultation type *</span>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm focus:border-accent focus:outline-none"
              >
                {consultationTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="eyebrow">Message</span>
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-accent focus:outline-none"
                placeholder="A stone in mind, a piece to restore…"
              />
            </label>

            {error && (
              <p className="text-xs text-muted-foreground">{error}</p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="group inline-flex w-full items-center justify-center gap-3 bg-[#25D366] px-6 py-4 text-[11px] uppercase tracking-[0.28em] text-white hover:brightness-95 disabled:opacity-60"
            >
              <MessageCircle className="h-4 w-4" />
              {saving ? "Saving…" : "Request via WhatsApp"}
            </button>

            <p className="text-[11px] leading-relaxed text-muted-foreground text-center flex items-center justify-center gap-2">
              <Calendar className="h-3 w-3" />
              Your request is saved in our diary and confirmed personally on WhatsApp.
            </p>
          </form>
        )}
      </section>
      <Footer />
    </div>
  );
}

function Input({
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
      <span className="eyebrow">{label}</span>
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
