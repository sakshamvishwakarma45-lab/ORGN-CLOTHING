import { NewProductForm } from '@/components/admin/NewProductForm';
import { createClient } from '@/lib/supabase/server';
import type { Category } from '@/lib/types';

export const metadata = { title: 'New Product' };

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from('categories').select('*').order('display_order');

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-8 font-display text-3xl font-black uppercase tracking-tight">New Product</h1>
      <NewProductForm categories={(categories ?? []) as Category[]} />
    </div>
  );
}
