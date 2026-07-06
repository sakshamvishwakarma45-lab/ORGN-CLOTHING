import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Used for anonymous storefront reads only. Unlike the cookie-based client in
// server.ts, this never touches cookies() — that's what lets Next.js cache and
// incrementally revalidate storefront pages instead of rendering every single
// page fresh on every request (which is slow). Admin pages should keep using
// the cookie-based client in server.ts, since they need the signed-in session.
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
