'use client';

import { Loader2, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Coupon } from '@/lib/types';

const emptyForm = { code: '', type: 'percent' as 'percent' | 'flat', value: '', expiryDate: '', usageLimit: '' };

export function CouponManager({ initialCoupons }: { initialCoupons: Coupon[] }) {
  const router = useRouter();
  const [coupons, setCoupons] = useState(initialCoupons);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const supabase = createClient();

    const { data, error: insertError } = await supabase
      .from('coupons')
      .insert({
        code: form.code.toUpperCase().trim(),
        type: form.type,
        value: Number(form.value) || 0,
        expiry_date: form.expiryDate || null,
        usage_limit: form.usageLimit ? Number(form.usageLimit) : null,
        is_active: true,
      })
      .select('*')
      .single();

    setSaving(false);
    if (insertError) {
      setError(insertError.message.includes('duplicate') ? 'That code already exists.' : insertError.message);
      return;
    }
    setCoupons((prev) => [data as Coupon, ...prev]);
    setForm(emptyForm);
    router.refresh();
  }

  async function toggleActive(coupon: Coupon) {
    const supabase = createClient();
    await supabase.from('coupons').update({ is_active: !coupon.is_active }).eq('id', coupon.id);
    setCoupons((prev) => prev.map((c) => (c.id === coupon.id ? { ...c, is_active: !c.is_active } : c)));
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this coupon?')) return;
    const supabase = createClient();
    await supabase.from('coupons').delete().eq('id', id);
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="overflow-x-auto border-2 border-ink bg-offwhite shadow-orgn-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b-2 border-ink bg-beige">
              <tr>
                <th className="p-4 font-bold uppercase tracking-wide">Code</th>
                <th className="p-4 font-bold uppercase tracking-wide">Discount</th>
                <th className="p-4 font-bold uppercase tracking-wide">Usage</th>
                <th className="p-4 font-bold uppercase tracking-wide">Expires</th>
                <th className="p-4 font-bold uppercase tracking-wide">Active</th>
                <th className="p-4 font-bold uppercase tracking-wide"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/10">
              {coupons.map((c) => (
                <tr key={c.id}>
                  <td className="p-4 font-mono font-semibold">{c.code}</td>
                  <td className="p-4">{c.type === 'percent' ? `${c.value}%` : `₹${c.value}`}</td>
                  <td className="p-4 text-ink/70">{c.times_used}{c.usage_limit ? ` / ${c.usage_limit}` : ''}</td>
                  <td className="p-4 text-ink/70">{c.expiry_date ? new Date(c.expiry_date).toLocaleDateString('en-IN') : 'Never'}</td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleActive(c)}
                      className={`px-2 py-1 text-xs font-bold uppercase ${c.is_active ? 'bg-ink text-beige' : 'bg-ink/10 text-ink/50'}`}
                    >
                      {c.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="p-4">
                    <button onClick={() => handleDelete(c.id)} className="text-ink/40 hover:text-orgn-orange"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-ink/50">No coupons yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="h-fit border-2 border-ink bg-offwhite p-6 shadow-orgn-sm">
        <h2 className="mb-4 font-display text-lg font-bold uppercase">New Coupon</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Code</label>
            <input required value={form.code} onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))} className="input-field font-mono uppercase" placeholder="SUMMER20" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Type</label>
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as 'percent' | 'flat' }))} className="input-field">
                <option value="percent">Percent</option>
                <option value="flat">Flat (₹)</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Value</label>
              <input required type="number" min="0" value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} className="input-field" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Expiry Date</label>
            <input type="date" value={form.expiryDate} onChange={(e) => setForm((f) => ({ ...f, expiryDate: e.target.value }))} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Usage Limit</label>
            <input type="number" min="0" value={form.usageLimit} onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value }))} className="input-field" placeholder="Optional" />
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-orgn-orange">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="mt-6 flex w-full items-center justify-center gap-2 bg-ink py-3 text-sm font-semibold uppercase tracking-wide text-beige shadow-orgn-sm hover:bg-orgn-orange hover:text-ink disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4" /> Create Coupon</>}
        </button>
      </form>
    </div>
  );
}
