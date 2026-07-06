'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus, Truck, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils';

const FREE_SHIPPING_THRESHOLD = 2999;

export function CartDrawer() {
  const [hydrated, setHydrated] = useState(false);
  const isOpen = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);
  const lines = useCartStore((s) => s.lines);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());

  useEffect(() => setHydrated(true), []);

  const shippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-offwhite shadow-2xl"
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between border-b border-ink/10 p-6">
              <h2 className="font-display text-2xl font-black uppercase">Your Bag</h2>
              <button onClick={close} aria-label="Close cart" className="rounded-full p-2 hover:bg-ink/5 transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Free shipping progress */}
            {hydrated && lines.length > 0 && (
              <div className="border-b border-ink/10 px-6 py-3">
                <div className="flex items-center gap-2 text-xs">
                  <Truck className="h-3.5 w-3.5 text-orgn-orange" />
                  {remaining > 0 ? (
                    <span className="text-ink/60">
                      Add <strong className="text-ink">{formatPrice(remaining)}</strong> for free shipping
                    </span>
                  ) : (
                    <span className="font-semibold text-orgn-orange">You qualify for free shipping! 🎉</span>
                  )}
                </div>
                <div className="shipping-progress mt-2">
                  <motion.div
                    className="shipping-progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${shippingProgress}%` }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            )}

            {!hydrated || lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                >
                  <p className="font-display text-xl font-bold uppercase text-ink/60">Your bag is empty</p>
                </motion.div>
                <button
                  onClick={close}
                  className="bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-wide text-beige shadow-orgn-sm transition-colors hover:bg-orgn-orange hover:text-ink"
                >
                  Keep Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-6">
                  <ul className="flex flex-col gap-6">
                    <AnimatePresence mode="popLayout">
                      {lines.map((line) => (
                        <motion.li
                          key={`${line.productId}-${line.size}-${line.color}`}
                          layout
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -60, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex gap-4"
                        >
                          <div className="relative h-28 w-24 flex-shrink-0 overflow-hidden bg-beige">
                            <Image src={line.image} alt={line.name} fill className="object-cover" sizes="96px" />
                          </div>
                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <Link href={`/product/${line.slug}`} onClick={close} className="font-semibold transition-colors hover:text-orgn-orange">
                                {line.name}
                              </Link>
                              <p className="text-sm text-ink/60">
                                {[line.size, line.color].filter(Boolean).join(' / ')}
                              </p>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center border border-ink/20">
                                <button
                                  onClick={() => updateQty(line.productId, line.size, line.color, line.qty - 1)}
                                  className="p-2 transition hover:bg-ink/5"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <motion.span
                                  key={line.qty}
                                  initial={{ scale: 1.3 }}
                                  animate={{ scale: 1 }}
                                  className="w-8 text-center text-sm font-semibold"
                                >
                                  {line.qty}
                                </motion.span>
                                <button
                                  onClick={() => updateQty(line.productId, line.size, line.color, line.qty + 1)}
                                  className="p-2 transition hover:bg-ink/5"
                                  aria-label="Increase quantity"
                                  disabled={line.qty >= line.maxStock}
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <span className="font-semibold">{formatPrice(line.price * line.qty)}</span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(line.productId, line.size, line.color)}
                            aria-label={`Remove ${line.name}`}
                            className="self-start p-1 text-ink/40 transition-colors hover:text-orgn-orange"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>

                <div className="border-t border-ink/10 p-6">
                  <div className="mb-4 flex items-center justify-between font-display text-lg font-bold uppercase">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <p className="mb-4 text-xs text-ink/60">Shipping and taxes calculated at checkout.</p>
                  <Link
                    href="/checkout"
                    onClick={close}
                    className="block w-full bg-ink py-4 text-center text-sm font-semibold uppercase tracking-wide text-beige shadow-orgn transition-colors duration-200 hover:bg-orgn-orange hover:text-ink shine-sweep"
                  >
                    Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
