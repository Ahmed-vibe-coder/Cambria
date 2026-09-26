import fs from "fs";
import path from "path";
import { PGlite } from "@electric-sql/pglite";

async function exportSeedSql() {
  const dbDir = path.resolve(process.cwd(), "data/postgres");
  const db = new PGlite(dbDir);

  const tables = [
    "programs",
    "templates",
    "students",
    "credentials",
    "credential_documents",
    "document_versions",
    "staff_users",
  ];

  let sqlOutput = `-- ============================================================================
-- CAMBRIA INTERNATIONAL COLLEGE PLATFORM — SEED DATA
-- Version: seed.sql
-- Generated for Supabase Cloud Database Provisioning
-- ============================================================================

-- Disable triggers temporarily during bulk insert
SET session_replication_role = 'replica';

`;

  for (const table of tables) {
    const res = await db.query(`SELECT * FROM ${table};`);
    const rows = res.rows as any[];
    if (rows.length === 0) continue;

    sqlOutput += `-- ----------------------------------------------------------------------------\n`;
    sqlOutput += `-- Table: ${table} (${rows.length} rows)\n`;
    sqlOutput += `-- ----------------------------------------------------------------------------\n`;

    for (const row of rows) {
      const columns = Object.keys(row);
      const values = columns.map((col) => {
        const val = row[col];
        if (val === null || val === undefined) return "NULL";
        if (typeof val === "boolean") return val ? "true" : "false";
        if (typeof val === "number") return val.toString();
        if (val instanceof Date) {
          return `'${val.toISOString()}'`;
        }
        if (typeof val === "object") {
          return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
        }
        // string / dates
        return `'${String(val).replace(/'/g, "''")}'`;
      });

      sqlOutput += `INSERT INTO public.${table} (${columns.join(", ")})\n`;
      sqlOutput += `VALUES (${values.join(", ")})\n`;
      sqlOutput += `ON CONFLICT (id) DO NOTHING;\n\n`;
    }
  }

  // Add storage bucket creation & policies
  sqlOutput += `-- ----------------------------------------------------------------------------
-- Storage Bucket & Security Policies: documents
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  10485760,
  ARRAY['application/pdf', 'image/png', 'image/jpeg']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 10485760;

-- Storage RLS: authenticated staff can manage documents
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Staff manage documents'
  ) THEN
    CREATE POLICY "Staff manage documents"
      ON storage.objects FOR ALL
      TO authenticated
      USING (bucket_id = 'documents')
      WITH CHECK (bucket_id = 'documents');
  END IF;
END $$;

-- Re-enable triggers
SET session_replication_role = 'origin';

-- End of seed.sql
`;

  const targetPath = path.resolve(process.cwd(), "supabase/seed.sql");
  fs.writeFileSync(targetPath, sqlOutput, "utf-8");
  console.log(`✅ Successfully generated ${targetPath} (${sqlOutput.length} bytes)`);
}

exportSeedSql().catch(console.error);
