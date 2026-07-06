-- ============================================================================
-- ORGN — Database Schema
-- Run this file first in the Supabase SQL Editor (or via `supabase db push`).
-- ============================================================================

create extension if not exists "uuid-ossp";

-- ----------------------------------------------------------------------------
-- PROFILES  (admin / staff accounts only — linked 1:1 to auth.users)
-- ----------------------------------------------------------------------------
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  username    text unique,
  name        text,
  role        text not null default 'staff' check (role in ('admin', 'staff')),
  created_at  timestamptz not null default now()
);

-- Automatically create a profile row whenever a new auth user is created.
-- New users default to 'staff' — promote to 'admin' manually (see README).
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, name, role)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'staff'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ----------------------------------------------------------------------------
-- CATEGORIES
-- ----------------------------------------------------------------------------
create table if not exists categories (
  id             uuid primary key default uuid_generate_v4(),
  name           text not null,
  slug           text not null unique,
  banner_image   text,
  display_order  int not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- PRODUCTS
-- ----------------------------------------------------------------------------
create table if not exists products (
  id                  uuid primary key default uuid_generate_v4(),
  name                text not null,
  slug                text not null unique,
  sku                 text unique,
  category_id         uuid references categories(id) on delete set null,
  short_description   text,
  description         text,
  price               numeric(10,2) not null default 0,
  compare_at_price    numeric(10,2),
  status              text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  is_featured         boolean not null default false,
  is_new_arrival      boolean not null default false,
  tags                text[] not null default '{}',
  meta_title          text,
  meta_description    text,
  weight_grams        numeric(10,2),
  length_cm           numeric(10,2),
  width_cm            numeric(10,2),
  height_cm           numeric(10,2),
  total_stock         int not null default 0,
  low_stock_threshold int not null default 5,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists idx_products_status on products(status);
create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_featured on products(is_featured);
create index if not exists idx_products_new_arrival on products(is_new_arrival);

create table if not exists product_images (
  id          uuid primary key default uuid_generate_v4(),
  product_id  uuid not null references products(id) on delete cascade,
  url         text not null,
  position    int not null default 0,
  is_primary  boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists idx_product_images_product on product_images(product_id);

create table if not exists product_variants (
  id              uuid primary key default uuid_generate_v4(),
  product_id      uuid not null references products(id) on delete cascade,
  size            text,
  color           text,
  stock           int not null default 0,
  price_override  numeric(10,2),
  sku_suffix      text,
  created_at      timestamptz not null default now()
);

create index if not exists idx_product_variants_product on product_variants(product_id);

-- ----------------------------------------------------------------------------
-- CUSTOMERS  (created at checkout — no login required, COD/pay-on-confirmation)
-- ----------------------------------------------------------------------------
create table if not exists customers (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  email       text not null,
  phone       text,
  created_at  timestamptz not null default now()
);

create unique index if not exists idx_customers_email on customers(lower(email));

create table if not exists addresses (
  id           uuid primary key default uuid_generate_v4(),
  customer_id  uuid not null references customers(id) on delete cascade,
  line1        text not null,
  line2        text,
  city         text not null,
  state        text not null,
  postal_code  text not null,
  country      text not null default 'India',
  phone        text,
  is_default   boolean not null default false,
  created_at   timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- COUPONS
-- ----------------------------------------------------------------------------
create table if not exists coupons (
  id            uuid primary key default uuid_generate_v4(),
  code          text not null unique,
  type          text not null check (type in ('percent', 'flat')),
  value         numeric(10,2) not null,
  expiry_date   date,
  usage_limit   int,
  times_used    int not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- ORDERS
-- ----------------------------------------------------------------------------
create table if not exists orders (
  id                 uuid primary key default uuid_generate_v4(),
  order_number       text not null unique,
  customer_id        uuid references customers(id) on delete set null,
  subtotal           numeric(10,2) not null default 0,
  shipping           numeric(10,2) not null default 0,
  discount           numeric(10,2) not null default 0,
  total              numeric(10,2) not null default 0,
  coupon_code        text,
  status             text not null default 'pending' check (status in ('pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_status     text not null default 'unpaid' check (payment_status in ('unpaid', 'paid')),
  payment_method     text not null default 'cod',
  shipping_address   jsonb not null,
  customer_name      text not null,
  customer_email     text not null,
  customer_phone     text,
  tracking_number    text,
  notes              text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_customer on orders(customer_id);
create index if not exists idx_orders_created on orders(created_at desc);

create table if not exists order_items (
  id            uuid primary key default uuid_generate_v4(),
  order_id      uuid not null references orders(id) on delete cascade,
  product_id    uuid references products(id) on delete set null,
  product_name  text not null,
  product_image text,
  size          text,
  color         text,
  qty           int not null,
  price         numeric(10,2) not null
);

create index if not exists idx_order_items_order on order_items(order_id);

-- ----------------------------------------------------------------------------
-- SUBSCRIBERS  (newsletter)
-- ----------------------------------------------------------------------------
create table if not exists subscribers (
  id             uuid primary key default uuid_generate_v4(),
  email          text not null unique,
  subscribed_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- SITE SETTINGS  (light CMS — hero copy, Why ORGN cards, Instagram links, etc.)
-- Single-row-per-key store so the admin panel can edit content without code.
-- ----------------------------------------------------------------------------
create table if not exists site_settings (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- MEDIA LIBRARY  (central asset index; files live in Supabase Storage)
-- ----------------------------------------------------------------------------
create table if not exists media_library (
  id           uuid primary key default uuid_generate_v4(),
  url          text not null,
  path         text not null,
  filename     text not null,
  alt_text     text,
  uploaded_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- updated_at helper trigger
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated_at on products;
create trigger trg_products_updated_at before update on products
  for each row execute procedure public.set_updated_at();

drop trigger if exists trg_categories_updated_at on categories;
create trigger trg_categories_updated_at before update on categories
  for each row execute procedure public.set_updated_at();

drop trigger if exists trg_orders_updated_at on orders;
create trigger trg_orders_updated_at before update on orders
  for each row execute procedure public.set_updated_at();
