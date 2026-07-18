import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { AdminGate } from "@/components/admin/AdminShell";
import { subscribeCollection, updateItem } from "@/lib/firestore-products";

const STATUSES = [
  "Pending",
  "Confirmed",
  "Preparing",
  "Ready",
  "Completed",
  "Cancelled",
] as const;
type Status = (typeof STATUSES)[number];

type OrderProduct = {
  productId?: string;
  productName?: string;
  productType?: string;
  price?: number;
  quantity?: number;
  image?: string;
};

type Order = {
  id: string;
  orderId?: string;
  userId?: string;
  customerName?: string;
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
  address?: string;
  orderNotes?: string;
  products?: OrderProduct[];
  items?: any[];
  totalQuantity?: number;
  subtotal?: number;
  deliveryFee?: number;
  discount?: number;
  totalAmount?: number;
  total?: number;
  status?: Status;
  paymentMethod?: string;
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
  const [selected, setSelected] = useState<Order | null>(null);

  useEffect(() => subscribeCollection<Order>("orders", setItems), []);

  // keep modal fresh after status update
  useEffect(() => {
    if (!selected) return;
    const updated = items.find((i) => i.id === selected.id);
    if (updated && updated !== selected) setSelected(updated);
  }, [items, selected]);

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return items.filter((i) => {
      if (filter !== "All" && (i.status || "Pending") !== filter) return false;
      if (!s) return true;
      return (
        i.orderId?.toLowerCase().includes(s) ||
        (i.customerName || i.name)?.toLowerCase().includes(s) ||
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
              <Th>Location</Th>
              <Th>Items</Th>
              <Th>Total</Th>
              <Th>Date</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-muted-foreground">
                  No orders match.
                </td>
              </tr>
            ) : (
              filtered.map((o) => {
                const productCount = o.products?.length ?? o.items?.length ?? 0;
                const total = o.totalAmount ?? o.total ?? 0;
                return (
                  <tr
                    key={o.id}
                    onClick={() => setSelected(o)}
                    className="border-b border-border/60 align-top cursor-pointer hover:bg-muted/40"
                  >
                    <td className="p-3 font-mono text-xs">{o.orderId || o.id.slice(0, 8)}</td>
                    <td className="p-3 font-display">{o.customerName || o.name || "—"}</td>
                    <td className="p-3 text-muted-foreground text-xs">
                      {o.email}
                      <br />
                      {o.phone}
                    </td>
                    <td className="p-3 text-muted-foreground text-xs">
                      {[o.city, o.country].filter(Boolean).join(", ") || "—"}
                    </td>
                    <td className="p-3 text-muted-foreground">{productCount}</td>
                    <td className="p-3">${total.toLocaleString()}</td>
                    <td className="p-3 text-muted-foreground text-xs">
                      {o.createdAt?.toDate?.().toLocaleDateString?.() ?? "—"}
                    </td>
                    <td className="p-3" onClick={(e) => e.stopPropagation()}>
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
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <OrderDetail order={selected} onClose={() => setSelected(null)} onStatus={changeStatus} />
      )}
    </div>
  );
}

function OrderDetail({
  order,
  onClose,
  onStatus,
}: {
  order: Order;
  onClose: () => void;
  onStatus: (id: string, s: Status) => Promise<void>;
}) {
  const products: OrderProduct[] =
    order.products ??
    (order.items?.map((i: any) => ({
      productId: i.id,
      productName: i.name,
      price: i.priceUSD ?? i.price,
      quantity: i.qty ?? i.quantity,
      image: i.image,
    })) ??
      []);
  const total = order.totalAmount ?? order.total ?? 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center overflow-y-auto p-4">
      <div className="w-full max-w-3xl bg-background border border-border my-8">
        <div className="flex items-center justify-between border-b border-border p-6">
          <div>
            <p className="eyebrow">Order</p>
            <p className="mt-1 font-mono text-sm">{order.orderId || order.id}</p>
          </div>
          <button onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <section>
            <p className="eyebrow">Customer</p>
            <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              <Row k="Full Name" v={order.customerName || order.name} />
              <Row k="Email" v={order.email} />
              <Row k="Phone" v={order.phone} />
              <Row k="Country" v={order.country} />
              <Row k="City" v={order.city} />
              <Row k="Address" v={order.address} />
            </dl>
            {order.orderNotes && (
              <div className="mt-4">
                <p className="eyebrow">Order Notes</p>
                <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
                  {order.orderNotes}
                </p>
              </div>
            )}
          </section>

          <section>
            <p className="eyebrow">Products</p>
            <ul className="mt-3 divide-y divide-border border border-border">
              {products.map((p, idx) => (
                <li key={idx} className="flex items-center gap-4 p-3">
                  {p.image ? (
                    <img src={p.image} alt={p.productName} className="h-16 w-16 object-cover" />
                  ) : (
                    <div className="h-16 w-16 bg-muted" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-base truncate">{p.productName || "—"}</p>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      {p.productType || "product"} · × {p.quantity ?? 1}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p>${(p.price ?? 0).toLocaleString()}</p>
                    <p className="text-accent">
                      ${((p.price ?? 0) * (p.quantity ?? 1)).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
              {products.length === 0 && (
                <li className="p-4 text-sm text-muted-foreground">No products.</li>
              )}
            </ul>
          </section>

          <section>
            <dl className="space-y-1.5 text-sm border-t border-border pt-4">
              {order.subtotal != null && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd>${order.subtotal.toLocaleString()}</dd>
                </div>
              )}
              {order.deliveryFee != null && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Delivery</dt>
                  <dd>${order.deliveryFee.toLocaleString()}</dd>
                </div>
              )}
              {order.discount ? (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Discount</dt>
                  <dd>-${order.discount.toLocaleString()}</dd>
                </div>
              ) : null}
              <div className="flex justify-between items-baseline pt-2 border-t border-border">
                <dt className="eyebrow">Total</dt>
                <dd className="font-display text-2xl text-accent">
                  ${total.toLocaleString()}
                </dd>
              </div>
            </dl>
          </section>

          <section className="flex items-center justify-between border-t border-border pt-4">
            <div>
              <p className="eyebrow">Status</p>
              <select
                value={order.status || "Pending"}
                onChange={(e) => onStatus(order.id, e.target.value as Status)}
                className="mt-2 border border-border bg-transparent px-3 py-2 text-sm focus:border-accent focus:outline-none"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs text-muted-foreground">
              {order.createdAt?.toDate?.().toLocaleString?.() ?? "—"}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v?: string }) {
  return (
    <>
      <dt className="text-muted-foreground">{k}</dt>
      <dd>{v || "—"}</dd>
    </>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="p-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-normal">
      {children}
    </th>
  );
}
