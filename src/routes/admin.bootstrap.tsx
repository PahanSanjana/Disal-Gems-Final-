import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, doc, getDocs, limit, query, serverTimestamp, setDoc } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase";

export const Route = createFileRoute("/admin/bootstrap")({
  head: () => ({ meta: [{ title: "Bootstrap Admin — Disal Ceylon" }] }),
  component: BootstrapPage,
});

function BootstrapPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("disalceylongems@gmail.com");
  const [password, setPassword] = useState("Disal@2002");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    async function check() {
      const db = getFirebaseDb();
      if (!db) return;
      const snap = await getDocs(query(collection(db, "admins"), limit(1)));
      setAllowed(snap.empty);
    }
    check();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const auth = getFirebaseAuth();
      const db = getFirebaseDb();
      if (!auth || !db) throw new Error("Firebase not configured.");

      let uid: string;
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        uid = cred.user.uid;
      } catch (e: any) {
        if (e?.code === "auth/email-already-in-use") {
          const cred = await signInWithEmailAndPassword(auth, email, password);
          uid = cred.user.uid;
        } else {
          throw e;
        }
      }
      await setDoc(doc(db, "admins", uid), {
        email,
        createdAt: serverTimestamp(),
      });
      setMsg("Admin created. Redirecting…");
      setTimeout(() => navigate({ to: "/admin", replace: true }), 1200);
    } catch (e: any) {
      setMsg(e?.message ?? "Bootstrap failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6 py-16">
      <form onSubmit={submit} className="w-full max-w-sm">
        <p className="eyebrow">Disal · Admin</p>
        <h1 className="mt-3 font-display text-4xl">Bootstrap.</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          One-time setup: creates the first admin account.
        </p>

        {allowed === false && (
          <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-destructive">
            An admin already exists. Bootstrap is disabled.
          </p>
        )}

        <div className="mt-10 space-y-6">
          <label className="block">
            <span className="eyebrow">Admin email</span>
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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm focus:border-accent focus:outline-none"
            />
          </label>
        </div>

        {msg && (
          <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-accent">
            {msg}
          </p>
        )}

        <button
          type="submit"
          disabled={busy || allowed === false}
          className="mt-8 w-full bg-onyx px-8 py-4 text-[11px] uppercase tracking-[0.28em] text-ivory hover:bg-onyx/90 disabled:opacity-50"
        >
          {busy ? "Creating…" : "Create admin"}
        </button>
      </form>
    </div>
  );
}
