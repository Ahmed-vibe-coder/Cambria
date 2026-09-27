import fs from "fs";
import { PNG } from "pngjs";

function findNonWhite(file: string, region: { x1: number, y1: number, x2: number, y2: number }) {
  const buf = fs.readFileSync(file);
  const png = PNG.sync.read(buf);
  let nonWhite = 0;
  for (let y = region.y1; y < region.y2; y++) {
    for (let x = region.x1; x < region.x2; x++) {
      const idx = (y * png.width + x) * 4;
      const r = png.data[idx];
      const g = png.data[idx+1];
      const b = png.data[idx+2];
      // If not near white/light-grey background
      if (r < 230 || g < 230 || b < 230) {
        nonWhite++;
      }
    }
  }
  console.log(`${file} [${region.x1},${region.y1} to ${region.x2},${region.y2}]: non-white pixels = ${nonWhite}`);
}

findNonWhite("design-references/certificates/cert-landscape-geometric-master-blank.png", { x1: 400, y1: 1200, x2: 600, y2: 1400 });
findNonWhite("design-references/certificates/cert-landscape-geometric-master-blank.png", { x1: 650, y1: 1200, x2: 800, y2: 1400 });
findNonWhite("design-references/certificates/cert-landscape-geometric-master-blank.png", { x1: 1350, y1: 1100, x2: 1600, y2: 1350 });
findNonWhite("design-references/certificates/cert-portrait-elegant-gold-master-blank.png", { x1: 760, y1: 1740, x2: 960, y2: 1940 });
findNonWhite("design-references/id-card/id-card-cr80-master-blank.png", { x1: 650, y1: 490, x2: 740, y2: 580 });
findNonWhite("design-references/id-card/id-card-cr80-master-blank.png", { x1: 17, y1: 190, x2: 300, y2: 580 });
