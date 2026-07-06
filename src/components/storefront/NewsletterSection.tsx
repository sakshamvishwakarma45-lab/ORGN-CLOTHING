'use client';

import { Reveal } from '@/components/ui/Reveal';
import { NewsletterSignup } from './NewsletterSignup';

export function NewsletterSection() {
  return (
    <section className="relative overflow-hidden bg-ink py-24">
      {/* Animated glow orbs */}
      <div className="pointer-events-none absolute right-0 top-0 h-[400px] w-[400px] animate-drift rounded-full bg-orgn-orange/20 blur-[100px]" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-[300px] w-[300px] animate-drift rounded-full bg-orgn-orange/10 blur-[80px]" style={{ animationDelay: '-12s' }} />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-orgn-orange">
            Limited offer — First 100 subscribers
          </p>
          <h2 className="font-display text-4xl font-black uppercase leading-tight tracking-tight text-offwhite sm:text-5xl">
            Get first access to every drop
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-offwhite/50">
            Join the list and get 10% off your first order. No spam — just drops, restocks, and exclusive early access.
          </p>
        </Reveal>
        <Reveal delay={0.15} className="mt-10 flex justify-center">
          <div className="w-full max-w-md">
            <NewsletterSignup variant="dark" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
