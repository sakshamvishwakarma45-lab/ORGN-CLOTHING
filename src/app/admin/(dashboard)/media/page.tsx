import { MediaLibraryManager } from '@/components/admin/MediaLibraryManager';
import { createClient } from '@/lib/supabase/server';

interface MediaItem {
  id: string;
  url: string;
  path: string;
  filename: string;
  alt_text: string | null;
  uploaded_at: string;
}

export const metadata = { title: 'Media Library' };

export default async function AdminMediaPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('media_library').select('*').order('uploaded_at', { ascending: false });

  return (
    <div>
      <h1 className="mb-2 font-display text-3xl font-black uppercase tracking-tight">Media Library</h1>
      <p className="mb-8 text-sm text-ink/50">
        A central place for images used across the site — banners, content blocks, and anything
        outside of individual product galleries.
      </p>
      <MediaLibraryManager initialItems={(data ?? []) as MediaItem[]} />
    </div>
  );
}
