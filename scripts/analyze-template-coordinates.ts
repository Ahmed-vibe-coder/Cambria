import fs from "fs";
import path from "path";
import { PNG } from "pngjs";

function getDiffBoxes(blankPath: string, filledPath: string) {
  const blankBuf = fs.readFileSync(blankPath);
  const filledBuf = fs.readFileSync(filledPath);
  const blank = PNG.sync.read(blankBuf);
  const filled = PNG.sync.read(filledBuf);

  if (blank.width !== filled.width || blank.height !== filled.height) {
    console.error(`Dimensions mismatch: ${blank.width}x${blank.height} vs ${filled.width}x${filled.height}`);
    return;
  }

  const { width, height } = blank;
  // Divide image into vertical slices or blocks of 20x20 to find regions with text
  const blockSize = 20;
  const gridW = Math.ceil(width / blockSize);
  const gridH = Math.ceil(height / blockSize);
  const diffGrid: boolean[][] = Array.from({ length: gridH }, () => Array(gridW).fill(false));

  let diffCount = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const dr = Math.abs(blank.data[idx] - filled.data[idx]);
      const dg = Math.abs(blank.data[idx + 1] - filled.data[idx + 1]);
      const db = Math.abs(blank.data[idx + 2] - filled.data[idx + 2]);
      const da = Math.abs(blank.data[idx + 3] - filled.data[idx + 3]);
      if (dr + dg + db + da > 30) {
        diffCount++;
        const gx = Math.floor(x / blockSize);
        const gy = Math.floor(y / blockSize);
        diffGrid[gy][gx] = true;
      }
    }
  }

  console.log(`Total diff pixels: ${diffCount}`);

  // Find connected rows of blocks to identify clusters
  const clusters: { minY: number; maxY: number; minX: number; maxX: number; blocks: number }[] = [];
  const visited: boolean[][] = Array.from({ length: gridH }, () => Array(gridW).fill(false));

  for (let gy = 0; gy < gridH; gy++) {
    for (let gx = 0; gx < gridW; gx++) {
      if (diffGrid[gy][gx] && !visited[gy][gx]) {
        // BFS cluster
        let minX = gx, maxX = gx, minY = gy, maxY = gy, count = 0;
        const queue: [number, number][] = [[gx, gy]];
        visited[gy][gx] = true;
        while (queue.length > 0) {
          const [cx, cy] = queue.shift()!;
          count++;
          if (cx < minX) minX = cx;
          if (cx > maxX) maxX = cx;
          if (cy < minY) minY = cy;
          if (cy > maxY) maxY = cy;

          // Check 8 neighbors
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const ny = cy + dy;
              const nx = cx + dx;
              if (ny >= 0 && ny < gridH && nx >= 0 && nx < gridW) {
                if (diffGrid[ny][nx] && !visited[ny][nx]) {
                  visited[ny][nx] = true;
                  queue.push([nx, ny]);
                }
              }
            }
          }
        }

        if (count > 2) {
          clusters.push({
            minX: minX * blockSize,
            maxX: Math.min((maxX + 1) * blockSize, width),
            minY: minY * blockSize,
            maxY: Math.min((maxY + 1) * blockSize, height),
            blocks: count
          });
        }
      }
    }
  }

  // Sort clusters by Y
  clusters.sort((a, b) => a.minY - b.minY);

  for (const c of clusters) {
    const w = c.maxX - c.minX;
    const h = c.maxY - c.minY;
    console.log(`  Cluster: x=${c.minX}, y=${c.minY}, w=${w}, h=${h} (blocks: ${c.blocks})`);
  }
}

console.log("=== 1. CERTIFICATE LANDSCAPE GEOMETRIC ===");
getDiffBoxes(
  "design-references/certificates/cert-landscape-geometric-master-blank.png",
  "design-references/certificates/cert-landscape-geometric-filled-sample.png"
);

console.log("\n=== 2. CERTIFICATE PORTRAIT ELEGANT GOLD ===");
getDiffBoxes(
  "design-references/certificates/cert-portrait-elegant-gold-master-blank.png",
  "design-references/certificates/cert-portrait-elegant-gold-filled-sample.png"
);

console.log("\n=== 3. ID CARD CR80 ===");
getDiffBoxes(
  "design-references/id-card/id-card-cr80-master-blank.png",
  "design-references/id-card/id-card-cr80-filled-sample.png"
);
