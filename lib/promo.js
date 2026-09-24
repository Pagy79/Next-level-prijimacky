import { supabase } from "./supabase/client";

/** Normalize promo input: strip non-alphanumeric, uppercase. */
export function normalizePromoCode(code) {
  return String(code || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

/**
 * Activate Premium via server RPC (SECURITY DEFINER).
 * One-time codes live in public.promo_codes (R2D2C3PO retired).
 */
export async function activatePromoCode(code) {
  const { data, error } = await supabase.rpc("activate_promo_code", {
    p_code: code,
  });

  if (error) {
    return {
      ok: false,
      message: error.message || "Aktivace kódu selhala.",
      error,
    };
  }

  return (
    data || {
      ok: false,
      message: "Neočekávaná odpověď serveru.",
    }
  );
}
