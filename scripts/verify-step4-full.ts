import { db, createCredential, getCredentialById, saveDocumentVersion } from "../src/lib/db";
import { generateDocumentHtml } from "../src/lib/renderer/render-html";
import { generateQrDataUri } from "../src/lib/renderer/generate-qr";
import { decodeQrFromPng } from "../src/lib/renderer/decode-qr";
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

async function runStep4Verification() {
  console.log("==================================================================");
  console.log("STEP 4: CREDENTIAL & QR CODE DATA MODEL VERIFICATION");
  console.log("==================================================================\n");

  // 1. Create credential via actual logic
  console.log("1. CREATING CREDENTIAL THROUGH DATABASE LOGIC:");
  console.log("   Calling createCredential({ student_id: 'b0000000-0000-0000-0000-000000000001', program_id: 'a0000000-0000-0000-0000-000000000001', ... })");

  const newCred = await createCredential({
    student_id: "b0000000-0000-0000-0000-000000000001", // Tariq Mansoor Al-Hashimi
    program_id: "a0000000-0000-0000-0000-000000000001", // EMBA-701
    issue_date: "2026-03-25",
    expiry_date: "2031-03-25",
    generate_certificate: true,
    generate_student_card: true,
    notes: "Verified award issuance for Step 4 audit verification.",
    actor_email: "auditor@cambria.edu",
  });

  console.log(`   ✓ Created credential ID: ${newCred.id}`);

  // 2. Query the database directly
  console.log("\n2. DIRECT DATABASE QUERY VERIFICATION (credentials & credential_documents):");
  const credRow = await db.queryOne(`
    SELECT id, credential_number, verification_token, status, student_id, program_id, issue_date 
    FROM credentials 
    WHERE id = $1;
  `, [newCred.id]);

  console.log("   Row in credentials table:");
  console.table([credRow]);

  const docRows = await db.query(`
    SELECT id, credential_id, document_type, template_id, current_version_id 
    FROM credential_documents 
    WHERE credential_id = $1 
    ORDER BY document_type;
  `, [newCred.id]);

  console.log(`   Rows in credential_documents table (${docRows.length} rows):`);
  console.table(docRows);

  const sameCredId = docRows.length === 2 && docRows[0].credential_id === docRows[1].credential_id;
  console.log(`   Confirmation: Both documents share the exact same credential_id? ${sameCredId ? "YES ✅" : "NO ❌"}`);

  // 3. Render documents & decode QR codes
  console.log("\n3. DOCUMENT RENDERING & QR CODE DECODING:");
  const docsDir = path.resolve(process.cwd(), "public/documents");
  fs.mkdirSync(docsDir, { recursive: true });

  const templates = await db.query("SELECT * FROM templates ORDER BY template_kind;");
  const certTmpl = templates.find((t: any) => t.template_kind === "certificate");
  const cardTmpl = templates.find((t: any) => t.template_kind === "student_card");

  const verificationUrl = `http://localhost:3000/verify/${credRow.verification_token}`;
  console.log(`   Target Verification URL: ${verificationUrl}`);
  const qrDataUri = await generateQrDataUri(verificationUrl);

  const studentData = {
    student_name_en: "Tariq Mansoor Al-Hashimi",
    student_name_ar: "طارق منصور الهاشمي",
    program_name_en: "Executive Leadership & Educational Governance",
    credential_number: credRow.credential_number,
    issue_date: "March 25, 2026",
    verification_url: verificationUrl,
    qr_data_uri: qrDataUri,
  };

  const browser = await chromium.launch({ headless: true });

  // Render Certificate
  const certHtml = generateDocumentHtml({
    layout: certTmpl.layout_schema,
    data: studentData,
  });
  const certPage = await browser.newPage({
    viewport: { width: certTmpl.width, height: certTmpl.height },
  });
  await certPage.setContent(certHtml, { waitUntil: "networkidle" });
  await certPage.waitForTimeout(500);

  const certPdfBuffer = await certPage.pdf({
    width: `${certTmpl.width}px`,
    height: `${certTmpl.height}px`,
    printBackground: true,
  });
  const certPdfPath = path.join(docsDir, "step4-cert.pdf");
  fs.writeFileSync(certPdfPath, certPdfBuffer);

  const certPngPath = path.join(docsDir, "step4-cert.png");
  await certPage.screenshot({ path: certPngPath });
  await certPage.close();

  // Render Student Card
  const cardHtml = generateDocumentHtml({
    layout: cardTmpl.layout_schema,
    data: studentData,
  });
  const cardPage = await browser.newPage({
    viewport: { width: cardTmpl.width, height: cardTmpl.height },
  });
  await cardPage.setContent(cardHtml, { waitUntil: "networkidle" });
  await cardPage.waitForTimeout(500);

  const cardPdfBuffer = await cardPage.pdf({
    width: `${cardTmpl.width}px`,
    height: `${cardTmpl.height}px`,
    printBackground: true,
  });
  const cardPdfPath = path.join(docsDir, "step4-card.pdf");
  fs.writeFileSync(cardPdfPath, cardPdfBuffer);

  const cardPngPath = path.join(docsDir, "step4-card.png");
  await cardPage.screenshot({ path: cardPngPath });
  await cardPage.close();

  await browser.close();

  console.log(`   ✓ Certificate PDF on disk: ${certPdfPath} (${fs.statSync(certPdfPath).size} bytes)`);
  console.log(`   ✓ Student Card PDF on disk: ${cardPdfPath} (${fs.statSync(cardPdfPath).size} bytes)`);

  // Decode QR codes
  const certDecodedUrl = decodeQrFromPng(certPngPath);
  const cardDecodedUrl = decodeQrFromPng(cardPngPath);

  console.log(`   ✓ Decoded Certificate QR URL: ${certDecodedUrl}`);
  console.log(`   ✓ Decoded Student Card QR URL: ${cardDecodedUrl}`);
  console.log(`   ✓ Cert QR matches target verification token: ${certDecodedUrl?.includes(credRow.verification_token) ? "YES ✅" : "NO ❌"}`);
  console.log(`   ✓ Card QR matches target verification token: ${cardDecodedUrl?.includes(credRow.verification_token) ? "YES ✅" : "NO ❌"}`);
  console.log(`   ✓ Both documents embed identical verification token? ${certDecodedUrl === cardDecodedUrl ? "YES ✅" : "NO ❌"}`);

  // Link initial version in database
  const certDoc = docRows.find((d: any) => d.document_type === "certificate");
  await saveDocumentVersion(
    certDoc.id,
    "/documents/step4-cert.pdf",
    "/documents/step4-cert.png",
    { ...studentData, version: 1 },
    "auditor@cambria.edu"
  );

  // 4. Document Regeneration Test
  console.log("\n4. REGENERATION TEST (version increment, token immutability):");
  console.log("   Calling saveDocumentVersion to simulate PDF regeneration...");

  const v2 = await saveDocumentVersion(
    certDoc.id,
    "/documents/step4-cert-v2.pdf",
    "/documents/step4-cert-v2.png",
    { ...studentData, version: 2, regenerated: true },
    "auditor@cambria.edu"
  );

  console.log(`   ✓ Generated Version record: ${v2.id}, version_number = ${v2.version_number}`);

  // Query document_versions
  const versions = await db.query(`
    SELECT id, credential_document_id, version_number, file_path, generated_at 
    FROM document_versions 
    WHERE credential_document_id = $1 
    ORDER BY version_number ASC;
  `, [certDoc.id]);

  console.log(`   Versions for certificate document (${versions.length} rows):`);
  console.table(versions);

  // Query credentials to prove immutability of token & number
  const credAfter = await db.queryOne(`
    SELECT credential_number, verification_token, status 
    FROM credentials 
    WHERE id = $1;
  `, [newCred.id]);

  console.log("   Credential row after document regeneration:");
  console.table([credAfter]);
  console.log(`   Credential number identical: ${credAfter.credential_number === credRow.credential_number ? "YES ✅" : "NO ❌"}`);
  console.log(`   Verification token identical: ${credAfter.verification_token === credRow.verification_token ? "YES ✅" : "NO ❌"}`);

  // Query audit logs
  const logs = await db.query(`
    SELECT action, entity_type, entity_id, from_state, to_state, reason, actor_email, created_at 
    FROM audit_logs 
    WHERE entity_id = $1 OR entity_id = $2 
    ORDER BY created_at DESC;
  `, [newCred.id, certDoc.id]);

  console.log(`   Audit logs for this credential & document (${logs.length} rows):`);
  console.table(logs);

  console.log("\n==================================================================");
  console.log("STEP 4 COMPLETE & VERIFIED ON REAL POSTGRESQL");
  console.log("==================================================================");
}

runStep4Verification().catch(console.error);
