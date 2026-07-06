'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Search, ShoppingBag, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Category } from '@/lib/types';
import { useCartStore } from '@/lib/store/cart';

export function HeaderClient({ categories, children }: { categories: Category[]; children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const itemCount = useCartStore((s) => s.itemCount());
  const openCart = useCartStore((s) => s.open);

  useEffect(() => setHydrated(true), []);

  // Auto-hide header on scroll down, show on scroll up
  useEffect(() => {
    function handleScroll() {
      const current = window.scrollY;
      if (current < 80) {
        setVisible(true);
      } else if (current > lastScrollY.current + 10) {
        setVisible(false);
      } else if (current < lastScrollY.current - 10) {
        setVisible(true);
      }
      lastScrollY.current = current;
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mobileNavItems = [
    { href: '/shop', label: 'Shop All' },
    ...categories.map((c) => ({ href: `/category/${c.slug}`, label: c.name })),
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b border-ink/10 bg-beige/85 backdrop-blur-md transition-transform duration-300 ${
          visible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          {children}

          <div className="flex items-center gap-1">
            {/* Search toggle */}
            <button
              onClick={() => setSearchOpen((p) => !p)}
              aria-label="Toggle search"
              className="relative flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-ink/5"
            >
              <Search className="h-5 w-5" strokeWidth={1.75} />
            </button>

            {/* Cart button */}
            <button
              onClick={openCart}
              aria-label={`Open cart, ${itemCount} items`}
              className="relative flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-ink/5"
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
              <AnimatePresence>
                {hydrated && itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-orgn-orange text-[11px] font-bold text-ink"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-ink/5 lg:hidden"
            >
              <Menu className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Search slide-out bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-ink/10"
            >
              <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4">
                <Search className="h-5 w-5 flex-shrink-0 text-ink/40" />
                <input
                  type="search"
                  placeholder="Search products..."
                  autoFocus
                  className="w-full bg-transparent text-sm outline-none placeholder:text-ink/40"
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setSearchOpen(false);
                  }}
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="flex-shrink-0 rounded p-1 hover:bg-ink/5"
                  aria-label="Close search"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Animated mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm lg:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-beige shadow-2xl lg:hidden"
            >
              <div className="flex h-20 items-center justify-between px-6">
                <span className="font-display text-2xl font-black">ORGN</span>
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-ink/5"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="flex flex-col gap-1 px-6 py-4" aria-label="Mobile">
                {mobileNavItems.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="block border-b border-ink/10 py-4 font-display text-3xl font-bold uppercase transition-colors hover:text-orgn-orange"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
