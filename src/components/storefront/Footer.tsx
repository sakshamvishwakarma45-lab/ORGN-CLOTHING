'use client';

import { ArrowUp, Instagram, Mail, MapPin, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Category } from '@/lib/types';
import { Wordmark } from '@/components/ui/Wordmark';
import { NewsletterSignup } from './NewsletterSignup';

const CONTACT = {
  email: 'sakshamvishwa36t@gmail.com',
  phone: '+91 73897 57675',
  address: 'Shantinagar, Jagdalpur, Chhattisgarh, 494001',
  instagram: 'https://www.instagram.com/orgnclothing.in/',
};

function BackToTop() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="group flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-offwhite/40 transition-colors hover:text-orgn-orange"
      aria-label="Back to top"
    >
      <span>Back to top</span>
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-offwhite/20 transition-all group-hover:border-orgn-orange group-hover:bg-orgn-orange/10">
        <ArrowUp className="h-3.5 w-3.5" />
      </span>
    </button>
  );
}

export function Footer({ categories }: { categories: Category[] }) {
  return (
    <footer className="relative border-t border-ink/10 bg-charcoal text-offwhite">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <Image src="/brand/orgn-mark.png" alt="" width={32} height={32} className="rounded-md" />
              <Wordmark size="md" className="text-offwhite" />
            </div>
            <p className="mt-4 max-w-xs text-sm text-offwhite/60">
              Modern minimal streetwear, designed in India. Heavyweight fabric, small-batch drops,
              built for everyday movement.
            </p>
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide transition-colors hover:text-orgn-orange"
            >
              <Instagram className="h-4 w-4" /> @orgnclothing.in
            </a>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-offwhite/50">Shop</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <Link href="/shop" className="link-underline transition-colors hover:text-orgn-orange">Shop All</Link>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <Link href={`/category/${c.slug}`} className="link-underline transition-colors hover:text-orgn-orange">{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-offwhite/50">Company</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href="/about" className="link-underline transition-colors hover:text-orgn-orange">About ORGN</Link></li>
              <li><Link href="/contact" className="link-underline transition-colors hover:text-orgn-orange">Contact</Link></li>
              <li><Link href="/shipping-returns" className="link-underline transition-colors hover:text-orgn-orange">Shipping &amp; Returns</Link></li>
              <li><Link href="/privacy" className="link-underline transition-colors hover:text-orgn-orange">Privacy Policy</Link></li>
              <li><Link href="/terms" className="link-underline transition-colors hover:text-orgn-orange">Terms of Service</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-offwhite/50">Get in touch</h3>
            <ul className="flex flex-col gap-3 text-sm text-offwhite/80">
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-orgn-orange" />
                <a href={`mailto:${CONTACT.email}`} className="link-underline transition-colors hover:text-orgn-orange">{CONTACT.email}</a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-orgn-orange" />
                <a href={`tel:+91${'7389757675'}`} className="link-underline transition-colors hover:text-orgn-orange">{CONTACT.phone}</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-orgn-orange" />
                <span>{CONTACT.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-offwhite/10 pt-8">
          <NewsletterSignup variant="dark" />
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-offwhite/10 pt-8 text-xs text-offwhite/40 sm:flex-row">
          <span>&copy; {new Date().getFullYear()} ORGN Clothing Co. All rights reserved.</span>
          <BackToTop />
          <span>Designed in India.</span>
        </div>
      </div>
    </footer>
  );
}
