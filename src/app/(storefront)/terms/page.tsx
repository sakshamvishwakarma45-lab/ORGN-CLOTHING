import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Terms of Service' };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="mb-2 font-display text-4xl font-black uppercase tracking-tight sm:text-5xl">
        Terms of Service
      </h1>
      <p className="mb-10 text-sm text-ink/50">Last updated: Placeholder — to be finalized by ORGN.</p>

      <div className="flex flex-col gap-8 text-ink/80">
        <section>
          <h2 className="mb-2 font-display text-xl font-bold uppercase">Orders &amp; Payment</h2>
          <p>
            All orders placed through this site are currently fulfilled on a Cash on Delivery /
            pay-on-confirmation basis. By placing an order, you agree to accept delivery and make
            payment as arranged. This is placeholder text — replace with ORGN&apos;s final terms
            once an online payment gateway is added.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-display text-xl font-bold uppercase">Pricing &amp; Availability</h2>
          <p>
            Prices are listed in Indian Rupees (INR) and may change without notice. Products are
            subject to availability; in the rare case an item sells out after you order, we will
            contact you to offer a substitute, refund, or cancellation.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-display text-xl font-bold uppercase">Intellectual Property</h2>
          <p>
            All designs, logos, and content on this site are the property of ORGN Clothing Co. and
            may not be reproduced without permission.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-display text-xl font-bold uppercase">Limitation of Liability</h2>
          <p>
            ORGN is not liable for indirect or incidental damages arising from the use of this
            site or its products, to the extent permitted by law. This is placeholder text —
            replace with ORGN&apos;s final legal terms, ideally reviewed by counsel.
          </p>
        </section>
      </div>
    </div>
  );
}
