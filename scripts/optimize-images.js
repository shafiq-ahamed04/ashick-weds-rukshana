import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const originalsDir = path.join(projectRoot, 'originals');
const fallbackInputDir = path.join(projectRoot, 'public/images');
const outputDir = path.join(projectRoot, 'public/images/optimized');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Strictly background assets only - no portrait photos
const assetFiles = ['hero-bg.jpg'];

async function optimizeImages() {
  console.log('--- Optimizing Background Assets ---');

  for (const file of assetFiles) {
    let inputPath = path.join(originalsDir, file);
    if (!fs.existsSync(inputPath)) {
      inputPath = path.join(fallbackInputDir, file);
    }

    if (!fs.existsSync(inputPath)) {
      console.warn(`File not found: ${file}`);
      continue;
    }

    const baseName = path.parse(file).name;
    const outputWebp = path.join(outputDir, `${baseName}.webp`);
    const outputJpg = path.join(outputDir, `${baseName}.jpg`);

    const image = sharp(inputPath);
    const metadata = await image.metadata();

    const resizeOptions = metadata.width > 1400 ? { width: 1400, withoutEnlargement: true } : {};

    // 1. WebP version
    await sharp(inputPath)
      .resize(resizeOptions)
      .webp({ quality: 80, effort: 6 })
      .toFile(outputWebp);

    // 2. Optimized JPG fallback version
    await sharp(inputPath)
      .resize(resizeOptions)
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(outputJpg);

    const originalStats = fs.statSync(inputPath);
    const webpStats = fs.statSync(outputWebp);
    const jpgStats = fs.statSync(outputJpg);

    console.log(
      `✓ ${file} (${(originalStats.size / 1024 / 1024).toFixed(2)} MB) -> WebP: ${(
        webpStats.size / 1024
      ).toFixed(1)} KB | JPG: ${(jpgStats.size / 1024).toFixed(1)} KB`
    );
  }

  // Also execute make-logo
  const makeLogoScript = path.join(__dirname, 'make-logo.js');
  if (fs.existsSync(makeLogoScript)) {
    console.log('--- Running Logo Optimization ---');
    const { default: makeLogo } = await import('./make-logo.js');
    if (typeof makeLogo === 'function') {
      await makeLogo();
    }
  }

  // Also execute make-illustration
  const makeIllustrationScript = path.join(__dirname, 'make-illustration.js');
  if (fs.existsSync(makeIllustrationScript)) {
    console.log('--- Running Illustration Optimization ---');
    const { default: makeIllustration } = await import('./make-illustration.js');
    if (typeof makeIllustration === 'function') {
      await makeIllustration();
    }
  }

  // Also execute make-og-image
  const makeOgImageScript = path.join(__dirname, 'make-og-image.js');
  if (fs.existsSync(makeOgImageScript)) {
    console.log('--- Running OG Image Generation ---');
    const { default: makeOgImage } = await import('./make-og-image.js');
    if (typeof makeOgImage === 'function') {
      await makeOgImage();
    }
  }

  console.log('--- Asset Optimization Complete ---');
}

optimizeImages().catch((err) => {
  console.error('Error optimizing assets:', err);
  process.exit(1);
});
