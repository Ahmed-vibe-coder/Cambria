import { PGlite } from "@electric-sql/pglite";
import path from "path";

async function testRls() {
  const dbDir = path.resolve(process.cwd(), "data/postgres");
  const db = new PGlite(dbDir);

  console.log("=== RLS VERIFICATION TEST ON POSTGRESQL ===");

  // 1. Show pg_tables rowsecurity
  console.log("\n1. Verifying Row Level Security is Enabled on All Public Tables:");
  const rlsStatus = await db.query(`
    SELECT tablename, rowsecurity 
    FROM pg_tables 
    WHERE schemaname = 'public' 
    ORDER BY tablename;
  `);
  console.table(rlsStatus.rows);

  // 2. Setup anon role and grants
  await db.exec(`
    DO $$ 
    BEGIN 
      IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'anon') THEN 
        CREATE ROLE anon; 
      END IF; 
    END $$;
    GRANT USAGE ON SCHEMA public TO anon;
    GRANT SELECT ON public.programs TO anon;
    GRANT SELECT ON public.students TO anon;
    GRANT SELECT ON public.credentials TO anon;
  `);

  // 3. Test as anon role
  console.log("\n2. Executing Queries as 'anon' Role (Unauthenticated Public User):");

  await db.exec("SET ROLE anon;");
  const currentRole = await db.query("SELECT current_user;");
  console.log("Current active role:", (currentRole.rows[0] as any).current_user);

  // Query students as anon
  const anonStudents = await db.query("SELECT id, student_id_number, email FROM students;");
  console.log(`\nQuery: SELECT id, student_id_number, email FROM students; (as anon)`);
  console.log(`Rows returned: ${anonStudents.rows.length}`);
  console.table(anonStudents.rows);

  // Query credentials as anon
  const anonCredentials = await db.query("SELECT id, credential_number, status FROM credentials;");
  console.log(`\nQuery: SELECT id, credential_number, status FROM credentials; (as anon)`);
  console.log(`Rows returned: ${anonCredentials.rows.length}`);
  console.table(anonCredentials.rows);

  // Query programs as anon
  const anonPrograms = await db.query("SELECT code, name, is_active FROM programs;");
  console.log(`\nQuery: SELECT code, name, is_active FROM programs; (as anon)`);
  console.log(`Rows returned: ${anonPrograms.rows.length}`);
  console.table(anonPrograms.rows);

  // 4. Reset role to postgres and show all rows exist
  console.log("\n3. Resetting Role to Privileged Postgres User:");
  await db.exec("RESET ROLE;");
  const resetRole = await db.query("SELECT current_user;");
  console.log("Current active role:", (resetRole.rows[0] as any).current_user);

  const privilegedStudents = await db.query("SELECT id, student_id_number, email FROM students;");
  console.log(`Privileged query on students returns: ${privilegedStudents.rows.length} rows`);

  const privilegedCredentials = await db.query("SELECT id, credential_number, status FROM credentials;");
  console.log(`Privileged query on credentials returns: ${privilegedCredentials.rows.length} rows`);

  await db.close();
}

testRls().catch(console.error);
