import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { firebaseReady, getFirebaseAuth, getFirebaseDb } from "./firebase";

export type Profile = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
};

type AuthCtx = {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  ready: boolean;
  signUp: (email: string, password: string, profile: Profile) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  saveProfile: (profile: Profile) => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const db = getFirebaseDb();
        if (db) {
          try {
            const snap = await getDoc(doc(db, "users", u.uid));
            if (snap.exists()) setProfile(snap.data() as Profile);
            else setProfile(null);
          } catch (e) {
            console.error("[auth] profile load", e);
          }
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, p: Profile) => {
      const auth = getFirebaseAuth();
      const db = getFirebaseDb();
      if (!auth || !db) throw new Error("Firebase not configured.");
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", cred.user.uid), {
        ...p,
        email,
        createdAt: serverTimestamp(),
      });
      setProfile({ ...p, email });
    },
    []
  );

  const signIn = useCallback(async (email: string, password: string) => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error("Firebase not configured.");
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signOut = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    await fbSignOut(auth);
  }, []);

  const saveProfile = useCallback(
    async (p: Profile) => {
      const db = getFirebaseDb();
      if (!db || !user) throw new Error("Not signed in.");
      await setDoc(
        doc(db, "users", user.uid),
        { ...p, updatedAt: serverTimestamp() },
        { merge: true }
      );
      setProfile(p);
    },
    [user]
  );

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      profile,
      loading,
      ready: firebaseReady,
      signUp,
      signIn,
      signOut,
      saveProfile,
    }),
    [user, profile, loading, signUp, signIn, signOut, saveProfile]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used inside <AuthProvider>");
  return v;
}
