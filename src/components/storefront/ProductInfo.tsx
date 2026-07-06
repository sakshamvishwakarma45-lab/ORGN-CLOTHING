'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Minus, Plus, Shield, Truck } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Product } from '@/lib/types';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { useCartStore } from '@/lib/store/cart';
import { useToast } from '@/components/ui/Toast';
import { formatPrice, getPrimaryImage } from '@/lib/utils';

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-ink/10">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-4 text-left text-xs font-bold uppercase tracking-widest text-ink/50 transition hover:text-ink"
      >
        {title}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProductInfo({ product }: { product: Product }) {
  const variants = product.product_variants ?? [];
  const colors = useMemo(
    () => Array.from(new Set(variants.map((v) => v.color).filter(Boolean))) as string[],
    [variants]
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(colors[0] ?? null);
  const sizesForColor = useMemo(
    () => variants.filter((v) => (selectedColor ? v.color === selectedColor : true)),
    [variants, selectedColor]
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(
    sizesForColor.find((v) => v.stock > 0)?.size ?? sizesForColor[0]?.size ?? null
  );
  const [qty, setQty] = useState(1);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const addButtonRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const activeVariant = variants.find(
    (v) => v.size === selectedSize && (selectedColor ? v.color === selectedColor : true)
  );
  const stock = activeVariant?.stock ?? 0;
  const price = activeVariant?.price_override ?? product.price;
  const onSale = product.compare_at_price && product.compare_at_price > product.price;
  const addItem = useCartStore((s) => s.addItem);
  const image = getPrimaryImage(product.product_images);

  function handleAddToCart() {
    if (!activeVariant || stock === 0) return;
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image,
        price,
        size: selectedSize,
        color: selectedColor,
        maxStock: stock,
      },
      qty
    );
    toast(`${product.name} added to bag`, 'cart');
  }

  // Observe when the add-to-cart button scrolls out of view (mobile only)
  useEffect(() => {
    const el = addButtonRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div>
        {product.category && (
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-orgn-orange">
            {product.category.name}
          </p>
        )}
        <h1 className="font-display text-3xl font-black uppercase leading-tight tracking-tight sm:text-4xl">
          {product.name}
        </h1>

        <div className="mt-4 flex items-center gap-3">
          <span className="text-2xl font-semibold">{formatPrice(price)}</span>
          {onSale && (
            <span className="text-lg text-ink/40 line-through">
              {formatPrice(product.compare_at_price as number)}
            </span>
          )}
          {onSale && (
            <span className="rounded bg-orgn-orange/10 px-2 py-0.5 text-xs font-bold text-orgn-orange">
              {Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)}% OFF
            </span>
          )}
        </div>

        {product.short_description && (
          <p className="mt-4 text-ink/70">{product.short_description}</p>
        )}

        {colors.length > 0 && (
          <div className="mt-8">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-ink/50">
              Color — {selectedColor}
            </h3>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    setSelectedColor(color);
                    const first = variants.find((v) => v.color === color && v.stock > 0) ?? variants.find((v) => v.color === color);
                    setSelectedSize(first?.size ?? null);
                  }}
                  className={`border-2 px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    selectedColor === color ? 'border-ink bg-ink text-beige' : 'border-ink/20 hover:border-ink'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {sizesForColor.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-ink/50">Size</h3>
            <div className="flex flex-wrap gap-2">
              {sizesForColor.map((v) => (
                <button
                  key={v.id}
                  disabled={v.stock === 0}
                  onClick={() => setSelectedSize(v.size)}
                  className={`relative border-2 px-4 py-2 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-30 ${
                    selectedSize === v.size ? 'border-ink bg-ink text-beige' : 'border-ink/20 hover:border-ink'
                  }`}
                >
                  {v.size}
                  {v.stock === 0 && <span className="absolute inset-0 flex items-center justify-center text-[10px]">Sold out</span>}
                </button>
              ))}
            </div>
            {stock > 0 && stock <= 5 && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-xs font-semibold text-orgn-orange"
              >
                Only {stock} left in stock — order soon!
              </motion.p>
            )}
          </div>
        )}

        <div ref={addButtonRef} className="mt-8 flex items-center gap-4">
          <div className="flex items-center border-2 border-ink/20">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="p-3 transition hover:bg-ink/5"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-10 text-center font-semibold">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(stock, q + 1))}
              className="p-3 transition hover:bg-ink/5"
              aria-label="Increase quantity"
              disabled={qty >= stock}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1">
            <MagneticButton onClick={handleAddToCart} variant="primary" className="w-full" disabled={stock === 0}>
              {stock === 0 ? 'Sold Out' : 'Add to Cart'}
            </MagneticButton>
          </div>
        </div>

        {/* Trust signals */}
        <div className="mt-6 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 text-sm text-ink/60">
            <Truck className="h-4 w-4 text-orgn-orange" />
            Dispatched in 24–48 hours
          </div>
          <div className="flex items-center gap-2 text-sm text-ink/60">
            <Shield className="h-4 w-4 text-orgn-orange" />
            Cash on Delivery available
          </div>
          <div className="flex items-center gap-2 text-sm text-ink/60">
            <Check className="h-4 w-4 text-orgn-orange" />
            100% Heavyweight Cotton
          </div>
        </div>

        {/* Accordion sections */}
        <div className="mt-8">
          {product.description && (
            <Accordion title="Product Details" defaultOpen>
              <p className="whitespace-pre-line text-sm leading-relaxed text-ink/70">{product.description}</p>
            </Accordion>
          )}
          <Accordion title="Shipping & Returns">
            <div className="space-y-2 text-sm text-ink/70">
              <p>• Standard Shipping: ₹99 (Free over ₹2,999)</p>
              <p>• Express Shipping: ₹199 (1–3 business days)</p>
              <p>• Easy 7-day returns on all unworn items</p>
              <p>• Cash on Delivery available across India</p>
            </div>
          </Accordion>
          <Accordion title="Care Instructions">
            <div className="space-y-2 text-sm text-ink/70">
              <p>• Machine wash cold with like colors</p>
              <p>• Do not bleach</p>
              <p>• Tumble dry low</p>
              <p>• Iron on low heat if needed</p>
            </div>
          </Accordion>
        </div>
      </div>

      {/* Sticky mobile add-to-cart bar */}
      <AnimatePresence>
        {showStickyBar && stock > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-40 border-t border-ink/10 bg-beige/95 p-4 backdrop-blur-md md:hidden"
          >
            <div className="flex items-center gap-3">
              <div>
                <p className="text-xs font-semibold text-ink/60">{product.name}</p>
                <p className="font-semibold">{formatPrice(price)}</p>
              </div>
              <button
                onClick={handleAddToCart}
                className="ml-auto flex-shrink-0 bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-wide text-beige shadow-orgn-sm transition-colors hover:bg-orgn-orange hover:text-ink shine-sweep"
              >
                Add to Cart
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
