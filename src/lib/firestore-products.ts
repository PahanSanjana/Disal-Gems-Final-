import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { getFirebaseDb } from "./firebase";
import { getStorage } from "firebase/storage";
import { getApp } from "firebase/app";

export type Gemstone = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  origin: string;
  carat: number;
  shape: string;
  color: string;
  cut: string;
  clarity: string;
  treatment: string;
  certificate: string;
  stock: number;
  imageUrls: string[];
  createdAt?: any;
  updatedAt?: any;
};

export type Jewelry = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  metal: string;
  gemstoneType: string;
  size: string;
  stock: number;
  imageUrls: string[];
  createdAt?: any;
  updatedAt?: any;
};

function db() {
  const d = getFirebaseDb();
  if (!d) throw new Error("Firebase not configured.");
  return d;
}

export function subscribeCollection<T>(
  name: string,
  cb: (rows: T[]) => void
): () => void {
  const q = query(collection(db(), name), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as T[]);
  }, () => cb([]));
}

export async function listCollection<T>(name: string): Promise<T[]> {
  try {
    const snap = await getDocs(collection(db(), name));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as T[];
  } catch {
    return [];
  }
}

export async function getItem<T>(name: string, id: string): Promise<T | null> {
  const snap = await getDoc(doc(db(), name, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as any) } as T;
}

export async function createItem(name: string, data: any): Promise<string> {
  const ref = await addDoc(collection(db(), name), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateItem(name: string, id: string, data: any) {
  await updateDoc(doc(db(), name, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteItem(name: string, id: string) {
  await deleteDoc(doc(db(), name, id));
}

export async function uploadImages(
  folder: string,
  files: File[]
): Promise<string[]> {
  const storage = getStorage(getApp());
  const urls: string[] = [];
  for (const f of files) {
    const path = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}-${f.name}`;
    const r = ref(storage, path);
    await uploadBytes(r, f);
    urls.push(await getDownloadURL(r));
  }
  return urls;
}

export async function deleteImageByUrl(url: string) {
  try {
    const storage = getStorage(getApp());
    const r = ref(storage, url);
    await deleteObject(r);
  } catch {
    /* ignore */
  }
}
