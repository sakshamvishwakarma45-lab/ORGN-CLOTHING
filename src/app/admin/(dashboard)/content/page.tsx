import { HeroSettingsForm } from '@/components/admin/HeroSettingsForm';
import { SubscribersPanel } from '@/components/admin/SubscribersPanel';
import { WhyOrgnEditor } from '@/components/admin/WhyOrgnEditor';
import { createClient } from '@/lib/supabase/server';
import type { HeroSettings, WhyOrgnCard } from '@/lib/types';

export const metadata = { title: 'Content' };

export default async function AdminContentPage() {
  const supabase = await createClient();
  const [{ data: heroRow }, { data: whyRow }, { count: subscriberCount }] = await Promise.all([
    supabase.from('site_settings').select('value').eq('key', 'hero').single(),
    supabase.from('site_settings').select('value').eq('key', 'why_orgn').single(),
    supabase.from('subscribers').select('*', { count: 'exact', head: true }),
  ]);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-8 font-display text-3xl font-black uppercase tracking-tight">Content</h1>

      <div className="flex flex-col gap-8">
        <section className="border-2 border-ink bg-offwhite p-6 shadow-orgn-sm">
          <h2 className="mb-4 font-display text-lg font-bold uppercase">Homepage Hero</h2>
          <HeroSettingsForm initial={heroRow?.value as HeroSettings} />
        </section>

        <section className="border-2 border-ink bg-offwhite p-6 shadow-orgn-sm">
          <h2 className="mb-4 font-display text-lg font-bold uppercase">Why ORGN — Feature Cards</h2>
          <WhyOrgnEditor initial={(whyRow?.value as WhyOrgnCard[]) ?? []} />
        </section>

        <section className="border-2 border-ink bg-offwhite p-6 shadow-orgn-sm">
          <h2 className="mb-4 font-display text-lg font-bold uppercase">Newsletter Subscribers</h2>
          <SubscribersPanel count={subscriberCount ?? 0} />
        </section>
      </div>
    </div>
  );
}
