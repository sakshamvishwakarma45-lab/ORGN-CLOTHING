import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Shipping & Returns' };

export default function ShippingReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="mb-2 font-display text-4xl font-black uppercase tracking-tight sm:text-5xl">
        Shipping &amp; Returns
      </h1>
      <p className="mb-10 text-sm text-ink/50">Last updated: Placeholder — to be finalized by ORGN.</p>

      <div className="flex flex-col gap-8 text-ink/80">
        <section>
          <h2 className="mb-2 font-display text-xl font-bold uppercase">Shipping</h2>
          <p>
            Orders are typically dispatched within 24–48 hours of confirmation. Standard delivery
            takes 3–6 business days depending on your location; Express delivery takes 1–3
            business days. Shipping charges, if any, are shown at checkout, and orders above a
            qualifying amount ship free. This is placeholder text — replace with ORGN&apos;s final
            shipping policy, courier partners, and delivery timelines.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-display text-xl font-bold uppercase">Order Tracking</h2>
          <p>
            Once your order ships, you&apos;ll receive a tracking number by email or phone. You can
            also check your order status by contacting us directly.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-display text-xl font-bold uppercase">Returns &amp; Exchanges</h2>
          <p>
            We accept returns on unworn, unwashed items with original tags attached within 7 days
            of delivery. To start a return, contact us with your order number. Refunds are issued
            to the original payment method (or as store credit) once the returned item is
            inspected. This is placeholder text — replace with ORGN&apos;s final returns window,
            conditions, and refund process.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-display text-xl font-bold uppercase">Damaged or Incorrect Items</h2>
          <p>
            If you receive a damaged, defective, or incorrect item, contact us within 48 hours of
            delivery with photos of the product and packaging, and we&apos;ll arrange a replacement
            or refund at no extra cost.
          </p>
        </section>
      </div>
    </div>
  );
}
