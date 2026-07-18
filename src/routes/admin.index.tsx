import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
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
    orders: 0,
    appointments: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);

  useEffect(() => {
    const db = getFirebaseDb();
    if (!db) return;
    (async () => {
      const [g, j, o, a] = await Promise.all([
        getDocs(collection(db, "gemstones")),
        getDocs(collection(db, "jewelry")),
        getDocs(collection(db, "orders")),
        getDocs(collection(db, "appointments")),
      ]);
      setCounts({
        gemstones: g.size,
        jewelry: j.size,
        orders: o.size,
        appointments: a.size,
      });
      try {
        const ro = await getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc"), limit(5)));
        setRecentOrders(ro.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch {}
      try {
        const ra = await getDocs(query(collection(db, "appointments"), orderBy("createdAt", "desc"), limit(5)));
        setRecentAppointments(ra.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch {}
    })();
  }, []);

  const cards = [
    { label: "Total Gemstones", value: counts.gemstones, to: "/admin/gemstones" },
    { label: "Total Jewelry", value: counts.jewelry, to: "/admin/jewelry" },
    { label: "Total Orders", value: counts.orders, to: "/admin/orders" },
    { label: "Total Appointments", value: counts.appointments, to: "/admin/appointments" },
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

      <div className="mt-14 grid gap-8 lg:grid-cols-2">
        <RecentList
          title="Recent Orders"
          rows={recentOrders}
          empty="No orders yet."
          render={(r) => (
            <>
              <p className="font-display text-lg">{r.name || r.customerName || "—"}</p>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                {r.status || "pending"}
              </p>
            </>
          )}
        />
        <RecentList
          title="Recent Appointments"
          rows={recentAppointments}
          empty="No appointments yet."
          render={(r) => (
            <>
              <p className="font-display text-lg">{r.name || r.customerName || "—"}</p>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                {r.preferredDate || r.date || "—"} · {r.status || "pending"}
              </p>
            </>
          )}
        />
      </div>
    </div>
  );
}

function RecentList({
  title,
  rows,
  empty,
  render,
}: {
  title: string;
  rows: any[];
  empty: string;
  render: (r: any) => React.ReactNode;
}) {
  return (
    <div className="border border-border p-6">
      <p className="eyebrow">{title}</p>
      {rows.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="mt-4 divide-y divide-border">
          {rows.map((r) => (
            <li key={r.id} className="py-4">
              {render(r)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
