import fs from "fs";
import path from "path";
import { PNG } from "pngjs";
import jsQR from "jsqr";

async function verifyQr(imagePath: string, name: string) {
  const buffer = fs.readFileSync(imagePath);
  const png = PNG.sync.read(buffer);
  const code = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);

  console.log(`Scan result for [${name}]:`);
  if (code) {
    console.log(`  ✅ Successfully decoded QR matrix!`);
    console.log(`  Decoded Data: "${code.data}"`);
    return code.data;
  } else {
    console.log(`  ❌ Failed to decode QR matrix.`);
    return null;
  }
}

async function main() {
  const outDir = path.resolve(process.cwd(), "test-artifacts");
  await verifyQr(path.join(outDir, "audit-card-cr80.png"), "CR80 Student ID Card");
  await verifyQr(path.join(outDir, "audit-gold-cert.png"), "Elegant Gold Certificate");
}

main().catch(console.error);
