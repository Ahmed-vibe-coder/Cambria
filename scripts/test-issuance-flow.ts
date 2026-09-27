import {
  createCredential,
  getCredentialByNumber,
  getTemplates,
  getStudents,
  getPrograms,
  saveDocumentVersion,
} from "../src/lib/db";

async function testCredentialIssuance() {
  console.log("=== Testing End-to-End Credential Issuance with Selected Templates ===");

  const students = await getStudents();
  const programs = await getPrograms();
  const templates = await getTemplates();

  const student = students[0];
  const program = programs[0];
  const certTemplate = templates.find((t) => t.template_kind === "certificate" && t.id.includes("0003")) || templates[0];
  const cardTemplate = templates.find((t) => t.template_kind === "student_card") || templates[1];

  console.log(`Candidate: ${student.full_name_en} (${student.id})`);
  console.log(`Program: ${program.name} (${program.id})`);
  console.log(`Certificate Template Selected: ${certTemplate.name} (${certTemplate.id})`);
  console.log(`Card Template Selected: ${cardTemplate.name} (${cardTemplate.id})`);

  const credential = await createCredential({
    student_id: student.id,
    program_id: program.id,
    issue_date: "2026-03-25",
    expiry_date: "2031-03-25",
    notes: "Master audit verification conferral",
    generate_certificate: true,
    generate_student_card: true,
    certificate_template_id: certTemplate.id,
    card_template_id: cardTemplate.id,
  });

  console.log("\n✅ Conferred Credential successfully!");
  console.log(`  Credential ID: ${credential.id}`);
  console.log(`  Credential Number: ${credential.credential_number}`);
  console.log(`  Verification Token: ${credential.verification_token}`);
  console.log(`  Attached Documents (${credential.documents?.length || 0}):`);
  credential.documents?.forEach((d) => {
    console.log(`    - Type: ${d.document_type}, DocID: ${d.id}, TemplateID: ${d.template_id}, Path: ${d.file_path}`);
  });

  // Verify Document Versioning
  const docToVersion = credential.documents![0];
  console.log(`\nTesting versioning on document ${docToVersion.id}...`);
  const version = await saveDocumentVersion(docToVersion.id, {
    file_path: "/documents/audit-cert-v2.pdf",
    thumbnail_path: "/documents/audit-cert-v2-thumb.png",
    metadata_snapshot: { reason: "Regenerated for seal high-resolution update" },
    file_size_bytes: 355646,
    sha256_hash: "a".repeat(64),
  });

  console.log(`✅ Created Document Version v${version.version_number} (ID: ${version.id}) for Doc ${docToVersion.id}`);

  // Re-read credential
  const refreshed = await getCredentialByNumber(credential.credential_number);
  console.log(`\nRe-read credential: ${refreshed?.credential_number}`);
  console.log(`  Token unchanged: ${refreshed?.verification_token === credential.verification_token}`);
  console.log(`  Credential number unchanged: ${refreshed?.credential_number === credential.credential_number}`);
}

testCredentialIssuance().catch(console.error);
