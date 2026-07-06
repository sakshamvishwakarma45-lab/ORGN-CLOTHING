'use client';

import { Check, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ProductStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

const OPTIONS: { value: ProductStatus; label: string }[] = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

export function ProductStatusControl({ productId, initialStatus }: { productId: string; initialStatus: ProductStatus }) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  async function handleChange(next: ProductStatus) {
    if (next === status) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from('products').update({ status: next }).eq('id', productId);
    setSaving(false);
    if (!error) {
      setStatus(next);
      setJustSaved(true);
      router.refresh();
      setTimeout(() => setJustSaved(false), 1800);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex border-2 border-ink">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => handleChange(opt.value)}
            disabled={saving}
            className={cn(
              'px-4 py-2 text-xs font-bold uppercase tracking-wide transition disabled:cursor-wait',
              status === opt.value
                ? opt.value === 'published'
                  ? 'bg-orgn-orange text-ink'
                  : 'bg-ink text-beige'
                : 'bg-offwhite text-ink/50 hover:text-ink'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {saving && <Loader2 className="h-4 w-4 animate-spin text-ink/40" />}
      {justSaved && !saving && (
        <span className="flex items-center gap-1 text-xs font-semibold text-orgn-orange">
          <Check className="h-3.5 w-3.5" /> Saved
        </span>
      )}
      {status !== 'published' && !saving && (
        <span className="text-xs text-ink/40">Not visible on the storefront yet</span>
      )}
    </div>
  );
}
