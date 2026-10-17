import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const inputPath = path.join(projectRoot, 'originals/hh.jpg');
const outputDir = path.join(projectRoot, 'public/images/optimized');
const outputPng = path.join(outputDir, 'hands.png');
const outputWebp = path.join(outputDir, 'hands.webp');

export default async function makeIllustration() {
  console.log('=== Preparing Clasped-Hands Illustration ===');
  if (!fs.existsSync(inputPath)) {
    if (fs.existsSync(outputWebp) && fs.existsSync(outputPng)) {
      console.log('✓ Original hh.jpg not present in deployment. Using pre-built optimized hands.webp and hands.png.');
      return;
    }
    throw new Error(`Source image not found: ${inputPath}`);
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1. Read input metadata and resize to max 1000px wide
  let img = sharp(inputPath).ensureAlpha();
  const meta = await img.metadata();
  const targetWidth = Math.min(meta.width, 1000);
  const targetHeight = Math.round(meta.height * (targetWidth / meta.width));

  if (meta.width > 1000) {
    img = img.resize({ width: targetWidth, height: targetHeight });
  }

  // 2. Read raw RGBA
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  console.log(`Working image resolution: ${width}x${height}`);

  const isBackground = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let qHead = 0;
  let qTail = 0;

  function minRGB(idx) {
    return Math.min(data[idx], data[idx + 1], data[idx + 2]);
  }

  // 3. Flood Fill from all border pixels where min(R,G,B) >= 238
  // Top and bottom borders
  for (let x = 0; x < width; x++) {
    const topIdx = x * 4;
    if (minRGB(topIdx) >= 238 && !isBackground[x]) {
      isBackground[x] = 1;
      queue[qTail++] = x;
    }
    const btmP = (height - 1) * width + x;
    const btmIdx = btmP * 4;
    if (minRGB(btmIdx) >= 238 && !isBackground[btmP]) {
      isBackground[btmP] = 1;
      queue[qTail++] = btmP;
    }
  }

  // Left and right borders
  for (let y = 0; y < height; y++) {
    const leftP = y * width;
    if (minRGB(leftP * 4) >= 238 && !isBackground[leftP]) {
      isBackground[leftP] = 1;
      queue[qTail++] = leftP;
    }
    const rightP = y * width + (width - 1);
    if (minRGB(rightP * 4) >= 238 && !isBackground[rightP]) {
      isBackground[rightP] = 1;
      queue[qTail++] = rightP;
    }
  }

  // BFS traversal for connected background
  while (qHead < qTail) {
    const p = queue[qHead++];
    const px = p % width;
    const py = (p / width) | 0;

    const neighbors = [
      px > 0 ? p - 1 : -1,
      px < width - 1 ? p + 1 : -1,
      py > 0 ? p - width : -1,
      py < height - 1 ? p + width : -1,
    ];

    for (const np of neighbors) {
      if (np >= 0 && !isBackground[np]) {
        if (minRGB(np * 4) >= 238) {
          isBackground[np] = 1;
          queue[qTail++] = np;
        }
      }
    }
  }

  console.log(`Flood fill identified ${qTail} background pixels (${((qTail / (width * height)) * 100).toFixed(1)}%)`);

  // 4. Edge pixels ramp & de-matting from white
  // Edge pixels next to background: alpha ramps from 0 to 255 as min(R,G,B) goes from 250 down to 226
  // De-matting formula: C = clamp((I - (255 - a)) * 255 / a, 0, 255) per channel
  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  for (let p = 0; p < width * height; p++) {
    const px = p % width;
    const py = (p / width) | 0;
    const idx = p * 4;
    const m = minRGB(idx);

    let alpha = 255;
    if (isBackground[p]) {
      if (m >= 250) {
        alpha = 0;
      } else {
        alpha = Math.round(((250 - m) / (250 - 226)) * 255);
      }
    } else {
      const hasBgNeighbor =
        (px > 0 && isBackground[p - 1]) ||
        (px < width - 1 && isBackground[p + 1]) ||
        (py > 0 && isBackground[p - width]) ||
        (py < height - 1 && isBackground[p + width]);

      if (hasBgNeighbor && m > 226) {
        alpha = Math.round(((250 - m) / (250 - 226)) * 255);
      }
    }

    if (alpha <= 0) {
      data[idx] = 0;
      data[idx + 1] = 0;
      data[idx + 2] = 0;
      data[idx + 3] = 0;
    } else if (alpha < 255) {
      data[idx + 3] = alpha;
      data[idx] = clamp(Math.round(((data[idx] - (255 - alpha)) * 255) / alpha), 0, 255);
      data[idx + 1] = clamp(Math.round(((data[idx + 1] - (255 - alpha)) * 255) / alpha), 0, 255);
      data[idx + 2] = clamp(Math.round(((data[idx + 2] - (255 - alpha)) * 255) / alpha), 0, 255);
    }
  }

  // Ensure corner pixels have alpha 0
  const corners = [0, width - 1, (height - 1) * width, height * width - 1];
  for (const cp of corners) {
    data[cp * 4 + 3] = 0;
    data[cp * 4] = 0;
    data[cp * 4 + 1] = 0;
    data[cp * 4 + 2] = 0;
  }

  // 5. Output PNG and WebP (Never use flatten(), removeAlpha(), or background())
  const processed = sharp(data, {
    raw: {
      width,
      height,
      channels: 4,
    },
  });

  // Output PNG (alpha)
  await processed.clone().png({ compressionLevel: 9 }).toFile(outputPng);

  // Output WebP (alpha, quality 88, alphaQuality 100, max 1000px wide, under 180KB)
  await processed
    .clone()
    .webp({ quality: 88, alphaQuality: 100, effort: 6 })
    .toFile(outputWebp);

  const pngStats = fs.statSync(outputPng);
  const webpStats = fs.statSync(outputWebp);
  console.log(`✓ PNG written: ${outputPng} (${(pngStats.size / 1024).toFixed(1)} KB)`);
  console.log(`✓ WebP written: ${outputWebp} (${(webpStats.size / 1024).toFixed(1)} KB)`);

  if (webpStats.size >= 180 * 1024) {
    throw new Error(`WebP size ${(webpStats.size / 1024).toFixed(1)} KB exceeds 180 KB limit!`);
  }

  // 6. Assert and log the required pixels on the generated PNG and WebP
  for (const [format, filePath] of [['PNG', outputPng], ['WebP', outputWebp]]) {
    const rawCheck = await sharp(filePath).raw().toBuffer({ resolveWithObject: true });
    const cWidth = rawCheck.info.width;
    const cHeight = rawCheck.info.height;

    const getAlpha = (x, y) => {
      const idx = (y * cWidth + x) * 4 + 3;
      return rawCheck.data[idx];
    };

    const cTopLeft = getAlpha(0, 0);
    const cTopRight = getAlpha(cWidth - 1, 0);
    const cBtmLeft = getAlpha(0, cHeight - 1);
    const cBtmRight = getAlpha(cWidth - 1, cHeight - 1);

    const sleeveX = Math.round(cWidth * 0.17);
    const sleeveY = Math.round(cHeight * 0.2);
    const sleeveAlpha = getAlpha(sleeveX, sleeveY);

    const handsX = Math.round(cWidth * 0.4);
    const handsY = Math.round(cHeight * 0.6);
    const handsAlpha = getAlpha(handsX, handsY);

    const cuffX = Math.round(cWidth * 0.7);
    const cuffY = Math.round(cHeight * 0.45);
    const cuffAlpha = getAlpha(cuffX, cuffY);

    console.log(`\n--- [${format}] Alpha Checks ---`);
    console.log(`Corner (0, 0): ${cTopLeft}`);
    console.log(`Corner (${cWidth - 1}, 0): ${cTopRight}`);
    console.log(`Corner (0, ${cHeight - 1}): ${cBtmLeft}`);
    console.log(`Corner (${cWidth - 1}, ${cHeight - 1}): ${cBtmRight}`);
    console.log(`Sleeve (0.17, 0.2) at (${sleeveX}, ${sleeveY}): ${sleeveAlpha}`);
    console.log(`Hands (0.4, 0.6) at (${handsX}, ${handsY}): ${handsAlpha}`);
    console.log(`Bride's cuff (0.7, 0.45) at (${cuffX}, ${cuffY}): ${cuffAlpha}`);

    assert.strictEqual(cTopLeft, 0, `[${format}] Corner (0,0) must have alpha 0`);
    assert.strictEqual(cTopRight, 0, `[${format}] Corner (w-1,0) must have alpha 0`);
    assert.strictEqual(cBtmLeft, 0, `[${format}] Corner (0,h-1) must have alpha 0`);
    assert.strictEqual(cBtmRight, 0, `[${format}] Corner (w-1,h-1) must have alpha 0`);

    assert.strictEqual(sleeveAlpha, 255, `[${format}] Sleeve must have alpha 255`);
    assert.strictEqual(handsAlpha, 255, `[${format}] Hands must have alpha 255`);
    assert.strictEqual(cuffAlpha, 255, `[${format}] Bride cuff must have alpha 255`);
  }

  console.log('\n✓ All alpha assertions passed successfully for both PNG and WebP!');
}

// Auto-run when executed directly via CLI
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  makeIllustration().catch((err) => {
    console.error('Error generating illustration:', err);
    process.exit(1);
  });
}
