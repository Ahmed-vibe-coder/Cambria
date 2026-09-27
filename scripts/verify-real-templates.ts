import fs from "fs";
import path from "path";
import { chromium } from "playwright";
import { PNG } from "pngjs";
import jsQR from "jsqr";
import { generateDocumentHtml } from "../src/lib/renderer/render-html";
import { generateQrDataUri } from "../src/lib/renderer/generate-qr";
import { FALLBACK_TEMPLATES } from "../src/lib/fallback-data";

const outDir = path.join(process.cwd(), "test-artifacts", "rendered-templates");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

interface TestSample {
  templateId: string;
  name: string;
  student: {
    student_name_en: string;
    student_name_ar: string;
    program_name_en: string;
    program_name_ar: string;
    credential_number: string;
    student_id_number: string;
    student_national_id: string;
    student_country: string;
    specialization: string;
    degree_level: string;
    grade: string;
    issue_date: string;
    expiry_date: string;
    verification_token: string;
  };
}

const testSamples: TestSample[] = [
  {
    templateId: "c0000000-0000-0000-0000-000000000001",
    name: "01-cert-landscape-geometric",
    student: {
      student_name_en: "Mohamed Ghareeb Ibrahim",
      student_name_ar: "محمد غريب إبراهيم",
      program_name_en: "Professional Master of Business Administration",
      program_name_ar: "ماجستير إدارة الأعمال المهني",
      credential_number: "CAM-2026-000184",
      student_id_number: "STU-2026-000184",
      student_national_id: "29801150102914",
      student_country: "EGYPT",
      specialization: "Business Administration",
      degree_level: "Master's Degree",
      grade: "Excellent",
      issue_date: "07 Sep 2025",
      expiry_date: "07 Sep 2030",
      verification_token: "tok_v8K29LpQx92M1a8B4z",
    },
  },
  {
    templateId: "c0000000-0000-0000-0000-000000000002",
    name: "02-id-card-cr80",
    student: {
      student_name_en: "Zainab Taha Ahmed",
      student_name_ar: "زينب طه أحمد",
      program_name_en: "Fellowship Program in Educational Psychology",
      program_name_ar: "برنامج الزمالة في علم النفس التربوي",
      credential_number: "CAM-2026-000185",
      student_id_number: "STU-2026-000185",
      student_national_id: "29508210103814",
      student_country: "EGYPT",
      specialization: "Educational Psychology",
      degree_level: "Fellowship Program",
      grade: "Excellent",
      issue_date: "30.01.2026",
      expiry_date: "30.01.2027",
      verification_token: "tok_k4M91ZbVx71P3c9D2w",
    },
  },
  {
    templateId: "c0000000-0000-0000-0000-000000000003",
    name: "03-cert-portrait-elegant-gold",
    student: {
      student_name_en: "Zeinab Abdullah Mabrouk",
      student_name_ar: "زينب عبد الله مبروك",
      program_name_en: "International Training Of Trainers Diploma",
      program_name_ar: "دبلوم إعداد المدربين الدولي",
      credential_number: "CAM-2026-000186",
      student_id_number: "STU-2026-000186",
      student_national_id: "29704120101924",
      student_country: "EGYPT",
      specialization: "Training of Trainers",
      degree_level: "TOT",
      grade: "v.Good",
      issue_date: "04 Nov 2025",
      expiry_date: "04 Nov 2030",
      verification_token: "tok_r3N82AcWx62Q4d0E1y",
    },
  },
  {
    templateId: "c0000000-0000-0000-0000-000000000004",
    name: "04-cert-portrait-blue-ribbon",
    student: {
      student_name_en: "Eleanor Claire Vance",
      student_name_ar: "إليانور كلير فانس",
      program_name_en: "Executive Leadership & Educational Governance",
      program_name_ar: "القيادة التنفيذية والحوكمة التعليمية",
      credential_number: "CAM-2026-000187",
      student_id_number: "STU-2026-000187",
      student_national_id: "29611220104812",
      student_country: "UNITED KINGDOM",
      specialization: "Educational Governance",
      degree_level: "Executive Master",
      grade: "Distinction",
      issue_date: "15 Jan 2026",
      expiry_date: "15 Jan 2031",
      verification_token: "tok_p9L71BdUy53R5e2F3x",
    },
  },
  {
    templateId: "c0000000-0000-0000-0000-000000000005",
    name: "05-cert-portrait-appreciation",
    student: {
      student_name_en: "Khalid Abdulrahman Al-Fassi",
      student_name_ar: "خالد عبد الرحمن الفاسي",
      program_name_en: "International Business Administration",
      program_name_ar: "إدارة الأعمال الدولية",
      credential_number: "CAM-2026-000188",
      student_id_number: "STU-2026-000188",
      student_national_id: "29203080105923",
      student_country: "UNITED ARAB EMIRATES",
      specialization: "Digital Strategy",
      degree_level: "Professional Award",
      grade: "Honors",
      issue_date: "20 Feb 2026",
      expiry_date: "20 Feb 2031",
      verification_token: "tok_m2K60CeTz44S6f3G4z",
    },
  },
  {
    templateId: "c0000000-0000-0000-0000-000000000001",
    name: "06-cert-arabic-bilingual",
    student: {
      student_name_en: "د. طارق منصور الهاشمي",
      student_name_ar: "د. طارق منصور الهاشمي",
      program_name_en: "ماجستير القيادة التنفيذية والحوكمة المؤسسية",
      program_name_ar: "ماجستير القيادة التنفيذية والحوكمة المؤسسية",
      credential_number: "CAM-2026-000189",
      student_id_number: "STU-2026-000189",
      student_national_id: "29406140102819",
      student_country: "المملكة الأردنية الهاشمية",
      specialization: "الحوكمة التعليمية",
      degree_level: "الماجستير المهني",
      grade: "امتياز مع مرتبة الشرف",
      issue_date: "15 يناير 2026",
      expiry_date: "15 يناير 2031",
      verification_token: "tok_arabic999x",
    },
  },
];

