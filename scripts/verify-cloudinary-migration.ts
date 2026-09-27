import fs from "fs";
import path from "path";

// Load .env.local if present
try {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
} catch (e) {}

import { uploadTemplateBackground, uploadDocumentArtifact, fetchAssetBuffer } from "../src/lib/storage/cloudinary";
import { generateDocumentHtml } from "../src/lib/renderer/render-html";
import { generateQrDataUri } from "../src/lib/renderer/generate-qr";
import { chromium } from "playwright";
import jsQR from "jsqr";
import { PNG } from "pngjs";

async function main() {
  console.log("============================================================");
  console.log("🚀 CLOUDINARY MIGRATION & SECURITY AUDIT VERIFICATION SUITE");
  console.log("============================================================\n");

  let allPassed = true;

  // --------------------------------------------------------------------------
  // TEST 1: Cloudinary Template Background Upload & Retrieval
  // --------------------------------------------------------------------------
  console.log("--- TEST 1: Template Background Upload to Cloudinary ---");
  try {
    // 1x1 transparent PNG
    const testPngBuffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64"
    );

    const uploadRes = await uploadTemplateBackground(
      testPngBuffer,
      `audit_bg_test_${Date.now()}.png`
    );

    console.log(`   ✓ Uploaded successfully!`);
    console.log(`   - Public ID: ${uploadRes.public_id}`);
    console.log(`   - Secure CDN URL: ${uploadRes.secure_url}`);
    console.log(`   - Format: ${uploadRes.format}, Size: ${uploadRes.bytes} bytes`);

    // Verify fetching via CDN
    const fetchedBuffer = await fetchAssetBuffer(uploadRes.secure_url);
    if (fetchedBuffer.length > 0) {
      console.log(`   ✓ CDN Asset fetch verified (${fetchedBuffer.length} bytes downloaded).`);
    } else {
      throw new Error("Downloaded asset was empty");
    }
  } catch (err: any) {
    console.error("   ❌ TEST 1 FAILED:", err.message);
    allPassed = false;
  }

  // --------------------------------------------------------------------------
  // TEST 2: In-Memory Render Pipeline -> Direct Cloudinary Upload (Zero Disk)
  // --------------------------------------------------------------------------
  console.log("\n--- TEST 2: In-Memory Render Pipeline -> Direct Cloudinary Upload ---");
  let testPdfPublicId = "";
  let testThumbPublicId = "";
  let testPdfUrl = "";
  let testThumbUrl = "";

  try {
    const testToken = `tok_audit_test_${Date.now()}`;
    const testCredNum = `CAM-AUDIT-${Math.floor(100000 + Math.random() * 900000)}`;
    const prodDomain = process.env.NEXT_PUBLIC_APP_URL || "https://cambria-five.vercel.app";
    const verificationUrl = `${prodDomain}/verify/${testToken}`;

    const qrDataUri = await generateQrDataUri(verificationUrl);

    // Verify QR encodes production domain
    const qrBase64 = qrDataUri.replace(/^data:image\/png;base64,/, "");
    const qrPng = PNG.sync.read(Buffer.from(qrBase64, "base64"));
    const decodedQr = jsQR(new Uint8ClampedArray(qrPng.data), qrPng.width, qrPng.height);
    if (!decodedQr || decodedQr.data !== verificationUrl) {
      throw new Error(`QR payload mismatch. Expected ${verificationUrl}, got ${decodedQr?.data}`);
    }
    console.log(`   ✓ QR Code correctly encodes production verification URL:`);
    console.log(`     ${decodedQr.data}`);

    // Composite HTML with Arabic text
    const sampleLayout: any = {
      template_kind: "certificate",
      width: 1123,
      height: 794,
      background_image_url: "",
      fields: [
        {
          id: "student_name",
          contentKey: "student_name_ar",
          label: "Student Name AR",
          type: "text",
          x: 200,
          y: 250,
          w: 700,
          h: 50,
          font: "Cairo",
          size: 28,
          weight: 700,
          color: "#0a192f",
          align: "center",
        },
        {
          id: "qr_code",
          contentKey: "verification_url",
          label: "QR Code",
          type: "qr",
          x: 880,
          y: 580,
          w: 140,
          h: 140,
        },
      ],
    };

    const html = generateDocumentHtml({
      layout: sampleLayout,
      data: {
        student_name_en: "Ahmed Saeed Audit",
        student_name_ar: "أحمد سعيد - تدقيق التحقق",
        program_name_en: "Advanced Computer Science",
        credential_number: testCredNum,
        issue_date: "2026-09-27",
        verification_url: verificationUrl,
        qr_data_uri: qrDataUri,
      },
    });

    // Launch Playwright Headless Chromium
    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });
    const page = await browser.newPage({
      viewport: { width: sampleLayout.width, height: sampleLayout.height },
    });
    await page.setContent(html, { waitUntil: "networkidle" });
    await page.waitForTimeout(350);

    const pdfBuffer = await page.pdf({
      width: `${sampleLayout.width}px`,
      height: `${sampleLayout.height}px`,
      printBackground: true,
    });

    const thumbBuffer = await page.screenshot({ type: "png" });
    await browser.close();

    console.log(`   ✓ Playwright generated in-memory buffers:`);
    console.log(`     - PDF Buffer: ${pdfBuffer.length} bytes`);
    console.log(`     - Thumbnail Buffer: ${thumbBuffer.length} bytes`);

    // Direct Cloudinary Upload
    const [cldPdf, cldThumb] = await Promise.all([
      uploadDocumentArtifact(pdfBuffer, {
        credentialNumber: testCredNum,
        documentType: "certificate",
        isPdf: true,
      }),
      uploadDocumentArtifact(thumbBuffer, {
        credentialNumber: testCredNum,
        documentType: "certificate",
        isPdf: false,
      }),
    ]);

    testPdfPublicId = cldPdf.public_id;
    testThumbPublicId = cldThumb.public_id;
    testPdfUrl = cldPdf.secure_url;
    testThumbUrl = cldThumb.secure_url;

    console.log(`   ✓ Cloudinary direct stream upload successful:`);
    console.log(`     - PDF Public ID: ${cldPdf.public_id}`);
    console.log(`     - PDF URL: ${cldPdf.secure_url}`);
    console.log(`     - Thumb Public ID: ${cldThumb.public_id}`);
    console.log(`     - Thumb URL: ${cldThumb.secure_url}`);
  } catch (err: any) {
    console.error("   ❌ TEST 2 FAILED:", err.message);
    allPassed = false;
  }

  // --------------------------------------------------------------------------
  // TEST 3: Security & Revocation Gating Simulation via Real Route Handler
  // --------------------------------------------------------------------------
  console.log("\n--- TEST 3: Gated Access & Revocation Security Checks ---");
  try {
    const { GET } = await import("../src/app/api/documents/[token]/[docType]/route");
    const { NextRequest } = await import("next/server");

    // 1. Test Active Credential -> Must return 200 OK
    console.log("   Sub-test 3.1: Active Credential (tok_v8K29LpQx92M1a8B4z)");
    const activeReq = new NextRequest("http://localhost:3000/api/documents/tok_v8K29LpQx92M1a8B4z/certificate");
    const activeRes = await GET(activeReq, {
      params: Promise.resolve({ token: "tok_v8K29LpQx92M1a8B4z", docType: "certificate" }),
    });
    console.log(`   - Status: ${activeRes.status} (Expected: 200)`);
    console.log(`   - Content-Type: ${activeRes.headers.get("content-type")}`);
    console.log(`   - X-Credential-Status: ${activeRes.headers.get("X-Credential-Status")}`);
    if (activeRes.status !== 200) {
      throw new Error(`Expected status 200 for active credential, got ${activeRes.status}`);
    }
    console.log("   ✓ Active credential served successfully.");

    // 2. Test Revoked Credential -> Must return 403 Forbidden
    console.log("\n   Sub-test 3.2: Revoked Credential (tok_r3N82AcWx62Q4d0E1y)");
    const revokedReq = new NextRequest("http://localhost:3000/api/documents/tok_r3N82AcWx62Q4d0E1y/certificate");
    const revokedRes = await GET(revokedReq, {
      params: Promise.resolve({ token: "tok_r3N82AcWx62Q4d0E1y", docType: "certificate" }),
    });
    const revokedJson = await revokedRes.json();
    console.log(`   - Status: ${revokedRes.status} (Expected: 403)`);
    console.log(`   - X-Credential-Status: ${revokedRes.headers.get("X-Credential-Status")}`);
    console.log(`   - Error Message: "${revokedJson.error}"`);
    console.log(`   - Revocation Reason: "${revokedJson.revocation_reason}"`);
    if (revokedRes.status !== 403) {
      throw new Error(`Expected status 403 for revoked credential, got ${revokedRes.status}`);
    }
    console.log("   ✓ Revocation 403 gating strictly enforced.");

    // 3. Test Suspended Credential -> Must return 403 Forbidden
    console.log("\n   Sub-test 3.3: Suspended Credential (tok_p9L71BdUy53R5e2F3x)");
    const suspendedReq = new NextRequest("http://localhost:3000/api/documents/tok_p9L71BdUy53R5e2F3x/certificate");
    const suspendedRes = await GET(suspendedReq, {
      params: Promise.resolve({ token: "tok_p9L71BdUy53R5e2F3x", docType: "certificate" }),
    });
    const suspendedJson = await suspendedRes.json();
    console.log(`   - Status: ${suspendedRes.status} (Expected: 403)`);
    console.log(`   - X-Credential-Status: ${suspendedRes.headers.get("X-Credential-Status")}`);
    console.log(`   - Error Message: "${suspendedJson.error}"`);
    console.log(`   - Suspension Reason: "${suspendedJson.suspension_reason}"`);
    if (suspendedRes.status !== 403) {
      throw new Error(`Expected status 403 for suspended credential, got ${suspendedRes.status}`);
    }
    console.log("   ✓ Suspension 403 gating strictly enforced.");

    console.log("\n   ✓ All lifecycle state checks passed!");
  } catch (err: any) {
    console.error("   ❌ TEST 3 FAILED:", err.message);
    allPassed = false;
  }

  console.log("\n============================================================");
  if (allPassed) {
    console.log("🎉 ALL AUDIT & MIGRATION VERIFICATION SUITES PASSED!");
  } else {
    console.log("❌ SOME TESTS FAILED. Check errors above.");
    process.exit(1);
  }
  console.log("============================================================");
}

main().catch((err) => {
  console.error("Fatal runner error:", err);
  process.exit(1);
});
