import { supabase } from "../supabase/client";

const SESSION_BACKUP_KEY = "nlp_stripe_session_backup_v1";

/** Stash session before leaving for Stripe Checkout (same-tab return). */
export function backupSessionForCheckout(session) {
  if (typeof window === "undefined" || !session?.access_token || !session?.refresh_token) {
    return;
  }
  try {
    sessionStorage.setItem(
      SESSION_BACKUP_KEY,
      JSON.stringify({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        saved_at: Date.now(),
      })
    );
  } catch (e) {
    console.warn("Session backup před Stripe selhal:", e);
  }
}

/** Restore session after Stripe return if Supabase storage was empty. */
export async function restoreSessionAfterCheckout() {
  if (typeof window === "undefined") return null;

  const {
    data: { session: existing },
  } = await supabase.auth.getSession();
  if (existing?.user) {
    clearSessionBackup();
    return existing;
  }

  let raw = null;
  try {
    raw = sessionStorage.getItem(SESSION_BACKUP_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (!parsed?.access_token || !parsed?.refresh_token) {
      clearSessionBackup();
      return null;
    }
    // Backup starší než 2 h zahodit
    if (parsed.saved_at && Date.now() - parsed.saved_at > 2 * 60 * 60 * 1000) {
      clearSessionBackup();
      return null;
    }
    const { data, error } = await supabase.auth.setSession({
      access_token: parsed.access_token,
      refresh_token: parsed.refresh_token,
    });
    clearSessionBackup();
    if (error) {
      console.warn("Obnova session po Stripe selhala:", error.message);
      return null;
    }
    return data.session || null;
  } catch (e) {
    console.warn("Obnova session po Stripe selhala:", e);
    clearSessionBackup();
    return null;
  }
}

export function clearSessionBackup() {
  try {
    sessionStorage.removeItem(SESSION_BACKUP_KEY);
  } catch {
    /* ignore */
  }
}

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

  backupSessionForCheckout(session);

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
    clearSessionBackup();
    return {
      error: payload?.error || "Nepodařilo se spustit platbu. Zkus to znovu.",
    };
  }
  if (!payload?.url) {
    clearSessionBackup();
    return { error: "Chybí odkaz na platební bránu." };
  }
  return { url: payload.url };
}
