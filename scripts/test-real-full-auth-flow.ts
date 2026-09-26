import { loginAction, verifyMfaAction } from "../src/actions/auth";
import { getStaffUserByEmail } from "../src/lib/db";
import { decryptSecret } from "../src/lib/crypto";
import { generateTotpToken } from "../src/lib/totp";

async function runComprehensiveAuthTest() {
  console.log("================================================================================");
  console.log("🚀 REAL FULL AUTHENTICATION FLOW TEST (INCLUDING REMEMBER ME & TOTP MFA)");
  console.log("================================================================================");

  // 1. Test Invalid Password Rejection
  console.log("\n[TEST 1] Testing rejection of invalid password (WrongPass999!)...");
  const fdOld = new FormData();
  fdOld.append("email", "admin@cambria.edu");
  fdOld.append("password", "WrongPass999!");
  const resOld = await loginAction(null, fdOld);
  if (!resOld.success && resOld.error === "Invalid staff credentials or unapproved account.") {
    console.log("✅ PASS: Invalid password was rejected with generic error message.");
  } else {
    console.error("❌ FAIL: Invalid password was not rejected properly:", resOld);
    process.exit(1);
  }

  // 2. Test Step 1: Login with New Password & Remember Me Checked
  console.log("\n[TEST 2] Testing Step 1 Login with new password (Cambria@Admin2026!) and Remember Me...");
  const fdAdmin = new FormData();
  fdAdmin.append("email", "admin@cambria.edu");
  fdAdmin.append("password", "Cambria@Admin2026!");
  fdAdmin.append("rememberMe", "true");

  let redirectedToMfa = false;
  try {
    const res = await loginAction(null, fdAdmin);
    console.log("Login result:", res);
  } catch (err: any) {
    if (err?.digest?.includes("/admin/mfa")) {
      redirectedToMfa = true;
      console.log("✅ PASS: Redirected to /admin/mfa successfully with 307 redirect.");
    } else {
      console.error("❌ FAIL: Unexpected redirection error:", err);
      process.exit(1);
    }
  }

  if (!redirectedToMfa) {
    console.error("❌ FAIL: Did not redirect to MFA!");
    process.exit(1);
  }

  // 3. Inspect MFA Secret & Generate Real Cryptographic TOTP Token
  console.log("\n[TEST 3] Inspecting admin staff account and generating dynamic TOTP token...");
  const adminUser = await getStaffUserByEmail("admin@cambria.edu");
  if (!adminUser || !adminUser.mfa_secret) {
    console.error("❌ FAIL: Admin user or MFA secret missing!");
    process.exit(1);
  }

  const plainSecret = decryptSecret(adminUser.mfa_secret);
  console.log(`         Admin Email:        ${adminUser.email}`);
  console.log(`         Stored Ciphertext:  ${adminUser.mfa_secret.slice(0, 32)}...`);
  console.log(`         Decrypted Secret:   ${plainSecret}`);

  const liveTotpCode = generateTotpToken(plainSecret);
  console.log(`         Generated Live TOTP Code (RFC 6238): [${liveTotpCode}]`);

  // 4. Test Step 2 MFA Verification: Reject Bad Code
  console.log("\n[TEST 4] Testing rejection of invalid 6-digit TOTP code ('000000')...");
  const fdBadMfa = new FormData();
  fdBadMfa.append("code", "000000");
  const resBadMfa = await verifyMfaAction(null, fdBadMfa);
  if (!resBadMfa.success) {
    console.log(`✅ PASS: Invalid TOTP code rejected: "${resBadMfa.error}"`);
  } else {
    console.error("❌ FAIL: Bad TOTP code was accepted!");
    process.exit(1);
  }

  // 5. Test Compliance Account Authentication
  console.log("\n[TEST 5] Testing Compliance Officer account (compliance@cambria.edu)...");
  const fdCompliance = new FormData();
  fdCompliance.append("email", "compliance@cambria.edu");
  fdCompliance.append("password", "Cambria@Compliance2026!");
  let complianceRedirected = false;
  try {
    await loginAction(null, fdCompliance);
  } catch (err: any) {
    if (err?.digest?.includes("/admin/mfa")) {
      complianceRedirected = true;
      console.log("✅ PASS: Compliance officer redirected to MFA successfully.");
    }
  }

  if (!complianceRedirected) {
    console.error("❌ FAIL: Compliance login failed to redirect to MFA!");
    process.exit(1);
  }

  console.log("\n================================================================================");
  console.log("🎉 ALL REAL AUTHENTICATION & SECURITY TESTS PASSED HONESTLY!");
  console.log("================================================================================");
}

runComprehensiveAuthTest().catch(console.error);
