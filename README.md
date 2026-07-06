# ORGN — Modern Minimal Streetwear E-Commerce

A full-stack storefront + admin back-office for **ORGN**, built with Next.js 14 (App
Router), Tailwind CSS, Framer Motion, and Supabase (Postgres, Auth, Storage).

---

## 1. Stack

- **Frontend:** Next.js 14 (App Router, TypeScript), Tailwind CSS, Framer Motion
- **Backend:** Supabase — Postgres, Auth (admin/staff login), Storage (product & media images), Row Level Security
- **State:** Zustand for the cart (persisted to `localStorage`)
- **Charts:** Recharts (admin dashboard)

---

## 2. One-time Supabase setup

Your Supabase project (`uribmkwvszwspuddgkua`) needs the schema, security policies,
storage bucket, seed data, and checkout functions created before the app will work.

1. Open your Supabase project → **SQL Editor**.
2. Run the files in `/supabase` **in this exact order** (each depends on the one before it):
   1. `01_schema.sql` — tables
   2. `02_rls_policies.sql` — Row Level Security (locks admin tables to staff only)
   3. `03_storage.sql` — creates the `orgn-media` public storage bucket + policies
   4. `04_seed.sql` — placeholder categories/products so the store isn't empty
   5. `05_functions.sql` — checkout functions (`create_order`, `preview_coupon`)

You can paste each file's contents into the SQL Editor and run them one at a time, or
run them all from the Supabase CLI with `supabase db push` if you prefer.

### Get your `service_role` key (required)

The order-confirmation page reads the just-placed order using the **service role**
key (server-side only), because orders are intentionally locked to admin/staff via
RLS and there's no customer login. This key was **not** included in the original
brief, so you need to add it yourself:

1. Supabase Dashboard → **Project Settings → API**.
2. Copy the **`service_role`** secret.
3. Paste it into `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`.

Without this, checkout still works and the order is saved correctly — but the
`/order-confirmation/[orderNumber]` page won't be able to display the order summary.

### Create the first admin account

Supabase Auth handles password hashing itself, so the admin password is never
written into any file. To create the account described in the brief
(`sakshamvishwakarma45@gmail.com` / username `saksham7389`):

1. Supabase Dashboard → **Authentication → Users → Add User**.
2. Email: `sakshamvishwakarma45@gmail.com`, Password: `orgn36t` (see note below).
3. Auto-confirm the email (toggle in the same dialog).
4. Back in the **SQL Editor**, run:
   ```sql
   update profiles
   set role = 'admin', username = 'saksham7389', name = 'Saksham'
   where id = (select id from auth.users where email = 'sakshamvishwakarma45@gmail.com');
   ```
   (The `profiles` row is created automatically by a trigger the moment the user
   signs up — this just promotes it from the default `staff` role to `admin`.)

**⚠️ Change this password after your first login.** `orgn36t` is fine to get
started with, but it's short and was shared in plain text during setup — treat it
as temporary. You can update it any time from Supabase Dashboard → Authentication →
Users, or add a "change password" flow to the admin panel later.

---

## 3. Local development

```bash
npm install
npm run dev
```

The `.env.local` file already contains your Supabase URL and anon key. Add the
`SUPABASE_SERVICE_ROLE_KEY` as described above before testing checkout end-to-end.

