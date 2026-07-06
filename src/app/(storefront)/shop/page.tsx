import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getCategories, getProducts } from '@/lib/data';
import { ProductCard } from '@/components/storefront/ProductCard';
import { ShopFilters } from '@/components/storefront/ShopFilters';
import { Reveal } from '@/components/ui/Reveal';

export const metadata: Metadata = { title: 'Shop All' };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ sizes?: string; min?: string; max?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const categories = await getCategories();
  const products = await getProducts({
    sizes: params.sizes?.split(',').filter(Boolean),
    minPrice: params.min ? Number(params.min) : undefined,
    maxPrice: params.max ? Number(params.max) : undefined,
    sort: (params.sort as 'newest' | 'price-asc' | 'price-desc') ?? 'newest',
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <Reveal className="mb-10">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-orgn-orange">
          {products.length} {products.length === 1 ? 'piece' : 'pieces'}
        </p>
        <h1 className="font-display text-5xl font-black uppercase tracking-tight sm:text-6xl">
          Shop All
        </h1>
      </Reveal>

      <div className="flex flex-col gap-10 lg:flex-row">
        <Suspense fallback={null}>
          <ShopFilters categories={categories} />
        </Suspense>

        <div className="flex-1">
          {products.length === 0 ? (
            <p className="py-24 text-center text-ink/50">
              No products match those filters. Try clearing a few and searching again.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
