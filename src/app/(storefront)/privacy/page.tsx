import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="mb-2 font-display text-4xl font-black uppercase tracking-tight sm:text-5xl">
        Privacy Policy
      </h1>
      <p className="mb-10 text-sm text-ink/50">Last updated: Placeholder — to be finalized by ORGN.</p>

      <div className="flex flex-col gap-8 text-ink/80">
        <section>
          <h2 className="mb-2 font-display text-xl font-bold uppercase">Information We Collect</h2>
          <p>
            When you place an order or sign up for our newsletter, we collect information such as
            your name, email address, phone number, and shipping address. This is placeholder text
            — replace with ORGN&apos;s final data-collection practices.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-display text-xl font-bold uppercase">How We Use Your Information</h2>
          <p>
            We use your information to process and deliver orders, communicate order updates, and
            (with your consent) send occasional emails about new drops and offers. We do not sell
            your personal information to third parties.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-display text-xl font-bold uppercase">Cookies</h2>
          <p>
            Our site uses cookies and local storage to keep your cart contents between visits and
            understand how the site is used. You can disable cookies in your browser settings, though
            some features may not work as expected.
          </p>
        </section>
        <section>
          <h2 className="mb-2 font-display text-xl font-bold uppercase">Your Rights</h2>
          <p>
            You may request access to, correction of, or deletion of your personal data at any time
            by contacting us. This is placeholder text — replace with ORGN&apos;s final policy
            wording and any region-specific compliance details.
          </p>
        </section>
      </div>
    </div>
  );
}
