import { createPublicClient } from '@/lib/supabase/public';
import type { AboutSettings, Category, HeroSettings, InstagramSettings, Product, WhyOrgnCard } from '@/lib/types';

const PRODUCT_SELECT = '*, category:categories(*), product_images(*), product_variants(*)';

export async function getCategories(): Promise<Category[]> {
  const supabase = createPublicClient();
  const { data } = await supabase.from('categories').select('*').order('display_order');
  return (data ?? []) as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = createPublicClient();
  const { data } = await supabase.from('categories').select('*').eq('slug', slug).single();
  return (data as Category) ?? null;
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  return (data ?? []) as unknown as Product[];
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('status', 'published')
    .eq('is_new_arrival', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  return (data ?? []) as unknown as Product[];
}

export interface ProductFilters {
  categorySlug?: string;
  sizes?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: 'newest' | 'price-asc' | 'price-desc';
}

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const supabase = createPublicClient();
  let query = supabase.from('products').select(PRODUCT_SELECT).eq('status', 'published');

  if (filters.categorySlug) {
    const category = await getCategoryBySlug(filters.categorySlug);
    if (category) query = query.eq('category_id', category.id);
    else return [];
  }
  if (typeof filters.minPrice === 'number') query = query.gte('price', filters.minPrice);
  if (typeof filters.maxPrice === 'number') query = query.lte('price', filters.maxPrice);

  switch (filters.sort) {
    case 'price-asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price-desc':
      query = query.order('price', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  const { data } = await query;
  let products = (data ?? []) as unknown as Product[];

  if (filters.sizes && filters.sizes.length > 0) {
    products = products.filter((p) =>
      p.product_variants?.some((v) => v.size && filters.sizes!.includes(v.size))
    );
  }

  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();
  return (data as unknown as Product) ?? null;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('status', 'published')
    .eq('category_id', product.category_id ?? '')
    .neq('id', product.id)
    .limit(limit);
  return (data ?? []) as unknown as Product[];
}

export async function getSiteSetting<T>(key: string, fallback: T): Promise<T> {
  const supabase = createPublicClient();
  const { data } = await supabase.from('site_settings').select('value').eq('key', key).single();
  return (data?.value as T) ?? fallback;
}

export async function getHeroSettings(): Promise<HeroSettings> {
  return getSiteSetting<HeroSettings>('hero', {
    heading: 'ORGN',
    subheading: 'Crafted from the origin. Built for everyday movement.',
    primary_cta_label: 'Shop Collection',
    primary_cta_href: '/shop',
    secondary_cta_label: 'Explore',
    secondary_cta_href: '#featured',
    floating_image: 'https://placehold.co/900x1100/0A0A0A/F4F1EA?text=ORGN',
  });
}

export async function getWhyOrgnCards(): Promise<WhyOrgnCard[]> {
  return getSiteSetting<WhyOrgnCard[]>('why_orgn', []);
}

export async function getInstagramSettings(): Promise<InstagramSettings> {
  return getSiteSetting<InstagramSettings>('instagram', {
    handle: '@orgnclothing.in',
    url: 'https://www.instagram.com/orgnclothing.in/',
    images: [],
  });
}

export async function getAboutSettings(): Promise<AboutSettings> {
  return getSiteSetting<AboutSettings>('about', {
    heading: 'Built from the ground up.',
    body: 'ORGN is a modern minimal streetwear label designed in India.',
  });
}
