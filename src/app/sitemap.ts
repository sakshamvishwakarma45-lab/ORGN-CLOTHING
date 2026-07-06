import type { MetadataRoute } from 'next';
import { getCategories, getProducts } from '@/lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://orgnclothing.in';
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  const staticRoutes = [
    '', '/shop', '/about', '/contact', '/shipping-returns', '/privacy', '/terms',
  ].map((path) => ({ url: `${base}${path}`, lastModified: new Date() }));

  const categoryRoutes = categories.map((c) => ({
    url: `${base}/category/${c.slug}`,
    lastModified: new Date(c.updated_at),
  }));

  const productRoutes = products.map((p) => ({
    url: `${base}/product/${p.slug}`,
    lastModified: new Date(p.updated_at),
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
