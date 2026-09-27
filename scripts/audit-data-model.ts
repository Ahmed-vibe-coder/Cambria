import { db, getCredentials, getCredentialById, getAuditLogs, updateCredentialStatus } from "../src/lib/db";

async function auditDataModel() {
  console.log("=== Testing Data Model via db.ts ===");

  // 1. Query credentials with both certificate and student_card
  const creds = await getCredentials();
  console.log(`Total credentials: ${creds.length}`);

  for (const c of creds) {
    console.log(`\nCredential: ${c.credential_number} (ID: ${c.id})`);
    console.log(`  Token: ${c.verification_token}`);
    console.log(`  Status: ${c.status}`);
    console.log(`  Documents (${c.documents?.length || 0}):`);
    c.documents?.forEach(d => {
      console.log(`    - Type: ${d.document_type}, ID: ${d.id}, Versions: ${d.versions?.length || 0}, CurrentVersion: ${d.current_version_id || 'none'}`);
    });
  }

  // 2. Query PGlite directly if available
  try {
    const pgCreds = await db.query(`
      SELECT c.id, c.credential_number, c.verification_token, c.status,
             cd.id as doc_id, cd.document_type, cd.file_path
      FROM credentials c
      LEFT JOIN credential_documents cd ON cd.credential_id = c.id
      ORDER BY c.credential_number;
    `);
    console.log("\nDirect DB query result count:", pgCreds.length);
    console.log("Direct DB rows:", JSON.stringify(pgCreds, null, 2));
  } catch (e) {
    console.log("Direct PGlite query note:", e);
  }

  // 3. Test lifecycle transitions and audit logs
  console.log("\n=== Testing Lifecycle & Audit Log ===");
  if (creds.length > 0) {
    const target = creds[0];
    const initialStatus = target.status;
    console.log(`Target credential ${target.credential_number} initial status: ${initialStatus}`);

    // Transition to suspended
    const actor = { id: "00000000-0000-0000-0000-000000000001", email: "audit-tester@cambria.edu" };
    const updated = await updateCredentialStatus(
      target.id,
      "suspended",
      "Compliance audit pause test",
      actor.email,
      actor.id
    );
    console.log(`Updated status: ${updated?.status}`);

    // Check audit logs
    const logs = await getAuditLogs();
    const latestLog = logs[0];
    console.log("Latest Audit Log:", {
      action: latestLog?.action,
      from_state: latestLog?.from_state,
      to_state: latestLog?.to_state,
      reason: latestLog?.reason,
      actor_email: latestLog?.actor_email,
      created_at: latestLog?.created_at
    });

    // Restore status
    await updateCredentialStatus(target.id, initialStatus, "Restore initial state after audit test", actor.email, actor.id);
    console.log(`Restored target credential to ${initialStatus}`);
  }
}

auditDataModel().catch(console.error);
