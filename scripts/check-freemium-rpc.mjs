import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

function loadEnv() {
  const env = {};
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    env[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

const env = loadEnv();
const key = env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY;
const admin = createClient(env.VITE_SUPABASE_URL, key);

console.log("has_service_role:", !!env.SUPABASE_SERVICE_ROLE_KEY);
console.log("has_db_url:", !!(env.DATABASE_URL || env.SUPABASE_DB_URL || env.POSTGRES_URL));
console.log("has_access_token:", !!env.SUPABASE_ACCESS_TOKEN);

for (const fn of ["start_practice_test", "start_big_test"]) {
  const { data, error } = await admin.rpc(fn);
  const msg = error?.message || "ok";
  console.log(fn + ":", msg.slice(0, 160));
  if (data) console.log("  data:", JSON.stringify(data).slice(0, 160));
}
