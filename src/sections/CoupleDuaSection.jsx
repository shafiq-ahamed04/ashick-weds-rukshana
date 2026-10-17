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
  const illustrationRef = useRef(null);
  const floatContainerRef = useRef(null);

  const tapMessages = wedding.dua?.tapMessages || [
    'Barakallahu lakuma',
    'Ameen',
    'Mabrook!',
    'May Allah unite you in goodness',
    'May your home be full of mercy',
  ];

  // GSAP Entrance & Motion Effects
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (!prefersReducedMotion) {
        // Entrance fade-up for section elements
        gsap.fromTo(
          '.couple-stagger-item',
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );

        // Illustration entrance: fade up once with scale 0.96 to 1 and blur 6px to 0
        if (illustrationRef.current) {
          gsap.fromTo(
            illustrationRef.current,
            { opacity: 0, scale: 0.96, filter: 'blur(6px)' },
            {
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)',
              duration: 1.4,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: cardRef.current,
                start: 'top 80%',
                once: true,
              },
              onComplete: () => {
                // Add gentle float (translateY 0 to -6px over 5s)
                if (floatContainerRef.current) {
                  floatContainerRef.current.classList.add('animate-illustration-float');
                }
              },
            }
          );
        }
      } else {
        gsap.set('.couple-stagger-item', { opacity: 1, y: 0 });
        if (illustrationRef.current) {
          gsap.set(illustrationRef.current, { opacity: 1, scale: 1, filter: 'blur(0px)' });
        }
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
      id="two-souls"
      ref={sectionRef}
      onClick={handleSectionTap}
      className="relative w-full py-20 sm:py-28 px-4 sm:px-6 md:px-12 overflow-hidden flex flex-col items-center justify-center text-center cursor-pointer select-none selection:bg-[#F4C6D7] selection:text-[#3E1A36]"
      style={{
        background: 'linear-gradient(180deg, #E4D7F2 0%, #F5CAD8 40%, #FBE6EE 75%, #FFF8F3 100%)',
      }}
      aria-label="Two Souls, One Journey & Send a Dua Interaction"
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
              <span className="font-body italic text-lg sm:text-xl text-[#5B2A4E] font-bold drop-shadow-[0_2px_8px_rgba(255,255,255,0.95)] px-4 py-1.5 rounded-full bg-white/85 border border-[#E3C98A]/70 shadow-sm">
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

      {/* SECTION HEADER: Label in label font, Names in script font like Invitation */}
      <div className="couple-stagger-item relative z-20 max-w-xl mx-auto mb-6 sm:mb-8 flex flex-col items-center">
        <span className="font-label text-xs sm:text-[13px] tracking-[0.2em] text-[#8A6414] uppercase font-bold mb-2 block">
          TWO SOULS, ONE JOURNEY
        </span>

        {/* Couple Names - Elegantly Shaped and Styled like Invitation Section */}
        <div className="my-3 flex flex-col items-center justify-center text-center">
          <span className="font-script text-[clamp(42px,9vw,76px)] text-[#3E1A36] leading-[1.15] name-script-shadow block">
            {wedding.groom}
          </span>
          <div className="flex items-center justify-center gap-3 my-1">
            <span className="h-[1px] w-10 sm:w-16 bg-gradient-to-r from-transparent via-[#C9A24B] to-[#C9A24B]/70" />
            <span className="font-script text-2xl sm:text-3xl text-[#8A6414] font-bold name-script-shadow select-none">
              &amp;
            </span>
            <span className="h-[1px] w-10 sm:w-16 bg-gradient-to-l from-transparent via-[#C9A24B] to-[#C9A24B]/70" />
          </div>
          <span className="font-script text-[clamp(42px,9vw,76px)] text-[#3E1A36] leading-[1.15] name-script-shadow block">
            {wedding.bride}
          </span>
        </div>

        <div className="my-2">
          <GoldDivider />
        </div>
      </div>

      {/* LARGE ISLAMIC POINTED-ARCH WINDOW CONTAINER */}
      <div
        ref={cardRef}
        className="couple-stagger-item relative z-20 w-[82vw] max-w-[460px] mx-auto flex flex-col items-center"
      >
        <div ref={floatContainerRef} className="relative w-full aspect-[400/560] drop-shadow-[0_20px_50px_rgba(62,26,54,0.22)]">
          {/* ARCH WINDOW INTERIOR WITH VECTOR MASK */}
          <div ref={illustrationRef} className="absolute inset-0 w-full h-full">
            <svg
              viewBox="0 0 400 560"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full block"
            >
              <defs>
                {/* Blush to Lilac Soft Interior Gradient */}
                <linearGradient id="twoSoulsBgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FBE6EE" />
                  <stop offset="40%" stopColor="#F5CAD8" />
                  <stop offset="100%" stopColor="#E4D7F2" />
                </linearGradient>

                {/* Golden Radial Pulse Glow behind hands */}
                <radialGradient id="handsGlowRadial" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#E3C98A" stopOpacity="0.75" />
                  <stop offset="45%" stopColor="#C9A24B" stopOpacity="0.32" />
                  <stop offset="70%" stopColor="#C9A24B" stopOpacity="0" />
                </radialGradient>

                {/* Gold Arch Border Gradient */}
                <linearGradient id="goldArchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F3E5AB" />
                  <stop offset="35%" stopColor="#C9A24B" />
                  <stop offset="70%" stopColor="#E3C98A" />
                  <stop offset="100%" stopColor="#9C7728" />
                </linearGradient>

                {/* Pointed Arch Mask */}
                <mask id="twoSoulsArchMask">
                  <path
                    d="M 200 8 C 265 75, 384 115, 384 190 L 384 542 Q 384 554 372 554 L 28 554 Q 16 554 16 542 L 16 190 C 16 115, 135 75, 200 8 Z"
                    fill="white"
                  />
                </mask>
              </defs>

              {/* MASKED ARCH CONTENT */}
              <g mask="url(#twoSoulsArchMask)">
                {/* Background soft blush -> lilac gradient */}
                <rect width="400" height="560" fill="url(#twoSoulsBgGrad)" />

                {/* Soft Golden Radial Glow behind clasped hands (around 50% x, 58% y) */}
                <circle
                  cx="200"
                  cy="325"
                  r="125"
                  fill="url(#handsGlowRadial)"
                  className="animate-glow-pulse pointer-events-none"
                />

                {/* Clasped-Hands Illustration - scaled to seamlessly fill the frame and hide sleeve/dupatta edges */}
                <image
                  href={wedding.illustration.webp}
                  x="-32"
                  y="-16"
                  width="464"
                  height="592"
                  preserveAspectRatio="xMidYMid slice"
                  className="select-none pointer-events-none"
                />

                {/* Tiny Gold Sparkle at the Ring (around 62% x, 61% y -> x:248, y:342) */}
                <g transform="translate(248, 342)" className="animate-ring-twinkle pointer-events-none">
                  <polygon
                    points="0,-11 2.8,-2.8 11,0 2.8,2.8 0,11 -2.8,2.8 -11,0 -2.8,-2.8"
                    fill="#E3C98A"
                    style={{ filter: 'drop-shadow(0 0 6px #E3C98A)' }}
                  />
                </g>
              </g>

              {/* ISLAMIC POINTED-ARCH DOUBLE GOLD BORDER */}
              {/* Outer Gold Border */}
              <path
                d="M 200 8 C 265 75, 384 115, 384 190 L 384 542 Q 384 554 372 554 L 28 554 Q 16 554 16 542 L 16 190 C 16 115, 135 75, 200 8 Z"
                stroke="url(#goldArchGrad)"
                strokeWidth="3.5"
                strokeLinejoin="round"
                fill="none"
              />

              {/* Inner Gold Border (Double border line) */}
              <path
                d="M 200 15 C 263 79, 377 117, 377 190 L 377 537 Q 377 547 366 547 L 34 547 Q 23 547 23 537 L 23 190 C 23 117, 137 79, 200 15 Z"
                stroke="#E3C98A"
                strokeWidth="1.5"
                strokeOpacity="0.85"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>

          {/* DECORATION 1: Hanging Wisteria Over the Top of the Arch */}
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

          {/* DECORATION 2: Two Flickering Gold Lanterns on the Sides */}
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

          {/* DECORATION 3: Blossom Clusters at Bottom Corners */}
          <div className="pointer-events-none absolute -bottom-3 -left-3 w-16 h-16 drop-shadow-md z-30" aria-hidden="true">
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="35" cy="45" r="18" fill="#F4C6D7" opacity="0.9" />
              <circle cx="33" cy="43" r="13" fill="#FBE6EE" />
              <circle cx="35" cy="45" r="5" fill="#C9A24B" />
              <circle cx="55" cy="55" r="12" fill="#E4D7F2" opacity="0.85" />
            </svg>
          </div>
          <div className="pointer-events-none absolute -bottom-3 -right-3 w-16 h-16 drop-shadow-md z-30 transform -scale-x-100" aria-hidden="true">
            <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="35" cy="45" r="18" fill="#F4C6D7" opacity="0.9" />
              <circle cx="33" cy="43" r="13" fill="#FBE6EE" />
              <circle cx="35" cy="45" r="5" fill="#C9A24B" />
              <circle cx="55" cy="55" r="12" fill="#E4D7F2" opacity="0.85" />
            </svg>
          </div>
        </div>

        {/* UNDER THE ARCH: GOLD DIVIDER WITH 8-POINTED STAR & BELOWTEXT */}
        {wedding.couple?.belowText && wedding.couple.belowText.trim() !== '' && (
          <div className="couple-stagger-item mt-6 sm:mt-7 flex flex-col items-center text-center">
            <GoldDivider className="!my-0 mb-4" />
            <p
              className="font-body italic font-[500] text-[clamp(20px,4.5vw,26px)] text-[#5B2A4E] leading-[1.5] max-w-[520px] mx-auto [text-wrap:balance]"
              style={{ textWrap: 'balance' }}
            >
              {wedding.couple.belowText}
            </p>
          </div>
        )}

        {/* ONE-LINE CAPTION (From config: couple.caption, rendered only if non-empty) */}
        {wedding.couple?.caption && wedding.couple.caption.trim() !== '' && (
          <p className="couple-stagger-item font-body font-medium italic text-lg sm:text-[19px] text-[#5B2A4E] leading-[1.6] max-w-md mx-auto mt-3">
            "{wedding.couple.caption}"
          </p>
        )}

        {/* TAP INSTRUCTION & DUA COUNTER */}
        <div className="couple-stagger-item mt-6 flex flex-col items-center justify-center text-center">
          <div className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/85 border border-[#E3C98A] shadow-[0_4px_20px_rgba(201,162,75,0.25)] hover:scale-105 active:scale-95 transition-transform duration-300">
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
