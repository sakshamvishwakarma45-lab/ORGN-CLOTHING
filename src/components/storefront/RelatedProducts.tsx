import type { Product } from '@/lib/types';
import { Reveal } from '@/components/ui/Reveal';
import { ProductCard } from './ProductCard';

export function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <Reveal className="mb-10">
        <h2 className="font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
          You Might Also Like
        </h2>
      </Reveal>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
