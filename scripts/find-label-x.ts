import fs from "fs";
import { PNG } from "pngjs";

const buf = fs.readFileSync("design-references/id-card/id-card-cr80-master-blank.png");
const png = PNG.sync.read(buf);

// In y=481..501, find max X of dark pixels
let maxX = 0;
for (let y = 481; y <= 501; y++) {
  for (let x = 300; x < 600; x++) {
    const idx = (y * png.width + x) * 4;
    const r = png.data[idx];
    const g = png.data[idx+1];
    const b = png.data[idx+2];
    if (r < 80 && g < 80 && b < 100) {
      if (x > maxX) maxX = x;
    }
  }
}
console.log(`Specialization label ends at x=${maxX}`);

// In y=298..317, find max X of "Name"
let maxNameX = 0;
for (let y = 298; y <= 317; y++) {
  for (let x = 300; x < 600; x++) {
    const idx = (y * png.width + x) * 4;
    const r = png.data[idx];
    const g = png.data[idx+1];
    const b = png.data[idx+2];
    if (r < 80 && g < 80 && b < 100) {
      if (x > maxNameX) maxNameX = x;
    }
  }
}
console.log(`Name label ends at x=${maxNameX}`);
