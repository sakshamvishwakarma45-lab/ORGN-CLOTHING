'use client';

import * as Icons from 'lucide-react';
import { Circle } from 'lucide-react';
import type { WhyOrgnCard } from '@/lib/types';
import { Reveal } from '@/components/ui/Reveal';

export function WhyOrgn({ cards }: { cards: WhyOrgnCard[] }) {
  return (
    <section className="relative bg-offwhite py-24">
      <div className="grain-overlay opacity-[0.03]" />
      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal className="mb-14 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-orgn-orange">
            The difference
          </p>
          <h2 className="font-display text-4xl font-black uppercase tracking-tight sm:text-5xl">
            Why ORGN
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {cards.map((card, i) => {
            const IconComponent = (Icons as unknown as Record<string, Icons.LucideIcon>)[card.icon] ?? Circle;
            return (
              <Reveal key={card.title} delay={i * 0.08}>
                <div className="tilt-card group h-full border-2 border-ink bg-beige p-6 shadow-orgn-sm transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-orgn">
                  <div className="relative z-10">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orgn-orange/10 transition-colors duration-300 group-hover:bg-orgn-orange/20">
                      <IconComponent className="h-6 w-6 text-orgn-orange" strokeWidth={1.75} />
                    </div>
                    <h3 className="font-display text-lg font-bold uppercase">{card.title}</h3>
                    <p className="mt-2 text-sm text-ink/60">{card.description}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
