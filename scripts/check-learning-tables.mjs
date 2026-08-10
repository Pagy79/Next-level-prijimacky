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
const sb = createClient(env.VITE_SUPABASE_URL, key);

let ok = true;
for (const table of ["attempts", "attempt_answers", "profiles"]) {
  const { error } = await sb.from(table).select("id").limit(1);
  if (
    error &&
    (error.code === "PGRST205" ||
      error.message?.includes("Could not find the table") ||
      error.message?.includes("does not exist"))
  ) {
    console.log(`FAIL ${table}: missing`);
    ok = false;
  } else if (error) {
    console.log(`WARN ${table}: ${error.message}`);
  } else {
    console.log(`OK   ${table}`);
  }
}
process.exit(ok ? 0 : 2);
