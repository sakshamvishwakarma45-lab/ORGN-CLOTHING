import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getCategories, getCategoryBySlug, getProducts } from '@/lib/data';
import { ProductCard } from '@/components/storefront/ProductCard';
import { ShopFilters } from '@/components/storefront/ShopFilters';
import { Reveal } from '@/components/ui/Reveal';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  return { title: category?.name ?? 'Category' };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sizes?: string; min?: string; max?: string; sort?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const [category, categories] = await Promise.all([getCategoryBySlug(slug), getCategories()]);
  if (!category) notFound();

  const products = await getProducts({
    categorySlug: slug,
    sizes: sp.sizes?.split(',').filter(Boolean),
    minPrice: sp.min ? Number(sp.min) : undefined,
    maxPrice: sp.max ? Number(sp.max) : undefined,
    sort: (sp.sort as 'newest' | 'price-asc' | 'price-desc') ?? 'newest',
  });

  return (
    <div>
      <div className="relative flex h-64 items-end overflow-hidden bg-ink sm:h-80">
        {category.banner_image && (
          <Image
            src={category.banner_image}
            alt={category.name}
            fill
            className="object-cover opacity-50"
            priority
          />
        )}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-10">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-offwhite/60">
            <span>Shop</span> <ArrowRight className="h-3 w-3" /> <span>{category.name}</span>
          </div>
          <h1 className="mt-2 font-display text-5xl font-black uppercase tracking-tight text-offwhite sm:text-6xl">
            {category.name}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <Reveal className="mb-8 text-sm font-semibold uppercase tracking-wide text-ink/50">
          {products.length} {products.length === 1 ? 'piece' : 'pieces'}
        </Reveal>

        <div className="flex flex-col gap-10 lg:flex-row">
          <Suspense fallback={null}>
            <ShopFilters categories={categories} activeCategory={slug} />
          </Suspense>

          <div className="flex-1">
            {products.length === 0 ? (
              <p className="py-24 text-center text-ink/50">
                Nothing here yet — check back soon or try clearing your filters.
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
    </div>
  );
}
