import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { Navbar } from "@/components/luxury/Navbar";
import { Footer } from "@/components/luxury/Footer";
import { useAuth, type Profile } from "@/lib/auth-context";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "Account — Disal Ceylon Gems & Jewelry" }] }),
  component: AccountPage,
});

function AccountPage() {
  const { user, profile, loading, saveProfile, signOut, ready } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<Profile>({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    address: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) setForm(profile);
    else if (user?.email) setForm((f) => ({ ...f, email: user.email ?? "" }));
  }, [profile, user]);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="bg-background text-foreground min-h-screen">
        <Navbar />
        <section className="mx-auto max-w-lg px-6 pt-40 pb-24 text-center">
          <p className="eyebrow">Loading</p>
          <h1 className="mt-3 font-display text-3xl">One moment…</h1>
          {!ready && (
            <p className="mt-4 text-xs text-muted-foreground">
              Firebase is not connected yet. Add credentials to <code>.env.local</code>.
            </p>
          )}
        </section>
      </div>
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await saveProfile(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-background text-foreground">
      <Navbar />
      <section className="mx-auto max-w-3xl px-6 pt-40 pb-24 md:px-10">
        <div className="flex items-end justify-between mb-10 border-b border-border pb-8">
          <div>
            <p className="eyebrow">Your account</p>
            <h1 className="mt-3 font-display text-4xl md:text-5xl">
              {profile?.fullName || "Welcome"}.
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
          </div>
          <button
            onClick={() => signOut()}
            className="text-[11px] uppercase tracking-[0.24em] gold-underline"
          >
            Sign out
          </button>
        </div>

        <form onSubmit={submit} className="space-y-10">
          <FieldSet legend="Client Information">
            <Field label="Full name *" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} full />
            <Field label="Email *" value={form.email} onChange={(v) => setForm({ ...form, email: v })} type="email" />
            <Field label="Phone (with country code) *" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          </FieldSet>

          <FieldSet legend="Delivery Information">
            <Field label="Country *" value={form.country} onChange={(v) => setForm({ ...form, country: v })} />
            <Field label="City *" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
            <Field label="Address *" value={form.address} onChange={(v) => setForm({ ...form, address: v })} full />
          </FieldSet>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-onyx px-8 py-4 text-[11px] uppercase tracking-[0.28em] text-ivory hover:bg-onyx/90 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save profile"}
            </button>
            {saved && (
              <span className="text-[11px] uppercase tracking-[0.24em] text-accent">
                Saved
              </span>
            )}
            <Link
              to="/wishlist"
              className="ml-auto text-[11px] uppercase tracking-[0.24em] gold-underline"
            >
              View wishlist
            </Link>
          </div>
        </form>

        <div className="mt-16 border-t border-border pt-10">
          <ChangePasswordSection />
        </div>
      </section>
      <Footer />
    </div>
  );
}

function FieldSet({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="eyebrow mb-4">{legend}</legend>
      <div className="grid grid-cols-2 gap-x-6 gap-y-5">{children}</div>
    </fieldset>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  full,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  full?: boolean;
}) {
  return (
    <label className={`block ${full ? "col-span-2" : "col-span-2 sm:col-span-1"}`}>
      <span className="eyebrow">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm focus:border-accent focus:outline-none"
      />
    </label>
  );
}

function ChangePasswordSection() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (next.length < 6) {
      setMsg({ ok: false, text: "New password must be at least 6 characters." });
      return;
    }
    if (next !== confirm) {
      setMsg({ ok: false, text: "Passwords do not match." });
      return;
    }
    setBusy(true);
    try {
      const auth = getFirebaseAuth();
      const u = auth?.currentUser;
      if (!auth || !u || !u.email) throw new Error("Not signed in.");
      const cred = EmailAuthProvider.credential(u.email, current);
      await reauthenticateWithCredential(u, cred);
      await updatePassword(u, next);
      setMsg({ ok: true, text: "Password updated." });
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (e: any) {
      setMsg({ ok: false, text: e?.message ?? "Failed to update password." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit}>
      <p className="eyebrow">Security</p>
      <h2 className="mt-2 font-display text-2xl">Change password</h2>
      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5">
        <label className="col-span-2 sm:col-span-1 block">
          <span className="eyebrow">Current password</span>
          <input
            type="password"
            required
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm focus:border-accent focus:outline-none"
          />
        </label>
        <label className="col-span-2 sm:col-span-1 block">
          <span className="eyebrow">New password</span>
          <input
            type="password"
            required
            minLength={6}
            value={next}
            onChange={(e) => setNext(e.target.value)}
            className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm focus:border-accent focus:outline-none"
          />
        </label>
        <label className="col-span-2 sm:col-span-1 block">
          <span className="eyebrow">Confirm new password</span>
          <input
            type="password"
            required
            minLength={6}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm focus:border-accent focus:outline-none"
          />
        </label>
      </div>
      {msg && (
        <p
          className={`mt-4 text-[11px] uppercase tracking-[0.22em] ${
            msg.ok ? "text-accent" : "text-destructive"
          }`}
        >
          {msg.text}
        </p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="mt-6 bg-onyx px-8 py-4 text-[11px] uppercase tracking-[0.28em] text-ivory hover:bg-onyx/90 disabled:opacity-50"
      >
        {busy ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
