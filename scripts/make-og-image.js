import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { wedding, getInvitationTimelineLine } from '../src/config/wedding.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const outputPath = path.join(projectRoot, 'public/og-image.jpg');

export default async function makeOgImage() {
  console.log('=== Generating Clean Photo-Free OG Image ===');

  const width = 1200;
  const height = 630;

  const xmlEscape = (str) =>
    String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  const groom = xmlEscape(wedding.groom);
  const bride = xmlEscape(wedding.bride);
  const timeline = xmlEscape(getInvitationTimelineLine());
  const bismillah = xmlEscape(wedding.bismillah);
  const tagline = xmlEscape(wedding.tagline);

  const svgContent = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Rich Plum / Blush / Gold Gradient Background -->
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#2D1127" />
        <stop offset="35%" stop-color="#3E1A36" />
        <stop offset="70%" stop-color="#5B2A4E" />
        <stop offset="100%" stop-color="#240D1F" />
      </linearGradient>

      <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#F4C6D7" stop-opacity="0.25" />
        <stop offset="50%" stop-color="#E3C98A" stop-opacity="0.12" />
        <stop offset="100%" stop-color="#3E1A36" stop-opacity="0" />
      </radialGradient>

      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#C9A24B" />
        <stop offset="50%" stop-color="#F3E5AB" />
        <stop offset="100%" stop-color="#C9A24B" />
      </linearGradient>
    </defs>

    <!-- Base Background -->
    <rect width="${width}" height="${height}" fill="url(#bgGrad)" />

    <!-- Ambient Center Glow -->
    <rect width="${width}" height="${height}" fill="url(#centerGlow)" />

    <!-- Ornamental Islamic Double Gold Border -->
    <rect x="40" y="40" width="${width - 80}" height="${height - 80}" rx="24" fill="none" stroke="url(#goldGrad)" stroke-width="2" opacity="0.6" />
    <rect x="52" y="52" width="${width - 104}" height="${height - 104}" rx="18" fill="none" stroke="#E3C98A" stroke-width="1" stroke-dasharray="6,6" opacity="0.4" />

    <!-- 8-Pointed Stars at 4 corners -->
    <g transform="translate(40, 40)" fill="#E3C98A" opacity="0.8">
      <circle cx="0" cy="0" r="4" />
    </g>
    <g transform="translate(${width - 40}, 40)" fill="#E3C98A" opacity="0.8">
      <circle cx="0" cy="0" r="4" />
    </g>
    <g transform="translate(40, ${height - 40})" fill="#E3C98A" opacity="0.8">
      <circle cx="0" cy="0" r="4" />
    </g>
    <g transform="translate(${width - 40}, ${height - 40})" fill="#E3C98A" opacity="0.8">
      <circle cx="0" cy="0" r="4" />
    </g>

    <!-- Bismillah Arabic -->
    <text x="600" y="145" text-anchor="middle" font-family="'Amiri', 'Traditional Arabic', serif" font-size="28" fill="#E3C98A" opacity="0.95">
      ${bismillah}
    </text>

    <!-- Kicker / Subtitle -->
    <text x="600" y="205" text-anchor="middle" font-family="'Cinzel', serif" font-size="14" letter-spacing="6" fill="#F4C6D7" font-weight="bold">
      WEDDING INVITATION
    </text>

    <!-- Couple Names -->
    <text x="600" y="310" text-anchor="middle" font-family="'Playfair Display', serif" font-size="64" font-weight="bold" fill="#FFF8F3">
      ${groom} &amp; ${bride}
    </text>

    <!-- Golden Ornamental Divider -->
    <g transform="translate(600, 360)">
      <line x1="-180" y1="0" x2="-25" y2="0" stroke="url(#goldGrad)" stroke-width="1.5" opacity="0.8" />
      <polygon points="0,-8 6,-2 12,0 6,2 0,8 -6,2 -12,0 -6,-2" fill="#E3C98A" />
      <circle cx="0" cy="0" r="2.5" fill="#3E1A36" />
      <line x1="25" y1="0" x2="180" y2="0" stroke="url(#goldGrad)" stroke-width="1.5" opacity="0.8" />
    </g>

    <!-- Tagline -->
    <text x="600" y="420" text-anchor="middle" font-family="'Cormorant Garamond', Georgia, serif" font-size="24" font-style="italic" fill="#E4D7F2" opacity="0.9">
      "${tagline}"
    </text>

    <!-- Timeline / Dates -->
    <rect x="360" y="475" width="480" height="46" rx="23" fill="#3E1A36" fill-opacity="0.6" stroke="#E3C98A" stroke-width="1.2" stroke-opacity="0.5" />
    <text x="600" y="504" text-anchor="middle" font-family="'Cinzel', serif" font-size="15" letter-spacing="3" fill="#E3C98A" font-weight="600">
      ${timeline}
    </text>
  </svg>
  `;

  await sharp(Buffer.from(svgContent))
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(outputPath);

  const stats = fs.statSync(outputPath);
  console.log(`✓ Rebuilt public/og-image.jpg (${(stats.size / 1024).toFixed(1)} KB) without any photo.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  makeOgImage().catch((err) => {
    console.error('Error generating OG image:', err);
    process.exit(1);
  });
}
