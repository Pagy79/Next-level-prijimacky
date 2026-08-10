/**
 * Ověří, že Supabase projekt má vše potřebné pro Next-level-prijimacky.
 *
 * Použití:
 *   1. Vytvoř .env.local s VITE_SUPABASE_URL a VITE_SUPABASE_ANON_KEY
 *   2. (volitelně) SUPABASE_SERVICE_ROLE_KEY pro audit schématu a RPC
 *   3. node scripts/verify-supabase.mjs
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnv() {
  const envPath = resolve(root, ".env.local");
  if (!existsSync(envPath)) {
    console.error("❌ Chybí .env.local — vytvoř soubor s VITE_SUPABASE_URL a VITE_SUPABASE_ANON_KEY");
    process.exit(1);
  }
  const env = {};
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

const REQUIRED_PROFILE_COLUMNS = [
  { name: "id", type: "uuid", notes: "PK, FK na auth.users" },
  { name: "nickname", type: "text", notes: "Přezdívka uživatele" },
  { name: "email", type: "text", notes: "E-mail (volitelně sync z auth)" },
  { name: "notifications_enabled", type: "boolean", notes: "Push notifikace zap/vyp" },
  { name: "is_premium", type: "boolean", notes: "Freemium / premium stav" },
  { name: "practice_tests_today", type: "integer", notes: "Počet krátkých testů dnes" },
  { name: "last_practice_test_date", type: "date", notes: "Datum posledního krátkého testu" },
  { name: "last_big_test_at", type: "timestamptz", notes: "Čas posledního velkého testu" },
];

function ok(msg) {
  console.log(`✅ ${msg}`);
}
function warn(msg) {
  console.log(`⚠️  ${msg}`);
}
function fail(msg) {
  console.log(`❌ ${msg}`);
}

async function main() {
  const env = loadEnv();
  const url = env.VITE_SUPABASE_URL;
  const anonKey = env.VITE_SUPABASE_ANON_KEY;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !anonKey) {
    fail("V .env.local chybí VITE_SUPABASE_URL nebo VITE_SUPABASE_ANON_KEY");
    process.exit(1);
  }

  console.log("\n🔍 Supabase audit — Next-level-prijimacky\n");
  console.log(`Project URL: ${url}\n`);

  const anon = createClient(url, anonKey);
  const admin = serviceKey ? createClient(url, serviceKey) : null;

  // 1) Základní konektivita
  try {
    const { error } = await anon.from("profiles").select("id").limit(1);
    if (error?.code === "42P01") {
      fail('Tabulka "profiles" neexistuje');
    } else if (error?.message?.includes("Invalid API key")) {
      fail("Neplatný anon key");
      process.exit(1);
    } else if (error?.code === "PGRST116" || error?.message?.includes("0 rows")) {
      ok('Tabulka "profiles" existuje a je čitelná (anon key funguje)');
    } else if (error) {
      warn(`Tabulka profiles: ${error.message} (code: ${error.code})`);
    } else {
      ok('Tabulka "profiles" existuje a je čitelná');
    }
  } catch (e) {
    fail(`Nepodařilo se připojit: ${e.message}`);
    process.exit(1);
  }

  // 2) Sloupce tabulky profiles (vyžaduje service role)
  if (admin) {
    const { data, error } = await admin.rpc("verify_supabase_audit_columns").catch(() => ({ data: null, error: { message: "no rpc" } }));

    if (error?.message === "no rpc") {
      // Fallback: zkusit SELECT jednotlivých sloupců
      console.log("\n📋 Kontrola sloupců tabulky profiles:");
      for (const col of REQUIRED_PROFILE_COLUMNS) {
        const { error: colError } = await admin.from("profiles").select(col.name).limit(0);
        if (colError?.message?.includes(col.name) || colError?.code === "42703") {
          fail(`Chybí sloupec: ${col.name} (${col.type}) — ${col.notes}`);
        } else if (colError) {
          warn(`${col.name}: ${colError.message}`);
        } else {
          ok(`${col.name} (${col.type})`);
        }
      }
    }
  } else {
    warn("Bez SUPABASE_SERVICE_ROLE_KEY neověřím sloupce — přidej klíč do .env.local pro úplný audit");
  }

  // 3) RPC delete_user
  console.log("\n🗑️  RPC funkce delete_user:");
  const { error: rpcError } = await anon.rpc("delete_user");
  if (rpcError?.message?.includes("Could not find the function")) {
    fail('RPC "delete_user" neexistuje — smazání účtu v appce nebude fungovat');
  } else if (rpcError?.message?.includes("permission denied") || rpcError?.code === "42501") {
    ok('RPC "delete_user" existuje (přístup odmítnut bez přihlášení — očekávané)');
  } else if (rpcError?.message?.includes("JWT") || rpcError?.message?.includes("not authenticated")) {
    ok('RPC "delete_user" existuje (vyžaduje přihlášení — očekávané)');
  } else if (rpcError) {
    warn(`delete_user: ${rpcError.message}`);
  } else {
    ok('RPC "delete_user" existuje');
  }

  // 4) Auth — registrace test (dry run)
  console.log("\n🔐 Auth:");
  const testEmail = `audit-${Date.now()}@invalid.test`;
  const { error: signUpError } = await anon.auth.signUp({
    email: testEmail,
    password: "audit-test-password-123",
  });
  if (signUpError?.message?.includes("Signups not allowed")) {
    warn("Registrace e-mailem je vypnutá — appka podporuje signUp, ale v dashboardu je disabled");
  } else if (signUpError?.message?.includes("Email signups are disabled")) {
    warn("E-mail registrace vypnutá v Auth settings");
  } else if (signUpError) {
    warn(`signUp test: ${signUpError.message}`);
  } else {
    ok("E-mail registrace (signUp) je povolená");
    if (admin) {
      // Smazat testovacího uživatele pokud vznikl
      const { data: users } = await admin.auth.admin.listUsers({ page: 1, perPage: 50 });
      const testUser = users?.users?.find((u) => u.email === testEmail);
      if (testUser) {
        await admin.auth.admin.deleteUser(testUser.id);
        ok("Testovací audit účet smazán");
      }
    }
  }

  // 5) RLS — anonymní UPDATE by měl selhat
  console.log("\n🔒 RLS politiky:");
  const fakeId = "00000000-0000-0000-0000-000000000001";
  const { error: anonUpdateError } = await anon
    .from("profiles")
    .update({ nickname: "hack" })
    .eq("id", fakeId);
  if (anonUpdateError?.code === "42501" || anonUpdateError?.message?.includes("permission") || anonUpdateError?.message?.includes("policy")) {
    ok("RLS blokuje anonymní UPDATE (správně)");
  } else if (!anonUpdateError) {
    warn("Anonymní UPDATE prošel — RLS pravděpodobně není správně nastavené!");
  } else {
    warn(`Anonymní UPDATE: ${anonUpdateError.message}`);
  }

  // 6) Trigger pro nové uživatele (service role)
  if (admin) {
    console.log("\n👤 Auto-vytvoření profilu při registraci:");
    const { count, error: countError } = await admin
      .from("profiles")
      .select("*", { count: "exact", head: true });
    if (countError) {
      warn(`Nelze spočítat profily: ${countError.message}`);
    } else {
      ok(`Tabulka profiles obsahuje ${count ?? 0} řádků`);
      warn("Ručně ověř v SQL Editoru trigger handle_new_user (viz scripts/supabase-audit.sql)");
    }
  }

  // 7) Learning loop tabulky
  console.log("\n📈 Learning loop (attempts / attempt_answers):");
  for (const table of ["attempts", "attempt_answers"]) {
    const { error } = await anon.from(table).select("id").limit(1);
    if (
      error?.code === "42P01" ||
      error?.code === "PGRST205" ||
      error?.message?.includes("does not exist") ||
      error?.message?.includes("Could not find the table")
    ) {
      fail(`Tabulka "${table}" neexistuje — spusť scripts/supabase-learning-loop.sql`);
    } else if (error?.message?.includes("permission") || error?.code === "42501" || error?.code === "PGRST301") {
      ok(`Tabulka "${table}" existuje (anon bez session — očekávané)`);
    } else if (error) {
      warn(`${table}: ${error.message}`);
    } else {
      ok(`Tabulka "${table}" existuje a je čitelná`);
    }
  }

  console.log("\n---\nAudit dokončen. Pro kompletní kontrolu spusť také scripts/supabase-audit.sql v Supabase SQL Editoru.\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
