import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// SERVER-ONLY. Never import this file from a Client Component — it uses the
// service_role key, which bypasses Row Level Security entirely. It exists so
// that unauthenticated storefront checkout (no customer login by design) can
// still write orders/customers safely, after validation happens in the route
// handler itself.
export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local (see .env.local.example).'
    );
  }

  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
