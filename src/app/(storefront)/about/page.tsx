import type { Metadata } from 'next';
import { getAboutSettings } from '@/lib/data';
import { Reveal } from '@/components/ui/Reveal';
import { Wordmark } from '@/components/ui/Wordmark';

export const metadata: Metadata = { title: 'About' };

export default async function AboutPage() {
  const about = await getAboutSettings();

  return (
    <div>
      <section className="relative overflow-hidden bg-beige py-24">
        <div className="grain-overlay" />
        <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 animate-drift rounded-full bg-orgn-orange/20 blur-[100px]" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-orgn-orange">Our Story</p>
            <Wordmark size="lg" className="mx-auto" />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-20">
        <Reveal>
          <h1 className="mb-6 font-display text-4xl font-black uppercase tracking-tight">{about.heading}</h1>
          <p className="text-lg leading-relaxed text-ink/70">{about.body}</p>
        </Reveal>

        <Reveal delay={0.15} className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="border-2 border-ink p-6 shadow-orgn-sm">
            <p className="font-display text-3xl font-black text-orgn-orange">240–420</p>
            <p className="mt-1 text-sm text-ink/60">GSM heavyweight fabric across the range</p>
          </div>
          <div className="border-2 border-ink p-6 shadow-orgn-sm">
            <p className="font-display text-3xl font-black text-orgn-orange">100%</p>
            <p className="mt-1 text-sm text-ink/60">Designed and developed in India</p>
          </div>
          <div className="border-2 border-ink p-6 shadow-orgn-sm">
            <p className="font-display text-3xl font-black text-orgn-orange">Small</p>
            <p className="mt-1 text-sm text-ink/60">Batch drops — once it&apos;s gone, it&apos;s gone</p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
