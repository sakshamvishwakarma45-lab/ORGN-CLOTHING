import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Customer, Order } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

export const metadata = { title: 'Customer Detail' };

export default async function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: customer }, { data: orders }] = await Promise.all([
    supabase.from('customers').select('*').eq('id', id).single(),
    supabase.from('orders').select('*').eq('customer_id', id).order('created_at', { ascending: false }),
  ]);

  if (!customer) notFound();
  const typedCustomer = customer as Customer;
  const orderList = (orders ?? []) as Order[];
  const totalSpent = orderList.reduce((sum, o) => sum + Number(o.total), 0);

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/customers" className="text-xs font-semibold uppercase text-ink/50 hover:text-orgn-orange">← All Customers</Link>
      <h1 className="mb-8 mt-1 font-display text-3xl font-black uppercase tracking-tight">{typedCustomer.name}</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="border-2 border-ink bg-offwhite p-5 shadow-orgn-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-ink/50">Email</p>
          <p className="mt-1 font-semibold">{typedCustomer.email}</p>
        </div>
        <div className="border-2 border-ink bg-offwhite p-5 shadow-orgn-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-ink/50">Phone</p>
          <p className="mt-1 font-semibold">{typedCustomer.phone ?? '—'}</p>
        </div>
        <div className="border-2 border-ink bg-offwhite p-5 shadow-orgn-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-ink/50">Total Spent</p>
          <p className="mt-1 font-semibold text-orgn-orange">{formatPrice(totalSpent)}</p>
        </div>
      </div>

      <section className="border-2 border-ink bg-offwhite p-6 shadow-orgn-sm">
        <h2 className="mb-4 font-display text-lg font-bold uppercase">Order History</h2>
        {orderList.length === 0 ? (
          <p className="text-sm text-ink/50">No orders yet.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-ink/10">
            {orderList.map((o) => (
              <li key={o.id} className="flex items-center justify-between py-3">
                <div>
                  <Link href={`/admin/orders/${o.id}`} className="text-sm font-semibold hover:text-orgn-orange">{o.order_number}</Link>
                  <p className="text-xs text-ink/50">{new Date(o.created_at).toLocaleDateString('en-IN')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatPrice(o.total)}</p>
                  <p className="text-xs capitalize text-ink/50">{o.status}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
