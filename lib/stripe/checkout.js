import { supabase } from "../supabase/client";

/**
 * Start Stripe Checkout for PREMIUM. Returns { url } or { error }.
 */
export async function startPremiumCheckout() {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  if (sessionError || !session?.access_token) {
    return { error: "Nejdřív se přihlas, pak můžeš koupit PREMIUM." };
  }

  const res = await fetch("/api/stripe/create-checkout", {
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
    return {
      error: payload?.error || "Nepodařilo se spustit platbu. Zkus to znovu.",
    };
  }
  if (!payload?.url) {
    return { error: "Chybí odkaz na platební bránu." };
  }
  return { url: payload.url };
}