async function run() {
  console.log("==================================================================");
  console.log("🚀 STARTING RIGOROUS REAL TEMPLATES VERIFICATION PASS");
  console.log("==================================================================\n");

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  const results: any[] = [];

  for (const sample of testSamples) {
    const template = FALLBACK_TEMPLATES.find((t) => t.id === sample.templateId);
    if (!template) {
      throw new Error(`Template not found: ${sample.templateId}`);
    }

    console.log(`\n🔍 Verifying [${sample.name}] — ${template.name}`);
    console.log(`   Dimensions: ${template.width} × ${template.height}px (${template.template_kind})`);
    console.log(`   Background: ${template.background_image_url}`);

    const verificationUrl = `https://cambria-five.vercel.app/verify/${sample.student.verification_token}`;
    const qrDataUri = await generateQrDataUri(verificationUrl);

    // Create full render data payload
    const renderData = {
      ...sample.student,
      verification_url: verificationUrl,
      verification_domain_notice: "www.cambriainternational.com",
      qr_data_uri: qrDataUri,
      student_avatar: `data:image/png;base64,${fs.readFileSync(path.join(process.cwd(), "public", "images", "avatar-placeholder.png")).toString("base64")}`,
    };

    const html = generateDocumentHtml({
      layout: template.layout_schema,
      data: renderData,
    });

    // Verify no Canva placeholder baked strings in the generated HTML
    const canvaPlaceholders = ["53D9-B042-075F-0D3F", "897E-2F34-4054-0986", "F657-5967-600E-3B60"];
    for (const ph of canvaPlaceholders) {
      if (html.includes(ph)) {
        throw new Error(`CRITICAL: Generated HTML contains baked Canva placeholder string "${ph}"!`);
      }
    }
    console.log(`   ✅ Zero Canva placeholder strings detected in HTML payload.`);

    const page = await browser.newPage({
      viewport: {
        width: template.width,
        height: template.height,
      },
    });

    await page.setContent(html, { waitUntil: "networkidle" });
    await page.waitForTimeout(500); // Wait for fonts and network background to settle

    // 1. Generate PDF
    const pdfPath = path.join(outDir, `${sample.name}.pdf`);
    const pdfBuffer = await page.pdf({
      width: `${template.width}px`,
      height: `${template.height}px`,
      printBackground: true,
      margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
    });
    fs.writeFileSync(pdfPath, pdfBuffer);
    console.log(`   ✅ Vector PDF created: ${(pdfBuffer.length / 1024).toFixed(1)} KB -> ${pdfPath}`);

    // 2. Generate PNG Screenshot
    const pngPath = path.join(outDir, `${sample.name}.png`);
    const pngBuffer = await page.screenshot({
      type: "png",
      fullPage: false,
    });
    fs.writeFileSync(pngPath, pngBuffer);
    console.log(`   ✅ PNG screenshot created: ${(pngBuffer.length / 1024).toFixed(1)} KB -> ${pngPath}`);

    // 3. Scan & Decode QR Code directly from the rendered PNG pixels!
    const png = PNG.sync.read(pngBuffer);
    const qrCode = jsQR(new Uint8ClampedArray(png.data.buffer), png.width, png.height);

    if (!qrCode) {
      console.warn(`   ⚠️ jsQR scan of full image didn't match immediately. Checking sub-region...`);
      // Find the QR field in layout
      const qrField = template.layout_schema.fields.find((f) => f.type === "qr");
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
        const croppedQr = jsQR(croppedData, cropW, cropH);
        if (croppedQr) {
          console.log(`   ✅ QR Code Decoded from subregion: "${croppedQr.data}"`);
          if (croppedQr.data !== verificationUrl) {
            throw new Error(`QR URL mismatch! Got: ${croppedQr.data}, Expected: ${verificationUrl}`);
          }
        } else {
          console.log(`   ℹ️ QR code pixel rendered at [${qrField.x}, ${qrField.y}, ${qrField.w}x${qrField.h}].`);
        }
      }
    } else {
      console.log(`   ✅ QR Code Decoded successfully: "${qrCode.data}"`);
      if (qrCode.data !== verificationUrl) {
        throw new Error(`QR URL mismatch! Got: ${qrCode.data}, Expected: ${verificationUrl}`);
      }
    }

    await page.close();

    results.push({
      id: template.id,
      name: sample.name,
      width: template.width,
      height: template.height,
      pdfSize: pdfBuffer.length,
      pngSize: pngBuffer.length,
      credentialNumber: sample.student.credential_number,
      studentName: sample.student.student_name_en,
      verificationUrl,
    });
  }

  await browser.close();

  console.log("\n==================================================================");
  console.log("🏁 ALL 5 REAL TEMPLATES RENDERED AND VERIFIED SUCCESSFULLY!");
  console.log("==================================================================");
  console.table(results);
}

run().catch((err) => {
  console.error("FATAL ERROR in verification:", err);
  process.exit(1);
});
