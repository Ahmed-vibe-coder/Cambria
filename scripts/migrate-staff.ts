import fs from "fs";
import path from "path";
import { PGlite } from "@electric-sql/pglite";
import { hashPassword, encryptSecret } from "../src/lib/crypto";
import { generateSecret } from "otplib";

async function applyStaffMigration() {
  console.log("Applying 002_staff_users.sql migration to ./data/postgres ...");
  const dbDir = path.resolve(process.cwd(), "data/postgres");
  const pglite = new PGlite(dbDir);

  const migrationSql = fs.readFileSync(
    path.resolve(process.cwd(), "supabase/migrations/002_staff_users.sql"),
    "utf-8"
  );

  await pglite.exec(migrationSql);
  console.log("✅ Table public.staff_users created with RLS enabled!");

  // Seed two distinct administrative accounts with unique per-user salts and unique MFA secrets
  console.log("\nSeeding administrative accounts with per-user salted passwords and encrypted MFA secrets...");

  // Admin 1: Chief Registrar (admin@cambria.edu)
  const admin1Pass = process.env.INITIAL_ADMIN_PASSWORD || "jnHNd9gd7kx4D4G4NU91Kqx1vsUt9-KH#K9";
  const admin1PasswordHash = hashPassword(admin1Pass);
  const admin1Secret = generateSecret();
  const admin1EncryptedSecret = encryptSecret(admin1Secret);

  // Admin 2: Compliance Officer (compliance@cambria.edu)
  const admin2Pass = process.env.INITIAL_COMPLIANCE_PASSWORD || "WTdWEKpWMITwfgHeOm_3oBxOcB_1t0-v";
  const admin2PasswordHash = hashPassword(admin2Pass);
  const admin2Secret = generateSecret();
  const admin2EncryptedSecret = encryptSecret(admin2Secret);

  // Upsert Admin 1
  await pglite.query(`
    INSERT INTO staff_users (email, full_name, role, password_hash, mfa_secret, mfa_enrolled)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (email) DO UPDATE SET
      password_hash = EXCLUDED.password_hash,
      mfa_secret = EXCLUDED.mfa_secret,
      mfa_enrolled = EXCLUDED.mfa_enrolled;
  `, [
    "admin@cambria.edu",
    "Chief Registrar",
    "super_admin",
    admin1PasswordHash,
    admin1EncryptedSecret,
    true,
  ]);

  // Upsert Admin 2
  await pglite.query(`
    INSERT INTO staff_users (email, full_name, role, password_hash, mfa_secret, mfa_enrolled)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (email) DO UPDATE SET
      password_hash = EXCLUDED.password_hash,
      mfa_secret = EXCLUDED.mfa_secret,
      mfa_enrolled = EXCLUDED.mfa_enrolled;
  `, [
    "compliance@cambria.edu",
    "Compliance Officer",
    "compliance",
    admin2PasswordHash,
    admin2EncryptedSecret,
    true,
  ]);

  console.log("✅ Seeded Admin 1: admin@cambria.edu");
  console.log("   Password Hash:", admin1PasswordHash);
  console.log("   MFA Secret (Encrypted at rest):", admin1EncryptedSecret);

  console.log("✅ Seeded Admin 2: compliance@cambria.edu");
  console.log("   Password Hash:", admin2PasswordHash);
  console.log("   MFA Secret (Encrypted at rest):", admin2EncryptedSecret);

  // Verify rows
  const rows = await pglite.query("SELECT id, email, full_name, role, password_hash, mfa_secret, mfa_enrolled FROM staff_users;");
  console.log("\nDatabase Verification Rows (staff_users):", rows.rows);

  await pglite.close();
}

applyStaffMigration().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
