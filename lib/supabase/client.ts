import { createBrowserClient } from "@supabase/ssr";
 
/**
 * Supabase client for use in Client Components ("use client").
 * Built on @supabase/ssr's createBrowserClient, which wraps
 * @supabase/supabase-js and additionally stores the session in cookies
 * (not just localStorage), so the same session is readable by
 * Server Components, Route Handlers and middleware.
 *
 * Call this once per component/hook that needs it — it's cheap to
 * construct, Supabase reuses the underlying auth state internally.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
 
