import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, MessageCircle, Check, ShieldCheck, Loader2 } from "lucide-react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { Navbar } from "@/components/luxury/Navbar";
import { Footer } from "@/components/luxury/Footer";
import { useCart } from "@/lib/store";
import { formatPrice } from "@/lib/products";
import { generateOrderId } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { getFirebaseDb } from "@/lib/firebase";

const WHATSAPP_NUMBER = "94764837777";

/**
 * Opens a WhatsApp deep link in a new top-level tab.
 * Using window.open inside a sandboxed preview iframe can be blocked
 * (ERR_BLOCKED_BY_RESPONSE on api.whatsapp.com). A synthetic anchor
 * click with target="_blank" escapes the iframe reliably.
 */
function openWhatsApp(url: string) {
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [{ title: "Checkout — Disal Ceylon Gems & Jewelry" }],
  }),
  component: CheckoutPage,
});

type Form = {
  name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  notes: string;
};

function CheckoutPage() {
  const cart = useCart();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const orderId = useMemo(() => generateOrderId(), []);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState<Form>({
    name: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    notes: "",
  });

  // Autofill from profile once available
  useEffect(() => {
    if (!profile) return;
    setForm((f) => ({
      ...f,
      name: f.name || profile.fullName,
      email: f.email || profile.email,
      phone: f.phone || profile.phone,
      country: f.country || profile.country,
      city: f.city || profile.city,
      address: f.address || profile.address,
    }));
  }, [profile]);

  const canSubmit =
    cart.items.length > 0 &&
    form.name.trim() &&
    form.email.trim() &&
    form.phone.trim() &&
    form.country.trim();

  function buildMessage() {
    const lines: string[] = [];
    lines.push(`✦ DISAL CEYLON — Private Order ✦`);
    lines.push(``);
    lines.push(`Order ID: ${orderId}`);
    lines.push(`Date: ${new Date().toLocaleDateString("en-GB")}`);
    lines.push(``);
    lines.push(`— Client —`);
    lines.push(`Name: ${form.name}`);
    lines.push(`Email: ${form.email}`);
    lines.push(`Phone: ${form.phone}`);
    lines.push(
      `Ship to: ${[form.address, form.city, form.country]
        .filter(Boolean)
        .join(", ")}`
    );
    if (form.notes.trim()) {
      lines.push(``);
      lines.push(`— Notes —`);
      lines.push(form.notes.trim());
    }
    lines.push(``);
    lines.push(`— Pieces —`);
    cart.items.forEach((i, idx) => {
      lines.push(
        `${idx + 1}. ${i.name}  (Ref. ${i.id.toUpperCase()})  × ${i.qty}  —  ${formatPrice(
          i.priceUSD * i.qty
        )}`
      );
    });
    lines.push(``);
    lines.push(`Total: ${formatPrice(cart.total)}`);
    lines.push(``);
    lines.push(
      `Please confirm availability and next steps. Thank you.`
    );
    return lines.join("\n");
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      buildMessage()
    )}`;
    openWhatsApp(url);
    setSent(true);
  }

  if (cart.items.length === 0 && !sent) {
    return (
      <div className="bg-background text-foreground">
        <Navbar />
        <section className="mx-auto max-w-[1400px] px-6 pt-40 pb-32 md:px-10 text-center">
          <p className="eyebrow">Checkout</p>
          <h1 className="mt-4 font-display text-5xl">
            Your vault is empty.
          </h1>
          <Link
            to="/gemstones"
            className="mt-10 inline-flex items-center gap-3 border border-onyx/30 px-8 py-4 text-[11px] uppercase tracking-[0.28em] hover:border-accent hover:text-accent"
          >
            Explore the collection
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground">
      <Navbar />
      <section className="mx-auto max-w-[1400px] px-6 pt-32 pb-24 md:px-10">
        <div className="border-b border-border pb-8 mb-12">
          <p className="eyebrow">Confirmation</p>
          <h1 className="mt-3 font-display text-5xl md:text-6xl">
            Confirm your order.
          </h1>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground leading-relaxed">
            Every Disal acquisition is finalised personally with our concierge
            over WhatsApp. Fill in your details and we will confirm
            availability, arrange secure payment and coordinate insured
            delivery.
          </p>
        </div>

        {sent ? (
          <div className="mx-auto max-w-xl border border-accent/40 bg-accent/5 p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent text-onyx">
              <Check className="h-5 w-5" />
            </div>
            <p className="eyebrow mt-6">Order forwarded</p>
            <h2 className="mt-3 font-display text-3xl">
              Order {orderId} sent.
            </h2>
            <p className="mt-4 text-sm text-muted-foreground">
              A WhatsApp conversation has opened with our concierge. If not,
              please tap below to resend.
            </p>
            <button
              onClick={submit}
              className="mt-6 inline-flex items-center gap-2 border border-onyx/30 px-6 py-3 text-[11px] uppercase tracking-[0.24em] hover:border-accent hover:text-accent"
            >
              <MessageCircle className="h-4 w-4" /> Reopen WhatsApp
            </button>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                to="/"
                className="text-[11px] uppercase tracking-[0.24em] gold-underline"
              >
                Return home
              </Link>
              <button
                onClick={() => {
                  cart.clear();
                  navigate({ to: "/" });
                }}
                className="text-[11px] uppercase tracking-[0.24em] gold-underline"
              >
                Clear cart
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="grid gap-14 lg:grid-cols-12">
            <div className="lg:col-span-7 space-y-10">
              <FieldSet legend="Client">
                <Field label="Full name" name="name" value={form.name} onChange={setForm} required />
                <Field label="Email" name="email" type="email" value={form.email} onChange={setForm} required />
                <Field label="Phone (with country code)" name="phone" value={form.phone} onChange={setForm} required />
              </FieldSet>

              <FieldSet legend="Delivery">
                <Field label="Country" name="country" value={form.country} onChange={setForm} required />
                <Field label="City" name="city" value={form.city} onChange={setForm} />
                <Field label="Address" name="address" value={form.address} onChange={setForm} full />
              </FieldSet>

              <FieldSet legend="Notes to atelier">
                <div className="col-span-2">
                  <label className="eyebrow block">Message (optional)</label>
                  <textarea
                    rows={4}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="mt-2 w-full border border-border bg-transparent px-4 py-3 text-sm focus:border-accent focus:outline-none"
                    placeholder="Ring size, engraving, private viewing…"
                  />
                </div>
              </FieldSet>
            </div>

            <aside className="lg:col-span-5">
              <div className="border border-border p-8 lg:sticky lg:top-32">
                <p className="eyebrow">Order {orderId}</p>
                <ul className="mt-6 divide-y divide-border">
                  {cart.items.map((i) => (
                    <li key={i.id} className="flex items-center gap-4 py-4">
                      <img
                        src={i.image}
                        alt={i.name}
                        className="h-16 w-16 object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-display text-lg leading-tight">
                          {i.name}
                        </p>
                        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                          × {i.qty}
                        </p>
                      </div>
                      <span className="text-sm text-accent">
                        {formatPrice(i.priceUSD * i.qty)}
                      </span>
                    </li>
                  ))}
                </ul>
                <dl className="mt-4 space-y-2 text-sm border-t border-border pt-4">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd>{formatPrice(cart.total)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Shipping</dt>
                    <dd className="text-accent">Complimentary</dd>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-border">
                    <dt className="eyebrow">Total</dt>
                    <dd className="font-display text-2xl text-accent">
                      {formatPrice(cart.total)}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 border-t border-border pt-6">
                  <p className="eyebrow">Bank Transfer Details</p>
                  <dl className="mt-3 space-y-1.5 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Account No.</dt>
                      <dd className="font-mono tracking-wide">030-13862992-001</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Name</dt>
                      <dd className="text-right">Disal Ceylon Gem &amp; Jewellery</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Bank</dt>
                      <dd>Saylan Bank</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Branch</dt>
                      <dd>Kaluthara, Sri Lanka</dd>
                    </div>
                  </dl>
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="group mt-6 inline-flex w-full items-center justify-center gap-3 bg-[#25D366] px-6 py-4 text-[11px] uppercase tracking-[0.28em] text-white hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MessageCircle className="h-4 w-4" />
                  Confirm Order via WhatsApp
                </button>

                <div className="mt-6 flex items-start gap-3 border-t border-border pt-6">
                  <ShieldCheck className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" strokeWidth={1.25} />
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    Your details open a private WhatsApp with our concierge.
                    No card is charged on this site.
                  </p>
                </div>
              </div>
            </aside>
          </form>
        )}
      </section>
      <Footer />
    </div>
  );
}

function FieldSet({
  legend,
  children,
}: {
  legend: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className="eyebrow mb-4">{legend}</legend>
      <div className="grid grid-cols-2 gap-x-6 gap-y-5">{children}</div>
    </fieldset>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
  full,
}: {
  label: string;
  name: keyof Form;
  value: string;
  onChange: React.Dispatch<React.SetStateAction<Form>>;
  type?: string;
  required?: boolean;
  full?: boolean;
}) {
  return (
    <label className={`block ${full ? "col-span-2" : "col-span-2 sm:col-span-1"}`}>
      <span className="eyebrow">
        {label}
        {required ? " *" : ""}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) =>
          onChange((prev) => ({ ...prev, [name]: e.target.value }))
        }
        className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm focus:border-accent focus:outline-none"
      />
    </label>
  );
}
