import Image from 'next/image';
import Link from 'next/link';
import type { Category } from '@/lib/types';
import { Wordmark } from '@/components/ui/Wordmark';
import { HeaderClient } from './HeaderClient';

export function Header({ categories }: { categories: Category[] }) {
  return (
    <>
      {/* Announcement / Ticker Bar */}
      <div className="relative z-50 overflow-hidden bg-ink py-2">
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 whitespace-nowrap px-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-offwhite/80">
                Free Shipping Over ₹2,999
              </span>
              <span className="text-orgn-orange">✦</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-offwhite/80">
                Limited Drops Only
              </span>
              <span className="text-orgn-orange">✦</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-offwhite/80">
                100% Heavyweight Cotton
              </span>
              <span className="text-orgn-orange">✦</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-offwhite/80">
                Designed In India
              </span>
              <span className="text-orgn-orange">✦</span>
              <span className="text-xs font-semibold uppercase tracking-widest text-offwhite/80">
                Cash On Delivery Available
              </span>
              <span className="text-orgn-orange">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Header */}
      <HeaderClient categories={categories}>
        <Link href="/" aria-label="ORGN home" className="flex items-center gap-2">
          <Image src="/brand/orgn-mark.png" alt="" width={30} height={30} className="rounded-md" />
          <Wordmark size="sm" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          <Link href="/shop" className="text-sm font-semibold uppercase tracking-wide transition-colors duration-200 hover:text-orgn-orange">
            Shop All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="text-sm font-semibold uppercase tracking-wide transition-colors duration-200 hover:text-orgn-orange"
            >
              {c.name}
            </Link>
          ))}
          <Link href="/about" className="text-sm font-semibold uppercase tracking-wide transition-colors duration-200 hover:text-orgn-orange">
            About
          </Link>
        </nav>
      </HeaderClient>
    </>
  );
}
