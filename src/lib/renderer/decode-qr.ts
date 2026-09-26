import fs from "fs";
import { PNG } from "pngjs";
import jsQR from "jsqr";

export function decodeQrFromPng(pngPath: string): string | null {
  const fileBuffer = fs.readFileSync(pngPath);
  const png = PNG.sync.read(fileBuffer);
  const code = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  return code ? code.data : null;
}
