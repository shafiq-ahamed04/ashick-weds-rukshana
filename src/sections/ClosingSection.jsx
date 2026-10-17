import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { wedding, getHeroEventDateString } from '../config/wedding';
import GoldDivider from '../components/GoldDivider';
import { ArrowUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function ClosingSection() {
  const sectionRef = useRef(null);
  const [petals, setPetals] = useState([]);

  const closing = wedding.closing || {
    label: 'TOGETHER IS A BEAUTIFUL PLACE TO BE',
    heading: 'Our forever begins with you.',
    arabic: 'جَزَاكُمُ اللَّهُ خَيْرًا',
    translation: 'May Allah reward you with goodness.',
  };

  const dateLine = getHeroEventDateString('nikah');

  // GSAP Entrance
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (!prefersReducedMotion) {
        gsap.fromTo(
          '.closing-stagger-item',
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );
      } else {
        gsap.set('.closing-stagger-item', { opacity: 1, y: 0 });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Tap anywhere inside section to scatter gentle petals
  const handleSectionTap = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const id = Date.now() + Math.random();
    const colors = ['#F4C6D7', '#E4D7F2', '#FFF8F3', '#E3C98A', '#FBE6EE'];
    const count = 6;
    const newBatch = [];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 50 + 35;
      const targetX = Math.cos(angle) * velocity;
      const targetY = Math.sin(angle) * velocity + 35;
      const rotation = Math.random() * 360 - 180;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 8 + 8;

      newBatch.push({
        id: `${id}-closing-petal-${i}`,
        x,
        y,
        targetX,
        targetY,
        rotation,
        color,
        size,
      });
    }

    setPetals((prev) => [...prev.slice(-18), ...newBatch]);

    // Clean up after animation
    setTimeout(() => {
      setPetals((prev) => prev.filter((p) => !newBatch.some((nb) => nb.id === p.id)));
    }, 1800);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <footer
      ref={sectionRef}
      onClick={handleSectionTap}
      className="relative w-full min-h-[90vh] sm:min-h-screen py-24 sm:py-32 px-4 sm:px-6 md:px-12 overflow-hidden flex flex-col items-center justify-between text-center select-none cursor-pointer selection:bg-[#C9A24B]/30 selection:text-[#FFF8F3]"
      style={{
        background: 'linear-gradient(180deg, #D4C1EA 0%, #C9B2E4 18%, #85537B 48%, #4A2041 78%, #2A1024 100%)',
      }}
      aria-label="Closing Blessing and Farewell"
    >
      {/* CELESTIAL TWILIGHT PARTICLES & CRESCENT MOON */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Soft twilight gradient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-radial from-[#F4C6D7]/20 via-[#E3C98A]/10 to-transparent blur-3xl pointer-events-none" />

        {/* Crescent Moon & Venus in twilight sky */}
        <div className="absolute top-12 right-[12%] sm:right-[18%] opacity-85">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            {/* Soft moon glow */}
            <circle cx="22" cy="22" r="18" fill="#E3C98A" fillOpacity="0.15" filter="blur(4px)" />
            {/* Elegant Crescent Moon */}
            <path
              d="M26 10 C18 12 13 18 14 26 C15 33 22 36 28 34 C21 37 12 32 11 23 C10 16 16 10 26 10 Z"
              fill="#FFF8F3"
              stroke="#E3C98A"
              strokeWidth="0.75"
            />
            {/* Guiding Morning/Evening Star */}
            <circle cx="34" cy="14" r="1.5" fill="#FFF8F3" className="animate-pulse" />
          </svg>
        </div>

        {/* Twinkling ambient stars */}
        <div className="absolute top-[22%] left-[15%] w-1.5 h-1.5 rounded-full bg-[#FFF8F3] shadow-[0_0_8px_#E3C98A] animate-pulse" />
        <div className="absolute top-[38%] left-[24%] w-1 h-1 rounded-full bg-[#E3C98A] shadow-[0_0_6px_#C9A24B] animate-pulse" style={{ animationDelay: '1.2s' }} />
        <div className="absolute top-[45%] right-[22%] w-1.5 h-1.5 rounded-full bg-[#FFF8F3] shadow-[0_0_8px_#E3C98A] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[60%] left-[18%] w-1 h-1 rounded-full bg-[#E3C98A] shadow-[0_0_6px_#C9A24B] animate-pulse" style={{ animationDelay: '0.8s' }} />
      </div>

      {/* TAP PETALS SCATTER OVERLAY */}
      <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden" aria-hidden="true">
        {petals.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${p.x}px`,
              top: `${p.y}px`,
              width: `${p.size}px`,
              height: `${p.size * 1.3}px`,
              backgroundColor: p.color,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              transform: `translate(${p.targetX}px, ${p.targetY}px) rotate(${p.rotation}deg)`,
              opacity: 0,
              transition: 'transform 1.6s cubic-bezier(0.2, 0.8, 0.3, 1), opacity 1.6s ease-out',
            }}
          />
        ))}
      </div>

      {/* CENTRAL CLOSING CONTENT */}
      <div className="relative z-20 max-w-2xl mx-auto flex flex-col items-center my-auto pt-6 pb-12">
        {/* Small Caps Label - Bold Gold */}
        <span
          className="closing-stagger-item font-label text-sm sm:text-[15px] tracking-[0.22em] text-[#8A6414] uppercase font-extrabold mb-3 drop-shadow-[0_1px_2px_rgba(255,255,255,0.6)]"
          style={{ WebkitTextStroke: '0.4px currentColor' }}
        >
          {closing.label}
        </span>

        {/* Display Heading */}
        <h2 className="closing-stagger-item font-display font-bold text-[clamp(34px,7.5vw,60px)] text-[#FFF8F3] leading-[1.15] my-2 drop-shadow-md">
          {closing.heading}
        </h2>

        {/* Gold Accent Divider */}
        <div className="closing-stagger-item my-4">
          <GoldDivider className="opacity-90" />
        </div>

        {/* Couple Names - Elegantly Shaped and Centered */}
        <div className="closing-stagger-item my-3 flex flex-col items-center justify-center text-center">
          <span className="font-script text-[clamp(40px,9vw,80px)] text-[#FFF8F3] leading-[1.15] name-script-shadow block">
            {wedding.bride}
          </span>
          <div className="flex items-center justify-center gap-3 my-1">
            <span className="h-[1px] w-10 sm:w-16 bg-gradient-to-r from-transparent via-[#E3C98A] to-[#E3C98A]/70" />
            <span className="font-script text-2xl sm:text-3xl text-[#E3C98A] font-bold name-script-shadow select-none">
              &amp;
            </span>
            <span className="h-[1px] w-10 sm:w-16 bg-gradient-to-l from-transparent via-[#E3C98A] to-[#E3C98A]/70" />
          </div>
          <span className="font-script text-[clamp(40px,9vw,80px)] text-[#FFF8F3] leading-[1.15] name-script-shadow block">
            {wedding.groom}
          </span>
        </div>

        {/* Date & City Line */}
        <p className="closing-stagger-item font-label text-xs sm:text-[13px] tracking-[0.2em] text-[#E3C98A] uppercase font-bold mb-8">
          {dateLine}
        </p>

        {/* Arabic Farewell Blessing (Amiri, weight 700) */}
        <div className="closing-stagger-item max-w-lg mx-auto bg-[#2A1024]/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-[#E3C98A]/35 shadow-[0_10px_35px_rgba(0,0,0,0.3)] mb-4">
          <p
            dir="rtl"
            lang="ar"
            className="font-arabic font-bold text-3xl sm:text-4xl text-[#E3C98A] leading-relaxed mb-3 drop-shadow-[0_2px_10px_rgba(201,162,75,0.4)]"
          >
            {closing.arabic}
          </p>
          <p className="font-body font-medium italic text-lg sm:text-xl text-[#FBE6EE] leading-relaxed">
            {closing.translation}
          </p>
        </div>

        {/* Tap hint */}
        <p className="closing-stagger-item font-body font-medium italic text-sm text-[#E3C98A]/80 mt-3">
          Tap anywhere to scatter rose petals of blessing
        </p>
      </div>

      {/* HORIZON MOSQUE SILHOUETTE (No human figures, arches, domes & minarets at base) */}
      <div className="relative z-10 w-full mt-auto -mb-6 pointer-events-none" aria-hidden="true">
        {/* Soft golden horizon atmospheric haze */}
        <div className="w-full h-12 bg-gradient-to-t from-[#2A1024] to-transparent opacity-90" />

        <svg
          viewBox="0 0 1200 220"
          preserveAspectRatio="none"
          className="w-full h-32 sm:h-44 md:h-52 drop-shadow-[0_-8px_20px_rgba(0,0,0,0.4)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="mosqueSkyGradient" x1="600" y1="0" x2="600" y2="220" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#C9A24B" stopOpacity="0.35" />
              <stop offset="35%" stopColor="#5B2A4E" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#1C0A18" stopOpacity="0.98" />
            </linearGradient>
            <linearGradient id="mosqueFillGradient" x1="600" y1="20" x2="600" y2="220" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#250D20" />
              <stop offset="100%" stopColor="#140611" />
            </linearGradient>
          </defs>

          {/* Distant background layer (softer silhouette) */}
          <g opacity="0.35">
            {/* Left distant dome */}
            <path d="M160 170 C160 120 200 100 200 100 C200 100 240 120 240 170 Z" fill="#5B2A4E" />
            {/* Right distant dome */}
            <path d="M960 170 C960 120 1000 100 1000 100 C1000 100 1040 120 1040 170 Z" fill="#5B2A4E" />
          </g>

          {/* Main Foreground Mosque Horizon Architecture */}
          {/* Base foundation line */}
          <rect x="0" y="195" width="1200" height="25" fill="#140611" />

          {/* Mosque Complex Outline & Silhouette */}
          <path
            d="
              M0 220
              L0 195
              L80 195
              L80 90
              L88 90
              L88 50
              L92 50
              C92 35 94 22 94 22
              C94 22 96 35 96 50
              L100 50
              L100 90
              L108 90
              L108 195
              L220 195
              L220 145
              C220 105 260 85 260 85
              C260 85 300 105 300 145
              L300 195
              L380 195
              L380 115
              L386 115
              L386 75
              C386 62 390 52 390 52
              C390 52 394 62 394 75
              L394 115
              L400 115
              L400 195
              L460 195
              L460 135
              C460 110 495 95 495 95
              C495 95 530 110 530 135
              L530 195
              L540 195
              L540 120
              C540 60 600 30 600 30
              C600 30 660 60 660 120
              L660 195
              L670 195
              L670 135
              C670 110 705 95 705 95
              C705 95 740 110 740 135
              L740 195
              L800 195
              L800 115
              L806 115
              L806 75
              C806 62 810 52 810 52
              C810 52 814 62 814 75
              L814 115
              L820 115
              L820 195
              L900 195
              L900 145
              C900 105 940 85 940 85
              C940 85 980 105 980 145
              L980 195
              L1092 195
              L1092 90
              L1100 90
              L1100 50
              L1104 50
              C1104 35 1106 22 1106 22
              C1106 22 1108 35 1108 50
              L1112 50
              L1112 90
              L1120 90
              L1120 195
              L1200 195
              L1200 220
              Z
            "
            fill="url(#mosqueFillGradient)"
            stroke="#E3C98A"
            strokeWidth="1.2"
            strokeOpacity="0.45"
          />

          {/* Central Dome Crescent Finial */}
          <circle cx="600" cy="18" r="3.5" fill="#E3C98A" />
          <path d="M599 12 C597 14 597 18 600 20 C596 20 594 16 597 12 Z" fill="#FFF8F3" />

          {/* Outer Minarets Crescent Finials */}
          <circle cx="94" cy="14" r="2.5" fill="#E3C98A" />
          <circle cx="1106" cy="14" r="2.5" fill="#E3C98A" />

          {/* Glowing Arch Windows along the horizon silhouette */}
          <g fill="#E3C98A" fillOpacity="0.25">
            {/* Grand central arch */}
            <path d="M585 195 L585 155 C585 145 600 138 600 138 C600 138 615 145 615 155 L615 195 Z" />
            {/* Flanking arches */}
            <path d="M485 195 L485 160 C485 150 495 145 495 145 C495 145 505 150 505 160 L505 195 Z" />
            <path d="M695 195 L695 160 C695 150 705 145 705 145 C705 145 715 150 715 160 L715 195 Z" />
            <path d="M250 195 L250 165 C250 157 260 152 260 152 C260 152 270 157 270 165 L270 195 Z" />
            <path d="M930 195 L930 165 C930 157 940 152 940 152 C940 152 950 157 950 165 L950 195 Z" />
          </g>
        </svg>
      </div>

      {/* BACK TO TOP BUTTON */}
      <div className="relative z-30 pt-4 pb-2">
        <button
          onClick={scrollToTop}
          type="button"
          aria-label="Back to top of wedding invitation"
          className="group min-h-[44px] px-6 py-2.5 rounded-full border border-[#E3C98A]/50 bg-[#2A1024]/80 backdrop-blur-md text-[#E3C98A] font-label text-[11px] tracking-[0.25em] uppercase font-bold hover:bg-[#E3C98A]/20 hover:border-[#E3C98A] active:scale-95 transition-all shadow-[0_4px_16px_rgba(0,0,0,0.3)] flex items-center gap-2 cursor-pointer"
        >
          <span>Back to top</span>
          <ArrowUp className="w-3.5 h-3.5 text-[#E3C98A] group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </footer>
  );
}
