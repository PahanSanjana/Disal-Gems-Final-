import { useEffect, useRef } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { getFirebaseDb } from "./firebase";
import { useAuth } from "./auth-context";
import { useWishlistStore } from "./store";
import type { WishItem } from "./store";

/**
 * Two-way wishlist sync between local storage and Firestore.
 * When signed out we fall back to localStorage only.
 */
export function WishlistSync() {
  const { user } = useAuth();
  const { items, replace } = useWishlistStore();
  const prevRef = useRef<WishItem[]>(items);
  const hydratedForUidRef = useRef<string | null>(null);

  // Initial hydrate on sign-in
  useEffect(() => {
    if (!user) {
      hydratedForUidRef.current = null;
      return;
    }
    if (hydratedForUidRef.current === user.uid) return;
    const db = getFirebaseDb();
    if (!db) return;

    (async () => {
      try {
        const snap = await getDocs(collection(db, "users", user.uid, "wishlist"));
        const remote: WishItem[] = snap.docs.map((d) => {
          const data = d.data() as any;
          return {
            id: d.id,
            kind: (data.kind ?? "gemstone") as "gemstone" | "jewelry",
            name: data.name ?? "",
            priceUSD: Number(data.priceUSD ?? 0),
            image: data.image ?? "",
          };
        });
        const local = items;
        const map = new Map<string, WishItem>();
        [...remote, ...local].forEach((i) => map.set(i.id, i));
        const merged = Array.from(map.values());

        // push local-only items up
        const remoteIds = new Set(remote.map((r) => r.id));
        const localOnly = local.filter((i) => !remoteIds.has(i.id));
        await Promise.all(
          localOnly.map((i) =>
            setDoc(doc(db, "users", user.uid, "wishlist", i.id), {
              ...i,
              createdAt: serverTimestamp(),
            })
          )
        );

        replace(merged);
        prevRef.current = merged;
        hydratedForUidRef.current = user.uid;
      } catch (e) {
        console.error("[wishlist] hydrate", e);
      }
    })();
  }, [user, items, replace]);

  // Mirror subsequent local changes
  useEffect(() => {
    if (!user || hydratedForUidRef.current !== user.uid) {
      prevRef.current = items;
      return;
    }
    const db = getFirebaseDb();
    if (!db) return;
    const prev = prevRef.current;
    const prevIds = new Set(prev.map((i) => i.id));
    const currentIds = new Set(items.map((i) => i.id));
    const added = items.filter((i) => !prevIds.has(i.id));
    const removed = prev.filter((i) => !currentIds.has(i.id));
    prevRef.current = items;

    added.forEach((i) => {
      setDoc(doc(db, "users", user.uid, "wishlist", i.id), {
        ...i,
        createdAt: serverTimestamp(),
      }).catch((e) => console.error("[wishlist] add", e));
    });
    removed.forEach((i) => {
      deleteDoc(doc(db, "users", user.uid, "wishlist", i.id)).catch((e) =>
        console.error("[wishlist] remove", e)
      );
    });
  }, [user, items]);

  return null;
}
