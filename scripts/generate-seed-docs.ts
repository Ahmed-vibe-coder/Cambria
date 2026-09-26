import { generateDocumentHtml } from "../src/lib/renderer/render-html";
import { generateQrDataUri } from "../src/lib/renderer/generate-qr";
import { getTemplates } from "../src/lib/db";
import { chromium } from "playwright";
import fs from "fs";
import path from "path";

async function generateSeedDocs() {
  console.log("🎨 Rendering initial seed documents (Certificate + Student Card)...");

  const templates = await getTemplates();
  const certTmpl = templates.find((t) => t.template_kind === "certificate")!;
  const cardTmpl = templates.find((t) => t.template_kind === "student_card")!;

  const studentData = {
    student_name_en: "Tariq Mansoor Al-Hashimi",
    student_name_ar: "طارق منصور الهاشمي",
    program_name_en: "Executive Leadership & Educational Governance",
    credential_number: "CAM-2026-000184",
    issue_date: "January 15, 2026",
    verification_url: "http://localhost:3000/verify/tok_v8K29LpQx92M1a8B4z",
  };

  const qrDataUri = await generateQrDataUri(studentData.verification_url);

  const docsDir = path.join(process.cwd(), "public", "documents");
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });

  // 1. Render Certificate
  console.log("-> Rendering Certificate PDF & Thumbnail...");
  const certHtml = generateDocumentHtml({
    layout: certTmpl.layout_schema,
    data: {
      ...studentData,
      qr_data_uri: qrDataUri,
    },
  });

  const certPage = await browser.newPage({
    viewport: { width: certTmpl.width, height: certTmpl.height },
  });
  await certPage.setContent(certHtml, { waitUntil: "networkidle" });
  await certPage.waitForTimeout(500);

  const certPdf = await certPage.pdf({
    width: `${certTmpl.width}px`,
    height: `${certTmpl.height}px`,
    printBackground: true,
  });
  const certThumb = await certPage.screenshot({ type: "png" });

  fs.writeFileSync(path.join(docsDir, "sample-cert-001.pdf"), certPdf);
  fs.writeFileSync(path.join(docsDir, "sample-cert-001.png"), certThumb);
  await certPage.close();

  // 2. Render Student Card
  console.log("-> Rendering Student Card PDF & Thumbnail...");
  const cardHtml = generateDocumentHtml({
    layout: cardTmpl.layout_schema,
    data: {
      ...studentData,
      qr_data_uri: qrDataUri,
    },
  });

  const cardPage = await browser.newPage({
    viewport: { width: cardTmpl.width, height: cardTmpl.height },
  });
  await cardPage.setContent(cardHtml, { waitUntil: "networkidle" });
  await cardPage.waitForTimeout(500);

  const cardPdf = await cardPage.pdf({
    width: `${cardTmpl.width}px`,
    height: `${cardTmpl.height}px`,
    printBackground: true,
  });
  const cardThumb = await cardPage.screenshot({ type: "png" });

  fs.writeFileSync(path.join(docsDir, "sample-card-001.pdf"), cardPdf);
  fs.writeFileSync(path.join(docsDir, "sample-card-001.png"), cardThumb);
  await cardPage.close();

  await browser.close();
  console.log("✅ Seed documents successfully generated in /public/documents/!");
}

generateSeedDocs().catch(console.error);
