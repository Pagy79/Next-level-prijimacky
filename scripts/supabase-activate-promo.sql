-- One-time promo codes for PREMIUM (replaces hard-coded R2D2C3PO)
-- 1) Spusť toto v Supabase SQL Editoru
-- 2) Pak: node scripts/seed-promo-codes.mjs   (vloží 11 kódů z promo-codes-once.txt)

CREATE TABLE IF NOT EXISTS public.promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  code_display text NOT NULL,
  label text,
  created_at timestamptz NOT NULL DEFAULT now(),
  used_at timestamptz,
  used_by uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  CONSTRAINT promo_codes_code_normalized CHECK (code ~ '^[A-Z0-9]+$')
);

CREATE INDEX IF NOT EXISTS promo_codes_unused_idx
  ON public.promo_codes (code)
  WHERE used_at IS NULL;

ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
-- Žádné policies pro authenticated/anon → tabulka není z klienta čitelná.
-- Přístup jen přes SECURITY DEFINER RPC (a service_role).

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

REVOKE ALL ON FUNCTION public.activate_promo_code(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.activate_promo_code(text) TO authenticated;

NOTIFY pgrst, 'reload schema';
