'use client';

import { Minus, Plus, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { useCartStore } from '@/lib/store/cart';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const [hydrated, setHydrated] = useState(false);
  const lines = useCartStore((s) => s.lines);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());

  useEffect(() => setHydrated(true), []);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="mb-10 font-display text-5xl font-black uppercase tracking-tight">Your Bag</h1>

      {!hydrated || lines.length === 0 ? (
        <div className="flex flex-col items-center gap-6 py-24 text-center">
          <p className="text-lg text-ink/60">Your bag is empty.</p>
          <MagneticButton href="/shop" variant="primary">
            Shop Collection
          </MagneticButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <ul className="flex flex-col gap-6 divide-y divide-ink/10 lg:col-span-2">
            {lines.map((line) => (
              <li key={`${line.productId}-${line.size}-${line.color}`} className="flex gap-4 pt-6 first:pt-0">
                <div className="relative h-32 w-28 flex-shrink-0 overflow-hidden bg-offwhite">
                  <Image src={line.image} alt={line.name} fill className="object-cover" sizes="112px" />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link href={`/product/${line.slug}`} className="font-display text-lg font-bold uppercase hover:text-orgn-orange">
                      {line.name}
                    </Link>
                    <p className="text-sm text-ink/60">{[line.size, line.color].filter(Boolean).join(' / ')}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border-2 border-ink/20">
                      <button onClick={() => updateQty(line.productId, line.size, line.color, line.qty - 1)} className="p-2 hover:bg-ink/5">
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center font-semibold">{line.qty}</span>
                      <button
                        onClick={() => updateQty(line.productId, line.size, line.color, line.qty + 1)}
                        className="p-2 hover:bg-ink/5"
                        disabled={line.qty >= line.maxStock}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-lg font-semibold">{formatPrice(line.price * line.qty)}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(line.productId, line.size, line.color)}
                  className="self-start p-1 text-ink/40 hover:text-orgn-orange"
                  aria-label={`Remove ${line.name}`}
                >
                  <X className="h-5 w-5" />
                </button>
              </li>
            ))}
          </ul>

          <div className="h-fit border-2 border-ink bg-offwhite p-6 shadow-orgn-sm">
            <h2 className="mb-4 font-display text-xl font-bold uppercase">Order Summary</h2>
            <div className="flex items-center justify-between border-b border-ink/10 pb-4 text-sm">
              <span className="text-ink/60">Subtotal</span>
              <span className="font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <p className="my-4 text-xs text-ink/50">Shipping and any discount codes are calculated at checkout.</p>
            <MagneticButton href="/checkout" variant="primary" className="w-full">
              Proceed to Checkout
            </MagneticButton>
          </div>
        </div>
      )}
    </div>
  );
}
