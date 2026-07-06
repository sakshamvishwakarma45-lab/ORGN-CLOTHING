import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ImageManager } from '@/components/admin/ImageManager';
import { ProductEditForm } from '@/components/admin/ProductEditForm';
import { ProductStatusControl } from '@/components/admin/ProductStatusControl';
import { VariantManager } from '@/components/admin/VariantManager';
import { createClient } from '@/lib/supabase/server';
import type { Category, Product } from '@/lib/types';

export const metadata = { title: 'Edit Product' };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*, product_images(*), product_variants(*)').eq('id', id).single(),
    supabase.from('categories').select('*').order('display_order'),
  ]);

  if (!product) notFound();
  const typedProduct = product as unknown as Product;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin/products" className="text-xs font-semibold uppercase text-ink/50 hover:text-orgn-orange">← All Products</Link>
          <h1 className="mt-1 font-display text-3xl font-black uppercase tracking-tight">{typedProduct.name}</h1>
        </div>
        {typedProduct.status === 'published' && (
          <Link href={`/product/${typedProduct.slug}`} target="_blank" className="text-xs font-semibold uppercase text-orgn-orange hover:underline">
            View Live →
          </Link>
        )}
      </div>

      <div className="mb-8">
        <ProductStatusControl productId={typedProduct.id} initialStatus={typedProduct.status} />
      </div>

      <div className="mb-8 border-2 border-ink bg-offwhite p-6 shadow-orgn-sm">
        <h2 className="mb-4 font-display text-lg font-bold uppercase">Images</h2>
        <ImageManager productId={typedProduct.id} initialImages={typedProduct.product_images ?? []} />
      </div>

      <div className="mb-8 border-2 border-ink bg-offwhite p-6 shadow-orgn-sm">
        <h2 className="mb-4 font-display text-lg font-bold uppercase">Variants (Size / Color / Stock)</h2>
        <VariantManager productId={typedProduct.id} initialVariants={typedProduct.product_variants ?? []} />
      </div>

      <ProductEditForm product={typedProduct} categories={(categories ?? []) as Category[]} />
    </div>
  );
}
