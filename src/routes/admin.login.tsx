import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/lib/auth-context";
import { getFirebaseDb } from "@/lib/firebase";

export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Sign in — Disal Ceylon" }] }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const { signIn, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    async function check() {
      if (!user) return;
      const db = getFirebaseDb();
      if (!db) return;
      const snap = await getDoc(doc(db, "admins", user.uid));
      if (snap.exists()) navigate({ to: "/admin", replace: true });
    }
    check();
  }, [user, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await signIn(email, password);
      const db = getFirebaseDb();
      const cur = (await import("firebase/auth")).getAuth().currentUser;
      if (!db || !cur) throw new Error("Not signed in.");
      const snap = await getDoc(doc(db, "admins", cur.uid));
      if (!snap.exists()) {
        await signOut();
        throw new Error("This account is not an admin.");
      }
      navigate({ to: "/admin", replace: true });
    } catch (e: any) {
      setErr(e?.message ?? "Sign in failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6 py-16">
      <form onSubmit={submit} className="w-full max-w-sm">
        <p className="eyebrow">Disal · Admin</p>
        <h1 className="mt-3 font-display text-4xl">Sign in.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Restricted to authorized administrators.
        </p>

        <div className="mt-10 space-y-6">
          <label className="block">
            <span className="eyebrow">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm focus:border-accent focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="eyebrow">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm focus:border-accent focus:outline-none"
            />
          </label>
        </div>

        {err && (
          <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-destructive">
            {err}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-8 w-full bg-onyx px-8 py-4 text-[11px] uppercase tracking-[0.28em] text-ivory hover:bg-onyx/90 disabled:opacity-50"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <p className="mt-8 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          First time?{" "}
          <Link to="/admin/bootstrap" className="gold-underline">
            Bootstrap admin
          </Link>
        </p>
      </form>
    </div>
  );
}
