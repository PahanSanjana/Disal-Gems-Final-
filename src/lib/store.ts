import { useSyncExternalStore } from "react";

export type CartItem = {
  id: string;
  name: string;
  priceUSD: number;
  image: string;
  qty: number;
};

export type WishItem = {
  id: string;
  kind: "gemstone" | "jewelry";
  name: string;
  priceUSD: number;
  image: string;
};

const CART_KEY = "disal_cart_v1";
const WISH_KEY = "disal_wishlist_v2";

function makeStore<T>(key: string, initial: T) {
  let state: T = initial;
  const listeners = new Set<() => void>();

  function load() {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) state = JSON.parse(raw) as T;
    } catch {}
  }

  function persist() {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }

  return {
    load,
    get: () => state,
    set: (next: T) => {
      state = next;
      persist();
      listeners.forEach((l) => l());
    },
    subscribe: (l: () => void) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
  };
}

const cartStore = makeStore<CartItem[]>(CART_KEY, []);
const wishStore = makeStore<WishItem[]>(WISH_KEY, []);

let hydrated = false;
function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  cartStore.load();
  wishStore.load();
}

const serverCartSnap: CartItem[] = [];
const serverWishSnap: WishItem[] = [];

export function useCart() {
  ensureHydrated();
  const items = useSyncExternalStore(cartStore.subscribe, cartStore.get, () => serverCartSnap);

  return {
    items,
    count: items.reduce((n, i) => n + i.qty, 0),
    total: items.reduce((n, i) => n + i.qty * i.priceUSD, 0),
    add(item: Omit<CartItem, "qty">, qty = 1) {
      const current = cartStore.get();
      const existing = current.find((i) => i.id === item.id);
      const next = existing
        ? current.map((i) => (i.id === item.id ? { ...i, qty: i.qty + qty } : i))
        : [...current, { ...item, qty }];
      cartStore.set(next);
    },
    update(id: string, qty: number) {
      cartStore.set(cartStore.get().map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
    },
    remove(id: string) {
      cartStore.set(cartStore.get().filter((i) => i.id !== id));
    },
    clear() {
      cartStore.set([]);
    },
  };
}

export function useWishlist() {
  ensureHydrated();
  const items = useSyncExternalStore(wishStore.subscribe, wishStore.get, () => serverWishSnap);
  return {
    items,
    ids: items.map((i) => i.id),
    has: (id: string) => items.some((i) => i.id === id),
    toggle(item: WishItem) {
      const current = wishStore.get();
      wishStore.set(
        current.some((i) => i.id === item.id)
          ? current.filter((i) => i.id !== item.id)
          : [...current, item]
      );
    },
    remove(id: string) {
      wishStore.set(wishStore.get().filter((i) => i.id !== id));
    },
  };
}

/** Used by the WishlistSync component to replace list atomically. */
export function useWishlistStore() {
  ensureHydrated();
  const items = useSyncExternalStore(wishStore.subscribe, wishStore.get, () => serverWishSnap);
  return {
    items,
    replace: (next: WishItem[]) => wishStore.set(next),
  };
}

export function generateOrderId() {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `DSL-${y}${m}${d}-${rand}`;
}
