'use client';

import { Check, Loader2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { WhyOrgnCard } from '@/lib/types';

export function WhyOrgnEditor({ initial }: { initial: WhyOrgnCard[] }) {
  const [cards, setCards] = useState<WhyOrgnCard[]>(initial.length > 0 ? initial : [{ icon: 'Sparkles', title: '', description: '' }]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function update(index: number, patch: Partial<WhyOrgnCard>) {
    setCards((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  }

  function addCard() {
    setCards((prev) => [...prev, { icon: 'Sparkles', title: '', description: '' }]);
  }

  function removeCard(index: number) {
    setCards((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();
    await supabase.from('site_settings').upsert({
      key: 'why_orgn',
      value: cards.filter((c) => c.title.trim()),
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <p className="mb-4 text-xs text-ink/50">
        Icon names match{' '}
        <a href="https://lucide.dev/icons" target="_blank" rel="noreferrer noopener" className="underline hover:text-orgn-orange">
          lucide.dev/icons
        </a>{' '}
        (e.g. Shirt, Truck, RotateCcw, MapPin, Sparkles).
      </p>
      <div className="flex flex-col gap-4">
        {cards.map((card, i) => (
          <div key={i} className="grid grid-cols-1 gap-2 border-b border-ink/10 pb-4 sm:grid-cols-[120px_1fr_2fr_auto] sm:items-start">
            <input value={card.icon} onChange={(e) => update(i, { icon: e.target.value })} placeholder="Icon" className="input-field" />
            <input value={card.title} onChange={(e) => update(i, { title: e.target.value })} placeholder="Title" className="input-field" />
            <input value={card.description} onChange={(e) => update(i, { description: e.target.value })} placeholder="Description" className="input-field" />
            <button onClick={() => removeCard(i)} type="button" className="flex items-center justify-center p-2 text-ink/40 hover:text-orgn-orange">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button onClick={addCard} type="button" className="flex items-center gap-1 text-xs font-semibold uppercase text-ink/60 hover:text-orgn-orange">
          <Plus className="h-3.5 w-3.5" /> Add Card
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="ml-auto flex items-center gap-2 bg-ink px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-beige hover:bg-orgn-orange hover:text-ink disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : null}
          {saved ? 'Saved' : 'Save Cards'}
        </button>
      </div>
    </div>
  );
}
