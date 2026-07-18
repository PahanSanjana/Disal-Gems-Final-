import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { AdminGate } from "@/components/admin/AdminShell";
import { subscribeCollection } from "@/lib/firestore-products";

type Contact = {
  id: string;
  contactId?: string;
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  createdAt?: any;
};

export const Route = createFileRoute("/admin/contacts")({
  head: () => ({ meta: [{ title: "Contact Messages — Admin" }] }),
  component: () => (
    <AdminGate>
      <ContactsPage />
    </AdminGate>
  ),
});

function ContactsPage() {
  const [items, setItems] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Contact | null>(null);

  useEffect(() => subscribeCollection<Contact>("contacts", setItems), []);

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    if (!s) return items;
    return items.filter(
      (c) =>
        c.name?.toLowerCase().includes(s) ||
        c.email?.toLowerCase().includes(s) ||
        c.subject?.toLowerCase().includes(s) ||
        c.message?.toLowerCase().includes(s)
    );
  }, [items, search]);

  return (
    <div>
      <div className="border-b border-border pb-6">
        <p className="eyebrow">Correspondence</p>
        <h1 className="mt-2 font-display text-4xl">Contact Messages</h1>
      </div>

      <div className="mt-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search messages…"
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
              <Th>Subject</Th>
              <Th>Message</Th>
              <Th>Date</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground">
                  No messages yet.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className="border-b border-border/60 cursor-pointer hover:bg-muted/40 align-top"
                >
                  <td className="p-3 font-display">{c.name || "—"}</td>
                  <td className="p-3 text-muted-foreground text-xs">{c.email || "—"}</td>
                  <td className="p-3 text-muted-foreground text-xs">{c.phone || "—"}</td>
                  <td className="p-3">{c.subject || "—"}</td>
                  <td className="p-3 text-xs max-w-xs truncate">{c.message}</td>
                  <td className="p-3 text-muted-foreground text-xs">
                    {c.createdAt?.toDate?.().toLocaleDateString?.() ?? "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-background border border-border">
            <div className="flex items-center justify-between border-b border-border p-6">
              <div>
                <p className="eyebrow">Message</p>
                <p className="mt-1 font-display text-2xl">{selected.subject || "—"}</p>
              </div>
              <button onClick={() => setSelected(null)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <p><span className="text-muted-foreground">From: </span>{selected.name}</p>
              <p><span className="text-muted-foreground">Email: </span>{selected.email}</p>
              <p><span className="text-muted-foreground">Phone: </span>{selected.phone || "—"}</p>
              <p className="text-xs text-muted-foreground">
                {selected.createdAt?.toDate?.().toLocaleString?.() ?? "—"}
              </p>
              <div className="border-t border-border pt-4 whitespace-pre-wrap leading-relaxed">
                {selected.message}
              </div>
            </div>
          </div>
        </div>
      )}
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
