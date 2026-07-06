import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getRelatedProducts } from '@/lib/data';
import { ProductGallery } from '@/components/storefront/ProductGallery';
import { ProductInfo } from '@/components/storefront/ProductInfo';
import { RelatedProducts } from '@/components/storefront/RelatedProducts';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: product.meta_title ?? product.name,
    description: product.meta_description ?? product.short_description ?? undefined,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);

  return (
    <div>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 lg:grid-cols-2">
        <ProductGallery images={product.product_images ?? []} productName={product.name} />
        <ProductInfo product={product} />
      </div>
      <RelatedProducts products={related} />
    </div>
  );
}
