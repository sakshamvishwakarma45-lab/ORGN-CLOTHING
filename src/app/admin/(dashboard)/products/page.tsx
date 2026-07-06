import { Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { DeleteProductButton } from '@/components/admin/DeleteProductButton';
import { createClient } from '@/lib/supabase/server';
import type { Category, Product } from '@/lib/types';
import { formatPrice, getPrimaryImage } from '@/lib/utils';

export const metadata = { title: 'Products' };

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; category?: string }>;
}) {
  const { q, status, category } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('products')
    .select('*, category:categories(*), product_images(*)')
    .order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);
  if (category) query = query.eq('category_id', category);
  if (q) query = query.ilike('name', `%${q}%`);

  const [{ data: products }, { data: categories }] = await Promise.all([
    query,
    supabase.from('categories').select('*').order('display_order'),
  ]);

  const productList = (products ?? []) as unknown as Product[];
  const categoryList = (categories ?? []) as Category[];

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-black uppercase tracking-tight">Products</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-ink px-5 py-3 text-sm font-semibold uppercase tracking-wide text-beige shadow-orgn-sm hover:bg-orgn-orange hover:text-ink"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      <form className="mb-6 flex flex-wrap gap-3">
        <input name="q" defaultValue={q} placeholder="Search by name…" className="input-field max-w-xs" />
        <select name="status" defaultValue={status ?? ''} className="input-field max-w-[160px]">
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <select name="category" defaultValue={category ?? ''} className="input-field max-w-[200px]">
          <option value="">All Categories</option>
          {categoryList.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button type="submit" className="border-2 border-ink px-5 py-3 text-sm font-semibold uppercase hover:bg-ink hover:text-beige">
          Filter
        </button>
      </form>

      <div className="overflow-x-auto border-2 border-ink bg-offwhite shadow-orgn-sm">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b-2 border-ink bg-beige">
            <tr>
              <th className="p-4 font-bold uppercase tracking-wide">Product</th>
              <th className="p-4 font-bold uppercase tracking-wide">Category</th>
              <th className="p-4 font-bold uppercase tracking-wide">Price</th>
              <th className="p-4 font-bold uppercase tracking-wide">Stock</th>
              <th className="p-4 font-bold uppercase tracking-wide">Status</th>
              <th className="p-4 font-bold uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {productList.map((p) => (
              <tr key={p.id}>
                <td className="flex items-center gap-3 p-4">
                  <div className="relative h-12 w-10 flex-shrink-0 overflow-hidden bg-beige">
                    <Image src={getPrimaryImage(p.product_images)} alt={p.name} fill className="object-cover" sizes="40px" />
                  </div>
                  <div>
                    <Link href={`/admin/products/${p.id}`} className="font-semibold hover:text-orgn-orange">{p.name}</Link>
                    <p className="text-xs text-ink/50">{p.sku}</p>
                  </div>
                </td>
                <td className="p-4 text-ink/70">{p.category?.name ?? '—'}</td>
                <td className="p-4 font-semibold">{formatPrice(p.price)}</td>
                <td className="p-4">
                  <span className={p.total_stock <= p.low_stock_threshold ? 'font-semibold text-orgn-orange' : ''}>
                    {p.total_stock}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`inline-block px-2 py-1 text-xs font-bold uppercase ${
                    p.status === 'published' ? 'bg-ink text-beige' : p.status === 'draft' ? 'bg-beige' : 'bg-ink/10'
                  }`}>
                    {p.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/products/${p.id}`} className="text-xs font-semibold uppercase text-orgn-orange hover:underline">Edit</Link>
                    <DeleteProductButton productId={p.id} productName={p.name} />
                  </div>
                </td>
              </tr>
            ))}
            {productList.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-ink/50">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
