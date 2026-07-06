import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { Order } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

export const metadata = { title: 'Orders' };

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-beige',
  paid: 'bg-ink text-beige',
  shipped: 'bg-orgn-orange text-ink',
  delivered: 'bg-ink text-beige',
  cancelled: 'bg-ink/10',
  refunded: 'bg-ink/10',
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const supabase = await createClient();

  let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (status) query = query.eq('status', status);
  const { data } = await query;
  const orders = (data ?? []) as Order[];

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-black uppercase tracking-tight">Orders</h1>

      <form className="mb-6 flex flex-wrap gap-3">
        <select name="status" defaultValue={status ?? ''} className="input-field max-w-[200px]">
          <option value="">All Statuses</option>
          {['pending', 'paid', 'shipped', 'delivered', 'cancelled', 'refunded'].map((s) => (
            <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
        <button type="submit" className="border-2 border-ink px-5 py-3 text-sm font-semibold uppercase hover:bg-ink hover:text-beige">
          Filter
        </button>
      </form>

      <div className="overflow-x-auto border-2 border-ink bg-offwhite shadow-orgn-sm">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b-2 border-ink bg-beige">
            <tr>
              <th className="p-4 font-bold uppercase tracking-wide">Order</th>
              <th className="p-4 font-bold uppercase tracking-wide">Customer</th>
              <th className="p-4 font-bold uppercase tracking-wide">Date</th>
              <th className="p-4 font-bold uppercase tracking-wide">Total</th>
              <th className="p-4 font-bold uppercase tracking-wide">Payment</th>
              <th className="p-4 font-bold uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="p-4">
                  <Link href={`/admin/orders/${o.id}`} className="font-semibold hover:text-orgn-orange">{o.order_number}</Link>
                </td>
                <td className="p-4">
                  <p>{o.customer_name}</p>
                  <p className="text-xs text-ink/50">{o.customer_email}</p>
                </td>
                <td className="p-4 text-ink/70">{new Date(o.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                <td className="p-4 font-semibold">{formatPrice(o.total)}</td>
                <td className="p-4 capitalize text-ink/70">{o.payment_status}</td>
                <td className="p-4">
                  <span className={`inline-block px-2 py-1 text-xs font-bold uppercase ${STATUS_COLORS[o.status]}`}>{o.status}</span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-ink/50">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
