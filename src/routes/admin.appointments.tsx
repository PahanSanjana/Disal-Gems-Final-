import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AdminGate } from "@/components/admin/AdminShell";
import { subscribeCollection, updateItem } from "@/lib/firestore-products";

const STATUSES = ["Pending", "Confirmed", "Completed", "Cancelled"] as const;
type Status = (typeof STATUSES)[number];

type Appt = {
  id: string;
  name?: string;
  customerName?: string;
  email?: string;
  phone?: string;
  preferredDate?: string;
  preferredTime?: string;
  consultationType?: string;
  message?: string;
  status?: Status;
  createdAt?: any;
};

export const Route = createFileRoute("/admin/appointments")({
  head: () => ({ meta: [{ title: "Appointments — Admin" }] }),
  component: () => (
    <AdminGate>
      <AppointmentsPage />
    </AdminGate>
  ),
});

function AppointmentsPage() {
  const [items, setItems] = useState<Appt[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Status | "All">("All");

  useEffect(() => subscribeCollection<Appt>("appointments", setItems), []);

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return items.filter((i) => {
      if (filter !== "All" && (i.status || "Pending") !== filter) return false;
      if (!s) return true;
      return (
        (i.name || i.customerName)?.toLowerCase().includes(s) ||
        i.email?.toLowerCase().includes(s) ||
        i.phone?.toLowerCase().includes(s) ||
        i.consultationType?.toLowerCase().includes(s)
      );
    });
  }, [items, search, filter]);

  async function changeStatus(id: string, status: Status) {
    await updateItem("appointments", id, { status });
  }

  return (
    <div>
      <div className="border-b border-border pb-6">
        <p className="eyebrow">Bookings</p>
        <h1 className="mt-2 font-display text-4xl">Appointments</h1>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, type…"
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
              <Th>Ref.</Th>
              <Th>Customer</Th>
              <Th>Contact</Th>
              <Th>Date · Time</Th>
              <Th>Type</Th>
              <Th>Message</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                  No appointments match.
                </td>
              </tr>
            ) : (
              filtered.map((a) => (
                <tr key={a.id} className="border-b border-border/60 align-top">
                  <td className="p-3 font-mono text-xs">{a.id.slice(0, 8)}</td>
                  <td className="p-3 font-display">{a.name || a.customerName || "—"}</td>
                  <td className="p-3 text-muted-foreground text-xs">
                    {a.email}
                    <br />
                    {a.phone}
                  </td>
                  <td className="p-3 text-xs">
                    {a.preferredDate}
                    <br />
                    <span className="text-muted-foreground">{a.preferredTime}</span>
                  </td>
                  <td className="p-3 text-muted-foreground">{a.consultationType}</td>
                  <td className="p-3 text-xs max-w-xs truncate" title={a.message}>
                    {a.message}
                  </td>
                  <td className="p-3">
                    <select
                      value={a.status || "Pending"}
                      onChange={(e) => changeStatus(a.id, e.target.value as Status)}
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
