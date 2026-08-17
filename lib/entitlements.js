import { supabase } from "./supabase/client";

/**
 * Ask the server to start a practice (or mistakes) attempt.
 * Atomically checks freemium limits and consumes one free slot when allowed.
 */
function friendlyRpcError(error, fallback) {
  const raw = error?.message || "";
  if (/updated_at/i.test(raw)) {
    return "Technická chyba při ověření limitu (databáze). Limit freemium je v pořádku — je potřeba aktualizovat SQL funkce v Supabase.";
  }
  return raw || fallback;
}

export async function requestStartPracticeTest() {
  const { data, error } = await supabase.rpc("start_practice_test");
  if (error) {
    return {
      allowed: false,
      message: friendlyRpcError(error, "Nepodařilo se ověřit limit testů."),
      error,
    };
  }
  return data || { allowed: false, message: "Neočekávaná odpověď serveru." };
}

/**
 * Ask the server to start a full timed mock exam.
 */
export async function requestStartBigTest() {
  const { data, error } = await supabase.rpc("start_big_test");
  if (error) {
    return {
      allowed: false,
      message: friendlyRpcError(error, "Nepodařilo se ověřit limit testu nanečisto."),
      error,
    };
  }
  return data || { allowed: false, message: "Neočekávaná odpověď serveru." };
}

export function applyEntitlementSnapshot(snapshot, setters) {
  if (!snapshot || typeof snapshot !== "object") return;
  const { setIsPremium, setPracticeTestsToday, setLastPracticeTestDate, setLastBigTestAt } = setters;
  if (typeof snapshot.is_premium === "boolean" && setIsPremium) {
    setIsPremium(snapshot.is_premium);
  }
  if (snapshot.practice_tests_today != null && setPracticeTestsToday) {
    setPracticeTestsToday(Number(snapshot.practice_tests_today) || 0);
  }
  if ("last_practice_test_date" in snapshot && setLastPracticeTestDate) {
    setLastPracticeTestDate(snapshot.last_practice_test_date ?? null);
  }
  if ("last_big_test_at" in snapshot && setLastBigTestAt) {
    setLastBigTestAt(snapshot.last_big_test_at ?? null);
  }
}
