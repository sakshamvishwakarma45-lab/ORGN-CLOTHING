'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import type { ProductImage } from '@/lib/types';
import { cn } from '@/lib/utils';

export function ProductGallery({ images, productName }: { images: ProductImage[]; productName: string }) {
  const sorted = [...images].sort((a, b) => a.position - b.position);
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const current = sorted[active] ?? sorted[0];

  const goNext = useCallback(() => {
    setActive((prev) => (prev + 1) % sorted.length);
    setImageLoaded(false);
  }, [sorted.length]);

  const goPrev = useCallback(() => {
    setActive((prev) => (prev - 1 + sorted.length) % sorted.length);
    setImageLoaded(false);
  }, [sorted.length]);

  return (
    <>
      <div className="flex flex-col-reverse gap-4 sm:flex-row">
        {/* Thumbnails */}
        <div className="flex gap-3 sm:flex-col">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              onClick={() => { setActive(i); setImageLoaded(false); }}
              className={cn(
                'relative h-16 w-14 flex-shrink-0 overflow-hidden border-2 transition-all duration-200 sm:h-20 sm:w-16',
                i === active ? 'border-orgn-orange scale-105' : 'border-transparent opacity-60 hover:opacity-100'
              )}
            >
              <Image src={img.url} alt={`${productName} ${i + 1}`} fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>

        {/* Main image */}
        <div
          className="group relative aspect-[4/5] w-full flex-1 cursor-zoom-in overflow-hidden bg-offwhite"
          onClick={() => setLightboxOpen(true)}
        >
          {/* Skeleton loader */}
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton" />
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={current?.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0"
            >
              <Image
                src={current?.url ?? 'https://placehold.co/1000x1250/1C1B19/F4F1EA?text=ORGN'}
                alt={productName}
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
                onLoad={() => setImageLoaded(true)}
              />
            </motion.div>
          </AnimatePresence>

          {/* Zoom indicator */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-ink/60 px-3 py-1.5 text-xs font-medium text-beige opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            <ZoomIn className="h-3.5 w-3.5" />
            Zoom
          </div>

          {/* Navigation arrows on mobile */}
          {sorted.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-ink/40 p-2 text-beige opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 sm:hidden"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-ink/40 p-2 text-beige opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 sm:hidden"
                aria-label="Next image"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Lightbox overlay */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox-overlay"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute right-6 top-6 z-10 rounded-full bg-offwhite/10 p-2 text-beige backdrop-blur-sm transition hover:bg-offwhite/20"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close zoom"
            >
              <X className="h-6 w-6" />
            </button>

            {sorted.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); goPrev(); }}
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-offwhite/10 p-3 text-beige backdrop-blur-sm transition hover:bg-offwhite/20"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); goNext(); }}
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-offwhite/10 p-3 text-beige backdrop-blur-sm transition hover:bg-offwhite/20"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <motion.div
              key={current?.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative h-[85vh] w-[85vw] max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={current?.url ?? 'https://placehold.co/1000x1250/1C1B19/F4F1EA?text=ORGN'}
                alt={productName}
                fill
                className="object-contain"
                sizes="85vw"
                priority
              />
            </motion.div>

            {/* Image counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-ink/60 px-4 py-1.5 text-xs font-semibold text-beige backdrop-blur-sm">
              {active + 1} / {sorted.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
