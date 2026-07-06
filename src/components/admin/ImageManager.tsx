'use client';

import { GripVertical, Loader2, Star, Trash2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ProductImage } from '@/lib/types';

function pathFromPublicUrl(url: string): string | null {
  const marker = '/orgn-media/';
  const idx = url.indexOf(marker);
  return idx === -1 ? null : url.slice(idx + marker.length);
}

export function ImageManager({ productId, initialImages }: { productId: string; initialImages: ProductImage[] }) {
  const [images, setImages] = useState(
    [...initialImages].sort((a, b) => a.position - b.position)
  );
  const [uploading, setUploading] = useState(false);
  const dragIndex = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const supabase = createClient();

    for (const file of Array.from(files)) {
      const path = `products/${productId}/${crypto.randomUUID()}-${file.name.replace(/\s+/g, '-')}`;
      const { error: uploadError } = await supabase.storage.from('orgn-media').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });
      if (uploadError) {
        alert(`Upload failed: ${uploadError.message}`);
        continue;
      }
      const { data: publicUrl } = supabase.storage.from('orgn-media').getPublicUrl(path);

      const { data: inserted, error: insertError } = await supabase
        .from('product_images')
        .insert({
          product_id: productId,
          url: publicUrl.publicUrl,
          position: images.length,
          is_primary: images.length === 0,
        })
        .select('*')
        .single();

      if (!insertError && inserted) {
        setImages((prev) => [...prev, inserted as ProductImage]);
      }
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function persistOrder(next: ProductImage[]) {
    setImages(next);
    const supabase = createClient();
    await Promise.all(next.map((img, i) => supabase.from('product_images').update({ position: i }).eq('id', img.id)));
  }

  function handleDrop(dropIndex: number) {
    if (dragIndex.current === null || dragIndex.current === dropIndex) return;
    const next = [...images];
    const [moved] = next.splice(dragIndex.current, 1);
    next.splice(dropIndex, 0, moved);
    dragIndex.current = null;
    persistOrder(next);
  }

  async function setPrimary(imageId: string) {
    const supabase = createClient();
    await supabase.from('product_images').update({ is_primary: false }).eq('product_id', productId);
    await supabase.from('product_images').update({ is_primary: true }).eq('id', imageId);
    setImages((prev) => prev.map((img) => ({ ...img, is_primary: img.id === imageId })));
  }

  async function deleteImage(image: ProductImage) {
    if (!confirm('Remove this image?')) return;
    const supabase = createClient();
    await supabase.from('product_images').delete().eq('id', image.id);
    const path = pathFromPublicUrl(image.url);
    if (path) await supabase.storage.from('orgn-media').remove([path]);
    setImages((prev) => prev.filter((img) => img.id !== image.id));
  }

  return (
    <div>
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {images.map((img, i) => (
          <div
            key={img.id}
            draggable
            onDragStart={() => (dragIndex.current = i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(i)}
            className="group relative aspect-square cursor-move overflow-hidden border-2 border-ink/20 bg-beige"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex flex-col justify-between bg-ink/0 p-2 opacity-0 transition group-hover:bg-ink/40 group-hover:opacity-100">
              <div className="flex justify-between">
                <GripVertical className="h-4 w-4 text-beige" />
                <button onClick={() => deleteImage(img)} className="rounded-full bg-beige p-1 text-ink hover:text-orgn-orange">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <button
                onClick={() => setPrimary(img.id)}
                className={`flex items-center justify-center gap-1 py-1.5 text-xs font-bold uppercase ${
                  img.is_primary ? 'bg-orgn-orange text-ink' : 'bg-beige text-ink hover:bg-orgn-orange'
                }`}
              >
                <Star className="h-3 w-3" fill={img.is_primary ? 'currentColor' : 'none'} /> {img.is_primary ? 'Primary' : 'Set primary'}
              </button>
            </div>
            {img.is_primary && (
              <span className="absolute left-1.5 top-1.5 bg-orgn-orange px-1.5 py-0.5 text-[9px] font-bold uppercase text-ink">Primary</span>
            )}
          </div>
        ))}

        <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-ink/30 text-ink/50 hover:border-orgn-orange hover:text-orgn-orange">
          {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Upload className="h-6 w-6" />}
          <span className="text-xs font-semibold uppercase">Upload</span>
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
      <p className="text-xs text-ink/40">Drag to reorder. The starred image is shown first on the storefront.</p>
    </div>
  );
}
