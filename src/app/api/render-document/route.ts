import { NextRequest, NextResponse } from "next/server";
import { generateDocumentHtml } from "@/lib/renderer/render-html";
import { generateQrDataUri } from "@/lib/renderer/generate-qr";
import { TemplateLayout } from "@/types/database";
import { chromium as playwrightChromium } from "playwright";
import fs from "fs";
import path from "path";

// Extended timeout for Chromium PDF rendering
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { layout, studentData, baseUrl } = body;

    if (!layout || !studentData) {
      return NextResponse.json(
        { error: "Missing required layout schema or student data." },
        { status: 400 }
      );
    }

    const domain = baseUrl || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const verificationUrl = `${domain}/verify/${studentData.verification_token}`;

    // 1. Generate QR Data URI
    const qrDataUri = await generateQrDataUri(verificationUrl);

    // 2. Composite HTML
    const html = generateDocumentHtml({
      layout: layout as TemplateLayout,
      data: {
        student_name_en: studentData.student_name_en,
        student_name_ar: studentData.student_name_ar,
        program_name_en: studentData.program_name_en,
        credential_number: studentData.credential_number,
        issue_date: studentData.issue_date,
        verification_url: verificationUrl,
        qr_data_uri: qrDataUri,
      },
    });

    // 3. Launch Headless Chromium via Playwright
    const browser = await playwrightChromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
    });

    const page = await browser.newPage({
      viewport: {
        width: layout.width,
        height: layout.height,
      },
    });

    // Set HTML content and wait for web fonts and network idle
    await page.setContent(html, { waitUntil: "networkidle" });
    await page.waitForTimeout(350); // Guarantee font shaping settles

    // 4. Source of Truth: Vector PDF
    const pdfBuffer = await page.pdf({
      width: `${layout.width}px`,
      height: `${layout.height}px`,
      printBackground: true,
      margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
    });

    // 5. Derived Artifact: Page 1 PNG Thumbnail
    const thumbnailBuffer = await page.screenshot({
      type: "png",
      fullPage: false,
    });

    await browser.close();

    // 6. Ensure private data/documents directory exists and persist artifacts
    const docsDir = path.join(process.cwd(), "data", "documents");
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }

    const filePrefix = `${studentData.credential_number}_${layout.template_kind}`;
    const pdfFileName = `${filePrefix}_v${Date.now()}.pdf`;
    const thumbFileName = `${filePrefix}_v${Date.now()}.png`;

    const pdfFilePath = path.join(docsDir, pdfFileName);
    const thumbFilePath = path.join(docsDir, thumbFileName);

    fs.writeFileSync(pdfFilePath, pdfBuffer);
    fs.writeFileSync(thumbFilePath, thumbnailBuffer);

    // Gated Route URL (no direct public folder exposure)
    const token = studentData.verification_token;
    const gatedPdfUrl = `/api/documents/${token}/${layout.template_kind}`;
    const gatedThumbUrl = `/api/documents/${token}/${layout.template_kind}?thumb=true`;

    return NextResponse.json({
      success: true,
      filePath: gatedPdfUrl,
      thumbnailPath: gatedThumbUrl,
      fileSizeBytes: pdfBuffer.length,
    });
  } catch (error: any) {
    console.error("❌ Document render pipeline error:", error);
    return NextResponse.json(
      { error: "Failed to render document: " + (error?.message || String(error)) },
      { status: 500 }
    );
  }
}
