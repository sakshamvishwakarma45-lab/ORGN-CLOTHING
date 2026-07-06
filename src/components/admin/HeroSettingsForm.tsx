'use client';

import { Check, Loader2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { HeroSettings } from '@/lib/types';

const DEFAULTS: HeroSettings = {
  heading: 'ORGN',
  subheading: 'Crafted from the origin. Built for everyday movement.',
  primary_cta_label: 'Shop Collection',
  primary_cta_href: '/shop',
  secondary_cta_label: 'Explore',
  secondary_cta_href: '#featured',
  floating_image: 'https://placehold.co/900x1100/0A0A0A/F4F1EA?text=ORGN',
};

export function HeroSettingsForm({ initial }: { initial?: HeroSettings }) {
  const [form, setForm] = useState<HeroSettings>(initial ?? DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof HeroSettings>(key: K, value: HeroSettings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    const supabase = createClient();
    const path = `content/hero-${crypto.randomUUID()}-${file.name.replace(/\s+/g, '-')}`;
    const { error } = await supabase.storage.from('orgn-media').upload(path, file);
    if (!error) {
      const { data } = supabase.storage.from('orgn-media').getPublicUrl(path);
      set('floating_image', data.publicUrl);
    }
    setUploading(false);
  }

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();
    await supabase.from('site_settings').upsert({ key: 'hero', value: form, updated_at: new Date().toISOString() });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Subheading / Tagline</label>
        <textarea rows={2} value={form.subheading} onChange={(e) => set('subheading', e.target.value)} className="input-field resize-none" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Primary CTA Label</label>
          <input value={form.primary_cta_label} onChange={(e) => set('primary_cta_label', e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Primary CTA Link</label>
          <input value={form.primary_cta_href} onChange={(e) => set('primary_cta_href', e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Secondary CTA Label</label>
          <input value={form.secondary_cta_label} onChange={(e) => set('secondary_cta_label', e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Secondary CTA Link</label>
          <input value={form.secondary_cta_href} onChange={(e) => set('secondary_cta_href', e.target.value)} className="input-field" />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Floating Product Image</label>
        <div className="flex items-center gap-4">
          <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden bg-beige">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.floating_image} alt="" className="h-full w-full object-contain" />
          </div>
          <label className="flex cursor-pointer items-center gap-2 border-2 border-ink px-4 py-2.5 text-xs font-semibold uppercase hover:bg-ink hover:text-beige">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Upload New Image
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
          </label>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-2 flex w-fit items-center gap-2 bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-wide text-beige shadow-orgn-sm hover:bg-orgn-orange hover:text-ink disabled:opacity-60"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : null}
        {saved ? 'Saved' : 'Save Hero Settings'}
      </button>
    </div>
  );
}
