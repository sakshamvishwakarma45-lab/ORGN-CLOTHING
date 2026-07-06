import type { AboutSettings } from '@/lib/types';
import { Reveal } from '@/components/ui/Reveal';

export function AboutSection({ settings }: { settings: AboutSettings }) {
  return (
    <section className="relative overflow-hidden bg-charcoal py-28 text-offwhite">
      <div className="pointer-events-none absolute -left-40 top-1/2 h-[500px] w-[500px] -translate-y-1/2 animate-drift rounded-full bg-orgn-orange/10 blur-[120px]" />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-orgn-orange">
            About ORGN
          </p>
          <h2 className="font-display text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl">
            {settings.heading}
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-8 text-balance text-lg leading-relaxed text-offwhite/70">
            {settings.body}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
