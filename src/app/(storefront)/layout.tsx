import { CartDrawer } from '@/components/storefront/CartDrawer';
import { Footer } from '@/components/storefront/Footer';
import { Header } from '@/components/storefront/Header';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { createPublicClient } from '@/lib/supabase/public';
import type { Category } from '@/lib/types';

// Storefront pages are cached and refreshed in the background every 30
// seconds (ISR) instead of being rebuilt on every single request — that's
// what makes navigation feel instant. Admin edits show up here within ~30s.
export const revalidate = 30;

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });

  const categories = (data ?? []) as Category[];

  return (
    <>
      <ScrollProgress />
      <Header categories={categories} />
      <main className="page-transition-enter">{children}</main>
      <Footer categories={categories} />
      <CartDrawer />
    </>
  );
}
