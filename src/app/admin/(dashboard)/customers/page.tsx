import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import type { Customer } from '@/lib/types';

export const metadata = { title: 'Customers' };

export default async function AdminCustomersPage() {
  const supabase = await createClient();
  const { data: customers } = await supabase.from('customers').select('*').order('created_at', { ascending: false });

  // Order counts per customer
  const { data: orders } = await supabase.from('orders').select('customer_id, total');
  const stats = new Map<string, { count: number; spent: number }>();
  (orders ?? []).forEach((o) => {
    if (!o.customer_id) return;
    const prev = stats.get(o.customer_id) ?? { count: 0, spent: 0 };
    stats.set(o.customer_id, { count: prev.count + 1, spent: prev.spent + Number(o.total) });
  });

  const customerList = (customers ?? []) as Customer[];

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-black uppercase tracking-tight">Customers</h1>

      <div className="overflow-x-auto border-2 border-ink bg-offwhite shadow-orgn-sm">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b-2 border-ink bg-beige">
            <tr>
              <th className="p-4 font-bold uppercase tracking-wide">Name</th>
              <th className="p-4 font-bold uppercase tracking-wide">Contact</th>
              <th className="p-4 font-bold uppercase tracking-wide">Orders</th>
              <th className="p-4 font-bold uppercase tracking-wide">Total Spent</th>
              <th className="p-4 font-bold uppercase tracking-wide">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {customerList.map((c) => {
              const s = stats.get(c.id) ?? { count: 0, spent: 0 };
              return (
                <tr key={c.id}>
                  <td className="p-4">
                    <Link href={`/admin/customers/${c.id}`} className="font-semibold hover:text-orgn-orange">{c.name}</Link>
                  </td>
                  <td className="p-4 text-ink/70">
                    <p>{c.email}</p>
                    <p className="text-xs text-ink/50">{c.phone}</p>
                  </td>
                  <td className="p-4">{s.count}</td>
                  <td className="p-4 font-semibold">₹{s.spent.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-ink/70">{new Date(c.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                </tr>
              );
            })}
            {customerList.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-ink/50">No customers yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
