import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { wedding } from '../config/wedding';
import GoldDivider from '../components/GoldDivider';

gsap.registerPlugin(ScrollTrigger);

export default function CoupleDuaSection() {
  const [duaCount, setDuaCount] = useState(0);
  const [tapIndex, setTapIndex] = useState(0);
  const [floatingItems, setFloatingItems] = useState([]);
  const sectionRef = useRef(null);
  const cardRef = useRef(null);

  const couple = wedding.couple;
  const tapMessages = wedding.dua.tapMessages || [
    'Barakallahu lakuma',
    'Ameen',
    'Mabrook!',
    'May Allah unite you in goodness',
    'May your home be full of mercy',
  ];

  // GSAP Entrance
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (!prefersReducedMotion) {
        gsap.fromTo(
          '.couple-stagger-item',
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            stagger: 0.14,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );
      } else {
        gsap.set('.couple-stagger-item', { opacity: 1, y: 0 });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Handle Tap anywhere inside section to send a dua
  const handleSectionTap = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const currentMsg = tapMessages[tapIndex % tapMessages.length];
    setTapIndex((prev) => prev + 1);
    setDuaCount((prev) => prev + 1);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const id = Date.now() + Math.random();

    const colors = ['#F4C6D7', '#E4D7F2', '#FFF8F3', '#E3C98A', '#FBE6EE'];

    let newPetals = [];
    if (!prefersReducedMotion) {
      const petalCount = Math.floor(Math.random() * 4) + 6;
      for (let i = 0; i < petalCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 50 + 35;
        const targetX = Math.cos(angle) * velocity;
        const targetY = Math.sin(angle) * velocity + 40;
        const rotation = Math.random() * 360 - 180;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 8 + 8;

        newPetals.push({
          id: `${id}-petal-${i}`,
          x,
          y,
          targetX,
          targetY,
          rotation,
          color,
          size,
        });
      }
    }

    const newItem = {
      id,
      x,
      y,
      message: currentMsg,
      petals: newPetals,
    };

    setFloatingItems((prev) => [...prev.slice(-6), newItem]);

    setTimeout(() => {
      setFloatingItems((prev) => prev.filter((item) => item.id !== id));
    }, 1800);
  };

  return (
    <section
      ref={sectionRef}
      onClick={handleSectionTap}
      className="relative w-full py-20 sm:py-28 px-4 sm:px-6 md:px-12 overflow-hidden flex flex-col items-center justify-center text-center cursor-pointer select-none selection:bg-[#F4C6D7] selection:text-[#3E1A36]"
      style={{
        background: 'linear-gradient(180deg, #E4D7F2 0%, #F5CAD8 40%, #FBE6EE 75%, #FFF8F3 100%)',
      }}
      aria-label="The Couple & Send a Dua Interaction"
    >
      {/* FLOATING TAP PARTICLES & DUA MESSAGES OVERLAY */}
      <div className="pointer-events-none absolute inset-0 z-40 overflow-hidden" aria-hidden="true">
        {floatingItems.map((item) => (
          <React.Fragment key={item.id}>
            <div
              className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2 animate-float-fade whitespace-nowrap z-50"
              style={{
                left: `${item.x}px`,
                top: `${item.y}px`,
              }}
            >
              <span className="font-body italic text-lg sm:text-xl text-[#5B2A4E] font-bold drop-shadow-[0_2px_8px_rgba(255,255,255,0.95)] px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-sm border border-[#E3C98A]/70 shadow-sm">
                ✨ {item.message} ✨
              </span>
            </div>

            {item.petals &&
              item.petals.map((petal) => (
                <div
                  key={petal.id}
                  className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${petal.x}px`,
                    top: `${petal.y}px`,
                    animation: 'burstPetal 1.4s cubic-bezier(0.25, 1, 0.5, 1) forwards',
                    '--target-x': `${petal.targetX}px`,
                    '--target-y': `${petal.targetY}px`,
                    '--rotation': `${petal.rotation}deg`,
                  }}
                >
                  <svg
                    width={petal.size}
                    height={petal.size * 0.65}
                    viewBox="0 0 20 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <ellipse cx="10" cy="6.5" rx="10" ry="6.5" fill={petal.color} opacity="0.85" />
                  </svg>
                </div>
              ))}
          </React.Fragment>
        ))}
      </div>

      {/* HEADER */}
      <div className="couple-stagger-item relative z-20 max-w-xl mx-auto mb-6 sm:mb-8 flex flex-col items-center">
        <span className="font-label text-xs sm:text-[13px] tracking-[0.2em] text-[#8A6414] uppercase font-bold mb-2 block">
          Two Souls, One Journey
        </span>

        {/* AR Monogram Logo */}
        <div className="w-[180px] xs:w-[210px] sm:w-[240px] my-1 mx-auto">
          <picture>
            <source srcSet={wedding.logo.webp} type="image/webp" />
            <img
              src={wedding.logo.png}
              alt={wedding.logo.alt}
              width="240"
              height="160"
              className="w-full h-auto object-contain"
              style={{ filter: 'drop-shadow(0 6px 18px rgba(91,42,78,0.22))' }}
            />
          </picture>
        </div>

        <div className="my-2">
          <GoldDivider />
        </div>
      </div>

      {/* LARGE ARCH-FRAMED COUPLE PHOTO CONTAINER (Safari-compatible rounded arch) */}
      <div
        ref={cardRef}
        className="couple-stagger-item relative z-20 w-full max-w-[340px] xs:max-w-[390px] sm:max-w-[460px] md:max-w-[520px] mx-auto flex flex-col items-center"
      >
        <div className="relative w-full aspect-[3/4.1] rounded-t-[160px] rounded-b-3xl p-2 bg-gradient-to-b from-[#E3C98A] via-[#C9A24B] to-[#9C7728] shadow-[0_20px_50px_rgba(62,26,54,0.22)]">
          <div className="relative w-full h-full p-1.5 bg-[#FFF8F3] rounded-t-[152px] rounded-b-[22px] overflow-hidden">
            <div className="w-full h-full rounded-t-[146px] rounded-b-[18px] overflow-hidden relative">
              <picture>
                <source srcSet={couple.photoWebp} type="image/webp" />
                <img
                  src={couple.photo}
                  alt={`${wedding.bride} & ${wedding.groom}`}
                  className="w-full h-full object-cover will-change-transform transition-transform duration-700 group-hover:scale-105"
                  style={{ objectPosition: couple.objectPosition || 'center 38%' }}
                  loading="lazy"
                  decoding="async"
                  width="1100"
                  height="1500"
                />
              </picture>

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#5B2A4E]/15 via-transparent to-[#E3C98A]/10 mix-blend-soft-light" />
            </div>
          </div>

          {/* Hanging Wisteria Over the Top of the Arch */}
          <div className="pointer-events-none absolute -top-4 inset-x-0 h-16 flex justify-center z-30" aria-hidden="true">
            <svg viewBox="0 0 300 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M20 20 Q150 45 280 20" stroke="#B9A3D6" strokeWidth="2.5" strokeLinecap="round" />
              <ellipse cx="60" cy="32" rx="4" ry="7" fill="#E4D7F2" />
              <ellipse cx="90" cy="38" rx="4.5" ry="8" fill="#B9A3D6" />
              <ellipse cx="120" cy="42" rx="5" ry="9" fill="#9D84C7" />
              <ellipse cx="150" cy="45" rx="5.5" ry="10" fill="#E4D7F2" />
              <ellipse cx="180" cy="42" rx="5" ry="9" fill="#9D84C7" />
              <ellipse cx="210" cy="38" rx="4.5" ry="8" fill="#B9A3D6" />
              <ellipse cx="240" cy="32" rx="4" ry="7" fill="#E4D7F2" />
            </svg>
          </div>

          {/* Two Flickering Gold Lanterns */}
          <div className="pointer-events-none absolute top-[28%] -left-5 sm:-left-7 z-30" aria-hidden="true">
            <svg viewBox="0 0 36 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 sm:w-10 h-auto drop-shadow-md">
              <line x1="18" y1="0" x2="18" y2="24" stroke="#C9A24B" strokeWidth="1.5" />
              <rect x="9" y="24" width="18" height="26" rx="3" fill="#5B2A4E" stroke="#C9A24B" strokeWidth="1.5" />
              <circle cx="18" cy="37" r="4" fill="#E3C98A" className="animate-glow-flicker" />
              <circle cx="18" cy="37" r="10" fill="#E3C98A" opacity="0.4" className="animate-glow-flicker" />
            </svg>
          </div>

          <div className="pointer-events-none absolute top-[28%] -right-5 sm:-right-7 z-30" aria-hidden="true">
            <svg viewBox="0 0 36 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 sm:w-10 h-auto drop-shadow-md">
              <line x1="18" y1="0" x2="18" y2="24" stroke="#C9A24B" strokeWidth="1.5" />
              <rect x="9" y="24" width="18" height="26" rx="3" fill="#5B2A4E" stroke="#C9A24B" strokeWidth="1.5" />
              <circle cx="18" cy="37" r="4" fill="#E3C98A" className="animate-glow-flicker" />
              <circle cx="18" cy="37" r="10" fill="#E3C98A" opacity="0.4" className="animate-glow-flicker" />
            </svg>
          </div>
        </div>

        {/* TAP INSTRUCTION & DUA COUNTER */}
        <div className="mt-8 flex flex-col items-center justify-center text-center">
          <div className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/85 backdrop-blur-md border border-[#E3C98A] shadow-[0_4px_20px_rgba(201,162,75,0.25)] hover:scale-105 active:scale-95 transition-transform duration-300">
            <svg className="w-4 h-4 text-[#C9A24B] animate-pulse" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C14.15 22 16.14 21.32 17.78 20.17C14.07 19.46 11.27 16.23 11.27 12.33C11.27 8.43 14.07 5.2 17.78 4.49C16.14 3.34 14.15 2 12 2Z" />
            </svg>

            <span className="font-label text-xs sm:text-[13px] tracking-[0.2em] text-[#5B2A4E] uppercase font-bold">
              Tap anywhere to send a dua to the couple
            </span>
          </div>

          {/* Duas Counter */}
          <div className="mt-3 flex items-center gap-1.5 text-base font-body italic text-[#5B2A4E] font-medium">
            <span>✨</span>
            <span className="font-bold text-[#3E1A36]">{duaCount}</span>
            <span>{duaCount === 1 ? 'dua sent with love' : 'duas sent with love'}</span>
            <span>✨</span>
          </div>
        </div>
      </div>
    </section>
  );
}
