# Plan: Checkout Bank Details + Firebase Admin Panel

## 1. Checkout — Bank Details (small, ship first)
Add a read-only "Bank Transfer Details" block on `/checkout` inside the order summary card:

```
Account No:  030-13862992-001
Name:        Disal Ceylon Gem & Jewellery
Bank:        Sampath Bank (please confirm — you wrote "Saylan"; likely Sampath)
Branch:      Kaluthara, Sri Lanka
```
Frontend design elsewhere is not touched.

## 2. Firebase Admin Panel (`/admin/*`)
All routes protected by an `isAdmin` check (Firestore `admins/{uid}` doc must exist). Non-admins → redirected to `/admin/login`.

Pages:
- `/admin/login` — Firebase email/password sign-in, verifies `admins/{uid}` exists
- `/admin` — Dashboard: cards (Total Gemstones, Jewelry, Orders, Appointments) + Recent Orders + Recent Appointments
- `/admin/gemstones` — list, search, add, edit, delete (confirm modal), multi-image upload to Storage
- `/admin/jewelry` — same CRUD pattern
- `/admin/orders` — list, search, filter by status, change status (Pending/Confirmed/Processing/Completed/Cancelled). No delete.
- `/admin/appointments` — list, search, filter by status, change status

Uses same luxury tokens (ivory/onyx/accent) so it feels native but stays minimal/utilitarian.

## 3. Customer Profile Enhancements (`/account`)
- Keep existing profile editor
- Add "Change password" section (Firebase `updatePassword`, with reauth via current password)
- Show read-only email + account created date

## 4. Product Data → Firestore
Migrate from `src/lib/products.ts` (hardcoded array + local images) to Firestore collections `gemstones` and `jewelry`, images in Firebase Storage.

Front-end product pages (`/gemstones`, `/jewelry`, `/product/$id`, collections, home) will read from Firestore instead of the static list. UI/design unchanged — same components, same layout, just data source swapped.

## 5. One-time Admin Seeding Page (`/admin/seed`)
Because I have no Firebase service account in this sandbox, I cannot push users/data server-side. Instead, after you sign in as admin, this page will:
- Upload the existing bundled `src/assets/*.jpg` images to Firebase Storage
- Insert corresponding gemstone/jewelry documents into Firestore
- Show progress + a "done" flag stored in Firestore so it only runs once

## Technical Details

### Admin user creation
I cannot create the admin auth user from here (no Admin SDK / service account). You have two options — pick one and I'll wire it accordingly:
- **(A)** You create `disalceylongems@gmail.com` / `Disal@2002` once in Firebase Console → Authentication → Add user. I'll add a small script/instructions.
- **(B)** I build a one-time public `/admin/bootstrap` page: if `admins` collection is empty, it lets you sign up with those credentials and auto-marks that user as admin. Deleted/disabled after first use.

### Admin role
Firestore collection `admins/{uid}` with `{ email, createdAt }`. `isAdmin(uid)` = doc exists. Enforced in Firestore security rules AND on the client route guard.

### Firestore security rules (you paste into Firebase Console → Firestore → Rules)
- `gemstones`, `jewelry`: public read, admin-only write
- `orders`, `appointments`: create by any authed user (own uid), read own, admin read/write all
- `users/{uid}`: only that user
- `admins/{uid}`: read by that user, no client write

### Storage rules
- `/products/**`: public read, admin-only write
- `/users/{uid}/**`: only that user

### Collections used
`users`, `admins`, `gemstones`, `jewelry`, `orders`, `appointments`

### Files added (approx.)
- `src/lib/admin-context.tsx` — isAdmin hook
- `src/lib/firestore-products.ts` — typed CRUD for gemstones/jewelry
- `src/components/admin/*` — Layout, Sidebar, DataTable, ImageUploader, ConfirmDialog, StatusBadge
- `src/routes/admin/*` — login, index, gemstones, jewelry, orders, appointments, seed, bootstrap
- Refactor of product-consuming routes to use Firestore

### Files edited
- `src/routes/checkout.tsx` — bank details block
- `src/routes/account.tsx` — change password section
- `src/routes/{index,gemstones,jewelry,collections,product.$id}.tsx` — read from Firestore
- `src/lib/products.ts` — kept as fallback/types

## Questions before I start
1. Admin bootstrap: **(A)** you create the user in Firebase Console, or **(B)** I build a self-destructing bootstrap page?
2. Bank name — you wrote "Saylan Bank" (not a real bank). Should I display it exactly as written, or use "Sampath Bank"?
3. This is ~15–20 files of work. OK if I ship it in one large change, or would you rather I go phase-by-phase (bank details + admin shell + auth first, then CRUD, then migration)?
