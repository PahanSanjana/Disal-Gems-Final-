import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AdminGate } from "@/components/admin/AdminShell";
import { subscribeCollection, updateItem } from "@/lib/firestore-products";

const STATUSES = ["Pending", "Confirmed", "Processing", "Completed", "Cancelled"] as const;
type Status = (typeof STATUSES)[number];

type Order = {
  id: string;
  orderId?: string;
  name?: string;
  customerName?: string;
  email?: string;
  phone?: string;
  items?: any[];
  total?: number;
  status?: Status;
  createdAt?: any;
};

export const Route = createFileRoute("/admin/orders")({
  head: () => ({ meta: [{ title: "Orders — Admin" }] }),
  component: () => (
    <AdminGate>
      <OrdersPage />
    </AdminGate>
  ),
});

function OrdersPage() {
  const [items, setItems] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Status | "All">("All");

  useEffect(() => subscribeCollection<Order>("orders", setItems), []);

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return items.filter((i) => {
      if (filter !== "All" && (i.status || "Pending") !== filter) return false;
      if (!s) return true;
      return (
        i.orderId?.toLowerCase().includes(s) ||
        (i.name || i.customerName)?.toLowerCase().includes(s) ||
        i.email?.toLowerCase().includes(s) ||
        i.phone?.toLowerCase().includes(s)
      );
    });
  }, [items, search, filter]);

  async function changeStatus(id: string, status: Status) {
    await updateItem("orders", id, { status });
  }

  return (
    <div>
      <div className="border-b border-border pb-6">
        <p className="eyebrow">Concierge</p>
        <h1 className="mt-2 font-display text-4xl">Orders</h1>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, name, email…"
            className="w-full border border-border bg-transparent pl-10 pr-4 py-2.5 text-sm focus:border-accent focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {(["All", ...STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s as any)}
              className={`px-3 py-2 text-[11px] uppercase tracking-[0.2em] border ${
                filter === s ? "border-accent text-accent" : "border-border text-muted-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border">
            <tr className="text-left">
              <Th>Order ID</Th>
              <Th>Customer</Th>
              <Th>Contact</Th>
              <Th>Items</Th>
              <Th>Total</Th>
              <Th>Date</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                  No orders match.
                </td>
              </tr>
            ) : (
              filtered.map((o) => (
                <tr key={o.id} className="border-b border-border/60 align-top">
                  <td className="p-3 font-mono text-xs">{o.orderId || o.id.slice(0, 8)}</td>
                  <td className="p-3 font-display">{o.name || o.customerName || "—"}</td>
                  <td className="p-3 text-muted-foreground text-xs">
                    {o.email}
                    <br />
                    {o.phone}
                  </td>
                  <td className="p-3 text-muted-foreground">{o.items?.length ?? 0}</td>
                  <td className="p-3">${(o.total ?? 0).toLocaleString()}</td>
                  <td className="p-3 text-muted-foreground text-xs">
                    {o.createdAt?.toDate?.().toLocaleDateString?.() ?? "—"}
                  </td>
                  <td className="p-3">
                    <select
                      value={o.status || "Pending"}
                      onChange={(e) => changeStatus(o.id, e.target.value as Status)}
                      className="border border-border bg-transparent px-2 py-1.5 text-xs focus:border-accent focus:outline-none"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
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
