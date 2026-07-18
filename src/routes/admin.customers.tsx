import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { AdminGate } from "@/components/admin/AdminShell";
import { getFirebaseDb } from "@/lib/firebase";

type Customer = {
  id: string;
  fullName?: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
  address?: string;
  createdAt?: any;
};

export const Route = createFileRoute("/admin/customers")({
  head: () => ({ meta: [{ title: "Customers — Admin" }] }),
  component: () => (
    <AdminGate>
      <CustomersPage />
    </AdminGate>
  ),
});

function CustomersPage() {
  const [items, setItems] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const db = getFirebaseDb();
    if (!db) return;
    (async () => {
      try {
        const snap = await getDocs(
          query(collection(db, "users"), orderBy("createdAt", "desc"))
        );
        setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
      } catch {
        try {
          const snap = await getDocs(collection(db, "users"));
          setItems(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
        } catch {}
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    if (!s) return items;
    return items.filter(
      (c) =>
        c.fullName?.toLowerCase().includes(s) ||
        c.email?.toLowerCase().includes(s) ||
        c.phone?.toLowerCase().includes(s)
    );
  }, [items, search]);

  return (
    <div>
      <div className="border-b border-border pb-6">
        <p className="eyebrow">Clientele</p>
        <h1 className="mt-2 font-display text-4xl">Customers</h1>
      </div>

      <div className="mt-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers…"
          className="w-full border border-border bg-transparent pl-10 pr-4 py-2.5 text-sm focus:border-accent focus:outline-none"
        />
      </div>

      <div className="mt-6 border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border">
            <tr className="text-left">
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Location</Th>
              <Th>Joined</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  No customers yet.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="border-b border-border/60">
                  <td className="p-3 font-display">{c.fullName || "—"}</td>
                  <td className="p-3 text-muted-foreground">{c.email || "—"}</td>
                  <td className="p-3 text-muted-foreground">{c.phone || "—"}</td>
                  <td className="p-3 text-muted-foreground">
                    {[c.city, c.country].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="p-3 text-muted-foreground text-xs">
                    {c.createdAt?.toDate?.().toLocaleDateString?.() ?? "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="p-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-normal">
      {children}
    </th>
  );
}
