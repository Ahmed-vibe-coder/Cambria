import fs from "fs";
import { PNG } from "pngjs";

const blankBuf = fs.readFileSync("design-references/id-card/id-card-cr80-master-blank.png");
const filledBuf = fs.readFileSync("design-references/id-card/id-card-cr80-filled-sample.png");
const blank = PNG.sync.read(blankBuf);
const filled = PNG.sync.read(filledBuf);

// Check differences row by row around each field
const bands = [
  { name: "Name", y1: 290, y2: 330 },
  { name: "National ID", y1: 335, y2: 375 },
  { name: "Country", y1: 380, y2: 420 },
  { name: "Title", y1: 425, y2: 465 },
  { name: "Specialization", y1: 470, y2: 510 },
  { name: "Valid Date", y1: 585, y2: 630 },
  { name: "Certificate Number", y1: 545, y2: 585 },
];

for (const b of bands) {
  let minX = 9999, maxX = 0, minY = 9999, maxY = 0;
  for (let y = b.y1; y <= b.y2; y++) {
    for (let x = 450; x < blank.width; x++) {
      const idx = (y * blank.width + x) * 4;
      const diff = Math.abs(blank.data[idx] - filled.data[idx]) +
                   Math.abs(blank.data[idx+1] - filled.data[idx+1]) +
                   Math.abs(blank.data[idx+2] - filled.data[idx+2]);
      if (diff > 50) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  console.log(`${b.name}: x=${minX}..${maxX} (w=${maxX-minX}), y=${minY}..${maxY} (h=${maxY-minY})`);
}
