/**
 * Storefront product utilities.
 * All product data is loaded from Firestore via the hooks below.
 * No hardcoded / mock / seed product data lives in this file anymore.
 */
import { useEffect, useState } from "react";
import {
  subscribeCollection,
  getItem,
  type Gemstone,
  type Jewelry,
} from "./firestore-products";

export type StoreProduct = {
  id: string;
  kind: "gemstone" | "jewelry";
  name: string;
  description: string;
  price: number;
  category?: string;
  imageUrls: string[];
  // gemstone
  origin?: string;
  carat?: number;
  shape?: string;
  color?: string;
  cut?: string;
  clarity?: string;
  treatment?: string;
  certificate?: string;
  // jewelry
  metal?: string;
  gemstoneType?: string;
  size?: string;
  stock?: number;
};

export function normalizeGemstone(g: Gemstone): StoreProduct {
  return {
    id: g.id,
    kind: "gemstone",
    name: g.name,
    description: g.description,
    price: Number(g.price) || 0,
    category: g.category,
    imageUrls: g.imageUrls ?? [],
    origin: g.origin,
    carat: g.carat,
    shape: g.shape,
    color: g.color,
    cut: g.cut,
    clarity: g.clarity,
    treatment: g.treatment,
    certificate: g.certificate,
    stock: g.stock,
  };
}

export function normalizeJewelry(j: Jewelry): StoreProduct {
  return {
    id: j.id,
    kind: "jewelry",
    name: j.name,
    description: j.description,
    price: Number(j.price) || 0,
    category: j.category,
    imageUrls: j.imageUrls ?? [],
    metal: j.metal,
    gemstoneType: j.gemstoneType,
    size: j.size,
    stock: j.stock,
  };
}

export function useGemstones() {
  const [items, setItems] = useState<StoreProduct[] | null>(null);
  useEffect(() => {
    const unsub = subscribeCollection<Gemstone>("gemstones", (rows) => {
      setItems(rows.map(normalizeGemstone));
    });
    return unsub;
  }, []);
  return items;
}

export function useJewelry() {
  const [items, setItems] = useState<StoreProduct[] | null>(null);
  useEffect(() => {
    const unsub = subscribeCollection<Jewelry>("jewelry", (rows) => {
      setItems(rows.map(normalizeJewelry));
    });
    return unsub;
  }, []);
  return items;
}

export function useAllProducts() {
  const gems = useGemstones();
  const jew = useJewelry();
  if (gems === null && jew === null) return null;
  return [...(gems ?? []), ...(jew ?? [])];
}

/** Look up a product by id across both collections. */
export function useProduct(id: string | undefined) {
  const [state, setState] = useState<{
    loading: boolean;
    product: StoreProduct | null;
  }>({ loading: true, product: null });

  useEffect(() => {
    let cancelled = false;
    if (!id) {
      setState({ loading: false, product: null });
      return;
    }
    (async () => {
      try {
        const g = await getItem<Gemstone>("gemstones", id);
        if (g) {
          if (!cancelled) setState({ loading: false, product: normalizeGemstone(g) });
          return;
        }
        const j = await getItem<Jewelry>("jewelry", id);
        if (j) {
          if (!cancelled) setState({ loading: false, product: normalizeJewelry(j) });
          return;
        }
        if (!cancelled) setState({ loading: false, product: null });
      } catch {
        if (!cancelled) setState({ loading: false, product: null });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return state;
}

export function formatPrice(usd: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(usd || 0);
}
