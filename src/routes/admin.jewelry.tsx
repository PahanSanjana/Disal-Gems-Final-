import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, Plus, Search, X, Upload } from "lucide-react";
import { AdminGate } from "@/components/admin/AdminShell";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  createItem,
  deleteItem,
  subscribeCollection,
  updateItem,
  uploadImages,
  type Jewelry,
} from "@/lib/firestore-products";

export const Route = createFileRoute("/admin/jewelry")({
  head: () => ({ meta: [{ title: "Jewelry — Admin" }] }),
  component: () => (
    <AdminGate>
      <JewelryPage />
    </AdminGate>
  ),
});

const EMPTY: Omit<Jewelry, "id"> = {
  name: "",
  description: "",
  price: 0,
  category: "",
  metal: "",
  gemstoneType: "",
  size: "",
  stock: 0,
  imageUrls: [],
};

function JewelryPage() {
  const [items, setItems] = useState<Jewelry[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Jewelry | "new" | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => subscribeCollection<Jewelry>("jewelry", setItems), []);

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    if (!s) return items;
    return items.filter(
      (i) =>
        i.name?.toLowerCase().includes(s) ||
        i.category?.toLowerCase().includes(s) ||
        i.metal?.toLowerCase().includes(s) ||
        i.gemstoneType?.toLowerCase().includes(s)
    );
  }, [items, search]);

  async function handleDelete() {
    if (!confirmId) return;
    await deleteItem("jewelry", confirmId);
    setConfirmId(null);
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="eyebrow">Inventory</p>
          <h1 className="mt-2 font-display text-4xl">Jewelry</h1>
        </div>
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 bg-onyx px-6 py-3 text-[11px] uppercase tracking-[0.24em] text-ivory hover:bg-onyx/90"
        >
          <Plus className="h-4 w-4" /> Add jewelry
        </button>
      </div>

      <div className="relative mt-8 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, category, metal…"
          className="w-full border border-border bg-transparent pl-10 pr-4 py-2.5 text-sm focus:border-accent focus:outline-none"
        />
      </div>

      <div className="mt-6 border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border">
            <tr className="text-left">
              <Th>Image</Th>
              <Th>Name</Th>
              <Th>Category</Th>
              <Th>Metal</Th>
              <Th>Price</Th>
              <Th>Stock</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                  No jewelry yet.
                </td>
              </tr>
            ) : (
              filtered.map((g) => (
                <tr key={g.id} className="border-b border-border/60">
                  <td className="p-3">
                    {g.imageUrls?.[0] ? (
                      <img src={g.imageUrls[0]} alt="" className="h-12 w-12 object-cover" />
                    ) : (
                      <div className="h-12 w-12 bg-muted" />
                    )}
                  </td>
                  <td className="p-3 font-display">{g.name}</td>
                  <td className="p-3 text-muted-foreground">{g.category}</td>
                  <td className="p-3 text-muted-foreground">{g.metal}</td>
                  <td className="p-3">${g.price?.toLocaleString?.() ?? g.price}</td>
                  <td className="p-3">{g.stock}</td>
                  <td className="p-3 text-right">
                    <button onClick={() => setEditing(g)} className="p-2 hover:text-accent" aria-label="Edit">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => setConfirmId(g.id)} className="p-2 hover:text-destructive" aria-label="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <JewelryForm
          initial={editing === "new" ? { ...EMPTY, id: "" } : editing}
          onClose={() => setEditing(null)}
        />
      )}
      <ConfirmDialog
        open={!!confirmId}
        title="Delete jewelry?"
        message="This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`p-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-normal ${className}`}>
      {children}
    </th>
  );
}

