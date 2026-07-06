import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase.from('subscribers').insert({ email: email.toLowerCase().trim() });

    // Unique violation just means they're already subscribed — treat as success.
    if (error && error.code !== '23505') {
      throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Newsletter signup error:', err);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
