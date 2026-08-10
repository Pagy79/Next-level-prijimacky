-- =============================================================================
-- Freemium RPC (zjednodušené) — spusť celé najednou v SQL Editoru
-- Po Run by dole mělo být Success. Pak spusť ověřovací SELECT na konci.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.start_practice_test()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  is_prem boolean;
  today date := (timezone('utc', now()))::date;
  last_date date;
  used integer;
  big_at timestamptz;
  lim integer := 2;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT p.is_premium, p.last_practice_test_date, coalesce(p.practice_tests_today, 0), p.last_big_test_at
    INTO is_prem, last_date, used, big_at
  FROM public.profiles p
  WHERE p.id = uid
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  IF is_prem THEN
    RETURN jsonb_build_object(
      'allowed', true,
      'is_premium', true,
      'practice_tests_today', used,
      'last_practice_test_date', last_date,
      'last_big_test_at', big_at
    );
  END IF;

  IF last_date IS DISTINCT FROM today THEN
    used := 0;
  END IF;

  IF used >= lim THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'daily_limit',
      'used', used,
      'limit', lim,
      'is_premium', false,
      'message', 'Dnes jsi vyuzil/a oba testy zdarma (2/2). Nove testy budou zase zitra, nebo prejdi na PREMIUM.',
      'practice_tests_today', used,
      'last_practice_test_date', today,
      'last_big_test_at', big_at
    );
  END IF;

  PERFORM set_config('app.allow_limit_update', 'true', true);

  UPDATE public.profiles
  SET
    practice_tests_today = used + 1,
    last_practice_test_date = today,
    updated_at = now()
  WHERE id = uid;

  RETURN jsonb_build_object(
    'allowed', true,
    'is_premium', false,
    'used', used + 1,
    'limit', lim,
    'practice_tests_today', used + 1,
    'last_practice_test_date', today,
    'last_big_test_at', big_at
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.start_big_test()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  is_prem boolean;
  practice_used integer;
  last_date date;
  big_at timestamptz;
  now_ts timestamptz := timezone('utc', now());
  remaining_days integer;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT p.is_premium, coalesce(p.practice_tests_today, 0), p.last_practice_test_date, p.last_big_test_at
    INTO is_prem, practice_used, last_date, big_at
  FROM public.profiles p
  WHERE p.id = uid
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  IF is_prem THEN
    RETURN jsonb_build_object(
      'allowed', true,
      'is_premium', true,
      'practice_tests_today', practice_used,
      'last_practice_test_date', last_date,
      'last_big_test_at', big_at
    );
  END IF;

  IF big_at IS NOT NULL AND (now_ts - big_at) < interval '7 days' THEN
    remaining_days := greatest(1, ceil(extract(epoch FROM (big_at + interval '7 days' - now_ts)) / 86400.0)::integer);
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'weekly_limit',
      'remaining_days', remaining_days,
      'is_premium', false,
      'message', 'Dalsi test nanecisto zdarma jeste neni dostupny. S PREMIUM ho muzes zkusit hned.',
      'practice_tests_today', practice_used,
      'last_practice_test_date', last_date,
      'last_big_test_at', big_at
    );
  END IF;

  PERFORM set_config('app.allow_limit_update', 'true', true);

  UPDATE public.profiles
  SET
    last_big_test_at = now_ts,
    updated_at = now()
  WHERE id = uid;

  RETURN jsonb_build_object(
    'allowed', true,
    'is_premium', false,
    'practice_tests_today', practice_used,
    'last_practice_test_date', last_date,
    'last_big_test_at', now_ts
  );
END;
$$;

-- Guard trigger (volitelné, ale doporučené)
CREATE OR REPLACE FUNCTION public.guard_profile_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  jwt_role text := coalesce(auth.jwt() ->> 'role', '');
  allow_limits boolean := coalesce(current_setting('app.allow_limit_update', true), '') = 'true';
BEGIN
  IF jwt_role = 'service_role'
     OR current_user IN ('postgres', 'supabase_admin')
     OR session_user IN ('postgres', 'supabase_admin') THEN
    RETURN NEW;
  END IF;

  IF NEW.is_premium IS DISTINCT FROM OLD.is_premium THEN
    RAISE EXCEPTION 'is_premium cannot be changed from the client';
  END IF;

  IF NOT allow_limits THEN
    IF NEW.practice_tests_today IS DISTINCT FROM OLD.practice_tests_today
       OR NEW.last_practice_test_date IS DISTINCT FROM OLD.last_practice_test_date
       OR NEW.last_big_test_at IS DISTINCT FROM OLD.last_big_test_at THEN
      RAISE EXCEPTION 'usage counters can only change via RPC';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_profile_columns ON public.profiles;
CREATE TRIGGER trg_guard_profile_columns
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_profile_columns();

GRANT EXECUTE ON FUNCTION public.start_practice_test() TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION public.start_big_test() TO authenticated, anon, service_role;

NOTIFY pgrst, 'reload schema';

-- Ověření (výsledek by měl ukázat 2 řádky):
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('start_practice_test', 'start_big_test');
