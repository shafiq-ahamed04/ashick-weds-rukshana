import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const possibleInputPaths = [
  path.join(projectRoot, 'originals/logo_ar.jpg'),
  path.join(projectRoot, 'public/images/logo_ar.jpg'),
  'C:/Users/shafi/Downloads/logo ar.jpg',
];

let inputPath = possibleInputPaths.find((p) => fs.existsSync(p));

const outputDir = path.join(projectRoot, 'public/images/optimized');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputPng = path.join(outputDir, 'logo_ar.png');
const outputWebp = path.join(outputDir, 'logo_ar.webp');

if (!inputPath) {
  if (fs.existsSync(outputWebp) && fs.existsSync(outputPng)) {
    console.log('Original logo not found, but pre-built logo_ar.png and logo_ar.webp already exist. Skipping.');
  } else {
    console.error('Could not find logo_ar.jpg in originals, public/images, or Downloads');
    process.exit(1);
  }
}

export default async function processLogo() {
  if (!inputPath) {
    console.log('Skipping logo processing (using existing pre-built assets).');
    return;
  }
  console.log(`\n=== REBUILDING TRANSPARENT LOGO ===`);
  console.log(`Reading logo from: ${inputPath}`);

  // Load image, resize to max 1400px wide while preserving aspect ratio
  let pipeline = sharp(inputPath);
  const metadata = await pipeline.metadata();

  let targetWidth = metadata.width;
  let targetHeight = metadata.height;
  if (targetWidth > 1400) {
    targetHeight = Math.round((1400 / targetWidth) * targetHeight);
    targetWidth = 1400;
    pipeline = pipeline.resize(targetWidth, targetHeight);
  }

  // Convert to raw RGBA with 4 channels
  const { data, info } = await pipeline.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Create RGBA buffer
  const rgbaBuffer = Buffer.alloc(width * height * 4);

  // Linear ramp thresholds
  // alpha = 0 when m >= 250, alpha = 255 when m <= 232, linear ramp between
  const minOpaque = 232;
  const minTransparent = 250;

  for (let i = 0; i < width * height; i++) {
    const srcIdx = i * channels;
    const dstIdx = i * 4;

    const r = data[srcIdx];
    const g = data[srcIdx + 1];
    const b = data[srcIdx + 2];
    const srcAlpha = channels === 4 ? data[srcIdx + 3] : 255;

    // If source is already fully transparent, it remains fully transparent
    if (srcAlpha === 0) {
      rgbaBuffer[dstIdx] = 0;
      rgbaBuffer[dstIdx + 1] = 0;
      rgbaBuffer[dstIdx + 2] = 0;
      rgbaBuffer[dstIdx + 3] = 0;
      continue;
    }

    const m = Math.min(r, g, b);

    let alpha;
    if (m >= minTransparent) {
      alpha = 0;
    } else if (m <= minOpaque) {
      alpha = 255;
    } else {
      alpha = Math.round(255 * ((minTransparent - m) / (minTransparent - minOpaque)));
    }

    if (alpha === 0) {
      rgbaBuffer[dstIdx] = 0;
      rgbaBuffer[dstIdx + 1] = 0;
      rgbaBuffer[dstIdx + 2] = 0;
      rgbaBuffer[dstIdx + 3] = 0;
    } else if (alpha === 255) {
      rgbaBuffer[dstIdx] = r;
      rgbaBuffer[dstIdx + 1] = g;
      rgbaBuffer[dstIdx + 2] = b;
      rgbaBuffer[dstIdx + 3] = 255;
    } else {
      // De-matte the semi-transparent edge pixels: un-blend from white
      // C = clamp((I - (255 - a) ) * 255 / a, 0, 255)
      const dematte = (val) => {
        const c = Math.round(((val - (255 - alpha)) * 255) / alpha);
        return Math.max(0, Math.min(255, c));
      };

      rgbaBuffer[dstIdx] = dematte(r);
      rgbaBuffer[dstIdx + 1] = dematte(g);
      rgbaBuffer[dstIdx + 2] = dematte(b);
      rgbaBuffer[dstIdx + 3] = alpha;
    }
  }

  // 1. Output PNG with alpha
  await sharp(rgbaBuffer, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(outputPng);

  // 2. Output WebP with alpha (quality starting at 90, alphaQuality 100, max 1400px wide, under 150KB)
  let webpQuality = 90;
  let webpBuffer = await sharp(rgbaBuffer, { raw: { width, height, channels: 4 } })
    .webp({ quality: webpQuality, effort: 6, alphaQuality: 100 })
    .toBuffer();

  // If over 150KB, adjust quality until strictly under 150KB
  while (webpBuffer.length > 150 * 1024 && webpQuality > 60) {
    webpQuality -= 2;
    webpBuffer = await sharp(rgbaBuffer, { raw: { width, height, channels: 4 } })
      .webp({ quality: webpQuality, effort: 6, alphaQuality: 100 })
      .toBuffer();
  }

  fs.writeFileSync(outputWebp, webpBuffer);

  const pngStats = fs.statSync(outputPng);
  const webpStats = fs.statSync(outputWebp);

  console.log(`✓ Generated ${outputPng} (${(pngStats.size / 1024).toFixed(1)} KB)`);
  console.log(`✓ Generated ${outputWebp} (${(webpStats.size / 1024).toFixed(1)} KB, quality=${webpQuality})`);

  // ==========================================
  // 2. VERIFY THE ALPHA (do not skip)
  // ==========================================
  console.log(`\n=== VERIFYING ALPHA CHANNELS ===`);

  const assertAlpha = async (filePath, label) => {
    const meta = await sharp(filePath).metadata();
    if (!meta.hasAlpha) {
      throw new Error(`FAIL: ${label} does not have alpha!`);
    }

    const { data: rawData, info: rawInfo } = await sharp(filePath).raw().toBuffer({ resolveWithObject: true });
    const getPixel = (x, y) => {
      const idx = (y * rawInfo.width + x) * rawInfo.channels;
      return [
        rawData[idx],
        rawData[idx + 1],
        rawData[idx + 2],
        rawData[idx + 3],
      ];
    };

    const w = rawInfo.width;
    const h = rawInfo.height;

    const cornerTL = getPixel(5, 5);
    const cornerTR = getPixel(w - 5, 5);
    const cornerBL = getPixel(5, h - 5);
    const cornerBR = getPixel(w - 5, h - 5);
    const center = getPixel(Math.floor(w / 2), Math.floor(h / 2));

    console.log(`Checking ${label}:`);
    console.log(`  - metadata.hasAlpha: ${meta.hasAlpha} (width: ${w}, height: ${h})`);
    console.log(`  - Pixel (5, 5) alpha: ${cornerTL[3]}`);
    console.log(`  - Pixel (width-5, 5) alpha: ${cornerTR[3]}`);
    console.log(`  - Pixel (5, height-5) alpha: ${cornerBL[3]}`);
    console.log(`  - Pixel (width-5, height-5) alpha: ${cornerBR[3]}`);
    console.log(`  - Center pixel alpha: ${center[3]} (RGB: ${center[0]}, ${center[1]}, ${center[2]})`);

    if (cornerTL[3] !== 0 || cornerTR[3] !== 0 || cornerBL[3] !== 0 || cornerBR[3] !== 0) {
      throw new Error(`FAIL: ${label} corners do not have alpha === 0!`);
    }

    if (center[3] !== 255) {
      throw new Error(`FAIL: ${label} center does not have alpha === 255!`);
    }

    console.log(`✓ All assertions passed for ${label}\n`);
  };

  await assertAlpha(outputPng, 'logo_ar.png');
  await assertAlpha(outputWebp, 'logo_ar.webp');
}

// Self-run when invoked directly
if (process.argv[1] && process.argv[1].endsWith('make-logo.js')) {
  processLogo().catch((err) => {
    console.error('Error during make-logo:', err);
    process.exit(1);
  });
}
