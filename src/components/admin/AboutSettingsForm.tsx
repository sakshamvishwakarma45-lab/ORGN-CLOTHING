'use client';

import { Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { AboutSettings } from '@/lib/types';

const DEFAULTS: AboutSettings = {
  heading: 'Built from the root up.',
  body: 'ORGN is short for origin — the root every one of us shares before region, language, or city ever enters the picture. Same origin, bigger map. Every piece is designed in-house, cut in heavyweight fabric, and produced in small batches so quality never gets diluted for volume. No influencer campaigns, no filler collections. Just clothing built to be worn, not just bought.',
};

export function AboutSettingsForm({ initial }: { initial?: AboutSettings }) {
  const [form, setForm] = useState<AboutSettings>(initial ?? DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof AboutSettings>(key: K, value: AboutSettings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();
    await supabase.from('site_settings').upsert({ key: 'about', value: form, updated_at: new Date().toISOString() });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-ink/50">
        Shown in the &quot;About ORGN&quot; section on the homepage and on the full <code>/about</code> page.
      </p>
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Heading</label>
        <input value={form.heading} onChange={(e) => set('heading', e.target.value)} className="input-field" />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Body</label>
        <textarea rows={6} value={form.body} onChange={(e) => set('body', e.target.value)} className="input-field resize-none" />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-2 flex w-fit items-center gap-2 bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-wide text-beige shadow-orgn-sm hover:bg-orgn-orange hover:text-ink disabled:opacity-60"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : null}
        {saved ? 'Saved' : 'Save About Settings'}
      </button>
    </div>
  );
}