function JewelryForm({ initial, onClose }: { initial: Jewelry; onClose: () => void }) {
  const [form, setForm] = useState<Jewelry>(initial);
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function bind<K extends keyof Jewelry>(k: K) {
    return {
      value: (form[k] as any) ?? "",
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const v = e.target.value;
        setForm((f) => ({
          ...f,
          [k]: k === "price" || k === "stock" ? Number(v) : v,
        }));
      },
    };
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    try {
      let urls = form.imageUrls || [];
      if (files.length) {
        const uploaded = await uploadImages("products/jewelry", files);
        urls = [...urls, ...uploaded];
      }
      const { id, createdAt, updatedAt, ...toSave } = { ...form, imageUrls: urls } as any;
      if (initial.id) await updateItem("jewelry", initial.id, toSave);
      else await createItem("jewelry", toSave);
      onClose();
    } catch (e: any) {
      setErr(e?.message ?? "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  function removeImage(idx: number) {
    setForm((f) => ({ ...f, imageUrls: f.imageUrls.filter((_, i) => i !== idx) }));
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 overflow-y-auto p-4">
      <form onSubmit={submit} className="mx-auto max-w-3xl bg-background border border-border p-8 my-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="eyebrow">{initial.id ? "Edit" : "New"}</p>
            <h2 className="mt-2 font-display text-3xl">Jewelry piece</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-8 grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <Field label="Name *" required {...bind("name")} />
          <Field label="Category" {...bind("category")} placeholder="Ring / Necklace …" />
          <Field label="Price (USD)" type="number" {...bind("price")} />
          <Field label="Stock" type="number" {...bind("stock")} />
          <Field label="Metal" {...bind("metal")} />
          <Field label="Gemstone type" {...bind("gemstoneType")} />
          <Field label="Size" {...bind("size")} />
          <div className="sm:col-span-2">
            <label className="eyebrow block">Description</label>
            <textarea
              rows={4}
              {...bind("description")}
              className="mt-2 w-full border border-border bg-transparent p-3 text-sm focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-8">
          <p className="eyebrow mb-3">Images (up to 5)</p>
          <div className="flex flex-wrap gap-3">
            {form.imageUrls?.map((u, i) => (
              <div key={u + i} className="relative">
                <img src={u} alt="" className="h-20 w-20 object-cover border border-border" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-2 -right-2 bg-onyx text-ivory rounded-full h-6 w-6 flex items-center justify-center"
                  aria-label="Remove image"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {files.map((f, i) => (
              <div key={f.name + i} className="relative">
                <img src={URL.createObjectURL(f)} alt="" className="h-20 w-20 object-cover border border-dashed border-accent" />
                <button
                  type="button"
                  onClick={() => setFiles((prev) => prev.filter((_, ix) => ix !== i))}
                  className="absolute -top-2 -right-2 bg-onyx text-ivory rounded-full h-6 w-6 flex items-center justify-center"
                  aria-label="Remove staged image"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            {(form.imageUrls?.length ?? 0) + files.length < 5 && (
              <label className="h-20 w-20 flex flex-col items-center justify-center border border-dashed border-border cursor-pointer hover:border-accent">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">Add</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const picked = Array.from(e.target.files || []);
                    const room = 5 - ((form.imageUrls?.length ?? 0) + files.length);
                    setFiles((prev) => [...prev, ...picked.slice(0, Math.max(0, room))]);
                    e.target.value = "";
                  }}
                />
              </label>
            )}
          </div>
          <p className="mt-3 text-[11px] uppercase tracking-widest text-muted-foreground">
            {(form.imageUrls?.length ?? 0) + files.length} / 5 images
          </p>
        </div>


        {err && <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-destructive">{err}</p>}

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 text-[11px] uppercase tracking-[0.24em] border border-border hover:border-foreground"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 text-[11px] uppercase tracking-[0.24em] bg-onyx text-ivory hover:bg-onyx/90 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  ...rest
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <input
        {...rest}
        className="mt-2 w-full border-b border-border bg-transparent py-2 text-sm focus:border-accent focus:outline-none"
      />
    </label>
  );
}
