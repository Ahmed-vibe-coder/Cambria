import fs from "fs";
import path from "path";
import sharp from "sharp";

const svg = `
<svg width="400" height="500" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="500" fill="#E2E8F0"/>
  <circle cx="200" cy="180" r="75" fill="#94A3B8"/>
  <path d="M70 450 C70 330 130 290 200 290 C270 290 330 330 330 450 Z" fill="#94A3B8"/>
</svg>
`;

async function main() {
  const target = path.join(process.cwd(), "public", "images", "avatar-placeholder.png");
  await sharp(Buffer.from(svg))
    .png()
    .toFile(target);
  console.log(`Created avatar placeholder: ${target}`);
}

main().catch(console.error);
