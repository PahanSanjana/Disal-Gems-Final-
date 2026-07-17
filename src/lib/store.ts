import { useSyncExternalStore } from "react";

export type CartItem = {
  id: string;
  name: string;
  priceUSD: number;
  image: string;
  qty: number;
};

const CART_KEY = "disal_cart_v1";
const WISH_KEY = "disal_wishlist_v1";

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
const wishStore = makeStore<string[]>(WISH_KEY, []);

let hydrated = false;
function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  cartStore.load();
  wishStore.load();
}

const serverSnap: CartItem[] = [];
const serverWish: string[] = [];

export function useCart() {
  ensureHydrated();
  const items = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.get,
    () => serverSnap
  );

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
      const next = cartStore
        .get()
        .map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i));
      cartStore.set(next);
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
  const ids = useSyncExternalStore(
    wishStore.subscribe,
    wishStore.get,
    () => serverWish
  );
  return {
    ids,
    has: (id: string) => ids.includes(id),
    toggle(id: string) {
      const current = wishStore.get();
      wishStore.set(
        current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
      );
    },
    remove(id: string) {
      wishStore.set(wishStore.get().filter((x) => x !== id));
    },
  };
}

/** Store-level accessor used by WishlistSync to replace the entire list atomically. */
export function useWishlistStore() {
  ensureHydrated();
  const ids = useSyncExternalStore(
    wishStore.subscribe,
    wishStore.get,
    () => serverWish
  );
  return {
    ids,
    replace: (next: string[]) => wishStore.set(next),
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
