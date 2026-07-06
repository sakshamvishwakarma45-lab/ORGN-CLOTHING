'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { MagneticButton } from '@/components/ui/MagneticButton';

function FloatingParticle({ delay, x, y, size }: { delay: number; x: string; y: string; size: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.4, 0],
        scale: [0, 1, 0.5],
        y: [0, -80, -160],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
      className="absolute rounded-full bg-orgn-orange/30"
      style={{ left: x, top: y, width: size, height: size }}
    />
  );
}

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden bg-beige px-6 text-center">
      {/* Floating particles */}
      <FloatingParticle delay={0} x="15%" y="60%" size={8} />
      <FloatingParticle delay={0.5} x="80%" y="70%" size={6} />
      <FloatingParticle delay={1} x="30%" y="80%" size={10} />
      <FloatingParticle delay={1.5} x="65%" y="50%" size={7} />
      <FloatingParticle delay={2} x="45%" y="75%" size={9} />
      <FloatingParticle delay={0.8} x="90%" y="40%" size={5} />

      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-orgn-orange/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        {/* Glitch 404 */}
        <div className="glitch-text font-display text-[8rem] font-black leading-none tracking-tight text-ink sm:text-[12rem]" data-text="404">
          404
        </div>

        <p className="font-display text-2xl font-bold uppercase text-ink/70">Page Not Found</p>
        <p className="max-w-sm text-ink/50">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>

        <MagneticButton href="/" variant="primary">
          Back to Home
        </MagneticButton>

        <Link href="/shop" className="text-sm font-semibold uppercase tracking-wide underline decoration-orgn-orange underline-offset-4 transition-colors hover:text-orgn-orange">
          Or browse the shop
        </Link>
      </motion.div>
    </div>
  );
}
