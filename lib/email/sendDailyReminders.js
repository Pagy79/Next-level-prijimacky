import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { buildDailyReminderEmail } from "./dailyReminder.js";

const FROM = "Trénink češtiny <info@fachmanka.cz>";
const TZ = "Europe/Prague";

export function pragueDateString(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getTimeZoneOffsetMs(timeZone, date) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts = Object.fromEntries(
    dtf
      .formatToParts(date)
      .filter((p) => p.type !== "literal")
      .map((p) => [p.type, p.value])
  );
  const asUTC = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second)
  );
  return asUTC - date.getTime();
}

/** ISO timestamptz for a Prague-local wall time on today's Prague calendar date. */
export function pragueWallTimeToIso(hour, minute = 0, second = 0, now = new Date()) {
  const dateStr = pragueDateString(now);
  const [y, m, d] = dateStr.split("-").map(Number);
  let utc = Date.UTC(y, m - 1, d, hour, minute, second);
  utc = Date.UTC(y, m - 1, d, hour, minute, second) - getTimeZoneOffsetMs(TZ, new Date(utc));
  utc = Date.UTC(y, m - 1, d, hour, minute, second) - getTimeZoneOffsetMs(TZ, new Date(utc));
  return new Date(utc).toISOString();
}

export function startOfPragueDayIso(now = new Date()) {
  return pragueWallTimeToIso(0, 0, 0, now);
}

/** End of reminder window: 18:00:00 Europe/Prague today. */
export function endOfReminderWindowIso(now = new Date()) {
  return pragueWallTimeToIso(18, 0, 0, now);
}

function inReminderWindow(isoTs, windowStartIso, windowEndIso) {
  if (!isoTs) return false;
  const t = new Date(isoTs).getTime();
  return t >= new Date(windowStartIso).getTime() && t < new Date(windowEndIso).getTime();
}

function wasActiveInWindow(profile, today, attemptUserIds, windowStartIso, windowEndIso) {
  // attempts = completed tests / practice (app table; not test_results)
  if (attemptUserIds.has(profile.id)) return true;
  // started practice today (freemium counter date)
  if (profile.last_practice_test_date === today) return true;
  // big mock started today before 18:00 Prague
  if (inReminderWindow(profile.last_big_test_at, windowStartIso, windowEndIso)) return true;
  return false;
}

/**
 * Send Reminder e-mails via Resend to opted-in users with no activity
 * between 00:00 and 18:00 Europe/Prague today.
 */
export async function runDailyReminders(env = process.env) {
  const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  const resendKey = env.RESEND_API_KEY;
  const appUrl = env.APP_URL || (env.VERCEL_URL ? `https://${env.VERCEL_URL}` : "");

  if (!supabaseUrl || !serviceKey) {
    throw new Error("Missing VITE_SUPABASE_URL / SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  if (!resendKey) {
    throw new Error("Missing RESEND_API_KEY");
  }
  if (!appUrl) {
    throw new Error("Missing APP_URL");
  }

  const admin = createClient(supabaseUrl, serviceKey);
  const resend = new Resend(resendKey);
  const today = pragueDateString();
  const windowStartIso = startOfPragueDayIso();
  const windowEndIso = endOfReminderWindowIso();

  const { data: profiles, error: profilesError } = await admin
    .from("profiles")
    .select("id, email, nickname, last_practice_test_date, last_big_test_at")
    .eq("notifications_enabled", true)
    .not("email", "is", null);

  if (profilesError) {
    throw new Error(`profiles query failed: ${profilesError.message}`);
  }

  const list = (profiles || []).filter((p) => {
    const email = String(p.email || "").trim();
    return email.includes("@") && email.includes(".");
  });

  if (list.length === 0) {
    return {
      today,
      windowStartIso,
      windowEndIso,
      scanned: 0,
      skippedActive: 0,
      sent: 0,
      failed: 0,
      errors: [],
    };
  }

  const ids = list.map((p) => p.id);

  // App stores completed runs in `attempts` (there is no `test_results` table).
  const { data: attemptsInWindow, error: attemptsError } = await admin
    .from("attempts")
    .select("user_id")
    .in("user_id", ids)
    .gte("created_at", windowStartIso)
    .lt("created_at", windowEndIso);

  if (attemptsError) {
    console.warn("attempts query failed (continuing with profile dates):", attemptsError.message);
  }

  const attemptUserIds = new Set((attemptsInWindow || []).map((a) => a.user_id));

  let skippedActive = 0;
  let sent = 0;
  let failed = 0;
  const errors = [];

  for (const profile of list) {
    if (wasActiveInWindow(profile, today, attemptUserIds, windowStartIso, windowEndIso)) {
      skippedActive += 1;
      continue;
    }

    const { subject, html, text } = buildDailyReminderEmail({
      nickname: profile.nickname,
      appUrl,
    });

    try {
      const { error } = await resend.emails.send({
        from: FROM,
        to: profile.email,
        subject,
        html,
        text,
      });
      if (error) {
        failed += 1;
        errors.push({ email: profile.email, message: error.message || String(error) });
      } else {
        sent += 1;
      }
    } catch (e) {
      failed += 1;
      errors.push({ email: profile.email, message: e?.message || String(e) });
    }
  }

  return {
    today,
    windowStartIso,
    windowEndIso,
    scanned: list.length,
    skippedActive,
    sent,
    failed,
    errors: errors.slice(0, 20),
  };
}
