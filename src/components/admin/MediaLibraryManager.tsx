'use client';

import { Check, Copy, Loader2, Trash2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface MediaItem {
  id: string;
  url: string;
  path: string;
  filename: string;
  alt_text: string | null;
  uploaded_at: string;
}

export function MediaLibraryManager({ initialItems }: { initialItems: MediaItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const supabase = createClient();

    for (const file of Array.from(files)) {
      const path = `media/${crypto.randomUUID()}-${file.name.replace(/\s+/g, '-')}`;
      const { error } = await supabase.storage.from('orgn-media').upload(path, file);
      if (error) continue;
      const { data: publicUrl } = supabase.storage.from('orgn-media').getPublicUrl(path);

      const { data: inserted } = await supabase
        .from('media_library')
        .insert({ url: publicUrl.publicUrl, path, filename: file.name })
        .select('*')
        .single();

      if (inserted) setItems((prev) => [inserted as MediaItem, ...prev]);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleDelete(item: MediaItem) {
    if (!confirm(`Delete "${item.filename}"?`)) return;
    const supabase = createClient();
    await supabase.from('media_library').delete().eq('id', item.id);
    await supabase.storage.from('orgn-media').remove([item.path]);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  }

  function copyUrl(item: MediaItem) {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div>
      <label className="mb-6 flex w-full max-w-xs cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-ink/30 py-8 text-ink/50 hover:border-orgn-orange hover:text-orgn-orange">
        {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
        <span className="text-xs font-semibold uppercase">Upload Images</span>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      </label>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {items.map((item) => (
          <div key={item.id} className="group relative aspect-square overflow-hidden border-2 border-ink/20 bg-beige">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.url} alt={item.alt_text ?? item.filename} className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex flex-col justify-between bg-ink/0 p-2 opacity-0 transition group-hover:bg-ink/50 group-hover:opacity-100">
              <button onClick={() => handleDelete(item)} className="ml-auto rounded-full bg-beige p-1.5 text-ink hover:text-orgn-orange">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => copyUrl(item)}
                className="flex items-center justify-center gap-1 bg-beige py-1.5 text-xs font-bold uppercase text-ink hover:bg-orgn-orange"
              >
                {copiedId === item.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copiedId === item.id ? 'Copied' : 'Copy URL'}
              </button>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <p className="text-sm text-ink/50">No media uploaded yet.</p>}
    </div>
  );
}
