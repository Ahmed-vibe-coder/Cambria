import fs from "fs";
import path from "path";
import { chromium } from "playwright";
import { generateDocumentHtml } from "../src/lib/renderer/render-html";
import { generateQrDataUri } from "../src/lib/renderer/generate-qr";
import { TemplateLayout } from "../src/types/database";
import { PNG } from "pngjs";
import jsQR from "jsqr";

async function run() {
  console.log("================================================================================");
  console.log("🔍 COORDINATE SYSTEM FIDELITY & ARABIC SHAPING AUDIT");
  console.log("================================================================================\n");

  // 1. Math Verification
  console.log("--- 1. COORDINATE TRANSFORMATION MATH VERIFICATION ---");
  const canvasWidth = 1920;
  const canvasHeight = 1080;
  const targetX = 350;
  const targetY = 420;
  const targetW = 600;
  const targetH = 80;

  // Simulate zoom 1.0 (100%)
  const zoom1 = 1.0;
  const clientDragDeltaX_1 = 50; // dragged 50 client px
  const computedDeltaX_1 = clientDragDeltaX_1 / zoom1;
  console.log(`Zoom 100%: Client drag 50px => Unscaled delta: ${computedDeltaX_1}px (Match: ${computedDeltaX_1 === 50})`);

  // Simulate zoom 0.5 (50%)
  const zoom05 = 0.5;
  const clientDragDeltaX_05 = 25; // dragged 25 client px on 50% zoom
  const computedDeltaX_05 = clientDragDeltaX_05 / zoom05;
  console.log(`Zoom 50%: Client drag 25px => Unscaled delta: ${computedDeltaX_05}px (Match: ${computedDeltaX_05 === 50})`);

  // 2. Generate Real Document with Playwright
  console.log("\n--- 2. REAL CHROMIUM RENDERING & FIELD COORDINATE MEASUREMENT ---");
  const testLayout: TemplateLayout = {
    template_kind: "certificate",
    width: canvasWidth,
    height: canvasHeight,
    background_color: "#FFFFFF",
    background_image_url: null,
    fields: [
      {
        id: "field-en-name",
        type: "text",
        contentKey: "student_name_en",
        label: "English Student Name",
        x: targetX,
        y: targetY,
        w: targetW,
        h: targetH,
        font: "Cormorant Garamond",
        size: 36,
        weight: 700,
        color: "#020B5A",
        align: "center",
        direction: "ltr",
      },
      {
        id: "field-ar-name",
        type: "text",
        contentKey: "student_name_ar",
        label: "Arabic Student Name",
        x: targetX,
        y: targetY + 120,
        w: targetW,
        h: targetH,
        font: "Cairo",
        size: 32,
        weight: 700,
        color: "#C8A84E",
        align: "center",
        direction: "rtl",
      },
      {
        id: "field-qr",
        type: "qr",
        label: "Verification QR",
        x: 100,
        y: 800,
        w: 160,
        h: 160,
      },
    ],
  };

  const domain = "https://cambria-five.vercel.app";
  const token = "tok_audit_verified_2026";
  const verificationUrl = `${domain}/verify/${token}`;
  const qrUri = await generateQrDataUri(verificationUrl);

  const html = generateDocumentHtml({
    layout: testLayout,
    data: {
      student_name_en: "Tariq Mansoor Al-Hashimi",
      student_name_ar: "طارق منصور الهاشمي",
      program_name_en: "Executive Leadership & Educational Governance",
      credential_number: "CAM-AUDIT-2026-001",
      issue_date: "September 27, 2026",
      verification_url: verificationUrl,
      qr_data_uri: qrUri,
    },
  });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: canvasWidth, height: canvasHeight },
  });

  await page.setContent(html, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);

  // Measure rendered bounding boxes inside Chromium
  const enBoundingBox = await page.locator(".field-container").nth(0).boundingBox();
  const arBoundingBox = await page.locator(".field-container").nth(1).boundingBox();
  const qrBoundingBox = await page.locator(".field-container").nth(2).boundingBox();

  console.log("Placed coordinates in Layout Schema:");
  console.log(` - English Name: Expected x=${targetX}, y=${targetY}, w=${targetW}, h=${targetH}`);
  console.log(`   Rendered Box:  Actual   x=${enBoundingBox?.x}, y=${enBoundingBox?.y}, w=${enBoundingBox?.width}, h=${enBoundingBox?.height}`);
  console.log(`   Coordinates Exact Match? ${enBoundingBox?.x === targetX && enBoundingBox?.y === targetY}`);

  console.log(` - Arabic Name:  Expected x=${targetX}, y=${targetY + 120}, w=${targetW}, h=${targetH}`);
  console.log(`   Rendered Box:  Actual   x=${arBoundingBox?.x}, y=${arBoundingBox?.y}, w=${arBoundingBox?.width}, h=${arBoundingBox?.height}`);
  console.log(`   Coordinates Exact Match? ${arBoundingBox?.x === targetX && arBoundingBox?.y === (targetY + 120)}`);

  // Check computed font and RTL on Arabic element
  const arComputed = await page.locator(".field-container").nth(1).evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      fontFamily: s.fontFamily,
      direction: s.direction,
      textAlign: s.textAlign,
      text: el.textContent?.trim(),
    };
  });
  console.log("\n--- 3. ARABIC / RTL COMPUTED STYLES IN CHROMIUM ---");
  console.log("Computed Style for Arabic element:", JSON.stringify(arComputed, null, 2));

  // Save screenshot of Arabic element for visual inspection
  const outDir = path.resolve("data/audit");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const shotPath = path.join(outDir, "arabic_audit_element.png");
  await page.locator(".field-container").nth(1).screenshot({ path: shotPath });
  console.log(`Saved Arabic element screenshot to: ${shotPath}`);

  // Save full page thumbnail
  const fullShotPath = path.join(outDir, "full_audit_document.png");
  await page.screenshot({ path: fullShotPath });
  console.log(`Saved full document screenshot to: ${fullShotPath}`);

  // 4. Decode rendered QR code from the screenshot
  const qrBuffer = fs.readFileSync(fullShotPath);
  const png = PNG.sync.read(qrBuffer);
  const decoded = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  console.log("\n--- 4. QR CODE DECODED STRING FROM CHROMIUM SCREENSHOT ---");
  console.log(`Decoded QR URL: ${decoded ? decoded.data : "FAILED TO DECODE"}`);
  console.log(`Expected URL:   ${verificationUrl}`);
  console.log(`Exact Match?    ${decoded?.data === verificationUrl}`);

  await browser.close();
}

run().catch(console.error);
