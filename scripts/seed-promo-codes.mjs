/**
 * Seed one-time promo codes (requires table from supabase-activate-promo.sql).
 * Usage: node scripts/seed-promo-codes.mjs
 */
import { readFileSync, existsSync } from "fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  const env = {};
  for (const path of [".env.local", ".env.vercel.production"]) {
    if (!existsSync(path)) continue;
    for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i < 0) continue;
      const k = t.slice(0, i).trim();
      let v = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
      if (v === "[SENSITIVE]") continue;
      if (!(k in env)) env[k] = v;
    }
  }
  return env;
}

function normalize(code) {
  return String(code || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

const env = loadEnv();
const url = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const listPath = "scripts/promo-codes-once.txt";
if (!existsSync(listPath)) {
  console.error("Missing", listPath);
  process.exit(1);
}

const rows = [];
for (const line of readFileSync(listPath, "utf8").split(/\r?\n/)) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  if (t.startsWith("TEST") || t.startsWith("MARKETING")) continue;
  const display = t;
  const code = normalize(display);
  if (!code) continue;
  const label = rows.length === 0 ? "test" : "marketing";
  rows.push({ code, code_display: display, label });
}

if (rows.length !== 11) {
  console.error("Expected 11 codes, got", rows.length);
  process.exit(1);
}

const admin = createClient(url, key);

const { error: tableErr } = await admin.from("promo_codes").select("id").limit(1);
if (tableErr) {
  console.error("Table promo_codes not ready:", tableErr.message);
  console.error("Nejdřív spusť scripts/supabase-activate-promo.sql v Supabase SQL Editoru.");
  process.exit(1);
}

const { data, error } = await admin.from("promo_codes").upsert(rows, {
  onConflict: "code",
  ignoreDuplicates: true,
});
if (error) {
  console.error("Seed failed:", error.message);
  process.exit(1);
}

const { count } = await admin
  .from("promo_codes")
  .select("*", { count: "exact", head: true });

console.log("Seeded/ensured", rows.length, "codes. Table rows:", count);
for (const r of rows) {
  console.log(`  ${r.code_display}  [${r.label}]`);
}
console.log("R2D2C3PO is retired (not in table).");
