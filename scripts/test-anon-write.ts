import path from "path";
import { PGlite } from "@electric-sql/pglite";

async function runAnonWriteTest() {
  console.log("================================================================================");
  console.log("🚫 RUNNING WRITE-AS-ANON POSTGRESQL RLS REJECTION TEST");
  console.log("================================================================================");
  const dbDir = path.resolve(process.cwd(), "data/postgres");
  const pglite = new PGlite(dbDir);

  // Switch role to unprivileged anonymous public visitor
  console.log("\n[Step 1] Executing 'SET ROLE anon;' in PostgreSQL...");
  await pglite.exec("SET ROLE anon;");

  // Attempt 1: Unauthorized INSERT into students
  console.log("\n[Test 1] Attempting INSERT into public.students as role 'anon'...");
  let insertBlocked = false;
  try {
    await pglite.query(`
      INSERT INTO public.students (student_id_number, full_name_en, full_name_ar, national_id, email)
      VALUES ('STU-ANON-INJECT', 'Unauthorized Student', 'طالب غير مصرح به', '00000000000000', 'unauth@attacker.com');
    `);
    console.error("❌ CRITICAL SECURITY VULNERABILITY: INSERT as role 'anon' succeeded!");
  } catch (error: any) {
    insertBlocked = true;
    console.log(`✅ PASS: PostgreSQL strictly rejected INSERT as anon:`);
    console.log(`         Error Message: "${error.message}" (Code: ${error.code})`);
  }

  // Attempt 2: Unauthorized UPDATE into credentials
  console.log("\n[Test 2] Attempting UPDATE on public.credentials as role 'anon'...");
  let updateBlocked = false;
  try {
    await pglite.query(`
      UPDATE public.credentials SET status = 'active' WHERE credential_number = 'CAM-2026-000186';
    `);
    console.error("❌ CRITICAL SECURITY VULNERABILITY: UPDATE as role 'anon' succeeded!");
  } catch (error: any) {
    updateBlocked = true;
    console.log(`✅ PASS: PostgreSQL strictly rejected UPDATE as anon:`);
    console.log(`         Error Message: "${error.message}" (Code: ${error.code})`);
  }

  // Attempt 3: Unauthorized DELETE from programs
  console.log("\n[Test 3] Attempting DELETE from public.programs as role 'anon'...");
  let deleteBlocked = false;
  try {
    await pglite.query(`
      DELETE FROM public.programs WHERE code = 'EMBA-701';
    `);
    console.error("❌ CRITICAL SECURITY VULNERABILITY: DELETE as role 'anon' succeeded!");
  } catch (error: any) {
    deleteBlocked = true;
    console.log(`✅ PASS: PostgreSQL strictly rejected DELETE as anon:`);
    console.log(`         Error Message: "${error.message}" (Code: ${error.code})`);
  }

  // Reset role
  await pglite.exec("RESET ROLE;");
  await pglite.close();

  if (insertBlocked && updateBlocked && deleteBlocked) {
    console.log("\n================================================================================");
    console.log("🎉 ALL WRITE-AS-ANON OPERATIONS STRICTLY REJECTED BY POSTGRESQL RLS!");
    console.log("================================================================================");
  } else {
    process.exit(1);
  }
}

runAnonWriteTest().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
