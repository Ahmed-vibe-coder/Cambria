import fs from "fs";
import path from "path";

// Load .env.local natively
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

import { uploadTemplateBackground } from "../src/lib/storage/cloudinary";

async function main() {
  console.log("==================================================");
  console.log("☁️ UPLOADING BLANK MASTERS TO CLOUDINARY");
  console.log("==================================================\n");

  const files = [
    {
      id: "id_card_cr80_master",
      file: path.resolve(process.cwd(), "design-references/id-card/id-card-cr80-master-blank.png"),
      kind: "student_card",
      name: "Official Student Identification Card (CR80 Executive)",
    },
    {
      id: "cert_landscape_geometric_master",
      file: path.resolve(process.cwd(), "design-references/certificates/cert-landscape-geometric-master-blank.png"),
      kind: "certificate",
      name: "Modern Geometric Certificate of Completion (Landscape)",
    },
    {
      id: "cert_portrait_elegant_gold_master",
      file: path.resolve(process.cwd(), "design-references/certificates/cert-portrait-elegant-gold-master-blank.png"),
      kind: "certificate",
      name: "Elegant Gold & Blue Seminar Certificate (Portrait)",
    },
    {
      id: "cert_portrait_blue_ribbon_master",
      file: path.resolve(process.cwd(), "design-references/certificates/cert-portrait-blue-ribbon-master-blank.png"),
      kind: "certificate",
      name: "Classic Navy Ribbon Distinction Certificate (Portrait)",
    },
    {
      id: "cert_portrait_appreciation_master",
      file: path.resolve(process.cwd(), "design-references/certificates/cert-portrait-appreciation-master-blank.png"),
      kind: "certificate",
      name: "Prestigious Academic Appreciation Certificate (Portrait)",
    },
  ];

  const results: any[] = [];

  for (const item of files) {
    if (!fs.existsSync(item.file)) {
      console.error(`❌ File not found: ${item.file}`);
      continue;
    }
    const buffer = fs.readFileSync(item.file);
    console.log(`Uploading "${item.name}" (${(buffer.length / 1024).toFixed(1)} KB)...`);
    const cld = await uploadTemplateBackground(buffer, item.id);
    console.log(`   ✓ Uploaded! Public ID: ${cld.public_id}`);
    console.log(`   ✓ URL: ${cld.secure_url}`);
    console.log(`   ✓ Dimensions: ${cld.width} x ${cld.height}\n`);
    results.push({
      ...item,
      public_id: cld.public_id,
      secure_url: cld.secure_url,
      width: cld.width,
      height: cld.height,
    });
  }

  // Write results JSON for use in template definitions
  fs.writeFileSync(
    path.resolve(process.cwd(), "design-references/uploaded-templates.json"),
    JSON.stringify(results, null, 2),
    "utf-8"
  );
  console.log("🎉 All blank masters uploaded and cataloged in design-references/uploaded-templates.json");
}

main().catch(console.error);
