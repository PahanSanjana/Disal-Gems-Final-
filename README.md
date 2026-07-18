# Disal Ceylon Gems & Jewelry

A luxury e-commerce web app for rare Ceylon gemstones and heirloom jewelry — built with **TanStack Start**, **React 19**, **Tailwind CSS v4**, **Firebase** (product catalog + user auth) and **Lovable Cloud / Supabase** (profiles, wishlists, appointments).

> Live preview is managed through Lovable. Product data lives in Firebase Firestore; user profiles, wishlists and consultation bookings live in Lovable Cloud.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Environment Variables](#environment-variables)
6. [Available Scripts](#available-scripts)
7. [Database Schema (Lovable Cloud)](#database-schema-lovable-cloud)
8. [Firebase Setup](#firebase-setup)
9. [Admin Panel](#admin-panel)
10. [Routing Overview](#routing-overview)
11. [Deployment](#deployment)
12. [Troubleshooting](#troubleshooting)

---

## Features

- **Curated catalog** — Gemstones and jewelry collections rendered from Firestore in real time.
- **Product detail pages** with imagery, specifications and add-to-cart / add-to-wishlist actions.
- **Cart & checkout flow** that finalizes orders via WhatsApp handoff.
- **Wishlist** synced to Lovable Cloud for signed-in users, and to local storage for guests.
- **Appointment booking** — customers request in-person or virtual consultations.
- **Authentication** — email + password via Firebase Auth, with a profile stored in Firestore and mirrored to Lovable Cloud.
- **Admin dashboard** — manage gemstones, jewelry, orders and appointments.
- **3D gem canvas** — interactive hero built with `@react-three/fiber` and `drei`.
- **Responsive luxury UI** — Cormorant Garamond / Inter typography, Tailwind v4 semantic tokens, shadcn/ui components.
- **SSR-ready** — TanStack Start handles server rendering, head metadata and route splitting.

---

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | TanStack Start v1 (React 19, Vite 7) |
| Routing | TanStack Router (file-based) |
| Data fetching | TanStack Query |
| Styling | Tailwind CSS v4 + shadcn/ui + Radix UI |
| Animation | Framer Motion |
| 3D | react-three-fiber, drei, three.js |
| Auth (customers) | Firebase Auth |
| Product DB | Firebase Firestore + Storage |
| App DB (profiles, wishlists, appointments) | Lovable Cloud (Supabase Postgres) |
| Forms | react-hook-form + zod |
| Icons | lucide-react |
| Package manager | Bun |

---

## Project Structure

```
src/
├── routes/                    # File-based routes (TanStack Router)
│   ├── __root.tsx             # App shell, head metadata, Firebase startup check
│   ├── index.tsx              # Home page
│   ├── gemstones.tsx          # Gemstones catalog
│   ├── jewelry.tsx            # Jewelry catalog
│   ├── collections.tsx        # Curated collections
│   ├── product.$id.tsx        # Product detail (dynamic)
│   ├── cart.tsx               # Shopping cart
│   ├── checkout.tsx           # Checkout + WhatsApp confirmation
│   ├── wishlist.tsx           # Saved items
│   ├── appointment.tsx        # Consultation booking
│   ├── account.tsx            # User account + profile
│   ├── auth.tsx               # Sign in / sign up
│   ├── about.tsx              # About page
│   ├── contact.tsx            # Contact page
│   └── admin.*.tsx            # Admin dashboard routes
│
├── components/
│   ├── luxury/                # Navbar, Footer, GemCanvas, Reveal, SearchOverlay…
│   ├── admin/                 # AdminShell, ConfirmDialog
│   └── ui/                    # shadcn/ui primitives
│
├── lib/
│   ├── firebase.ts            # Firebase init + env validation
│   ├── firestore-products.ts  # Firestore CRUD for products
│   ├── auth-context.tsx       # Firebase Auth provider
│   ├── admin-context.tsx      # useIsAdmin hook (checks admins/{uid} doc)
│   ├── store.ts               # Zustand-style cart state
│   ├── wishlist-sync.tsx      # Syncs wishlist between local + Lovable Cloud
│   └── products.ts            # Product types & helpers
│
├── integrations/supabase/     # Auto-generated Lovable Cloud client + types
├── styles.css                 # Tailwind v4 theme + design tokens
├── router.tsx                 # Router bootstrap
├── start.ts                   # TanStack Start config (middleware)
└── server.ts                  # SSR entry

supabase/
└── migrations/                # SQL migrations for Lovable Cloud
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) ≥ 1.1 (or Node 20+ / npm / pnpm — Bun is what the project is set up for)
- A **Firebase** project with **Authentication (Email/Password)**, **Firestore** and **Storage** enabled
- **Lovable Cloud** enabled on the project (already configured if you cloned from Lovable)

### Install & run

```bash
bun install
bun run dev
```

The app starts on `http://localhost:8080`.

---

## Environment Variables

Create a `.env` file at the project root with the following keys.

### Lovable Cloud / Supabase (auto-populated by Lovable Cloud)

```env
VITE_SUPABASE_URL="https://<project-id>.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="sb_publishable_..."
VITE_SUPABASE_PROJECT_ID="<project-id>"
```

### Firebase (get from Firebase Console → Project Settings → Your apps → Web app)

```env
VITE_FIREBASE_API_KEY="AIza..."
VITE_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-app"
VITE_FIREBASE_STORAGE_BUCKET="your-app.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="1234567890"
VITE_FIREBASE_APP_ID="1:1234567890:web:abcdef"
VITE_FIREBASE_MEASUREMENT_ID="G-XXXXXXX"   # optional (Analytics)
```

> `VITE_*` variables are inlined into the client bundle at build time. Firebase Web `apiKey` values are **publishable** and safe to expose — access control comes from Firestore/Storage security rules, not from hiding the key.

If any required Firebase variable is missing, the app shows a clear **"Firebase setup required"** screen listing the missing keys (see `src/routes/__root.tsx` → `FirebaseStartupCheck`).

---

## Available Scripts

| Command | Description |
| --- | --- |
| `bun run dev` | Start the Vite dev server (SSR + HMR) on port 8080. |
| `bun run build` | Production build. |
| `bun run build:dev` | Development-mode build (useful for debugging). |
| `bun run preview` | Preview the production build locally. |
| `bun run lint` | Run ESLint over the project. |
| `bun run format` | Format all files with Prettier. |

---

## Database Schema (Lovable Cloud)

Three tables live in the `public` schema, all protected by Row-Level Security.

### `profiles`
Mirror of a signed-in customer's contact details.
- `id` (uuid, PK, references `auth.users`)
- `full_name`, `email`, `phone`, `country`, `city`, `address`
- Auto-created by the `on_auth_user_created` trigger.
- **RLS**: users can read/update only their own row.

### `wishlists`
Persistent wishlist entries for signed-in users.
- `user_id` (uuid)
- `product_id` (text), `product_type` (`gemstone` | `jewelry`)
- `product_details` (jsonb snapshot)
- **RLS**: users can manage only their own entries.

### `appointments`
Consultation bookings (guests allowed).
- `full_name`, `email`, `phone`, `date`, `time`
- `consultation_type`, `message`, `status`
- `user_id` (nullable — guests can book)
- **RLS**: anyone can insert; users see their own; admins see all.

Migrations live in `supabase/migrations/`.

---

## Firebase Setup

1. **Create a Firebase project** at [console.firebase.google.com](https://console.firebase.google.com).
2. **Add a Web app** and copy the config values into `.env` (see above).
3. **Enable Authentication** → Sign-in method → **Email/Password**.
4. **Enable Firestore** in production mode. Suggested minimum rules:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /gemstones/{id}   { allow read: if true; allow write: if isAdmin(); }
       match /jewelry/{id}     { allow read: if true; allow write: if isAdmin(); }
       match /users/{uid}      { allow read, write: if request.auth.uid == uid; }
       match /admins/{uid}     { allow read: if request.auth.uid == uid; }

       function isAdmin() {
         return request.auth != null &&
                exists(/databases/$(database)/documents/admins/$(request.auth.uid));
       }
     }
   }
   ```
5. **Enable Storage** for product images.
6. **Grant yourself admin** by creating a document at `admins/{yourUid}` in Firestore (any content). The `useIsAdmin()` hook checks for its existence.

---

## Admin Panel

Available under `/admin`, gated by the `admins/{uid}` Firestore doc.

| Route | Purpose |
| --- | --- |
| `/admin` | Dashboard overview |
| `/admin/gemstones` | Create / edit / delete gemstones |
| `/admin/jewelry` | Create / edit / delete jewelry |
| `/admin/appointments` | View & update consultation requests |
| `/admin/orders` | View WhatsApp-confirmed orders |
| `/admin/login` | Admin sign-in |
| `/admin/bootstrap` | Initial admin bootstrap helper |

---

## Routing Overview

TanStack Router uses **flat, dot-separated** file names under `src/routes/`:

| File | URL |
| --- | --- |
| `index.tsx` | `/` |
| `gemstones.tsx` | `/gemstones` |
| `product.$id.tsx` | `/product/:id` |
| `admin.orders.tsx` | `/admin/orders` |

The **root layout** lives in `src/routes/__root.tsx` and provides the HTML shell, global providers (React Query, Auth, Wishlist sync) and the Firebase startup check.

---

## Deployment

The project targets **Cloudflare Workers** via TanStack Start's Vite plugin (edge SSR).

### Deploy via Lovable
Click **Publish** inside the Lovable editor. Environment variables set in Lovable are shipped with the build.

### Manual deploy
```bash
bun run build
# then deploy the generated .output/ directory to your Worker / edge host
```

Make sure all `VITE_*` env vars are set in the target environment **before building** — Vite inlines them at build time.

---

## Troubleshooting

**"Firebase setup required" screen on load**
A `VITE_FIREBASE_*` variable is missing. The screen lists which one — add it to `.env` and restart the dev server.

**`Firebase not configured` error at runtime**
Firebase initialization failed. Check that `VITE_FIREBASE_API_KEY` is a real key starting with `AIza…` (not a `@secret:` placeholder — those aren't resolved in client bundles).

**`permission-denied` from Firestore**
Your Firestore rules block the request. Update rules (see [Firebase Setup](#firebase-setup)) or make sure the acting user has an `admins/{uid}` doc.

**Admin pages show "not authorized"**
Create a document at `admins/{yourFirebaseUid}` in Firestore. Sign out and back in.

**Type errors after DB migration**
Lovable Cloud regenerates `src/integrations/supabase/types.ts` after each migration. Restart the dev server if types look stale.

**Port 8080 already in use**
Kill the other process or change `server.port` in `vite.config.ts`.

---

## License

Proprietary — © Disal Ceylon Gems & Jewelry. All rights reserved.
