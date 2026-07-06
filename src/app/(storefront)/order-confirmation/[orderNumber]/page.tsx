import { CheckCircle2 } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Order, OrderItem } from '@/lib/types';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = { title: 'Order Confirmed' };
export const revalidate = 0;

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const supabase = createAdminClient();

  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('order_number', orderNumber)
    .single();

  if (!order) notFound();

  const typedOrder = order as Order & { order_items: OrderItem[] };
  const address = typedOrder.shipping_address;

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <div className="mb-10 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-orgn-orange" strokeWidth={1.5} />
        <h1 className="font-display text-4xl font-black uppercase tracking-tight sm:text-5xl">
          Order Confirmed
        </h1>
        <p className="mt-3 text-ink/60">
          Thank you, {typedOrder.customer_name.split(' ')[0]}. Your order{' '}
          <span className="font-semibold text-ink">{typedOrder.order_number}</span> has been placed.
        </p>
        <p className="mt-1 text-sm text-ink/50">
          We&apos;ll reach out on {typedOrder.customer_phone ?? typedOrder.customer_email} to confirm delivery.
        </p>
      </div>

      <div className="border-2 border-ink bg-offwhite p-6 shadow-orgn-sm">
        <div className="mb-6 grid grid-cols-1 gap-6 border-b border-ink/10 pb-6 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-ink/50">Shipping Address</h3>
            <p className="text-sm text-ink/80">
              {typedOrder.customer_name}<br />
              {address.line1}{address.line2 ? `, ${address.line2}` : ''}<br />
              {address.city}, {address.state} {address.postal_code}<br />
              {address.country}
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-widest text-ink/50">Payment</h3>
            <p className="text-sm text-ink/80">Cash on Delivery</p>
            <h3 className="mb-2 mt-4 text-xs font-bold uppercase tracking-widest text-ink/50">Status</h3>
            <p className="text-sm capitalize text-ink/80">{typedOrder.status} — Payment {typedOrder.payment_status}</p>
          </div>
        </div>

        <ul className="flex flex-col gap-4 border-b border-ink/10 pb-6">
          {typedOrder.order_items.map((item) => (
            <li key={item.id} className="flex items-center gap-4">
              <div className="relative h-16 w-14 flex-shrink-0 overflow-hidden bg-beige">
                {item.product_image && (
                  <Image src={item.product_image} alt={item.product_name} fill className="object-cover" sizes="56px" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{item.product_name}</p>
                <p className="text-xs text-ink/50">
                  {[item.size, item.color].filter(Boolean).join(' / ')} · Qty {item.qty}
                </p>
              </div>
              <span className="text-sm font-semibold">{formatPrice(item.price * item.qty)}</span>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-2 pt-6 text-sm">
          <div className="flex justify-between"><span className="text-ink/60">Subtotal</span><span>{formatPrice(typedOrder.subtotal)}</span></div>
          {typedOrder.discount > 0 && (
            <div className="flex justify-between text-orgn-orange"><span>Discount</span><span>-{formatPrice(typedOrder.discount)}</span></div>
          )}
          <div className="flex justify-between"><span className="text-ink/60">Shipping</span><span>{typedOrder.shipping === 0 ? 'Free' : formatPrice(typedOrder.shipping)}</span></div>
          <div className="mt-2 flex justify-between border-t border-ink/10 pt-2 font-display text-lg font-bold uppercase">
            <span>Total</span><span>{formatPrice(typedOrder.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center">
        <MagneticButton href="/shop" variant="primary">Continue Shopping</MagneticButton>
      </div>
    </div>
  );
}
