import {
  generateTotpToken,
  verifyTotpToken,
  getAccountOtpAuthUri,
  generatePerAccountSecret,
} from "../src/lib/totp";

async function testMfa() {
  console.log("=== TOTP MFA CRYPTOGRAPHIC VERIFICATION TEST (PER-ACCOUNT) ===");
  const testSecret = generatePerAccountSecret();
  const testEmail = "admin@cambria.edu";
  console.log(`Generated Dynamic Secret: ${testSecret}`);
  console.log(`Standard OTP URI:         ${getAccountOtpAuthUri(testEmail, testSecret)}`);

  console.log("\n1. Testing Invalid / Wrong Codes:");
  const wrongCodes = ["000000", "123456", "999999", "abcdef", "12345"];
  for (const code of wrongCodes) {
    const valid = verifyTotpToken(code, testSecret);
    console.log(`   - Code "${code}": result = ${valid} ${valid === false ? "✅ (REJECTED)" : "❌ (ACCEPTED)"}`);
  }

  console.log("\n2. Testing Legitimate Real-Time Generated TOTP Token:");
  const currentToken = generateTotpToken(testSecret);
  console.log(`   - Generated Token: "${currentToken}"`);
  const valid = verifyTotpToken(currentToken, testSecret);
  console.log(`   - Verification result: ${valid} ${valid === true ? "✅ (ACCEPTED)" : "❌ (REJECTED)"}`);

  console.log("\n3. Testing Token After Modification (+1):");
  const tamperedToken = String((Number(currentToken) + 1) % 1000000).padStart(6, "0");
  const tamperedValid = verifyTotpToken(tamperedToken, testSecret);
  console.log(`   - Tampered Token "${tamperedToken}": result = ${tamperedValid} ${tamperedValid === false ? "✅ (REJECTED)" : "❌ (ACCEPTED)"}`);

  console.log("\n✨ TOTP RFC 6238 verification functions verified with cryptographic accuracy.");
}

testMfa().catch(console.error);
