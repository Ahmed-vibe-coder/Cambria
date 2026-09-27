import fs from "fs";
import path from "path";
import { PNG } from "pngjs";

const dir = path.join(process.cwd(), "public", "موقع الكليه");
const files = fs.readdirSync(dir);

console.log("=================================================");
console.log("🔍 ASSET INSPECTION & DIMENSION ANALYSIS");
console.log("=================================================\n");

for (const file of files) {
  const filePath = path.join(dir, file);
  const buffer = fs.readFileSync(filePath);
  try {
    const png = PNG.sync.read(buffer);
    console.log(`File: "${file}"`);
    console.log(`   Dimensions: ${png.width} x ${png.height} (Aspect: ${(png.width / png.height).toFixed(3)})`);
    console.log(`   Size: ${(buffer.length / 1024).toFixed(1)} KB`);
    console.log(`   Has Alpha Channel: ${png.alpha}`);
    console.log("-------------------------------------------------");
  } catch (err: any) {
    console.log(`File: "${file}" - Error parsing PNG: ${err.message}`);
  }
}
