import {
  toPublicVerificationView,
  ALLOWED_PUBLIC_VERIFICATION_KEYS,
  RawVerificationInput,
} from "../src/lib/serializers/public-verification";

async function runAllowlistTest() {
  console.log("================================================================================");
  console.log("🛡️ RUNNING AUTOMATED PUBLIC SERIALIZATION ALLOW-LIST SECURITY TEST");
  console.log("================================================================================");

  // Dirty raw input simulating a database join with all sensitive student fields attached
  const dirtyRow: RawVerificationInput = {
    // Legitimate public fields
    credential_number: "CAM-2026-000101",
    verification_token: "tok_7f9a2b1c8e3d4f5a",
    status: "active",
    issue_date: "2026-02-15",
    expiry_date: null,
    revocation_reason: null,
    suspension_reason: null,
    
    // Potentially dangerous nested student row from database join
    student: {
      full_name_en: "Tariq Mansoor Al-Hashimi",
      full_name_ar: "طارق منصور الهاشمي",
      national_id: "29508141209384", // CRITICAL SENSITIVE FIELD
      email: "tariq.alhashimi@email.com", // CRITICAL SENSITIVE FIELD
      phone: "+966 50 123 4567", // CRITICAL SENSITIVE FIELD
      birth_date: "1995-08-14", // CRITICAL SENSITIVE FIELD
      gender: "male",
      nationality: "Saudi",
    },

    // Program metadata
    program: {
      name: "Executive Leadership & Educational Governance",
      name_ar: "القيادة التنفيذية والحوكمة التعليمية",
      degree_level: "professional_masters",
    },

    // Injected malicious/accidental top-level table columns
    national_id: "29508141209384",
    email: "tariq.alhashimi@email.com",
    phone: "+966 50 123 4567",
    birth_date: "1995-08-14",
    password_hash: "scrypt:5f7b8a:9a8b7c6d5e4f3a2b1c",
    mfa_secret: "aes256gcm:iv:tag:ciphertext",
    created_by: "00000000-0000-0000-0000-000000000000",
    internal_admin_notes: "Confidential disciplinary review passed.",
    unallowlisted_extra_column: "leaked_value",

    // Documents
    documents: [
      {
        document_type: "certificate",
        file_path: "/api/documents/tok_7f9a2b1c8e3d4f5a/certificate",
        thumbnail_path: "/api/documents/tok_7f9a2b1c8e3d4f5a/certificate?thumb=true",
      },
    ],
  };

  console.log("[Test 1] Passing dirty database row through toPublicVerificationView()...");
  const result = toPublicVerificationView(dirtyRow);

  console.log("Resulting Object Keys:", Object.keys(result));

  // Check 1: Sensitive fields must NOT exist in the output
  const forbiddenKeys = [
    "national_id",
    "email",
    "phone",
    "birth_date",
    "gender",
    "nationality",
    "password_hash",
    "mfa_secret",
    "created_by",
    "internal_admin_notes",
    "unallowlisted_extra_column",
  ];

  let leakDetected = false;
  for (const key of forbiddenKeys) {
    if (key in result || (result as any)[key] !== undefined) {
      console.error(`❌ CRITICAL SECURITY FAILURE: Forbidden key '${key}' leaked into output!`);
      leakDetected = true;
    }
  }

  if (leakDetected) {
    process.exit(1);
  }
  console.log("✅ PASS: Zero sensitive keys leaked in serialization.");

  // Check 2: Every key in the output must exist in ALLOWED_PUBLIC_VERIFICATION_KEYS
  for (const key of Object.keys(result)) {
    if (!ALLOWED_PUBLIC_VERIFICATION_KEYS.has(key)) {
      console.error(`❌ FAILURE: Output contains unallow-listed key '${key}'`);
      process.exit(1);
    }
  }
  console.log("✅ PASS: Every serialized key is in the strict allow-list.");

  // Check 3: JSON serialization test
  const jsonStr = JSON.stringify(result);
  for (const sensitiveValue of [
    "29508141209384",
    "tariq.alhashimi@email.com",
    "+966 50 123 4567",
    "1995-08-14",
    "scrypt:5f7b8a",
    "Confidential disciplinary review",
  ]) {
    if (jsonStr.includes(sensitiveValue)) {
      console.error(`❌ FAILURE: Stringified JSON contains sensitive value '${sensitiveValue}'`);
      process.exit(1);
    }
  }
  console.log("✅ PASS: Stringified JSON contains 0 occurrences of sensitive values.");

  console.log("================================================================================");
  console.log("🎉 ALL SERIALIZATION ALLOW-LIST SECURITY CHECKS PASSED PERFECTLY!");
  console.log("================================================================================");
}

runAllowlistTest().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
