import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/luxury/Navbar";
import { Footer } from "@/components/luxury/Footer";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign In — Disal Ceylon Gems & Jewelry" }] }),
  component: AuthPage,
});

function AuthPage() {
  const { signIn, signUp, ready } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    country: "",
    city: "",
    address: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready) {
      setError("Authentication is not configured yet. Add your Firebase config in .env.local.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (mode === "signin") {
        await signIn(form.email, form.password);
      } else {
        await signUp(form.email, form.password, {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          country: form.country,
          city: form.city,
          address: form.address,
        });
      }
      navigate({ to: "/account" });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      setError(msg.replace(/^Firebase:\s*/, ""));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-background text-foreground">
      <Navbar />
      <section className="mx-auto max-w-lg px-6 pt-40 pb-24 md:px-10">
        <p className="eyebrow text-center">The Client Book</p>
        <h1 className="mt-3 font-display text-5xl text-center">
          {mode === "signin" ? "Welcome back." : "Join the Client Book."}
        </h1>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          {mode === "signin"
            ? "Sign in to view your wishlist and private atelier notes."
            : "Create a private account with the Disal atelier."}
        </p>

        {!ready && (
          <div className="mt-8 border border-accent/40 bg-accent/5 p-4 text-xs text-muted-foreground">
            Firebase is not yet connected. Add your web-app credentials to{" "}
            <code>.env.local</code> and restart the dev server to enable sign-in.
          </div>
        )}

        <form onSubmit={submit} className="mt-10 space-y-5">
          {mode === "signup" && (
            <>
              <Input label="Full name *" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} required />
              <Input label="Phone (with country code) *" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Country *" value={form.country} onChange={(v) => setForm({ ...form, country: v })} required />
                <Input label="City *" value={form.city} onChange={(v) => setForm({ ...form, city: v })} required />
              </div>
              <Input label="Address *" value={form.address} onChange={(v) => setForm({ ...form, address: v })} required />
            </>
          )}
          <Input label="Email *" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
          <Input label="Password *" type="password" value={form.password} onChange={(v) => setForm({ ...form, password: v })} required />

          {error && <p className="text-xs text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-onyx px-8 py-4 text-[11px] uppercase tracking-[0.28em] text-ivory hover:bg-onyx/90 disabled:opacity-50"
          >
            {loading ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          {mode === "signin" ? (
            <>
              New to Disal?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="text-accent gold-underline"
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="text-accent gold-underline"
              >
                Sign in
              </button>
            </>
          )}
        </p>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-accent">Return home</Link>
        </p>
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
