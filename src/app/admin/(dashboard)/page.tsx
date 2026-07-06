import { ExternalLink, Package, Plus } from 'lucide-react';
import Link from 'next/link';
import { SalesChart } from '@/components/admin/SalesChart';
import { StatsCard } from '@/components/admin/StatsCard';
import { createClient } from '@/lib/supabase/server';
import type { Order } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

export const metadata = { title: 'Dashboard' };

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ count: orderCount }, { count: productCount }, { data: orders }, { data: lowStockProducts }, { data: { user } }] =
    await Promise.all([
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(200),
      supabase.from('products').select('id, name, total_stock, low_stock_threshold'),
      supabase.auth.getUser(),
    ]);

  const allOrders = (orders ?? []) as Order[];
  const totalSales = allOrders.reduce((sum, o) => sum + Number(o.total), 0);
  const recentOrders = allOrders.slice(0, 6);

  const lowStock = (lowStockProducts ?? []).filter(
    (p) => p.total_stock <= p.low_stock_threshold
  );

  // Get user name
  let userName = 'there';
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('name, username').eq('id', user.id).single();
    if (profile) userName = profile.name ?? profile.username ?? 'there';
  }

  // Build last-30-days sales series
  const today = new Date();
  const days: { date: string; sales: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    const daySales = allOrders
      .filter((o) => o.created_at.slice(0, 10) === key)
      .reduce((sum, o) => sum + Number(o.total), 0);
    days.push({ date: label, sales: daySales });
  }

  return (
    <div>
      {/* Welcome + Quick Actions */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-black uppercase tracking-tight">
            {getGreeting()}, {userName} 👋
          </h1>
          <p className="mt-1 text-sm text-ink/50">Here&apos;s what&apos;s happening with your store today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-ink px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-beige shadow-orgn-sm transition-colors hover:bg-orgn-orange hover:text-ink"
          >
            <Plus className="h-3.5 w-3.5" /> New Product
          </Link>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 border-2 border-ink/20 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide transition hover:border-ink"
          >
            <ExternalLink className="h-3.5 w-3.5" /> View Store
          </Link>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard label="Total Sales" value={formatPrice(totalSales)} numericValue={totalSales} iconName="rupee" accent />
        <StatsCard label="Total Orders" value={String(orderCount ?? 0)} numericValue={orderCount ?? 0} iconName="cart" />
        <StatsCard label="Total Products" value={String(productCount ?? 0)} numericValue={productCount ?? 0} iconName="package" />
        <StatsCard label="Low Stock Alerts" value={String(lowStock.length)} numericValue={lowStock.length} iconName="alert" accent={lowStock.length > 0} />
      </div>

      <div className="mb-8">
        <SalesChart data={days} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="border-2 border-ink bg-offwhite p-5 shadow-orgn-sm transition-shadow hover:shadow-orgn">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold uppercase">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs font-semibold uppercase text-orgn-orange hover:underline">View All</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-ink/50">No orders yet.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-ink/10">
              {recentOrders.map((o) => (
                <li key={o.id} className="flex items-center justify-between py-3 transition hover:bg-ink/[0.02]">
                  <div>
                    <Link href={`/admin/orders/${o.id}`} className="text-sm font-semibold transition-colors hover:text-orgn-orange">{o.order_number}</Link>
                    <p className="text-xs text-ink/50">{o.customer_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{formatPrice(o.total)}</p>
                    <p className={`text-xs capitalize ${o.status === 'delivered' ? 'text-success' : o.status === 'cancelled' ? 'text-danger' : 'text-ink/50'}`}>{o.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-2 border-ink bg-offwhite p-5 shadow-orgn-sm transition-shadow hover:shadow-orgn">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold uppercase">Low Stock</h2>
            <Link href="/admin/products" className="text-xs font-semibold uppercase text-orgn-orange hover:underline">View All</Link>
          </div>
          {lowStock.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-6 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                <Package className="h-5 w-5 text-success" />
              </div>
              <p className="text-sm text-ink/50">Everything is well stocked! 🎉</p>
            </div>
          ) : (
            <ul className="flex flex-col divide-y divide-ink/10">
              {lowStock.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-3 transition hover:bg-ink/[0.02]">
                  <Link href={`/admin/products/${p.id}`} className="text-sm font-semibold transition-colors hover:text-orgn-orange">{p.name}</Link>
                  <span className={`rounded px-2 py-0.5 text-xs font-bold ${p.total_stock === 0 ? 'bg-danger/10 text-danger' : 'bg-orgn-orange/10 text-orgn-orange'}`}>
                    {p.total_stock === 0 ? 'Out of stock' : `${p.total_stock} left`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
