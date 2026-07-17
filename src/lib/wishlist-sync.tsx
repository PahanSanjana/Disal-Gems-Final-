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
import { findProduct } from "./products";

/**
 * Two-way sync: whenever the user is signed in and Firebase is configured,
 * - initial: merge remote wishlist into local, and push local additions up
 * - subsequent local changes: mirror to Firestore
 * When signed out: falls back to localStorage only.
 */
export function WishlistSync() {
  const { user } = useAuth();
  const { ids, replace } = useWishlistStore();
  const prevIdsRef = useRef<string[]>(ids);
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
        const remote = snap.docs.map((d) => d.id);
        const local: string[] = ids;
        const merged = Array.from(new Set([...remote, ...local]));

        // Push any local-only items to Firestore
        const localOnly = local.filter((id: string) => !remote.includes(id));
        await Promise.all(
          localOnly.map((id: string) => {
            const p = findProduct(id);
            return setDoc(doc(db, "users", user.uid, "wishlist", id), {
              productId: id,
              productType: p?.category ?? "Unknown",
              productDetails: p
                ? {
                    name: p.name,
                    priceUSD: p.priceUSD,
                    image: p.images[0],
                    category: p.category,
                    type: p.type,
                  }
                : null,
              createdAt: serverTimestamp(),
            });
          })
        );

        replace(merged);
        prevIdsRef.current = merged;
        hydratedForUidRef.current = user.uid;
      } catch (e) {
        console.error("[wishlist] hydrate", e);
      }
    })();
  }, [user, ids, replace]);

  // Mirror subsequent local changes to Firestore
  useEffect(() => {
    if (!user || hydratedForUidRef.current !== user.uid) {
      prevIdsRef.current = ids;
      return;
    }
    const db = getFirebaseDb();
    if (!db) return;
    const prev = prevIdsRef.current;
    const added = ids.filter((x: string) => !prev.includes(x));
    const removed = prev.filter((x: string) => !ids.includes(x));
    prevIdsRef.current = ids;

    added.forEach((id: string) => {
      const p = findProduct(id);
      setDoc(doc(db, "users", user.uid, "wishlist", id), {
        productId: id,
        productType: p?.category ?? "Unknown",
        productDetails: p
          ? {
              name: p.name,
              priceUSD: p.priceUSD,
              image: p.images[0],
              category: p.category,
              type: p.type,
            }
          : null,
        createdAt: serverTimestamp(),
      }).catch((e) => console.error("[wishlist] add", e));
    });
    removed.forEach((id: string) => {
      deleteDoc(doc(db, "users", user.uid, "wishlist", id)).catch((e) =>
        console.error("[wishlist] remove", e)
      );
    });
  }, [user, ids]);

  return null;
}
