'use client';

import { Check, Loader2, Trash2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { InstagramSettings } from '@/lib/types';

const DEFAULTS: InstagramSettings = {
  handle: '@orgnclothing.in',
  url: 'https://www.instagram.com/orgnclothing.in/',
  images: [],
};

export function InstagramSettingsForm({ initial }: { initial?: InstagramSettings }) {
  const [form, setForm] = useState<InstagramSettings>(initial ?? DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof InstagramSettings>(key: K, value: InstagramSettings[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const supabase = createClient();
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      const path = `content/instagram-${crypto.randomUUID()}-${file.name.replace(/\s+/g, '-')}`;
      const { error } = await supabase.storage.from('orgn-media').upload(path, file);
      if (!error) {
        const { data } = supabase.storage.from('orgn-media').getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
    }
    setForm((f) => ({ ...f, images: [...f.images, ...uploaded] }));
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function removeImage(index: number) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  }

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();
    await supabase.from('site_settings').upsert({ key: 'instagram', value: form, updated_at: new Date().toISOString() });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-ink/50">Powers the &quot;Follow the Drop&quot; grid at the bottom of the homepage.</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Instagram Handle</label>
          <input value={form.handle} onChange={(e) => set('handle', e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Profile URL</label>
          <input value={form.url} onChange={(e) => set('url', e.target.value)} className="input-field" />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-ink/50">Grid Images</label>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {form.images.map((src, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden border-2 border-ink/20 bg-beige">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button
                onClick={() => removeImage(i)}
                className="absolute right-1 top-1 rounded-full bg-beige p-1 text-ink opacity-0 transition group-hover:opacity-100 hover:text-orgn-orange"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 border-2 border-dashed border-ink/30 text-ink/50 hover:border-orgn-orange hover:text-orgn-orange">
            {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
            <span className="text-[10px] font-semibold uppercase">Upload</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>
        </div>
        <p className="mt-2 text-xs text-ink/40">Recommended: square images, at least 600×600px.</p>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-2 flex w-fit items-center gap-2 bg-ink px-6 py-3 text-sm font-semibold uppercase tracking-wide text-beige shadow-orgn-sm hover:bg-orgn-orange hover:text-ink disabled:opacity-60"
      >
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : null}
        {saved ? 'Saved' : 'Save Instagram Settings'}
      </button>
    </div>
  );
}
