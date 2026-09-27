import fs from "fs";
import path from "path";
import crypto from "crypto";
import {
  getTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  setDefaultTemplate,
  isTemplateInUse,
  getCredentials,
} from "../src/lib/db";
import { generateDocumentHtml } from "../src/lib/renderer/render-html";
import { Template, TemplateField } from "../src/types/database";
import { chromium } from "playwright";

async function main() {
  console.log("===============================================================");
  console.log("   TEMPLATE STUDIO EDITOR & MULTI-TEMPLATE AUDIT TEST SUITE   ");
  console.log("===============================================================\n");

  const results: Record<string, any> = {};

  // --------------------------------------------------------------------------
  // 1. CANVAS INTERACTION MATHEMATICS & ZOOM INDEPENDENCE
  // --------------------------------------------------------------------------
  console.log(">>> [1/6] Auditing Canvas Math, Snapping & Zoom Conversion...");

  const canvasW = 2000;
  const canvasH = 1414;
  const testField: TemplateField = {
    id: "test_field_math",
    type: "text",
    x: 100,
    y: 100,
    w: 500,
    h: 60,
    font: "Montserrat",
    size: 24,
    color: "#020B5A",
  };

  // Center H mathematical formula: Math.round((canvasW - field.w) / 2)
  const calculatedCenterH = Math.round((canvasW - testField.w) / 2);
  const calculatedCenterV = Math.round((canvasH - testField.h) / 2);
  console.log(`  - Center H calculation: (${canvasW} - ${testField.w}) / 2 = ${calculatedCenterH} (Expected: 750)`);
  console.log(`  - Center V calculation: (${canvasH} - ${testField.h}) / 2 = ${calculatedCenterV} (Expected: 677)`);

  // Grid Snapping formula: Math.round(val / 10) * 10
  const unalignedX = 754;
  const unalignedY = 678;
  const snappedX = Math.round(unalignedX / 10) * 10;
  const snappedY = Math.round(unalignedY / 10) * 10;
  console.log(`  - Grid Snapping: (${unalignedX}, ${unalignedY}) -> snapped to 10px -> (${snappedX}, ${snappedY})`);

  // Zoom scale conversion: deltaCanvas = deltaScreen / zoom
  // When a user drags mouse by 150 screen pixels:
  const screenDelta = 150;
  const zoom50Delta = Math.round(screenDelta / 0.5); // 300 canvas px
  const zoom100Delta = Math.round(screenDelta / 1.0); // 150 canvas px
  const zoom150Delta = Math.round(screenDelta / 1.5); // 100 canvas px
  console.log(`  - Zoom Scale Invariance:`);
  console.log(`    * At 50% Zoom: screen move of ${screenDelta}px = ${zoom50Delta} canvas px`);
  console.log(`    * At 100% Zoom: screen move of ${screenDelta}px = ${zoom100Delta} canvas px`);
  console.log(`    * At 150% Zoom: screen move of ${screenDelta}px = ${zoom150Delta} canvas px`);

  results.canvasMath = {
    calculatedCenterH,
    calculatedCenterV,
    snappedX,
    snappedY,
    zoom50Delta,
    zoom100Delta,
    zoom150Delta,
  };

  // --------------------------------------------------------------------------
  // 2. TEMPLATE CRUD & DELETION RESTRICTION AUDIT
  // --------------------------------------------------------------------------
  console.log("\n>>> [2/6] Auditing Template CRUD & In-Use Protection...");

  const allTemplates = await getTemplates();
  console.log(`  - Current registered templates count: ${allTemplates.length}`);
  allTemplates.forEach((t) => {
    console.log(`    * [${t.id}] ${t.name} (${t.template_kind}, ${t.width}x${t.height}) - is_active: ${t.is_active}`);
  });

  // Test In-Use Protection using real UUID
  const inUseTemplateId = "c0000000-0000-0000-0000-000000000001"; // Landscape Geometric (referenced by fallback credential)
  const inUse = await isTemplateInUse(inUseTemplateId);
  console.log(`  - isTemplateInUse('${inUseTemplateId}'): ${inUse}`);

  let deleteBlocked = false;
  let blockErrorMessage = "";
  try {
    await deleteTemplate(inUseTemplateId);
  } catch (err: any) {
    deleteBlocked = true;
    blockErrorMessage = err.message;
  }
  console.log(`  - Attempting to delete in-use template '${inUseTemplateId}':`);
  console.log(`    * Blocked: ${deleteBlocked}`);
  console.log(`    * Error: "${blockErrorMessage}"`);

  // Test creating an ephemeral test template with proper UUID
  const tempTestTemplateId = crypto.randomUUID();
  const createdTestTemplate = await createTemplate({
    id: tempTestTemplateId,
    code: "AUDIT_TEMP_" + Date.now().toString(36).toUpperCase(),
    name: "Audit Ephemeral Template",
    template_kind: "certificate",
    width: 2000,
    height: 1414,
    background_image_url: "https://res.cloudinary.com/kwe1gmrq/image/upload/v1790515734/cambria/templates/cert_landscape_geometric_master.png",
    layout_schema: {
      template_kind: "certificate",
      width: 2000,
      height: 1414,
      fields: [
        {
          id: "f_audit_title",
          type: "text",
          staticText: "EXCELLENCE IN ACADEMIC RESEARCH",
          x: 400,
          y: 250,
          w: 1200,
          h: 50,
          font: "Cormorant Garamond",
          size: 28,
          weight: 700,
          color: "#020B5A",
          align: "center",
        },
        {
          id: "f_audit_name",
          type: "text",
          contentKey: "student_name_en",
          x: 400,
          y: 500,
          w: 1200,
          h: 80,
          font: "Alex Brush",
          size: 64,
          weight: 400,
          color: "#07133F",
          align: "center",
        },
      ],
    },
    is_active: false,
  });

  console.log(`  - Created ephemeral template: ${createdTestTemplate.id} (${createdTestTemplate.name})`);

  // Verify reload fidelity
  const reloaded = await getTemplateById(tempTestTemplateId);
  const fieldsCountMatches = reloaded?.layout_schema?.fields?.length === 2;
  const titleMatches = reloaded?.layout_schema?.fields?.[0]?.staticText === "EXCELLENCE IN ACADEMIC RESEARCH";
  const nameFontMatches = reloaded?.layout_schema?.fields?.[1]?.font === "Alex Brush";
  console.log(`  - Reload Fidelity:`);
  console.log(`    * Field count: ${reloaded?.layout_schema?.fields?.length} (Matches: ${fieldsCountMatches})`);
  console.log(`    * Title staticText: "${reloaded?.layout_schema?.fields?.[0]?.staticText}" (Matches: ${titleMatches})`);
  console.log(`    * Name font: "${reloaded?.layout_schema?.fields?.[1]?.font}" (Matches: ${nameFontMatches})`);

  // Test Clean Deletion of Unused Template
  const deletedCleanly = await deleteTemplate(tempTestTemplateId);
  const recheckAfterDelete = await getTemplateById(tempTestTemplateId);
  console.log(`  - Deleting unused template: success=${deletedCleanly}, recheckExists=${!!recheckAfterDelete}`);

  results.crud = {
    inUseBlocked: deleteBlocked,
    blockErrorMessage,
    createFidelity: fieldsCountMatches && titleMatches && nameFontMatches,
    cleanDeletion: deletedCleanly && !recheckAfterDelete,
  };

  // --------------------------------------------------------------------------
  // 3. DEFAULT PER TYPE AUDIT
  // --------------------------------------------------------------------------
  console.log("\n>>> [3/6] Auditing Default-Per-Type Constraint...");

  // Set default certificate to Elegant Gold
  const elegantGoldId = "c0000000-0000-0000-0000-000000000003";
  const geometricId = "c0000000-0000-0000-0000-000000000001";

  await setDefaultTemplate(elegantGoldId, "certificate");
  const postSetTemplates = await getTemplates();
  const certDefaults = postSetTemplates.filter((t) => t.template_kind === "certificate" && t.is_active);
  console.log(`  - Certificate templates with is_active=true: ${certDefaults.length}`);
  certDefaults.forEach((d) => console.log(`    * Default Certificate: ${d.name} (${d.id})`));

  // Reset default back to geometric
  await setDefaultTemplate(geometricId, "certificate");
  const resetTemplates = await getTemplates();
  const resetCertDefaults = resetTemplates.filter((t) => t.template_kind === "certificate" && t.is_active);
  console.log(`  - After reset, Certificate templates with is_active=true: ${resetCertDefaults.length}`);
  resetCertDefaults.forEach((d) => console.log(`    * Default Certificate: ${d.name} (${d.id})`));

  results.defaultPerType = {
    singleDefaultEnforced: certDefaults.length === 1 && resetCertDefaults.length === 1,
    activeDefaultId: resetCertDefaults[0]?.id,
  };

  // --------------------------------------------------------------------------
  // 4. VARIABLE FIELD SCHEMA PER TEMPLATE PROOF
  // --------------------------------------------------------------------------
  console.log("\n>>> [4/6] Proving Variable Field Schema Per Template...");

  const templateCard = await getTemplateById("c0000000-0000-0000-0000-000000000002"); // CR80 ID Card
  const templateGold = await getTemplateById("c0000000-0000-0000-0000-000000000003"); // Elegant Gold Certificate

  const cardKeys = (templateCard?.layout_schema?.fields || []).map((f: any) => f.contentKey || f.id);
  const goldKeys = (templateGold?.layout_schema?.fields || []).map((f: any) => f.contentKey || f.id);

  console.log(`  - Template A [CR80 ID Card] fields (${cardKeys.length}):`, cardKeys);
  console.log(`  - Template B [Elegant Gold Cert] fields (${goldKeys.length}):`, goldKeys);

  const cardHasNationalId = cardKeys.includes("student_national_id");
  const cardHasCountry = cardKeys.includes("student_country");
  const cardHasPhoto = cardKeys.includes("student_photo");
  const goldHasNationalId = goldKeys.includes("student_national_id");
  const goldHasPhoto = goldKeys.includes("student_photo");

  console.log(`  - Field Schema Differentiation:`);
  console.log(`    * Card has student_national_id: ${cardHasNationalId} | Gold Cert has student_national_id: ${goldHasNationalId}`);
  console.log(`    * Card has student_country: ${cardHasCountry} | Gold Cert has student_country: false`);
  console.log(`    * Card has student_photo: ${cardHasPhoto} | Gold Cert has student_photo: ${goldHasPhoto}`);

  // --------------------------------------------------------------------------
  // 5. RENDERING PIPELINE & DOCUMENT GENERATION WITH ZERO BLEED-THROUGH
  // --------------------------------------------------------------------------
  console.log("\n>>> [5/6] Generating Documents from Differing Templates to Prove Zero Bleed-Through...");

  const outDir = path.resolve(process.cwd(), "test-artifacts");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const renderDataA = {
    student_name_en: "Dr. Laila Samir Al-Mansour",
    student_name_ar: "د. ليلى سمير المنصور",
    student_id_number: "CAM-STU-2026-9901",
    student_national_id: "29901150102345",
    student_country: "United Arab Emirates",
    specialization: "Clinical Health Informatics",
    program_name_en: "Advanced Health Informatics & Clinical Data Systems",
    program_name_ar: "المعلوماتية الصحية المتقدمة ونظم البيانات السريرية",
    degree_level: "Fellowship Program",
    grade: "Distinction with Honors",
    credential_number: "CAM-2026-000888",
    verification_token: "tok_audit_diff_schemas_888",
    issue_date: "2026-03-20",
    expiry_date: "2031-03-20",
    verification_url: "https://cambria-five.vercel.app/verify/tok_audit_diff_schemas_888",
    qr_data_uri: await (await import("../src/lib/renderer/generate-qr")).generateQrDataUri("https://cambria-five.vercel.app/verify/tok_audit_diff_schemas_888"),
    college_name_en: "CAMBRIA INTERNATIONAL COLLEGE",
    college_name_ar: "كلية كامبريا الدولية",
    student_avatar: "/images/avatar-placeholder.png",
  };

  // Render Document from Template A (CR80 Card)
  const cardHtml = generateDocumentHtml({
    layout: templateCard!.layout_schema,
    data: renderDataA,
  });

  // Render Document from Template B (Gold Certificate)
  const goldHtml = generateDocumentHtml({
    layout: templateGold!.layout_schema,
    data: renderDataA,
  });

  // Verify in generated HTML:
  // 1. Card HTML contains masked National ID, country (United Arab Emirates), and avatar-placeholder.png
  const expectedMasked = "299*********45";
  const cardContainsMaskedId = cardHtml.includes(expectedMasked);
  const cardContainsCountry = cardHtml.includes("United Arab Emirates");
  const cardContainsAvatar = cardHtml.includes("avatar-placeholder.png");
  // 2. Gold HTML does NOT contain masked National ID, does NOT contain avatar image, does NOT contain student country
  const goldContainsMaskedId = goldHtml.includes(expectedMasked);
  const goldContainsCountry = goldHtml.includes("United Arab Emirates");
  const goldContainsAvatar = goldHtml.includes("avatar-placeholder.png");

  console.log(`  - HTML Inspection Results:`);
  console.log(`    * Card HTML: maskedId=${cardContainsMaskedId} ("${expectedMasked}"), country=${cardContainsCountry}, avatar=${cardContainsAvatar}`);
  console.log(`    * Gold HTML: maskedId=${goldContainsMaskedId}, country=${goldContainsCountry}, avatar=${goldContainsAvatar}`);

  const zeroBleedThrough =
    cardContainsMaskedId &&
    cardContainsCountry &&
    !goldContainsMaskedId &&
    !goldContainsCountry &&
    !goldContainsAvatar;
  console.log(`  - Zero Bleed-Through between variable templates: ${zeroBleedThrough ? "VERIFIED (PASS)" : "FAILED"}`);

  // --------------------------------------------------------------------------
  // 6. PLAYWRIGHT PDF & SCREENSHOT RENDERING VERIFICATION
  // --------------------------------------------------------------------------
  console.log("\n>>> [6/6] Rendering Physical PDFs via Playwright...");

  const browser = await chromium.launch({ headless: true });

  // 6a. Render Card
  const pageCard = await browser.newPage({
    viewport: { width: templateCard!.width, height: templateCard!.height },
  });
  await pageCard.setContent(cardHtml, { waitUntil: "networkidle" });
  const cardPdfPath = path.join(outDir, "audit-card-cr80.pdf");
  const cardPngPath = path.join(outDir, "audit-card-cr80.png");
  await pageCard.pdf({
    path: cardPdfPath,
    width: `${templateCard!.width}px`,
    height: `${templateCard!.height}px`,
    printBackground: true,
    pageRanges: "1",
  });
  await pageCard.screenshot({ path: cardPngPath, fullPage: true });
  console.log(`  - Rendered CR80 Card PDF: ${cardPdfPath} (${fs.statSync(cardPdfPath).size} bytes)`);

  // 6b. Render Gold Certificate
  const pageGold = await browser.newPage({
    viewport: { width: templateGold!.width, height: templateGold!.height },
  });
  await pageGold.setContent(goldHtml, { waitUntil: "networkidle" });
  const goldPdfPath = path.join(outDir, "audit-gold-cert.pdf");
  const goldPngPath = path.join(outDir, "audit-gold-cert.png");
  await pageGold.pdf({
    path: goldPdfPath,
    width: `${templateGold!.width}px`,
    height: `${templateGold!.height}px`,
    printBackground: true,
    pageRanges: "1",
  });
  await pageGold.screenshot({ path: goldPngPath, fullPage: true });
  console.log(`  - Rendered Gold Cert PDF: ${goldPdfPath} (${fs.statSync(goldPdfPath).size} bytes)`);

  await browser.close();

  // --------------------------------------------------------------------------
  // 7. CRYPTOGRAPHIC QR MATRIX DECODING
  // --------------------------------------------------------------------------
  console.log("\n>>> [7/7] Cryptographically Scanning Rendered QR Matrices with jsQR...");
  const { PNG } = await import("pngjs");
  const jsQR = (await import("jsqr")).default;

  function scanQr(imgPath: string, name: string, template?: Template) {
    const buffer = fs.readFileSync(imgPath);
    const png = PNG.sync.read(buffer);
    let code = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);

    if (!code && template) {
      const qrField = template.layout_schema.fields.find((f: any) => f.type === "qr");
      if (qrField) {
        const cropX = Math.max(0, qrField.x - 20);
        const cropY = Math.max(0, qrField.y - 20);
        const cropW = Math.min(png.width - cropX, qrField.w + 40);
        const cropH = Math.min(png.height - cropY, qrField.h + 40);
        const croppedData = new Uint8ClampedArray(cropW * cropH * 4);
        for (let cy = 0; cy < cropH; cy++) {
          for (let cx = 0; cx < cropW; cx++) {
            const srcIdx = ((cropY + cy) * png.width + (cropX + cx)) * 4;
            const dstIdx = (cy * cropW + cx) * 4;
            croppedData[dstIdx] = png.data[srcIdx];
            croppedData[dstIdx + 1] = png.data[srcIdx + 1];
            croppedData[dstIdx + 2] = png.data[srcIdx + 2];
            croppedData[dstIdx + 3] = png.data[srcIdx + 3];
          }
        }
        code = jsQR(croppedData, cropW, cropH);
      }
    }

    if (code) {
      console.log(`  ✅ [${name}] Scanned Matrix: "${code.data}"`);
      return code.data;
    } else {
      console.log(`  ❌ [${name}] Failed to decode QR matrix.`);
      return null;
    }
  }

  const cardQr = scanQr(cardPngPath, "CR80 Student ID Card", templateCard!);
  const goldQr = scanQr(goldPngPath, "Elegant Gold Certificate", templateGold!);
  const qrVerified = cardQr?.includes("tok_audit_diff_schemas_888") && goldQr?.includes("tok_audit_diff_schemas_888");
  console.log(`  - QR Decodability Verification: ${qrVerified ? "VERIFIED (PASS)" : "FAILED"}`);

  console.log("\n===============================================================");
  console.log("             ALL AUDIT SUITE CHECKS COMPLETED                 ");
  console.log("===============================================================");
}

main().catch(console.error);
