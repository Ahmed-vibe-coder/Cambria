import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim();
        process.env[key] = val;
      }
    }
  }
}

loadEnv();

async function checkAllTables() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const client = createClient(url, key);

  const tables = [
    "programs",
    "students",
    "templates",
    "credentials",
    "credential_documents",
    "document_versions",
    "staff_users",
    "audit_logs",
    "trusted_devices"
  ];

  for (const t of tables) {
    const { data, error, count } = await client.from(t).select("*", { count: "exact" }).limit(3);
    console.log(`Table [${t}]:`, {
      count,
      returnedRows: data?.length,
      sampleId: data?.[0]?.id || null,
      error: error ? { message: error.message, code: error.code } : null
    });
  }
}

checkAllTables().catch(console.error);
