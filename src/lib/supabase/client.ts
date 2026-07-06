'use client';

import { createBrowserClient } from '@supabase/ssr';

// Not parameterized with generated Database types (none were generated for
// this project) — table calls are loosely typed. See src/lib/types.ts for
// the hand-written domain types used everywhere else in the app.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
