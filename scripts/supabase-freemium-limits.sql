-- =============================================================================
-- Server-side freemium limits + protect premium columns
-- Spusť v Supabase SQL Editoru (New query → Run)
-- Dashboard (service_role / SQL jako postgres) může is_premium měnit dál.
-- =============================================================================

-- Guard: klient nesmí měnit is_premium ani usage countery.
-- RPC start_* nastaví app.allow_limit_update = true pro legitimní spotřebu limitu.
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
  -- Dashboard Table Editor (service_role) + SQL Editor (postgres)
  IF jwt_role = 'service_role'
     OR current_user IN ('postgres', 'supabase_admin')
     OR session_user IN ('postgres', 'supabase_admin') THEN
    RETURN NEW;
  END IF;

  IF NEW.is_premium IS DISTINCT FROM OLD.is_premium THEN
    RAISE EXCEPTION 'is_premium nelze měnit z klienta — nastav ho v Supabase Dashboardu';
  END IF;

  IF NOT allow_limits THEN
    IF NEW.practice_tests_today IS DISTINCT FROM OLD.practice_tests_today
       OR NEW.last_practice_test_date IS DISTINCT FROM OLD.last_practice_test_date
       OR NEW.last_big_test_at IS DISTINCT FROM OLD.last_big_test_at THEN
      RAISE EXCEPTION 'Limity lze měnit jen přes serverové RPC';
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

-- Atomicky zkontroluje limit a spotřebuje 1 practice test (nebo premium = unlimited).
CREATE OR REPLACE FUNCTION public.start_practice_test()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  prof public.profiles%ROWTYPE;
  today date := (timezone('utc', now()))::date;
  used integer;
  lim integer := 2;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO prof FROM public.profiles WHERE id = uid FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  IF prof.is_premium THEN
    RETURN jsonb_build_object(
      'allowed', true,
      'is_premium', true,
      'practice_tests_today', coalesce(prof.practice_tests_today, 0),
      'last_practice_test_date', prof.last_practice_test_date,
      'last_big_test_at', prof.last_big_test_at
    );
  END IF;

  used := CASE
    WHEN prof.last_practice_test_date = today THEN coalesce(prof.practice_tests_today, 0)
    ELSE 0
  END;

  IF used >= lim THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'daily_limit',
      'used', used,
      'limit', lim,
      'is_premium', false,
      'message', format(
        'Dnes jsi využil/a oba testy zdarma (%s/%s). Nové testy budou zase zítra, nebo přejdi na PREMIUM pro neomezený přístup.',
        lim, lim
      ),
      'practice_tests_today', used,
      'last_practice_test_date', today,
      'last_big_test_at', prof.last_big_test_at
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
    'last_big_test_at', prof.last_big_test_at
  );
END;
$$;

-- Atomicky zkontroluje týdenní limit big testu a spotřebuje 1 pokus.
CREATE OR REPLACE FUNCTION public.start_big_test()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  prof public.profiles%ROWTYPE;
  interval_days integer := 7;
  remaining_days integer;
  now_ts timestamptz := timezone('utc', now());
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO prof FROM public.profiles WHERE id = uid FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  IF prof.is_premium THEN
    RETURN jsonb_build_object(
      'allowed', true,
      'is_premium', true,
      'practice_tests_today', coalesce(prof.practice_tests_today, 0),
      'last_practice_test_date', prof.last_practice_test_date,
      'last_big_test_at', prof.last_big_test_at
    );
  END IF;

  IF prof.last_big_test_at IS NOT NULL
     AND (now_ts - prof.last_big_test_at) < make_interval(days => interval_days) THEN
    remaining_days := ceil(
      extract(epoch FROM (prof.last_big_test_at + make_interval(days => interval_days) - now_ts))
      / 86400.0
    )::integer;
    IF remaining_days < 1 THEN
      remaining_days := 1;
    END IF;

    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'weekly_limit',
      'remaining_days', remaining_days,
      'is_premium', false,
      'message', format(
        'Další test nanečisto zdarma bude dostupný za %s %s. S PREMIUM ho můžeš zkusit hned.',
        remaining_days,
        CASE
          WHEN remaining_days = 1 THEN 'den'
          WHEN remaining_days < 5 THEN 'dny'
          ELSE 'dní'
        END
      ),
      'practice_tests_today', coalesce(prof.practice_tests_today, 0),
      'last_practice_test_date', prof.last_practice_test_date,
      'last_big_test_at', prof.last_big_test_at
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
    'practice_tests_today', coalesce(prof.practice_tests_today, 0),
    'last_practice_test_date', prof.last_practice_test_date,
    'last_big_test_at', now_ts
  );
END;
$$;

REVOKE ALL ON FUNCTION public.start_practice_test() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.start_big_test() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.start_practice_test() TO authenticated;
GRANT EXECUTE ON FUNCTION public.start_big_test() TO authenticated;
