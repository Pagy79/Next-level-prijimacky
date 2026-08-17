-- Hotfix: freemium RPC without profiles.updated_at
-- Paste into Supabase SQL Editor and click Run (whole script once).

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
    last_practice_test_date = today
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
    last_big_test_at = now_ts
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

NOTIFY pgrst, 'reload schema';
