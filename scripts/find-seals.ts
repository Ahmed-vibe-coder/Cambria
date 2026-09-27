import fs from "fs";
import { PNG } from "pngjs";

const buf = fs.readFileSync("design-references/certificates/cert-landscape-geometric-master-blank.png");
const png = PNG.sync.read(buf);

let minX = 9999, maxX = 0, minY = 9999, maxY = 0;
// Search in bottom half
for (let y = 1000; y < 1400; y++) {
  for (let x = 300; x < 900; x++) {
    const idx = (y * png.width + x) * 4;
    const r = png.data[idx];
    const g = png.data[idx+1];
    const b = png.data[idx+2];
    if (r < 200 || g < 200 || b < 200) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

console.log(`Seals bounding box on cert-landscape-geometric: x=${minX}..${maxX}, y=${minY}..${maxY}`);
