'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function DeleteProductButton({ productId, productName }: { productId: string; productName: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${productName}"? This can't be undone.`)) return;
    setLoading(true);
    const supabase = createClient();
    await supabase.from('products').delete().eq('id', productId);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-1 text-xs font-semibold uppercase text-ink/50 hover:text-orgn-orange disabled:opacity-50"
    >
      <Trash2 className="h-3.5 w-3.5" /> Delete
    </button>
  );
}
