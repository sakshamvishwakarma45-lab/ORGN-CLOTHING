import { CouponManager } from '@/components/admin/CouponManager';
import { createClient } from '@/lib/supabase/server';
import type { Coupon } from '@/lib/types';

export const metadata = { title: 'Coupons' };

export default async function AdminCouponsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl font-black uppercase tracking-tight">Coupons</h1>
      <CouponManager initialCoupons={(data ?? []) as Coupon[]} />
    </div>
  );
}
