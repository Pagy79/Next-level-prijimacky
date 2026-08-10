-- Když už jsi spustil supabase-freemium-limits.sql, stačí toto:
GRANT EXECUTE ON FUNCTION public.start_practice_test() TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.start_big_test() TO authenticated, anon, service_role;
NOTIFY pgrst, 'reload schema';
