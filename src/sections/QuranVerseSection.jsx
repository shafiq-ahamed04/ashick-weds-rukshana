import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { wedding } from '../config/wedding';
import GoldDivider from '../components/GoldDivider';

gsap.registerPlugin(ScrollTrigger);

export default function QuranVerseSection() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (!prefersReducedMotion) {
        gsap.fromTo(
          '.quran-step',
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            stagger: 0.16,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );
      } else {
        gsap.set('.quran-step', { opacity: 1, y: 0 });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 sm:py-28 px-4 sm:px-6 md:px-12 overflow-hidden flex flex-col items-center justify-center text-center selection:bg-[#F4C6D7] selection:text-[#3E1A36]"
      style={{
        background: 'linear-gradient(180deg, #E4D7F2 0%, #7A496E 18%, #4A1E3E 45%, #35142E 75%, #3E1A36 100%)',
      }}
      aria-label="Sacred Quranic Verse and Blessing"
    >
      {/* TWINKLING GOLDEN STARS IN NIGHT SKY */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-[15%] left-[10%] w-1.5 h-1.5 rounded-full bg-[#E3C98A] shadow-[0_0_8px_#C9A24B] animate-pulse" />
        <div className="absolute top-[25%] right-[12%] w-2 h-2 rounded-full bg-[#E3C98A] shadow-[0_0_10px_#C9A24B] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[50%] left-[6%] w-1 h-1 rounded-full bg-[#FFF8F3] shadow-[0_0_6px_#C9A24B] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[68%] right-[8%] w-1.5 h-1.5 rounded-full bg-[#E3C98A] shadow-[0_0_8px_#C9A24B] animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-[20%] left-[15%] w-2 h-2 rounded-full bg-[#FFF8F3] shadow-[0_0_8px_#C9A24B] animate-pulse" style={{ animationDelay: '2.5s' }} />
        <div className="absolute bottom-[28%] right-[25%] w-1.5 h-1.5 rounded-full bg-[#E3C98A] shadow-[0_0_8px_#C9A24B] animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      {/* AMBIENT CELESTIAL GLOW */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] rounded-full bg-[#C9A24B]/10 blur-[100px]"
        aria-hidden="true"
      />

      {/* SACRED CARD CONTAINER */}
      <div
        ref={cardRef}
        className="relative z-20 w-full max-w-xl md:max-w-2xl mx-auto px-5 sm:px-8 py-9 sm:py-12 rounded-[2rem] sm:rounded-[2.5rem] bg-[#2F1329]/80 backdrop-blur-md border border-[#E3C98A]/40 shadow-[0_15px_50px_rgba(0,0,0,0.4)]"
      >
        {/* Decorative corner accents */}
        <div className="absolute top-4 left-4 text-[#C9A24B]/50 text-xs select-none">✦</div>
        <div className="absolute top-4 right-4 text-[#C9A24B]/50 text-xs select-none">✦</div>
        <div className="absolute bottom-4 left-4 text-[#C9A24B]/50 text-xs select-none">✦</div>
        <div className="absolute bottom-4 right-4 text-[#C9A24B]/50 text-xs select-none">✦</div>

        {/* 1. CINZEL LABEL: "AND AMONG HIS SIGNS" */}
        <span className="quran-step font-label text-xs sm:text-[13px] tracking-[0.2em] text-[#E3C98A] uppercase font-bold mb-4 block drop-shadow-sm">
          {wedding.quranVerse.label}
        </span>

        {/* 2. ARABIC IN AMIRI (Quran verse weight 400, large, line-height 2.2) */}
        <div className="quran-step my-4 relative">
          <div
            className="pointer-events-none absolute inset-0 -top-4 -bottom-4 bg-[#C9A24B]/15 blur-xl rounded-full"
            aria-hidden="true"
          />

          <p
            dir="rtl"
            lang="ar"
            className="relative font-arabic font-normal text-2xl sm:text-3xl md:text-4xl text-[#FFF8F3] leading-[2.2] sm:leading-[2.4] tracking-wide text-center drop-shadow-[0_2px_12px_rgba(201,162,75,0.4)] max-w-xl mx-auto [text-wrap:balance]"
          >
            {wedding.quranVerse.arabic}
          </p>
        </div>

        {/* 3. ENGLISH TRANSLATION */}
        <p className="quran-step font-body font-medium italic text-lg sm:text-[19px] text-[#FBE6EE] leading-[1.6] max-w-lg mx-auto my-3">
          "{wedding.quranVerse.translation}"
        </p>

        {/* 4. REFERENCE */}
        <p className="quran-step font-label text-xs sm:text-[13px] tracking-[0.2em] text-[#E3C98A] uppercase font-bold mt-2 mb-4">
          {wedding.quranVerse.reference}
        </p>

        {/* 5. GOLD DIVIDER */}
        <div className="quran-step my-4">
          <GoldDivider className="opacity-75" />
        </div>

        {/* 6. LABEL: "A DUA FOR THE COUPLE" */}
        <span className="quran-step font-label text-xs sm:text-[13px] tracking-[0.2em] text-[#E3C98A] uppercase font-bold mt-4 mb-3 block drop-shadow-sm">
          {wedding.dua.label}
        </span>

        {/* 7. ARABIC DUA (Weight 700) */}
        <div className="quran-step my-3 relative">
          <p
            dir="rtl"
            lang="ar"
            className="font-arabic font-bold text-2xl sm:text-3xl md:text-4xl text-[#E3C98A] leading-[2.2] tracking-wide text-center drop-shadow-[0_2px_10px_rgba(201,162,75,0.35)] max-w-md mx-auto [text-wrap:balance]"
          >
            {wedding.dua.arabic}
          </p>
        </div>

        {/* 8. ENGLISH DUA TRANSLATION */}
        <p className="quran-step font-body font-medium italic text-lg sm:text-[19px] text-[#FBE6EE] leading-[1.6] max-w-md mx-auto mt-2">
          "{wedding.dua.translation}"
        </p>
      </div>

      <div className="w-full pt-8" />
    </section>
  );
}
