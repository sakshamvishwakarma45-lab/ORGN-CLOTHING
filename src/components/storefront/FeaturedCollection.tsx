import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Reveal } from '@/components/ui/Reveal';
import { ProductCard } from './ProductCard';

export function FeaturedCollection({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section id="featured" className="mx-auto max-w-7xl px-6 py-24">
      <Reveal className="mb-10 flex items-end justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-orgn-orange">
            Selected pieces
          </p>
          <h2 className="font-display text-4xl font-black uppercase tracking-tight sm:text-5xl">
            Featured Collection
          </h2>
        </div>
        <Link
          href="/shop"
          className="hidden text-sm font-semibold uppercase tracking-wide underline decoration-orgn-orange decoration-2 underline-offset-4 hover:text-orgn-orange sm:inline"
        >
          View All
        </Link>
      </Reveal>

      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
        {products.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.08}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>

      <div className="mt-10 text-center sm:hidden">
        <Link
          href="/shop"
          className="text-sm font-semibold uppercase tracking-wide underline decoration-orgn-orange decoration-2 underline-offset-4"
        >
          View All
        </Link>
      </div>
    </section>
  );
}
