'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatPrice, getPrimaryImage } from '@/lib/utils';
import { useCartStore } from '@/lib/store/cart';
import { useToast } from '@/components/ui/Toast';

export function ProductCard({ product }: { product: Product }) {
  const [hover, setHover] = useState(false);
  const images = product.product_images ?? [];
  const primary = getPrimaryImage(images);
  const secondary = images.find((img) => img.url !== primary)?.url ?? primary;
  const onSale = product.compare_at_price && product.compare_at_price > product.price;
  const addItem = useCartStore((s) => s.addItem);
  const { toast } = useToast();

  // Quick add default variant
  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const variants = product.product_variants ?? [];
    const available = variants.find((v) => v.stock > 0) ?? variants[0];
    if (!available) return;
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: primary,
        price: available.price_override ?? product.price,
        size: available.size,
        color: available.color,
        maxStock: available.stock,
      },
      1
    );
    toast(`${product.name} added to bag`, 'cart');
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group block"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-offwhite shadow-sm transition-shadow duration-500 group-hover:shadow-card-hover">
        {/* Primary image */}
        <Image
          src={primary}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className={`object-cover transition-all duration-700 ${
            hover ? 'scale-105 opacity-0' : 'scale-100 opacity-100'
          }`}
        />
        {/* Secondary image (crossfade) */}
        <Image
          src={secondary}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className={`object-cover transition-all duration-700 ${
            hover ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
          }`}
        />
        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.is_new_arrival && (
            <span className="bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-beige">
              New
            </span>
          )}
          {onSale && (
            <span className="bg-orgn-orange px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink">
              Sale
            </span>
          )}
        </div>

        {/* Quick Add button on hover */}
        <AnimatePresence>
          {hover && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={handleQuickAdd}
              className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 bg-ink/90 py-3 text-xs font-semibold uppercase tracking-wide text-beige backdrop-blur-sm transition-colors hover:bg-orgn-orange hover:text-ink"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Quick Add
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-body text-sm font-semibold text-ink transition-colors duration-200 group-hover:text-orgn-orange">
            {product.name}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-ink/70">{formatPrice(product.price)}</span>
            {onSale && (
              <span className="text-xs text-ink/40 line-through">
                {formatPrice(product.compare_at_price as number)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
