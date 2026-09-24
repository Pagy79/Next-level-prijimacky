-- Patch: hláška pro už použitý promo kód
-- Spusť v Supabase SQL Editor (bez INSERTů — jen funkce)

CREATE OR REPLACE FUNCTION public.activate_promo_code(p_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  normalized text;
  promo record;
  already_premium boolean;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  normalized := upper(regexp_replace(coalesce(p_code, ''), '[^a-zA-Z0-9]', '', 'g'));

  IF normalized = '' THEN
    RETURN jsonb_build_object(
      'ok', false,
      'reason', 'invalid_code',
      'message', 'Neplatný kód. Napiš si o něj na info@kompasnaskolu.cz'
    );
  END IF;

  SELECT is_premium INTO already_premium
  FROM public.profiles
  WHERE id = uid;

  IF already_premium IS TRUE THEN
    RETURN jsonb_build_object(
      'ok', true,
      'is_premium', true,
      'reason', 'already_premium',
      'message', 'Premium už na účtu máš aktivní.'
    );
  END IF;

  SELECT *
  INTO promo
  FROM public.promo_codes
  WHERE code = normalized
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'ok', false,
      'reason', 'invalid_code',
      'message', 'Neplatný kód. Napiš si o něj na info@kompasnaskolu.cz'
    );
  END IF;

  IF promo.used_at IS NOT NULL THEN
    RETURN jsonb_build_object(
      'ok', false,
      'reason', 'already_used',
      'message', 'Neplatný kód. Tento testovací kód byl už použitý.'
    );
  END IF;

  UPDATE public.promo_codes
  SET used_at = now(),
      used_by = uid
  WHERE id = promo.id
    AND used_at IS NULL;

  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'ok', false,
      'reason', 'already_used',
      'message', 'Neplatný kód. Tento testovací kód byl už použitý.'
    );
  END IF;

  UPDATE public.profiles
  SET is_premium = true
  WHERE id = uid;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  RETURN jsonb_build_object(
    'ok', true,
    'is_premium', true,
    'message', 'Vesmírný Premium přístup aktivován! 🚀'
  );
END;
$$;
