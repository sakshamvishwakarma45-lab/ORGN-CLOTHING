// Hand-written types mirroring supabase/01_schema.sql.
// If you prefer generated types, run:
//   npx supabase gen types typescript --project-id uribmkwvszwspuddgkua > src/lib/database.types.ts
// and swap the Database type below for the generated one.

export type ProductStatus = 'draft' | 'published' | 'archived';
export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'unpaid' | 'paid';
export type CouponType = 'percent' | 'flat';
export type ProfileRole = 'admin' | 'staff';

export interface Category {
  id: string;
  name: string;
  slug: string;
  banner_image: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  position: number;
  is_primary: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string | null;
  color: string | null;
  stock: number;
  price_override: number | null;
  sku_suffix: string | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  category_id: string | null;
  short_description: string | null;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  status: ProductStatus;
  is_featured: boolean;
  is_new_arrival: boolean;
  tags: string[];
  meta_title: string | null;
  meta_description: string | null;
  weight_grams: number | null;
  length_cm: number | null;
  width_cm: number | null;
  height_cm: number | null;
  total_stock: number;
  low_stock_threshold: number;
  created_at: string;
  updated_at: string;
  category?: Category | null;
  product_images?: ProductImage[];
  product_variants?: ProductVariant[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
}

export interface Address {
  id: string;
  customer_id: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string | null;
  is_default: boolean;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  product_image: string | null;
  size: string | null;
  color: string | null;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  coupon_code: string | null;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string;
  shipping_address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  tracking_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  expiry_date: string | null;
  usage_limit: number | null;
  times_used: number;
  is_active: boolean;
  created_at: string;
}

export interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
}

export interface Profile {
  id: string;
  username: string | null;
  name: string | null;
  role: ProfileRole;
  created_at: string;
}

export interface WhyOrgnCard {
  icon: string;
  title: string;
  description: string;
}

export interface HeroSettings {
  heading: string;
  subheading: string;
  primary_cta_label: string;
  primary_cta_href: string;
  secondary_cta_label: string;
  secondary_cta_href: string;
  floating_image: string;
}

export interface InstagramSettings {
  handle: string;
  url: string;
  images: string[];
}

export interface AboutSettings {
  heading: string;
  body: string;
}

