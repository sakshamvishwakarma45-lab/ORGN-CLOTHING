-- ============================================================================
-- ORGN — Row Level Security
-- Run after 01_schema.sql. Assumes the anon key is used on the storefront and
-- the service_role key is only ever used server-side (API routes / admin
-- writes), never shipped to the browser.
-- ============================================================================

alter table profiles         enable row level security;
alter table categories       enable row level security;
alter table products         enable row level security;
alter table product_images   enable row level security;
alter table product_variants enable row level security;
alter table customers        enable row level security;
alter table addresses        enable row level security;
alter table coupons          enable row level security;
alter table orders           enable row level security;
alter table order_items      enable row level security;
alter table subscribers      enable row level security;
alter table site_settings    enable row level security;
alter table media_library    enable row level security;

-- Helper: is the current JWT user an admin/staff member?
create or replace function public.is_staff()
returns boolean as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role in ('admin', 'staff')
  );
$$ language sql stable security definer set search_path = public;

-- ----------------------------------------------------------------------------
-- PROFILES — a user can read their own row; staff can read all
-- ----------------------------------------------------------------------------
create policy "read own profile" on profiles
  for select using (auth.uid() = id or public.is_staff());

create policy "staff manage profiles" on profiles
  for all using (public.is_staff()) with check (public.is_staff());

-- ----------------------------------------------------------------------------
-- CATEGORIES — public read, staff write
-- ----------------------------------------------------------------------------
create policy "public read categories" on categories
  for select using (true);

create policy "staff write categories" on categories
  for insert with check (public.is_staff());
create policy "staff update categories" on categories
  for update using (public.is_staff()) with check (public.is_staff());
create policy "staff delete categories" on categories
  for delete using (public.is_staff());

-- ----------------------------------------------------------------------------
-- PRODUCTS — public can read published products only, staff can read/write all
-- ----------------------------------------------------------------------------
create policy "public read published products" on products
  for select using (status = 'published' or public.is_staff());

create policy "staff insert products" on products
  for insert with check (public.is_staff());
create policy "staff update products" on products
  for update using (public.is_staff()) with check (public.is_staff());
create policy "staff delete products" on products
  for delete using (public.is_staff());

-- PRODUCT IMAGES / VARIANTS — follow the parent product's visibility
create policy "public read images of visible products" on product_images
  for select using (
    public.is_staff() or exists (
      select 1 from products p where p.id = product_id and p.status = 'published'
    )
  );
create policy "staff write product images" on product_images
  for all using (public.is_staff()) with check (public.is_staff());

create policy "public read variants of visible products" on product_variants
  for select using (
    public.is_staff() or exists (
      select 1 from products p where p.id = product_id and p.status = 'published'
    )
  );
create policy "staff write product variants" on product_variants
  for all using (public.is_staff()) with check (public.is_staff());

-- ----------------------------------------------------------------------------
-- CUSTOMERS / ADDRESSES — staff only from the client.
-- Checkout writes go through the /api/checkout route using the service role
-- key (bypasses RLS deliberately, after server-side validation).
-- ----------------------------------------------------------------------------
create policy "staff read customers" on customers
  for select using (public.is_staff());
create policy "staff manage customers" on customers
  for all using (public.is_staff()) with check (public.is_staff());

create policy "staff manage addresses" on addresses
  for all using (public.is_staff()) with check (public.is_staff());

-- ----------------------------------------------------------------------------
-- ORDERS / ORDER ITEMS — staff only from the client (same reasoning as above)
-- ----------------------------------------------------------------------------
create policy "staff manage orders" on orders
  for all using (public.is_staff()) with check (public.is_staff());

create policy "staff manage order items" on order_items
  for all using (public.is_staff()) with check (public.is_staff());

-- ----------------------------------------------------------------------------
-- COUPONS — never exposed to the client directly; validated via API route
-- with the service role key so usage counts / limits can't be scraped.
-- ----------------------------------------------------------------------------
create policy "staff manage coupons" on coupons
  for all using (public.is_staff()) with check (public.is_staff());

-- ----------------------------------------------------------------------------
-- SUBSCRIBERS — anyone can subscribe (insert only), staff can read/export
-- ----------------------------------------------------------------------------
create policy "anyone can subscribe" on subscribers
  for insert with check (true);
create policy "staff read subscribers" on subscribers
  for select using (public.is_staff());
create policy "staff delete subscribers" on subscribers
  for delete using (public.is_staff());

-- ----------------------------------------------------------------------------
-- SITE SETTINGS — public read (storefront CMS content), staff write
-- ----------------------------------------------------------------------------
create policy "public read site settings" on site_settings
  for select using (true);
create policy "staff write site settings" on site_settings
  for insert with check (public.is_staff());
create policy "staff update site settings" on site_settings
  for update using (public.is_staff()) with check (public.is_staff());

-- ----------------------------------------------------------------------------
-- MEDIA LIBRARY — staff only
-- ----------------------------------------------------------------------------
create policy "staff manage media" on media_library
  for all using (public.is_staff()) with check (public.is_staff());
