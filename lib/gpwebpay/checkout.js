import { supabase } from "../supabase/client";
import {
  backupSessionForCheckout,
  clearSessionBackup,
  restoreSessionAfterCheckout,
} from "../stripe/checkout";

export { backupSessionForCheckout, clearSessionBackup, restoreSessionAfterCheckout };

/**
 * Start GP webpay Checkout for PREMIUM. Returns { url } or { error }.
 * Same client contract as the former Stripe helper.
 */
export async function startPremiumCheckout() {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  if (sessionError || !session?.access_token) {
    return { error: "Nejdřív se přihlas, pak můžeš koupit PREMIUM." };
  }

  backupSessionForCheckout(session);

  const res = await fetch("/api/gpwebpay/pay", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      "Content-Type": "application/json",
    },
  });

  let payload = null;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }

  if (!res.ok) {
    clearSessionBackup();
    return {
      error: payload?.error || "Nepodařilo se spustit platbu. Zkus to znovu.",
    };
  }
  if (!payload?.url) {
    clearSessionBackup();
    return { error: "Chybí odkaz na platební bránu." };
  }
  return { url: payload.url, orderNumber: payload.orderNumber };
}
