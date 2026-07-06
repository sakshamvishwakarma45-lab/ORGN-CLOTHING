import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { OrderStatusForm } from '@/components/admin/OrderStatusForm';
import { createClient } from '@/lib/supabase/server';
import type { Order, OrderItem } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

export const metadata = { title: 'Order Detail' };

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('orders').select('*, order_items(*)').eq('id', id).single();

  if (!data) notFound();
  const order = data as unknown as Order & { order_items: OrderItem[] };
  const address = order.shipping_address;

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/orders" className="text-xs font-semibold uppercase text-ink/50 hover:text-orgn-orange">← All Orders</Link>
      <h1 className="mb-8 mt-1 font-display text-3xl font-black uppercase tracking-tight">{order.order_number}</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <section className="border-2 border-ink bg-offwhite p-6 shadow-orgn-sm">
            <h2 className="mb-4 font-display text-lg font-bold uppercase">Items</h2>
            <ul className="flex flex-col gap-4">
              {order.order_items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 border-b border-ink/10 pb-4 last:border-0 last:pb-0">
                  <div className="relative h-16 w-14 flex-shrink-0 overflow-hidden bg-beige">
                    {item.product_image && <Image src={item.product_image} alt={item.product_name} fill className="object-cover" sizes="56px" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{item.product_name}</p>
                    <p className="text-xs text-ink/50">{[item.size, item.color].filter(Boolean).join(' / ')} · Qty {item.qty}</p>
                  </div>
                  <span className="text-sm font-semibold">{formatPrice(item.price * item.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col gap-1 border-t border-ink/10 pt-4 text-sm">
              <div className="flex justify-between"><span className="text-ink/60">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-orgn-orange"><span>Discount {order.coupon_code ? `(${order.coupon_code})` : ''}</span><span>-{formatPrice(order.discount)}</span></div>}
              <div className="flex justify-between"><span className="text-ink/60">Shipping</span><span>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span></div>
              <div className="mt-1 flex justify-between border-t border-ink/10 pt-1 font-display text-base font-bold uppercase">
                <span>Total</span><span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </section>

          <section className="border-2 border-ink bg-offwhite p-6 shadow-orgn-sm">
            <h2 className="mb-4 font-display text-lg font-bold uppercase">Customer</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h3 className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">Contact</h3>
                <p className="text-sm">{order.customer_name}</p>
                <p className="text-sm text-ink/70">{order.customer_email}</p>
                <p className="text-sm text-ink/70">{order.customer_phone}</p>
              </div>
              <div>
                <h3 className="mb-1 text-xs font-bold uppercase tracking-widest text-ink/50">Shipping Address</h3>
                <p className="text-sm text-ink/70">
                  {address.line1}{address.line2 ? `, ${address.line2}` : ''}<br />
                  {address.city}, {address.state} {address.postal_code}<br />
                  {address.country}
                </p>
              </div>
            </div>
          </section>
        </div>

        <section className="h-fit border-2 border-ink bg-offwhite p-6 shadow-orgn-sm">
          <h2 className="mb-4 font-display text-lg font-bold uppercase">Fulfillment</h2>
          <OrderStatusForm order={order} />
        </section>
      </div>
    </div>
  );
}
