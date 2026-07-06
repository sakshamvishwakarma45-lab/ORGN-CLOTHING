import type { Product } from '@/lib/types';
import { Reveal } from '@/components/ui/Reveal';
import { ProductCard } from './ProductCard';

export function NewArrivals({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <Reveal className="mb-10">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-orgn-orange">
          Just landed
        </p>
        <h2 className="font-display text-4xl font-black uppercase tracking-tight sm:text-5xl">
          New Arrivals
        </h2>
      </Reveal>

      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
        {products.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.08}>
            <ProductCard product={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
