import { runDailyReminders } from "../../lib/email/sendDailyReminders.js";

/**
 * Vercel Cron → daily reminder e-mails (Resend).
 * Auth: Authorization: Bearer ${CRON_SECRET}
 */
export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const cronSecret = process.env.CRON_SECRET;
  const auth = req.headers.authorization || "";
  if (!cronSecret || auth !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const result = await runDailyReminders();
    return res.status(200).json({ ok: true, ...result });
  } catch (e) {
    console.error("daily-reminder failed:", e);
    return res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
}
