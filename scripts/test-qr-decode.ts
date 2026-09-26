import { decodeQrFromPng } from "../src/lib/renderer/decode-qr";
import path from "path";
import QRCode from "qrcode";
import fs from "fs";

async function testDecode() {
  // Test 1: Decode standalone QR png
  const testUrl = "http://localhost:3000/verify/tok_v8K29LpQx92M1a8B4z";
  const tempQrPath = path.resolve(process.cwd(), "public/documents/test-qr.png");
  await QRCode.toFile(tempQrPath, testUrl, { width: 300 });

  const decoded = decodeQrFromPng(tempQrPath);
  console.log("Decoded standalone QR:", decoded);
  console.log("Matches original:", decoded === testUrl);

  // Test 2: Try decoding full cert page screenshot
  const certPngPath = path.resolve(process.cwd(), "public/documents/sample-cert-001.png");
  if (fs.existsSync(certPngPath)) {
    const certDecoded = decodeQrFromPng(certPngPath);
    console.log("Decoded full cert screenshot:", certDecoded);
  }

  // Test 3: Try decoding full card page screenshot
  const cardPngPath = path.resolve(process.cwd(), "public/documents/sample-card-001.png");
  if (fs.existsSync(cardPngPath)) {
    const cardDecoded = decodeQrFromPng(cardPngPath);
    console.log("Decoded full card screenshot:", cardDecoded);
  }
}

testDecode().catch(console.error);
