'use client';

import { Check, Loader2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ProductVariant } from '@/lib/types';

interface VariantRow {
  id: string;
  size: string;
  color: string;
  stock: number;
  priceOverride: string;
}

function toRows(variants: ProductVariant[]): VariantRow[] {
  return variants.map((v) => ({
    id: v.id,
    size: v.size ?? '',
    color: v.color ?? '',
    stock: v.stock,
    priceOverride: v.price_override != null ? String(v.price_override) : '',
  }));
}

export function VariantManager({ productId, initialVariants }: { productId: string; initialVariants: ProductVariant[] }) {
  const [rows, setRows] = useState<VariantRow[]>(
    initialVariants.length > 0 ? toRows(initialVariants) : [{ id: crypto.randomUUID(), size: '', color: '', stock: 0, priceOverride: '' }]
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function updateRow(id: string, patch: Partial<VariantRow>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function addRow() {
    setRows((prev) => [...prev, { id: crypto.randomUUID(), size: '', color: '', stock: 0, priceOverride: '' }]);
  }

  function removeRow(id: string) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function addSizeRun() {
    const template = rows[0];
    const sizes = ['S', 'M', 'L', 'XL'];
    setRows(sizes.map((size) => ({
      id: crypto.randomUUID(), size, color: template?.color ?? '', stock: 10, priceOverride: '',
    })));
  }

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();
    const validRows = rows.filter((r) => r.size.trim().length > 0);

    await supabase.from('product_variants').delete().eq('product_id', productId);

    if (validRows.length > 0) {
      await supabase.from('product_variants').insert(
        validRows.map((r) => ({
          product_id: productId,
          size: r.size.trim(),
          color: r.color.trim() || null,
          stock: Number(r.stock) || 0,
          price_override: r.priceOverride ? Number(r.priceOverride) : null,
          sku_suffix: r.size.trim(),
        }))
      );
    }

    const totalStock = validRows.reduce((sum, r) => sum + (Number(r.stock) || 0), 0);
    await supabase.from('products').update({ total_stock: totalStock }).eq('id', productId);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <button onClick={addSizeRun} type="button" className="text-xs font-semibold uppercase text-orgn-orange hover:underline">
          Quick-fill S/M/L/XL
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="hidden grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 px-1 text-xs font-bold uppercase tracking-widest text-ink/40 sm:grid">
          <span>Size</span><span>Color</span><span>Stock</span><span>Price Override (₹)</span><span></span>
        </div>
        {rows.map((row) => (
          <div key={row.id} className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_1fr_1fr_1fr_auto]">
            <input value={row.size} onChange={(e) => updateRow(row.id, { size: e.target.value })} placeholder="S / M / 32…" className="input-field" />
            <input value={row.color} onChange={(e) => updateRow(row.id, { color: e.target.value })} placeholder="Black" className="input-field" />
            <input type="number" min="0" value={row.stock} onChange={(e) => updateRow(row.id, { stock: Number(e.target.value) })} className="input-field" />
            <input type="number" min="0" step="0.01" value={row.priceOverride} onChange={(e) => updateRow(row.id, { priceOverride: e.target.value })} placeholder="Optional" className="input-field" />
            <button onClick={() => removeRow(row.id)} type="button" className="flex items-center justify-center p-2 text-ink/40 hover:text-orgn-orange">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button onClick={addRow} type="button" className="flex items-center gap-1 text-xs font-semibold uppercase text-ink/60 hover:text-orgn-orange">
          <Plus className="h-3.5 w-3.5" /> Add Variant
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          type="button"
          className="ml-auto flex items-center gap-2 bg-ink px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-beige hover:bg-orgn-orange hover:text-ink disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : null}
          {saved ? 'Saved' : 'Save Variants'}
        </button>
      </div>
    </div>
  );
}
