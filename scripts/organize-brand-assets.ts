import fs from "fs";
import path from "path";
import { PNG } from "pngjs";

const rootDir = process.cwd();
const arabicDir = path.join(rootDir, "public", "موقع الكليه");
const designRefDir = path.join(rootDir, "design-references");

console.log("==================================================");
console.log("📦 ORGANIZING BRAND ASSETS & REFERENCE MATERIALS");
console.log("==================================================\n");

// 1. Ensure target directories exist
const certsDir = path.join(designRefDir, "certificates");
const idCardDir = path.join(designRefDir, "id-card");
const logoRefDir = path.join(designRefDir, "logo");
const imagesDir = path.join(rootDir, "public", "images");

fs.mkdirSync(certsDir, { recursive: true });
fs.mkdirSync(idCardDir, { recursive: true });
fs.mkdirSync(logoRefDir, { recursive: true });
fs.mkdirSync(imagesDir, { recursive: true });

// 2. Map files to clean English hyphenated names
const fileMappings: { src: string; dest: string }[] = [
  // Logo
  {
    src: path.join(arabicDir, "cambria (4).pdf.png"),
    dest: path.join(logoRefDir, "cambria-seal-master.png"),
  },
  // ID Card
  {
    src: path.join(arabicDir, "ID Cambria (3.375 x 2.125 in).png"),
    dest: path.join(idCardDir, "id-card-cr80-master-blank.png"),
  },
  {
    src: path.join(arabicDir, "ID Cambria (3.375 x 2.125 in) (1).png"),
    dest: path.join(idCardDir, "id-card-cr80-filled-sample.png"),
  },
  // Certificate Style 1: Modern Geometric Landscape (2000x1414)
  {
    src: path.join(arabicDir, "Blue White Modern Geometric Certificate of Completion (3).png"),
    dest: path.join(certsDir, "cert-landscape-geometric-master-blank.png"),
  },
  {
    src: path.join(arabicDir, "Blue White Modern Geometric Certificate of Completion (2).png"),
    dest: path.join(certsDir, "cert-landscape-geometric-filled-sample.png"),
  },
  // Certificate Style 2: Elegant Gold & Blue Portrait (1414x2000)
  {
    src: path.join(arabicDir, "Blue and Gold Elegant Seminar Certificate Portrait (2).png"),
    dest: path.join(certsDir, "cert-portrait-elegant-gold-master-blank.png"),
  },
  {
    src: path.join(arabicDir, "Blue and Gold Elegant Seminar Certificate Portrait (3).png"),
    dest: path.join(certsDir, "cert-portrait-elegant-gold-filled-sample.png"),
  },
  // Certificate Style 3: Blue Ribbon Banner Portrait (1414x2000)
  {
    src: path.join(arabicDir, "Blue and Gold Elegant Seminar Certificate Portrait.png"),
    dest: path.join(certsDir, "cert-portrait-blue-ribbon-master-blank.png"),
  },
  // Certificate Style 4: Appreciation Multi-Layer Border Portrait (1414x2000)
  {
    src: path.join(arabicDir, "Blue Simple Appreciation Certificate (1).png"),
    dest: path.join(certsDir, "cert-portrait-appreciation-master-blank.png"),
  },
];

for (const mapping of fileMappings) {
  if (fs.existsSync(mapping.src)) {
    fs.copyFileSync(mapping.src, mapping.dest);
    console.log(`✓ Copied: ${path.basename(mapping.dest)}`);
  } else {
    console.warn(`⚠ Missing source: ${mapping.src}`);
  }
}

// 3. Update public site logo assets from clean master logo
const newLogoMaster = path.join(arabicDir, "cambria (4).pdf.png");
if (fs.existsSync(newLogoMaster)) {
  const logoBuffer = fs.readFileSync(newLogoMaster);

  // Replace public/images/cambria-logo.png
  fs.writeFileSync(path.join(imagesDir, "cambria-logo.png"), logoBuffer);
  console.log(`✓ Updated public/images/cambria-logo.png with transparent new seal`);

  // Replace public/images/cambria-seal.png
  fs.writeFileSync(path.join(imagesDir, "cambria-seal.png"), logoBuffer);
  console.log(`✓ Updated public/images/cambria-seal.png with transparent new seal`);

  // Replace public/favicon.png
  fs.writeFileSync(path.join(rootDir, "public", "favicon.png"), logoBuffer);
  console.log(`✓ Updated public/favicon.png with transparent new seal`);

  // Generate public/favicon.ico embedding PNG bytes (Standard ICO format)
  // ICO header: 6 bytes (Reserved 2B, Type 2B (1=ICO), Count 2B (1))
  // Directory entry: 16 bytes (Width, Height, Palette, Reserved, Planes 2B, BPP 2B, Size 4B, Offset 4B)
  const icoHeader = Buffer.alloc(6 + 16);
  icoHeader.writeUInt16LE(0, 0); // Reserved
  icoHeader.writeUInt16LE(1, 2); // 1 = ICO
  icoHeader.writeUInt16LE(1, 4); // 1 image

  // Dir entry
  icoHeader.writeUInt8(0, 6); // 0 = 256px or larger
  icoHeader.writeUInt8(0, 7); // 0 = 256px
  icoHeader.writeUInt8(0, 8); // Color palette
  icoHeader.writeUInt8(0, 9); // Reserved
  icoHeader.writeUInt16LE(1, 10); // Color planes
  icoHeader.writeUInt16LE(32, 12); // Bits per pixel
  icoHeader.writeUInt32LE(logoBuffer.length, 14); // Image size in bytes
  icoHeader.writeUInt32LE(22, 18); // Offset to image data (6 + 16 = 22)

  const icoBuffer = Buffer.concat([icoHeader, logoBuffer]);
  fs.writeFileSync(path.join(rootDir, "public", "favicon.ico"), icoBuffer);
  console.log(`✓ Generated public/favicon.ico with transparent new seal`);
}

// 4. Remove temporary Arabic-named folder from public/
if (fs.existsSync(arabicDir)) {
  fs.rmSync(arabicDir, { recursive: true, force: true });
  console.log(`✓ Cleaned up public/موقع الكليه/ (no Arabic paths in public)`);
}

console.log("\n==================================================");
console.log("🎉 ASSET REORGANIZATION COMPLETE");
console.log("==================================================");
