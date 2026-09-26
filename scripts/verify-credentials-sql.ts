import { PGlite } from "@electric-sql/pglite";
import path from "path";

async function queryCredentials() {
  const dbDir = path.resolve(process.cwd(), "data/postgres");
  const db = new PGlite(dbDir);

  console.log("SQL QUERY: SELECT credential_number, verification_token, status FROM credentials;");
  const res = await db.query("SELECT credential_number, verification_token, status FROM credentials ORDER BY credential_number;");
  console.log(`Total rows returned: ${res.rows.length}`);
  console.table(res.rows);

  await db.close();
}

queryCredentials().catch(console.error);
