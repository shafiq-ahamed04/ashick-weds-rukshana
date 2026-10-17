# Ashick & Rukshana — Cinematic Muslim Wedding Invitation (Nikah & Walima Edition)

A cinematic, mobile-first Muslim wedding invitation website featuring scroll-driven storytelling, royal arched pavilion aesthetics, gold calligraphy, glowing lanterns, and soft floating petals.

---

## 🏛️ Stack & Technologies

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom Islamic wedding palette tokens & Google Fonts
- **Animations**: [GSAP](https://greensock.com/gsap/) with [ScrollTrigger](https://greensock.com/scrolltrigger/)
- **Smooth Scroll**: [Lenis](https://github.com/darkroomengineering/lenis)
- **Typography**:
  - `Pinyon Script` (Couple names & monogram)
  - `Amiri` (Holy Bismillah calligraphy)
  - `Cinzel` (Small caps royal labels & headings)
  - `Cormorant Garamond` (Body typography)

---

## ⚙️ Configuration (Single Source of Truth)

All names, dates, venues, Quranic ayah / Bismillah, and contact details are centrally configured in:
`src/config/wedding.js`

```javascript
export const wedding = {
  bride: "Rukshana Parveen",
  groom: "Ashick",
  monogram: "R & A",
  bismillah: "بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ",
  tagline: "A journey of faith, love & a beautiful beginning",
  events: {
    nikah:  { date: "2026-12-27", time: "11:00 AM", venue: "Arulanandham Mahal", city: "Thanjavur", mapQuery: "Arulanandham Mahal Thanjavur" },
    walima: { date: "2026-12-30", time: "12:00 PM", venue: "Vasantha Mahal",     city: "Namakkal",  mapQuery: "Vasantha Mahal Namakkal" }
  },
  whatsapp: "919500938029",
  message: "With the blessings of Allah and our families, we invite you to celebrate our beginning."
};
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## 📦 Deployment to Vercel

This project is ready to deploy directly on Vercel:
1. Push repository to GitHub.
2. Import the project in Vercel.
3. Framework preset: **Vite**.
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click **Deploy**.

---

## ✨ Phase 1 Deliverables Summary

- **Intro Splash Screen**:
  - Monogram with animated hairline gold circle (SVG stroke animation).
  - Cinzel caption "UNFOLDING OUR STORY".
  - Glowing lantern tap-to-open button.
  - Curtain split animation: royal deep-plum drapes part to left and right.
  - Scroll locked until curtains open.
- **Hero Section**:
  - Full viewport arched pavilion (`/public/images/hero-bg.jpg`) with slow Ken Burns zoom.
  - Staggered fade-up reveal on opening:
    1. Bismillah in Amiri
    2. Gold hairline divider with ornamental Islamic centerpiece
    3. "TOGETHER WITH THEIR FAMILIES" in Cinzel small caps
    4. Bride name (*Rukshana Parveen*) in Pinyon Script
    5. "&" with side lines
    6. Groom name (*Ashick*) in Pinyon Script
    7. Tagline from config
    8. Event date and city formatted dynamically from config (*27 DECEMBER 2026 · THANJAVUR*)
    9. "Scroll to unfold our story" with bouncing arrow indicator
  - Layered floral framing (wisteria, blush roses) with depth of field blur.
  - Interactive canvas with drifting petals and glowing golden dust particles.
  - Atmospheric lantern flicker animations.
- **Mobile-First & Performance**:
  - Responsive layout (tested across 360px, 390px, 768px, 1280px+).
  - Uses `100svh` for mobile address bar resilience.
  - Respects `prefers-reduced-motion`.
