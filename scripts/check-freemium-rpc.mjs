import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const env = {};
for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const i = t.indexOf("=");
  if (i < 0) continue;
  env[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
}

const admin = createClient(
  env.VITE_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY
);

for (const fn of ["start_practice_test", "start_big_test"]) {
  const { data, error } = await admin.rpc(fn);
  const msg = error?.message || "ok";
  if (/Could not find the function/i.test(msg)) {
    console.log(fn + ": MISSING");
  } else {
    console.log(fn + ": OK — " + msg.slice(0, 120));
    if (data) console.log("  data:", JSON.stringify(data).slice(0, 120));
  }
}
