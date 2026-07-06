import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { code, subtotal } = await request.json();
    if (!code || typeof subtotal !== 'number') {
      return NextResponse.json({ valid: false, reason: 'INVALID_INPUT' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase.rpc('preview_coupon', { p_code: code, p_subtotal: subtotal });

    if (error) {
      return NextResponse.json({ valid: false, reason: 'ERROR' }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ valid: false, reason: 'ERROR' }, { status: 500 });
  }
}
