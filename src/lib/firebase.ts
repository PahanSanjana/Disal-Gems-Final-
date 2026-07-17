import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string,
};

export const firebaseReady =
  !!firebaseConfig.apiKey &&
  !!firebaseConfig.projectId;

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _analytics: Analytics | null = null;

function safeInit() {
  if (typeof window === "undefined") return; // SSR protection
  if (!firebaseReady) return;

  if (!_app) {
    _app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  }

  if (!_auth) {
    _auth = getAuth(_app);
  }

  if (!_db) {
    _db = getFirestore(_app);
  }

  if (!_analytics) {
    _analytics = getAnalytics(_app);
  }
}

export function getFirebaseAuth(): Auth | null {
  safeInit();
  return _auth;
}

export function getFirebaseDb(): Firestore | null {
  safeInit();
  return _db;
}

export function getFirebaseAnalytics(): Analytics | null {
  safeInit();
  return _analytics;
}