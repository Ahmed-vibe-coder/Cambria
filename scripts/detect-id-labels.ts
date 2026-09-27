import fs from "fs";
import { PNG } from "pngjs";

const buf = fs.readFileSync("design-references/id-card/id-card-cr80-master-blank.png");
const png = PNG.sync.read(buf);

// Find dark text pixels in x = 320..480 (where the labels are)
const rowCounts: number[] = Array(png.height).fill(0);
for (let y = 150; y < 600; y++) {
  for (let x = 320; x < 480; x++) {
    const idx = (y * png.width + x) * 4;
    const r = png.data[idx];
    const g = png.data[idx+1];
    const b = png.data[idx+2];
    // dark navy / black text
    if (r < 80 && g < 80 && b < 100) {
      rowCounts[y]++;
    }
  }
}

// Find label text bands
let inBand = false;
let startY = 0;
console.log("Labels Y bands on id-card-cr80-master-blank.png:");
for (let y = 150; y < 600; y++) {
  if (rowCounts[y] > 5 && !inBand) {
    inBand = true;
    startY = y;
  } else if (rowCounts[y] <= 5 && inBand) {
    inBand = false;
    const h = y - startY;
    if (h >= 8) {
      console.log(`  Band: y=${startY}..${y} (h=${h}, mid=${Math.round(startY + h/2)})`);
    }
  }
}

// Check where "Valid Date" is
const validDateCounts: number[] = Array(png.height).fill(0);
for (let y = 450; y < 620; y++) {
  for (let x = 480; x < 630; x++) {
    const idx = (y * png.width + x) * 4;
    const r = png.data[idx];
    const g = png.data[idx+1];
    const b = png.data[idx+2];
    if (r < 80 && g < 80 && b < 100) {
      validDateCounts[y]++;
    }
  }
}
for (let y = 450; y < 620; y++) {
  if (validDateCounts[y] > 5) {
    console.log(`  Valid Date area: y=${y}`);
    break;
  }
}

// Check where "Certificate Number:" is
for (let y = 450; y < 620; y++) {
  let count = 0;
  for (let x = 750; x < 980; x++) {
    const idx = (y * png.width + x) * 4;
    const r = png.data[idx];
    const g = png.data[idx+1];
    const b = png.data[idx+2];
    if (r < 80 && g < 80 && b < 100) {
      count++;
    }
  }
  if (count > 5) {
    console.log(`  Certificate Number label area: y=${y}`);
    break;
  }
}
