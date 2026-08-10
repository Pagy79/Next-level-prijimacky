-- =============================================================================
-- Supabase audit pro Next-level-prijimacky
-- Spusť v Supabase Dashboard → SQL Editor
-- =============================================================================

-- 1) Existuje tabulka profiles?
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public' AND table_name = 'profiles'
) AS profiles_table_exists;

-- 2) Sloupce tabulky profiles (porovnej s požadavky appky)
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Očekávané sloupce:
-- id (uuid), nickname (text), email (text),
-- notifications_enabled (boolean), is_premium (boolean),
-- practice_tests_today (integer), last_practice_test_date (date),
-- last_big_test_at (timestamptz)

-- 3) RLS zapnuté?
SELECT relname AS table_name, relrowsecurity AS rls_enabled
FROM pg_class
WHERE relname = 'profiles';

-- 4) RLS politiky na profiles
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles';

-- Očekávané politiky (minimálně):
-- SELECT: authenticated user může číst svůj profil (id = auth.uid())
-- UPDATE: authenticated user může upravovat svůj profil
-- INSERT: trigger nebo policy pro vytvoření profilu při registraci

-- 5) Existuje RPC delete_user?
SELECT routine_name, routine_type, security_type
FROM information_schema.routines
WHERE routine_schema = 'public' AND routine_name = 'delete_user';

-- 6) Trigger pro auto-vytvoření profilu při registraci?
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth' AND event_object_table = 'users';

-- 7) Funkce handle_new_user (typický pattern)
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public' AND routine_name ILIKE '%user%';

-- 8) Počet profilů vs. uživatelů (měly by být zhruba stejné)
SELECT
  (SELECT COUNT(*) FROM auth.users) AS auth_users_count,
  (SELECT COUNT(*) FROM public.profiles) AS profiles_count;

-- 9) Learning loop tabulky
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public' AND table_name = 'attempts'
) AS attempts_table_exists;

SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public' AND table_name = 'attempt_answers'
) AS attempt_answers_table_exists;

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name IN ('attempts', 'attempt_answers')
ORDER BY table_name, ordinal_position;

SELECT relname AS table_name, relrowsecurity AS rls_enabled
FROM pg_class
WHERE relname IN ('attempts', 'attempt_answers');
