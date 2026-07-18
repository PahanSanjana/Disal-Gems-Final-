import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { AdminGate } from "@/components/admin/AdminShell";
import { getFirebaseDb } from "@/lib/firebase";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Dashboard — Disal Ceylon" }] }),
  component: () => (
    <AdminGate>
      <Dashboard />
    </AdminGate>
  ),
});

function Dashboard() {
  const [counts, setCounts] = useState({
    gemstones: 0,
    jewelry: 0,
  });

  useEffect(() => {
    const db = getFirebaseDb();
    if (!db) return;

    (async () => {
      const [g, j] = await Promise.all([
        getDocs(collection(db, "gemstones")),
        getDocs(collection(db, "jewelry")),
      ]);

      setCounts({
        gemstones: g.size,
        jewelry: j.size,
      });
    })();
  }, []);

  const cards = [
    { label: "Total Gemstones", value: counts.gemstones, to: "/admin/gemstones" },
    { label: "Total Jewelry", value: counts.jewelry, to: "/admin/jewelry" },
  ];

  return (
    <div>
      <p className="eyebrow">Overview</p>
      <h1 className="mt-3 font-display text-4xl md:text-5xl">Dashboard</h1>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to as any}
            className="border border-border p-6 hover:border-accent transition-colors"
          >
            <p className="eyebrow">{c.label}</p>
            <p className="mt-4 font-display text-4xl text-accent">{c.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}