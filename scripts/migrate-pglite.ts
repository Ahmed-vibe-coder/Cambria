import { PGlite } from '@electric-sql/pglite';
import fs from 'fs';
import path from 'path';

async function migrate() {
  const dbDir = path.resolve(process.cwd(), 'data/postgres');
  fs.mkdirSync(dbDir, { recursive: true });
  console.log(`[migrate] Connecting to PGlite at ${dbDir}...`);
  const db = new PGlite(dbDir);

  // 1. Create authenticated role if it doesn't exist
  await db.exec(`
    DO $$ 
    BEGIN 
      IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'authenticated') THEN 
        CREATE ROLE authenticated; 
      END IF; 
    END $$;
  `);
  console.log('[migrate] Ensured role "authenticated" exists.');

  // 2. Read migration SQL, stripping extension statements that aren't bundled in standard wasm
  const sqlPath = path.resolve(process.cwd(), 'supabase/migrations/001_initial_schema.sql');
  let sql = fs.readFileSync(sqlPath, 'utf8');

  // Remove CREATE EXTENSION lines since gen_random_uuid() is built-in in Postgres 13+
  sql = sql.replace(/CREATE EXTENSION IF NOT EXISTS "uuid-ossp";/g, '-- uuid-ossp built into PG13+');
  sql = sql.replace(/CREATE EXTENSION IF NOT EXISTS "pgcrypto";/g, '-- pgcrypto built into PG13+');

  console.log('[migrate] Executing schema DDL...');
  await db.exec(sql);
  console.log('[migrate] Migration executed successfully!');

  // Verify tables
  const res = await db.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);
  console.log('[migrate] Public tables in Postgres:');
  for (const row of res.rows) {
    console.log(`  - ${(row as { table_name: string }).table_name}`);
  }

  // Verify RLS is enabled
  const rlsRes = await db.query(`
    SELECT tablename, rowsecurity 
    FROM pg_tables 
    WHERE schemaname = 'public' 
    ORDER BY tablename;
  `);
  console.log('[migrate] Row Level Security (rowsecurity=true means enabled):');
  for (const row of rlsRes.rows) {
    const r = row as { tablename: string; rowsecurity: boolean };
    console.log(`  - ${r.tablename}: RLS = ${r.rowsecurity}`);
  }

  await db.close();
  console.log('[migrate] Database connection closed.');
}

migrate().catch((err) => {
  console.error('[migrate] Migration failed:', err);
  process.exit(1);
});
