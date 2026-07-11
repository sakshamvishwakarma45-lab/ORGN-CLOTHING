'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { MagneticButton } from '@/components/ui/MagneticButton';
import type { HeroSettings } from '@/lib/types';

const TICKER_ITEMS = [
  'HEAVYWEIGHT COTTON',
  'LIMITED DROPS',
  'DESIGNED IN INDIA',
  'BUILT FOR MOVEMENT',
  'SMALL-BATCH ONLY',
  'PREMIUM QUALITY',
];

export function Hero({ settings }: { settings: HeroSettings }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 60, damping: 20 });
  const springY = useSpring(my, { stiffness: 60, damping: 20 });

  const glowX = useTransform(springX, (v) => v * 0.4);
  const glowY = useTransform(springY, (v) => v * 0.4);
  const productX = useTransform(springX, (v) => v * -0.6);
  const productY = useTransform(springY, (v) => v * -0.6);
  const productRotate = useTransform(springX, (v) => v * 0.02);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(e.clientX - rect.left - rect.width / 2);
    my.set(e.clientY - rect.top - rect.height / 2);
  }

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-[640px] w-full flex-col items-center justify-center overflow-hidden bg-beige py-28 sm:py-36"
    >
      <div className="grain-overlay" />

      {/* Slow-drifting blurred orange glow, with subtle mouse parallax */}
      <motion.div
        style={{ x: glowX, y: glowY }}
        className="pointer-events-none absolute right-[10%] top-[15%] h-[420px] w-[420px] animate-drift rounded-full bg-orgn-orange/30 blur-[110px] md:h-[560px] md:w-[560px]"
      />

      {/* Second glow for depth */}
      <div className="pointer-events-none absolute -left-20 bottom-[20%] h-[300px] w-[300px] animate-drift rounded-full bg-orgn-orange/10 blur-[100px]" style={{ animationDelay: '-8s' }} />

      {/* Oversized low-opacity wordmark bleeding into the background */}
      <div className="bg-wordmark">
        <span>ORGN</span>
      </div>

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-orgn-orange"
        >
          Est. 2026 — India
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-7xl font-black leading-[0.85] tracking-tight text-ink text-pop-lg sm:text-8xl md:text-9xl"
        >
          ORGN
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 max-w-md text-balance font-body text-lg text-ink/70 sm:text-xl"
        >
          {settings.subheading}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <MagneticButton href={settings.primary_cta_href} variant="primary">
            {settings.primary_cta_label}
          </MagneticButton>
          <MagneticButton href={settings.secondary_cta_href} variant="ghost">
            {settings.secondary_cta_label}
          </MagneticButton>
        </motion.div>
      </div>

      {/* Floating product visual */}
      <motion.div
        style={{ x: productX, y: productY, rotate: productRotate }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none absolute bottom-0 right-[2%] hidden w-[260px] md:block lg:w-[340px]"
      >
        <div className="animate-float">
          <div className="relative aspect-[4/5] w-full">
            <Image
              src={settings.floating_image}
              alt=""
              fill
              className="object-contain drop-shadow-2xl"
              sizes="340px"
              priority
            />
          </div>
          <div className="mx-auto h-8 w-3/4 rounded-full bg-orgn-orange/30 blur-2xl" />
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-20 left-1/2 z-10 -translate-x-1/2 sm:bottom-16"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-ink/30 p-1.5"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-ink/60" />
        </motion.div>
      </motion.div>

      {/* Marquee ticker at bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-0 left-0 z-10 w-full border-t border-ink/10 bg-beige/60 py-3 backdrop-blur-sm"
      >
        <div className="marquee-track">
          {[...Array(2)].map((_, setIndex) => (
            <div key={setIndex} className="flex items-center gap-0">
              {TICKER_ITEMS.map((item) => (
                <span key={`${setIndex}-${item}`} className="flex items-center gap-6 px-6">
                  <span className="whitespace-nowrap font-display text-xs font-bold uppercase tracking-[0.2em] text-ink/40">
                    {item}
                  </span>
                  <span className="text-orgn-orange/60">◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
