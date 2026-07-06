'use client';

import { Check, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Order, OrderStatus, PaymentStatus } from '@/lib/types';

export function OrderStatusForm({ order }: { order: Order }) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(order.payment_status);
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number ?? '');
  const [notes, setNotes] = useState(order.notes ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from('orders')
      .update({
        status,
        payment_status: paymentStatus,
        tracking_number: trackingNumber || null,
        notes: notes || null,
      })
      .eq('id', order.id);
    setSaving(false);
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Order Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value as OrderStatus)} className="input-field">
          {['pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded'].map((s) => (
            <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Payment Status</label>
        <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)} className="input-field">
          <option value="unpaid">Unpaid</option>
          <option value="paid">Paid</option>
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Tracking Number</label>
        <input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} className="input-field" placeholder="Optional" />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Internal Notes</label>
        <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className="input-field resize-none" placeholder="Optional" />
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center justify-center gap-2 bg-ink py-3 text-sm font-semibold uppercase tracking-wide text-beige shadow-orgn-sm hover:bg-orgn-orange hover:text-ink disabled:opacity-60"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : null}
        {saved ? 'Saved' : 'Update Order'}
      </button>
    </div>
  );
}
