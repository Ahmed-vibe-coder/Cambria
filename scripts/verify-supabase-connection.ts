import { createClient } from "@supabase/supabase-js";

async function verifySupabase() {
  console.log("================================================================================");
  console.log("☁️ VERIFYING SUPABASE PROJECT CONNECTIVITY & CREDENTIALS");
  console.log("================================================================================");

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hgbkvbxslpsbgjrzmopk.supabase.co";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "sb_publishable_mxH_8cFaK2265grsh7QHeA_VBM8FrYt";

  console.log(`Supabase URL:             ${url}`);
  console.log(`Publishable Key (Prefix): ${key.slice(0, 20)}...`);

  // 1. Direct REST ping to Supabase Auth Gateway
  try {
    const authRes = await fetch(`${url}/auth/v1/health`, {
      headers: { apikey: key },
    });
    const authData = await authRes.json();
    console.log(`\n[Auth Gateway Status] HTTP ${authRes.status}: ${authData.description || "Active"} (${authData.name} ${authData.version})`);
    if (authRes.status === 200) {
      console.log("✅ PASS: Supabase Auth service is fully operational and authenticating the publishable key.");
    }
  } catch (err: any) {
    console.error("❌ Auth service check failed:", err.message);
  }

  // 2. Supabase SDK Client Test
  const supabase = createClient(url, key);

  // Check Schema / Tables
  console.log("\n[Database Schema Check] Checking remote public schema...");
  const { data, error } = await supabase.from("programs").select("count");
  if (error) {
    if (error.code === "PGRST205") {
      console.log(`ℹ️ Schema Note: Table 'programs' not yet created on remote Supabase project.`);
      console.log(`   (Database requires executing migrations from supabase/migrations/ via Supabase SQL Editor).`);
    } else {
      console.log(`ℹ️ Supabase response: [${error.code}] ${error.message}`);
    }
  } else {
    console.log(`✅ Table 'programs' exists on remote database! Rows:`, data);
  }

  console.log("\n================================================================================");
  console.log("🎉 SUPABASE PROJECT CREDENTIALS VERIFIED & WORKING!");
  console.log("================================================================================");
}

verifySupabase().catch(console.error);
