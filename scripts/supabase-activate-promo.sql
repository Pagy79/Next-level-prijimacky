-- =============================================================================
-- Promo / test code → Premium (bez platební brány)
-- Spusť v Supabase SQL Editoru
-- Platný kód: R2D2-C3PO (i bez pomlčky / malá písmena)
-- =============================================================================

CREATE OR REPLACE FUNCTION public.activate_promo_code(p_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  normalized text;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  normalized := upper(regexp_replace(coalesce(p_code, ''), '[^a-zA-Z0-9]', '', 'g'));

  IF normalized IS DISTINCT FROM 'R2D2C3PO' THEN
    RETURN jsonb_build_object(
      'ok', false,
      'reason', 'invalid_code',
      'message', 'Neplatný kód. Napiš si o něj na info@fachmanka.cz'
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
