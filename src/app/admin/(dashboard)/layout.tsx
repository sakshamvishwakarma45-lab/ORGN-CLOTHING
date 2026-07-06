import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { createClient } from '@/lib/supabase/server';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let userLabel = user?.email ?? 'Signed in';
  if (user) {
    const { data: profile } = await supabase.from('profiles').select('username, name, role').eq('id', user.id).single();
    if (profile) {
      userLabel = `${profile.name ?? profile.username ?? user.email} · ${profile.role}`;
    }
  }

  // Get counts for sidebar badges
  const [{ count: pendingOrders }] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }).in('status', ['pending', 'confirmed']),
  ]);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminSidebar
        userLabel={userLabel}
        orderCount={pendingOrders ?? 0}
      />
      <main className="flex-1 overflow-x-hidden bg-beige/50 p-6 lg:p-10">{children}</main>
    </div>
  );
}
