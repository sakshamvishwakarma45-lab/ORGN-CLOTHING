import { CategoryManager } from '@/components/admin/CategoryManager';
import { createClient } from '@/lib/supabase/server';
import type { Category } from '@/lib/types';

export const metadata = { title: 'Categories' };

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('categories').select('*').order('display_order');

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-black uppercase tracking-tight">Categories</h1>
      <CategoryManager initialCategories={(data ?? []) as Category[]} />
    </div>
  );
}
