'use client';

import { SlidersHorizontal, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import type { Category } from '@/lib/types';
import { cn } from '@/lib/utils';

const SIZES = ['S', 'M', 'L', 'XL', '30', '32', '34', '36', 'One Size'];
const SORTS: { value: string; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

export function ShopFilters({
  categories,
  activeCategory,
}: {
  categories: Category[];
  activeCategory?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeSizes = searchParams.get('sizes')?.split(',').filter(Boolean) ?? [];
  const sort = searchParams.get('sort') ?? 'newest';
  const minPrice = searchParams.get('min') ?? '';
  const maxPrice = searchParams.get('max') ?? '';

  function updateParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '') params.delete(key);
      else params.set(key, value);
    });
    router.push(`?${params.toString()}`, { scroll: false });
  }

  function toggleSize(size: string) {
    const next = activeSizes.includes(size)
      ? activeSizes.filter((s) => s !== size)
      : [...activeSizes, size];
    updateParams({ sizes: next.length ? next.join(',') : null });
  }

  const content = (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-ink/50">Category</h3>
        <ul className="flex flex-col gap-2">
          <li>
            <a
              href="/shop"
              className={cn('text-sm font-semibold', !activeCategory ? 'text-orgn-orange' : 'hover:text-orgn-orange')}
            >
              All Products
            </a>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <a
                href={`/category/${c.slug}`}
                className={cn(
                  'text-sm font-semibold',
                  activeCategory === c.slug ? 'text-orgn-orange' : 'hover:text-orgn-orange'
                )}
              >
                {c.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-ink/50">Size</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={cn(
                'border-2 px-3 py-1.5 text-xs font-semibold transition',
                activeSizes.includes(size)
                  ? 'border-ink bg-ink text-beige'
                  : 'border-ink/20 hover:border-ink'
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-ink/50">Price (₹)</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={minPrice}
            onBlur={(e) => updateParams({ min: e.target.value || null })}
            className="w-full border-2 border-ink/20 px-3 py-2 text-sm outline-none focus:border-orgn-orange"
          />
          <span className="text-ink/40">—</span>
          <input
            type="number"
            placeholder="Max"
            defaultValue={maxPrice}
            onBlur={(e) => updateParams({ max: e.target.value || null })}
            className="w-full border-2 border-ink/20 px-3 py-2 text-sm outline-none focus:border-orgn-orange"
          />
        </div>
      </div>

      {(activeSizes.length > 0 || minPrice || maxPrice) && (
        <button
          onClick={() => router.push(activeCategory ? `/category/${activeCategory}` : '/shop')}
          className="text-left text-xs font-semibold uppercase tracking-wide text-orgn-orange underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );

  return (
    <>
      <div className="flex items-center justify-between border-b border-ink/10 pb-4 lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
        <select
          value={sort}
          onChange={(e) => updateParams({ sort: e.target.value })}
          className="border-2 border-ink/20 bg-transparent px-3 py-2 text-xs font-semibold uppercase"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <aside className="hidden w-64 flex-shrink-0 lg:block">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold uppercase">Filters</h2>
          <select
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value })}
            className="border-2 border-ink/20 bg-transparent px-2 py-1.5 text-xs font-semibold"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        {content}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-beige p-6 lg:hidden">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-xl font-black uppercase">Filters</h2>
            <button onClick={() => setMobileOpen(false)} aria-label="Close filters">
              <X className="h-6 w-6" />
            </button>
          </div>
          {content}
          <button
            onClick={() => setMobileOpen(false)}
            className="mt-8 w-full bg-ink py-4 text-sm font-semibold uppercase tracking-wide text-beige"
          >
            Show Results
          </button>
        </div>
      )}
    </>
  );
}
