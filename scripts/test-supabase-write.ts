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

async function testSupabaseWrite() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const client = createClient(url, key);

  console.log("Testing write with key:", key.slice(0, 15) + "...");
  const testId = "99999999-9999-9999-9999-999999999999";
  const { data, error } = await client.from("programs").insert({
    id: testId,
    code: "TEST-PROG-01",
    name: "Test Persistence Program",
    name_ar: "برنامج اختبار الثبات",
    degree_level: "training_course",
    duration: "1 week",
    credits: 1,
    is_active: true
  }).select();

  console.log("Insert result:", { data, error });

  if (!error) {
    // Read it back
    const read = await client.from("programs").select("*").eq("id", testId);
    console.log("Read back result:", read);
    // Cleanup
    await client.from("programs").delete().eq("id", testId);
  }
}

testSupabaseWrite().catch(console.error);
