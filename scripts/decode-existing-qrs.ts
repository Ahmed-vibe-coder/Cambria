import fs from "fs";
import { PNG } from "pngjs";
import jsQR from "jsqr";

function decodeQrFromPng(pngPath: string): string | null {
  const buffer = fs.readFileSync(pngPath);
  const png = PNG.sync.read(buffer);
  const code = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  return code ? code.data : null;
}

const files = [
  "data/documents/sample-cert-001.png",
  "data/documents/sample-card-001.png",
  "data/documents/step4-cert.png",
  "data/documents/step4-card.png",
  "data/documents/test-qr.png",
];

for (const file of files) {
  if (fs.existsSync(file)) {
    const decoded = decodeQrFromPng(file);
    console.log(`${file} => Decoded QR: ${decoded}`);
  } else {
    console.log(`${file} => File not found`);
  }
}
