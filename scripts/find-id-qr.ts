import fs from "fs";
import { PNG } from "pngjs";

const buf = fs.readFileSync("design-references/id-card/id-card-cr80-filled-sample.png");
const png = PNG.sync.read(buf);

// Find QR code dark matrix
let qrMinX = 9999, qrMaxX = 0, qrMinY = 9999, qrMaxY = 0;
for (let y = 450; y < 600; y++) {
  for (let x = 600; x < 760; x++) {
    const idx = (y * png.width + x) * 4;
    const r = png.data[idx];
    const g = png.data[idx+1];
    const b = png.data[idx+2];
    if (r < 40 && g < 40 && b < 40) {
      if (x < qrMinX) qrMinX = x;
      if (x > qrMaxX) qrMaxX = x;
      if (y < qrMinY) qrMinY = y;
      if (y > qrMaxY) qrMaxY = y;
    }
  }
}
console.log(`QR on filled sample: x=${qrMinX}..${qrMaxX} (w=${qrMaxX-qrMinX}), y=${qrMinY}..${qrMaxY} (h=${qrMaxY-qrMinY})`);
