import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const FREE_SHIPPING_THRESHOLD = 2999;
const STANDARD_SHIPPING = 99;
const EXPRESS_SHIPPING = 199;

interface CheckoutItem {
  productId: string;
  size: string | null;
  color: string | null;
  qty: number;
}

interface CheckoutBody {
  customer: { name: string; email: string; phone: string };
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
  };
  items: CheckoutItem[];
  shippingMethod: 'standard' | 'express';
  couponCode?: string;
}

const ERROR_MESSAGES: Record<string, string> = {
  EMPTY_CART: 'Your cart is empty.',
  INVALID_COUPON: 'That coupon code is not valid.',
  COUPON_EXPIRED: 'That coupon has expired.',
  COUPON_LIMIT_REACHED: 'That coupon has reached its usage limit.',
  PRODUCT_UNAVAILABLE: 'One of the items in your cart is no longer available.',
  VARIANT_NOT_FOUND: 'One of the selected sizes/colors is no longer available.',
  INVALID_QTY: 'Invalid quantity for one of the items in your cart.',
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutBody;

    if (!body.customer?.name || !body.customer?.email || !body.items?.length) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }
    if (!body.address?.line1 || !body.address?.city || !body.address?.state || !body.address?.postalCode) {
      return NextResponse.json({ error: 'Please provide a complete shipping address.' }, { status: 400 });
    }

    const supabase = await createClient();

    // Server-side price verification: look up current published prices rather
    // than trusting client-sent amounts, to decide the free-shipping threshold.
    const productIds = Array.from(new Set(body.items.map((i) => i.productId)));
    const { data: products } = await supabase
      .from('products')
      .select('id, price, product_variants(size, color, stock, price_override)')
      .in('id', productIds)
      .eq('status', 'published');

    let verifiedSubtotal = 0;
    for (const item of body.items) {
      const product = products?.find((p) => p.id === item.productId);
      if (!product) continue;
      const variant = (product.product_variants as { size: string | null; color: string | null; price_override: number | null }[] | null)?.find(
        (v) => (v.size ?? '') === (item.size ?? '') && (v.color ?? '') === (item.color ?? '')
      );
      const price = variant?.price_override ?? product.price;
      verifiedSubtotal += price * item.qty;
    }

    const shippingCost =
      body.shippingMethod === 'express'
        ? EXPRESS_SHIPPING
        : verifiedSubtotal >= FREE_SHIPPING_THRESHOLD
        ? 0
        : STANDARD_SHIPPING;

    const { data, error } = await supabase.rpc('create_order', {
      p_customer_name: body.customer.name,
      p_customer_email: body.customer.email,
      p_customer_phone: body.customer.phone ?? null,
      p_shipping_address: {
        line1: body.address.line1,
        line2: body.address.line2 ?? null,
        city: body.address.city,
        state: body.address.state,
        postal_code: body.address.postalCode,
        country: body.address.country ?? 'India',
      },
      p_items: body.items.map((i) => ({
        product_id: i.productId,
        size: i.size,
        color: i.color,
        qty: i.qty,
      })),
      p_shipping_cost: shippingCost,
      p_coupon_code: body.couponCode || null,
    });

    if (error) {
      const code = error.message.split(':')[0].trim();
      return NextResponse.json({ error: ERROR_MESSAGES[code] ?? 'Could not place order. Please try again.' }, { status: 400 });
    }

    return NextResponse.json({ orderNumber: data.order_number, total: data.total });
  } catch (err) {
    console.error('Checkout error:', err);
    return NextResponse.json({ error: 'Something went wrong placing your order.' }, { status: 500 });
  }
}
