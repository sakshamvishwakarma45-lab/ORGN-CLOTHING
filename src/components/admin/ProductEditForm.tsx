'use client';

import { Check, Loader2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Category, Product } from '@/lib/types';
import { slugify } from '@/lib/utils';

export function ProductEditForm({ product, categories }: { product: Product; categories: Category[] }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: product.name,
    slug: product.slug,
    sku: product.sku ?? '',
    categoryId: product.category_id ?? '',
    shortDescription: product.short_description ?? '',
    description: product.description ?? '',
    price: String(product.price),
    compareAtPrice: product.compare_at_price != null ? String(product.compare_at_price) : '',
    isFeatured: product.is_featured,
    isNewArrival: product.is_new_arrival,
    tags: product.tags.join(', '),
    metaTitle: product.meta_title ?? '',
    metaDescription: product.meta_description ?? '',
    lowStockThreshold: String(product.low_stock_threshold),
    weightGrams: product.weight_grams != null ? String(product.weight_grams) : '',
    lengthCm: product.length_cm != null ? String(product.length_cm) : '',
    widthCm: product.width_cm != null ? String(product.width_cm) : '',
    heightCm: product.height_cm != null ? String(product.height_cm) : '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from('products')
      .update({
        name: form.name,
        slug: form.slug || slugify(form.name),
        sku: form.sku || null,
        category_id: form.categoryId || null,
        short_description: form.shortDescription || null,
        description: form.description || null,
        price: Number(form.price) || 0,
        compare_at_price: form.compareAtPrice ? Number(form.compareAtPrice) : null,
        is_featured: form.isFeatured,
        is_new_arrival: form.isNewArrival,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        meta_title: form.metaTitle || null,
        meta_description: form.metaDescription || null,
        low_stock_threshold: Number(form.lowStockThreshold) || 5,
        weight_grams: form.weightGrams ? Number(form.weightGrams) : null,
        length_cm: form.lengthCm ? Number(form.lengthCm) : null,
        width_cm: form.widthCm ? Number(form.widthCm) : null,
        height_cm: form.heightCm ? Number(form.heightCm) : null,
      })
      .eq('id', product.id);

    setSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleDelete() {
    if (!confirm(`Delete "${product.name}"? This can't be undone.`)) return;
    const supabase = createClient();
    await supabase.from('products').delete().eq('id', product.id);
    router.push('/admin/products');
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-8">
      <section className="border-2 border-ink bg-offwhite p-6 shadow-orgn-sm">
        <h2 className="mb-4 font-display text-lg font-bold uppercase">Basic Info</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Name</label>
            <input required value={form.name} onChange={(e) => set('name', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Slug</label>
            <input required value={form.slug} onChange={(e) => set('slug', slugify(e.target.value))} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">SKU</label>
            <input value={form.sku} onChange={(e) => set('sku', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Category</label>
            <select value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)} className="input-field">
              <option value="">No category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Tags (comma separated)</label>
            <input value={form.tags} onChange={(e) => set('tags', e.target.value)} className="input-field" placeholder="tee, black, bestseller" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Short Description</label>
            <input value={form.shortDescription} onChange={(e) => set('shortDescription', e.target.value)} className="input-field" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Long Description</label>
            <textarea rows={5} value={form.description} onChange={(e) => set('description', e.target.value)} className="input-field resize-none" />
          </div>
        </div>
      </section>

      <section className="border-2 border-ink bg-offwhite p-6 shadow-orgn-sm">
        <h2 className="mb-4 font-display text-lg font-bold uppercase">Pricing &amp; Visibility</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Price (₹)</label>
            <input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => set('price', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Compare-at Price (₹)</label>
            <input type="number" min="0" step="0.01" value={form.compareAtPrice} onChange={(e) => set('compareAtPrice', e.target.value)} className="input-field" placeholder="Optional" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Low Stock Threshold</label>
            <input type="number" min="0" value={form.lowStockThreshold} onChange={(e) => set('lowStockThreshold', e.target.value)} className="input-field" />
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} className="h-4 w-4" />
            Featured on homepage
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" checked={form.isNewArrival} onChange={(e) => set('isNewArrival', e.target.checked)} className="h-4 w-4" />
            New Arrival
          </label>
        </div>
      </section>

      <section className="border-2 border-ink bg-offwhite p-6 shadow-orgn-sm">
        <h2 className="mb-4 font-display text-lg font-bold uppercase">SEO</h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Meta Title</label>
            <input value={form.metaTitle} onChange={(e) => set('metaTitle', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Meta Description</label>
            <textarea rows={2} value={form.metaDescription} onChange={(e) => set('metaDescription', e.target.value)} className="input-field resize-none" />
          </div>
        </div>
      </section>

      <section className="border-2 border-ink bg-offwhite p-6 shadow-orgn-sm">
        <h2 className="mb-4 font-display text-lg font-bold uppercase">Shipping (weight &amp; dimensions)</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Weight (g)</label>
            <input type="number" min="0" value={form.weightGrams} onChange={(e) => set('weightGrams', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Length (cm)</label>
            <input type="number" min="0" value={form.lengthCm} onChange={(e) => set('lengthCm', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Width (cm)</label>
            <input type="number" min="0" value={form.widthCm} onChange={(e) => set('widthCm', e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Height (cm)</label>
            <input type="number" min="0" value={form.heightCm} onChange={(e) => set('heightCm', e.target.value)} className="input-field" />
          </div>
        </div>
      </section>

      {error && <p className="text-sm text-orgn-orange">{error}</p>}

      <div className="flex items-center justify-between">
        <button type="button" onClick={handleDelete} className="flex items-center gap-2 text-sm font-semibold uppercase text-ink/50 hover:text-orgn-orange">
          <Trash2 className="h-4 w-4" /> Delete Product
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-ink px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-beige shadow-orgn-sm hover:bg-orgn-orange hover:text-ink disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : null}
          {saved ? 'Saved' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
