import { getStaffUserByEmail } from "../src/lib/db";
import { decryptSecret } from "../src/lib/crypto";
import { generateTotpToken } from "../src/lib/totp";

async function runPerAdminMfaTest() {
  console.log("================================================================================");
  console.log("🔐 RUNNING PER-ADMIN DYNAMIC MFA & CROSS-ACCOUNT ISOLATION TEST");
  console.log("================================================================================");
  const baseUrl = "http://localhost:3000";

  // Step 1: Database Inspection for Admin A & Admin B
  console.log("\n[Step 1] Inspecting Administrative Accounts in PostgreSQL Database...");
  const adminA = await getStaffUserByEmail("admin@cambria.edu");
  const adminB = await getStaffUserByEmail("compliance@cambria.edu");

  if (!adminA || !adminB) {
    console.error("❌ Both admin accounts must exist in database!");
    process.exit(1);
  }

  console.log("\n--- Admin A Record (Chief Registrar) ---");
  console.log(`Email:                  ${adminA.email}`);
  console.log(`Stored Password Hash:   ${adminA.password_hash}`);
  console.log(`Stored MFA Ciphertext:  ${adminA.mfa_secret}`);
  console.log(`MFA Enrolled:           ${adminA.mfa_enrolled}`);

  console.log("\n--- Admin B Record (Compliance Officer) ---");
  console.log(`Email:                  ${adminB.email}`);
  console.log(`Stored Password Hash:   ${adminB.password_hash}`);
  console.log(`Stored MFA Ciphertext:  ${adminB.mfa_secret}`);
  console.log(`MFA Enrolled:           ${adminB.mfa_enrolled}`);

  // Confirm secrets are encrypted at rest
  if (!adminA.mfa_secret?.startsWith("aes256gcm:") || !adminB.mfa_secret?.startsWith("aes256gcm:")) {
    console.error("❌ FAILURE: MFA secrets are not stored in aes256gcm encrypted format!");
    process.exit(1);
  }
  console.log("\n✅ PASS: Both accounts store MFA secrets strictly encrypted at rest (AES-256-GCM).");

  // Step 2: Decrypt secrets and generate dynamic RFC 6238 codes
  const plainSecretA = decryptSecret(adminA.mfa_secret!);
  const plainSecretB = decryptSecret(adminB.mfa_secret!);

  if (plainSecretA === plainSecretB) {
    console.error("❌ FAILURE: Admin A and Admin B share the same secret!");
    process.exit(1);
  }
  console.log("✅ PASS: Admin A and Admin B have completely independent, unique secrets.");

  const codeA = generateTotpToken(plainSecretA);
  const codeB = generateTotpToken(plainSecretB);

  console.log(`\nDynamic Code A (for ${adminA.email}): [${codeA}]`);
  console.log(`Dynamic Code B (for ${adminB.email}): [${codeB}]`);

  // Step 3: Login as Admin A
  console.log(`\n[Step 2] Authenticating as Admin A (${adminA.email}) with password...`);
  const loginResA = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: adminA.email, password: "Cambria@Admin2026!" }),
  });
  const loginDataA = await loginResA.json();
  const cookiesA = loginResA.headers.get("set-cookie") || "";
  console.log(`         HTTP Status: ${loginResA.status}, Require MFA: ${loginDataA.requireMfa}`);

  // Test 3a: Submit Wrong Code to Admin A
  console.log(`\n[Test 3a] Submitting wrong static code ('987654') to Admin A challenge...`);
  const wrongResA = await fetch(`${baseUrl}/api/auth/mfa`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookiesA,
    },
    body: JSON.stringify({ code: "987654", email: adminA.email }),
  });
  const wrongDataA = await wrongResA.json();
  console.log(`          HTTP Status: ${wrongResA.status}, Error: "${wrongDataA.error}"`);
  if (wrongResA.status === 401) {
    console.log("✅ PASS: Wrong code rejected cryptographically with 401.");
  } else {
    console.error("❌ FAILURE: Wrong code was not rejected!");
    process.exit(1);
  }

  // Test 3b: Submit Admin B's valid code to Admin A's challenge (CROSS-ACCOUNT ISOLATION)
  console.log(`\n[Test 3b] Submitting Admin B's valid code ('${codeB}') to Admin A's challenge (CROSS-ACCOUNT)...`);
  const crossResA = await fetch(`${baseUrl}/api/auth/mfa`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookiesA,
    },
    body: JSON.stringify({ code: codeB, email: adminA.email }),
  });
  const crossDataA = await crossResA.json();
  console.log(`          HTTP Status: ${crossResA.status}, Error: "${crossDataA.error}"`);
  if (crossResA.status === 401) {
    console.log("✅ PASS: Cross-account code strictly rejected! Account B's code cannot unlock Account A.");
  } else {
    console.error("❌ FAILURE: Cross-account code was unexpectedly accepted!");
    process.exit(1);
  }

  // Test 3c: Submit Admin A's own valid code to Admin A's challenge
  console.log(`\n[Test 3c] Submitting Admin A's own valid code ('${codeA}') to Admin A's challenge...`);
  const validResA = await fetch(`${baseUrl}/api/auth/mfa`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookiesA,
    },
    body: JSON.stringify({ code: codeA, email: adminA.email }),
  });
  const validDataA = await validResA.json();
  console.log(`          HTTP Status: ${validResA.status}, Authorized: ${validDataA.success}, User: ${validDataA.user?.fullName}`);
  if (validResA.status === 200 && validDataA.success) {
    console.log("✅ PASS: Admin A authorized successfully with its own unique TOTP code.");
  } else {
    console.error("❌ FAILURE: Admin A failed to authorize with valid code!");
    process.exit(1);
  }

  // Step 4: Login as Admin B
  console.log(`\n[Step 4] Authenticating as Admin B (${adminB.email}) with password...`);
  const loginResB = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: adminB.email, password: "Cambria@Compliance2026!" }),
  });
  const loginDataB = await loginResB.json();
  const cookiesB = loginResB.headers.get("set-cookie") || "";
  console.log(`         HTTP Status: ${loginResB.status}, Require MFA: ${loginDataB.requireMfa}`);

  // Test 4a: Submit Admin A's valid code to Admin B's challenge (CROSS-ACCOUNT ISOLATION)
  console.log(`\n[Test 4a] Submitting Admin A's valid code ('${codeA}') to Admin B's challenge (CROSS-ACCOUNT)...`);
  const crossResB = await fetch(`${baseUrl}/api/auth/mfa`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookiesB,
    },
    body: JSON.stringify({ code: codeA, email: adminB.email }),
  });
  const crossDataB = await crossResB.json();
  console.log(`          HTTP Status: ${crossResB.status}, Error: "${crossDataB.error}"`);
  if (crossResB.status === 401) {
    console.log("✅ PASS: Cross-account code strictly rejected! Account A's code cannot unlock Account B.");
  } else {
    console.error("❌ FAILURE: Cross-account code was unexpectedly accepted!");
    process.exit(1);
  }

  // Test 4b: Submit Admin B's own valid code to Admin B's challenge
  console.log(`\n[Test 4b] Submitting Admin B's own valid code ('${codeB}') to Admin B's challenge...`);
  const validResB = await fetch(`${baseUrl}/api/auth/mfa`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookiesB,
    },
    body: JSON.stringify({ code: codeB, email: adminB.email }),
  });
  const validDataB = await validResB.json();
  console.log(`          HTTP Status: ${validResB.status}, Authorized: ${validDataB.success}, User: ${validDataB.user?.fullName}`);
  if (validResB.status === 200 && validDataB.success) {
    console.log("✅ PASS: Admin B authorized successfully with its own unique TOTP code.");
  } else {
    console.error("❌ FAILURE: Admin B failed to authorize with valid code!");
    process.exit(1);
  }

  console.log("\n================================================================================");
  console.log("🎉 ALL PER-ADMIN MFA & ACCOUNT ISOLATION TESTS PASSED WITH 100% PROOF!");
  console.log("================================================================================");
}

runPerAdminMfaTest().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
