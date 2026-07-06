'use client';

import { ArrowDown, ArrowUp, Loader2, Pencil, Plus, Trash2, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Category } from '@/lib/types';
import { slugify } from '@/lib/utils';

const emptyForm = { id: null as string | null, name: '', slug: '', bannerImage: '' };

export function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [form, setForm] = useState(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function startEdit(cat: Category) {
    setForm({ id: cat.id, name: cat.name, slug: cat.slug, bannerImage: cat.banner_image ?? '' });
    setSlugTouched(true);
  }

  function resetForm() {
    setForm(emptyForm);
    setSlugTouched(false);
  }

  async function handleBannerUpload(file: File) {
    setUploading(true);
    const supabase = createClient();
    const path = `categories/${crypto.randomUUID()}-${file.name.replace(/\s+/g, '-')}`;
    const { error } = await supabase.storage.from('orgn-media').upload(path, file);
    if (!error) {
      const { data } = supabase.storage.from('orgn-media').getPublicUrl(path);
      setForm((f) => ({ ...f, bannerImage: data.publicUrl }));
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();

    if (form.id) {
      const { data } = await supabase
        .from('categories')
        .update({ name: form.name, slug: form.slug, banner_image: form.bannerImage || null })
        .eq('id', form.id)
        .select('*')
        .single();
      if (data) setCategories((prev) => prev.map((c) => (c.id === form.id ? (data as Category) : c)));
    } else {
      const { data } = await supabase
        .from('categories')
        .insert({
          name: form.name,
          slug: form.slug || slugify(form.name),
          banner_image: form.bannerImage || null,
          display_order: categories.length,
        })
        .select('*')
        .single();
      if (data) setCategories((prev) => [...prev, data as Category]);
    }

    setSaving(false);
    resetForm();
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this category? Products in it will become uncategorized.')) return;
    const supabase = createClient();
    await supabase.from('categories').delete().eq('id', id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    router.refresh();
  }

  async function move(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= categories.length) return;
    const next = [...categories];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    setCategories(next);
    const supabase = createClient();
    await Promise.all(next.map((c, i) => supabase.from('categories').update({ display_order: i }).eq('id', c.id)));
    router.refresh();
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="overflow-x-auto border-2 border-ink bg-offwhite shadow-orgn-sm">
          <table className="w-full min-w-[500px] text-left text-sm">
            <thead className="border-b-2 border-ink bg-beige">
              <tr>
                <th className="p-4 font-bold uppercase tracking-wide">Order</th>
                <th className="p-4 font-bold uppercase tracking-wide">Name</th>
                <th className="p-4 font-bold uppercase tracking-wide">Slug</th>
                <th className="p-4 font-bold uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {categories.map((cat, i) => (
                <tr key={cat.id}>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button onClick={() => move(i, -1)} disabled={i === 0} className="disabled:opacity-20"><ArrowUp className="h-4 w-4" /></button>
                      <button onClick={() => move(i, 1)} disabled={i === categories.length - 1} className="disabled:opacity-20"><ArrowDown className="h-4 w-4" /></button>
                    </div>
                  </td>
                  <td className="p-4 font-semibold">{cat.name}</td>
                  <td className="p-4 text-ink/60">/{cat.slug}</td>
                  <td className="p-4">
                    <div className="flex gap-3">
                      <button onClick={() => startEdit(cat)} className="flex items-center gap-1 text-xs font-semibold uppercase text-orgn-orange hover:underline">
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </button>
                      <button onClick={() => handleDelete(cat.id)} className="flex items-center gap-1 text-xs font-semibold uppercase text-ink/50 hover:text-orgn-orange">
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-ink/50">No categories yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="h-fit border-2 border-ink bg-offwhite p-6 shadow-orgn-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold uppercase">{form.id ? 'Edit Category' : 'New Category'}</h2>
          {form.id && (
            <button type="button" onClick={resetForm} className="text-ink/40 hover:text-orgn-orange"><X className="h-4 w-4" /></button>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => {
                const name = e.target.value;
                setForm((f) => ({ ...f, name, slug: slugTouched ? f.slug : slugify(name) }));
              }}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Slug</label>
            <input
              required
              value={form.slug}
              onChange={(e) => { setForm((f) => ({ ...f, slug: slugify(e.target.value) })); setSlugTouched(true); }}
              className="input-field"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Banner Image</label>
            {form.bannerImage ? (
              <div className="relative mb-2 aspect-[3/1] overflow-hidden bg-beige">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.bannerImage} alt="" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, bannerImage: '' }))}
                  className="absolute right-2 top-2 rounded-full bg-beige p-1 hover:text-orgn-orange"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex aspect-[3/1] cursor-pointer flex-col items-center justify-center gap-1 border-2 border-dashed border-ink/30 text-ink/50 hover:border-orgn-orange hover:text-orgn-orange">
                {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
                <span className="text-xs font-semibold uppercase">Upload banner</span>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleBannerUpload(e.target.files[0])} />
              </label>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-6 flex w-full items-center justify-center gap-2 bg-ink py-3 text-sm font-semibold uppercase tracking-wide text-beige shadow-orgn-sm hover:bg-orgn-orange hover:text-ink disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : form.id ? 'Save Changes' : <><Plus className="h-4 w-4" /> Create Category</>}
        </button>
      </form>
    </div>
  );
}