- Storefront: [http://localhost:3000](http://localhost:3000)
- Admin panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 4. Deployment

- **Frontend:** Push this repo to GitHub and import it into Vercel. Add the same
  three environment variables (`NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) in the Vercel
  project settings.
- **Backend:** Already hosted — no separate database/server to deploy.
- Update the hardcoded `https://orgnclothing.in` references in
  `src/app/layout.tsx`, `src/app/sitemap.ts`, and `src/app/robots.ts` once you know
  the real production domain.

---

## 5. Project structure

```
src/
  app/
    (storefront)/        # public site — home, shop, product, cart, checkout, static pages
    admin/
      login/              # admin sign-in (unauthenticated)
      (dashboard)/        # everything behind the auth+role gate
    api/                  # checkout, coupon preview, newsletter signup
  components/
    storefront/           # header, footer, hero, product cards, cart drawer, etc.
    admin/                 # sidebar, forms, image/variant managers, charts
    ui/                    # shared primitives (Wordmark, MagneticButton, Reveal)
  lib/
    supabase/              # browser / server / admin (service-role) clients
    data.ts                # storefront data-fetching helpers
    store/cart.ts           # Zustand cart store
    types.ts                # shared TypeScript types
supabase/                  # SQL migrations, run once via the SQL Editor
```

Admin CRUD (products, categories, orders, coupons, content, media) calls Supabase
directly from client components rather than going through custom API routes — this
is safe because every write is governed by the Row Level Security policies in
`02_rls_policies.sql`, which check the signed-in user's `profiles.role`.

---

## 6. Assumptions & decisions made on your behalf

- **Fonts:** Archivo (display/headings) + Inter (body). The uploaded logo uses a
  bold geometric sans that isn't a free Google font under that exact name, so
  Archivo Black-weight was used as the closest open-source match for the
  recurring UI treatment (buttons, section headings). Your actual logo files
  (`public/brand/`) are used as-is for the favicon and are ready to drop in
  anywhere you want the literal artwork instead of the live-text version.
- **Signature drop-shadow:** implemented as a reusable CSS treatment
  (`text-pop-*` classes in `globals.css`) rather than baking it into images, so
  it can be reused consistently across headings, cards, and buttons per the brief.
- **Checkout confirmation & service role:** see the callout above — this key
  wasn't provided in the brief and needs to be added for the confirmation page
  to render order details.
- **Product variants:** modeled as size **and** color per row (`product_variants`),
  but the seed data and admin UI default to one color per product listing (like
  most streetwear drops) with multiple sizes — the schema supports multi-color
  products if you need that later.
- **Stock decrementing:** happens atomically in a Postgres function
  (`create_order`) rather than in application code, so two simultaneous
  checkouts can't oversell the same size.
- **Contact page:** the "send message" form opens the visitor's email client
  with a prefilled message (`mailto:`) rather than storing submissions in a new
  database table, since a contact-messages table wasn't in the original data
  model. Easy to swap for a real backend later if you want stored submissions.
- **Shipping rates:** flat placeholder rates (Standard ₹99, free over ₹2,999;
  Express ₹199) since no courier integration was specified — these live in
  `src/app/api/checkout/route.ts` and the checkout page, and are easy to replace
  once you have real shipping costs or a rate-calculation API.
- **Legal pages:** Shipping/Returns, Privacy, and Terms are static
  (hand-editable in their page files) rather than pulled from the CMS, since the
  brief said final wording would come later — happy to wire these into
  `site_settings` too if you'd like them admin-editable.
- **Coupons:** one-time flat/percent codes with an optional expiry and usage
  cap, validated server-side; no per-customer or per-product restrictions yet.
- **Placeholder images:** seed products use `placehold.co` generated images
  (branded beige/black/orange) instead of stock photography, per the "don't
  depend on stock photography" instruction — swap them out via
  `/admin/products` once real product photography is ready.

---

## 7. What's included vs. left as a seam

**Included:** full product/category/order/customer/coupon CRUD, image uploads with
drag-to-reorder, size/color variant + stock management, light CMS for the hero and
"Why ORGN" section, newsletter capture + CSV export, media library, dashboard with
a 30-day sales chart and low-stock alerts, and a COD/pay-on-confirmation checkout
flow with atomic stock decrementing.

**Deliberately left as a seam (per the brief):** no payment gateway. The checkout
API route (`src/app/api/checkout/route.ts`) computes shipping/discount and calls a
single Postgres function — dropping in Razorpay/Stripe later means adding a payment
step before that call (or after it, holding the order as `pending` until payment
confirms) without restructuring the cart, address, or order-summary UI.
