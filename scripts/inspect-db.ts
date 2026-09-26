import { PGlite } from '@electric-sql/pglite';
import path from 'path';

async function check() {
  const dbDir = path.resolve(process.cwd(), 'data/postgres');
  const db = new PGlite(dbDir);
  
  const versionRes = await db.query('SELECT version();');
  console.log('--- POSTGRES ENGINE VERSION ---');
  console.log((versionRes.rows[0] as { version: string }).version);

  const tablesRes = await db.query(`
    SELECT tablename, rowsecurity 
    FROM pg_tables 
    WHERE schemaname = 'public' 
    ORDER BY tablename;
  `);
  console.log('\n--- PUBLIC TABLES & RLS STATUS ---');
  console.table(tablesRes.rows);

  const polRes = await db.query(`
    SELECT tablename, policyname, permissive, roles, cmd 
    FROM pg_policies 
    WHERE schemaname = 'public' 
    ORDER BY tablename, policyname;
  `);
  console.log('\n--- ROW LEVEL SECURITY POLICIES ---');
  console.table(polRes.rows);

  await db.close();
}

check().catch(console.error);
