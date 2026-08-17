/**
 * Manuální spuštění denních připomínek (stejná logika jako Vercel Cron).
 * Usage: node scripts/run-daily-reminders.mjs
 */
import { readFileSync, existsSync } from "fs";
import { runDailyReminders } from "../lib/email/sendDailyReminders.js";

function loadEnv() {
  const path = ".env.local";
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const key = t.slice(0, i).trim();
    const val = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    if (!(key in process.env)) process.env[key] = val;
  }
}

loadEnv();

const result = await runDailyReminders();
console.log(JSON.stringify(result, null, 2));
if (result.failed > 0) process.exitCode = 1;
