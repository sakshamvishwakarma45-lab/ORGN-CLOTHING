import { Instagram } from 'lucide-react';
import Image from 'next/image';
import type { InstagramSettings } from '@/lib/types';
import { Reveal } from '@/components/ui/Reveal';

export function InstagramFeed({ settings }: { settings: InstagramSettings }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <Reveal className="mb-10 flex items-center justify-between">
        <h2 className="font-display text-3xl font-black uppercase tracking-tight sm:text-4xl">
          Follow the Drop
        </h2>
        <a
          href={settings.url}
          target="_blank"
          rel="noreferrer noopener"
          className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide hover:text-orgn-orange"
        >
          <Instagram className="h-4 w-4" /> {settings.handle}
        </a>
      </Reveal>

      <div className="grid grid-cols-3 gap-2 sm:gap-3 md:grid-cols-6">
        {settings.images.map((src, i) => (
          <a
            key={i}
            href={settings.url}
            target="_blank"
            rel="noreferrer noopener"
            className="group relative aspect-square overflow-hidden bg-offwhite"
          >
            <Image
              src={src}
              alt="ORGN on Instagram"
              fill
              sizes="(min-width: 768px) 16vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors group-hover:bg-ink/40">
              <Instagram className="h-6 w-6 text-beige opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
