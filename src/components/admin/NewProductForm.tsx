'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Category } from '@/lib/types';
import { slugify } from '@/lib/utils';

export function NewProductForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: insertError } = await supabase
      .from('products')
      .insert({
        name,
        slug: slug || slugify(name),
        category_id: categoryId || null,
        price: Number(price) || 0,
        status: 'draft',
      })
      .select('id')
      .single();

    if (insertError) {
      setError(insertError.message.includes('duplicate') ? 'That slug is already in use.' : insertError.message);
      setLoading(false);
      return;
    }

    router.push(`/admin/products/${data.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 border-2 border-ink bg-offwhite p-6 shadow-orgn-sm">
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Product Name</label>
        <input required value={name} onChange={(e) => handleNameChange(e.target.value)} className="input-field" autoFocus />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">URL Slug</label>
        <input
          required
          value={slug}
          onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true); }}
          className="input-field"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Category</label>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="input-field">
          <option value="">No category</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Price (₹)</label>
        <input required type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="input-field" />
      </div>

      {error && <p className="text-sm text-orgn-orange">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 flex items-center justify-center gap-2 bg-ink py-3.5 text-sm font-semibold uppercase tracking-wide text-beige shadow-orgn-sm hover:bg-orgn-orange hover:text-ink disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create & Continue Editing'}
      </button>
    </form>
  );
}
