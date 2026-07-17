import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "./auth-context";
import { getFirebaseDb } from "./firebase";

export function useIsAdmin() {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function check() {
      if (loading) return;
      if (!user) {
        setIsAdmin(false);
        return;
      }
      const db = getFirebaseDb();
      if (!db) {
        setIsAdmin(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, "admins", user.uid));
        if (!cancelled) setIsAdmin(snap.exists());
      } catch {
        if (!cancelled) setIsAdmin(false);
      }
    }
    check();
    return () => {
      cancelled = true;
    };
  }, [user, loading]);

  return { isAdmin, loading: loading || isAdmin === null, user };
}
