'use client';

import { Download, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function SubscribersPanel({ count }: { count: number }) {
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    setExporting(true);
    const supabase = createClient();
    const { data } = await supabase.from('subscribers').select('email, subscribed_at').order('subscribed_at', { ascending: false });

    const rows = ['email,subscribed_at', ...(data ?? []).map((s) => `${s.email},${s.subscribed_at}`)];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orgn-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-display text-2xl font-black">{count}</p>
        <p className="text-sm text-ink/50">subscribers on the list</p>
      </div>
      <button
        onClick={handleExport}
        disabled={exporting || count === 0}
        className="flex items-center gap-2 border-2 border-ink px-5 py-3 text-sm font-semibold uppercase hover:bg-ink hover:text-beige disabled:opacity-50"
      >
        {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} Export CSV
      </button>
    </div>
  );
}
