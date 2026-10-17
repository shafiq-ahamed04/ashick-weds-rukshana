import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { wedding, getHeroEventDateString } from '../config/wedding';
import GoldDivider from '../components/GoldDivider';
import FloralFrame from '../components/FloralFrame';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection({ isIntroCompleted }) {
  const heroRef = useRef(null);
  const bgRef = useRef(null);
  const contentCardRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  // Parallax effects on scroll
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Parallax for background image
      gsap.to(bgRef.current, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Parallax for content card
      gsap.to(contentCardRef.current, {
        yPercent: 25,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '80% top',
          scrub: 1,
        },
      });

      // Hide scroll indicator on initial scroll
      gsap.to(scrollIndicatorRef.current, {
        opacity: 0,
        y: 20,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: heroRef.current,
          start: '5% top',
          end: '15% top',
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Staggered reveal animation when intro completes
  useEffect(() => {
    if (!isIntroCompleted) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.set('.hero-stagger-item', { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-stagger-item',
        {
          opacity: 0,
          y: 28,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          stagger: 0.16,
          ease: 'power3.out',
          delay: 0.1,
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, [isIntroCompleted]);

  const heroDateString = getHeroEventDateString('nikah');

  return (
    <section
      ref={heroRef}
      className="relative w-full h-svh-screen min-h-svh-screen overflow-hidden flex flex-col items-center justify-between selection:bg-[#F4C6D7] selection:text-[#3E1A36]"
      aria-label="Wedding Hero Section"
    >
      {/* BACKGROUND IMAGE WITH SLOW KEN BURNS ZOOM (Optimized WebP with JPG fallback) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        <picture>
          <source srcSet={wedding.heroBg.webp} type="image/webp" />
          <img
            ref={bgRef}
            src={wedding.heroBg.jpg}
            alt="Palatial Mughal Arched Window Pavilion with wisteria, lanterns and sunset sky"
            className="w-full h-full object-cover object-center animate-ken-burns scale-105 will-change-transform"
            loading="eager"
            decoding="async"
          />
        </picture>

        {/* Ambient atmospheric overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#3E1A36]/30 via-transparent to-[#3E1A36]/40 pointer-events-none" />

        {/* Lantern glow effects */}
        <div className="absolute top-[12%] left-[13%] w-24 h-24 rounded-full bg-[#E3C98A]/35 blur-2xl animate-glow-flicker pointer-events-none" />
        <div className="absolute top-[13%] right-[12%] w-24 h-24 rounded-full bg-[#E3C98A]/35 blur-2xl animate-glow-flicker pointer-events-none" />
        <div className="absolute bottom-[18%] left-[24%] w-20 h-20 rounded-full bg-[#E3C98A]/40 blur-xl animate-glow-flicker pointer-events-none" />
        <div className="absolute bottom-[20%] right-[22%] w-28 h-28 rounded-full bg-[#E3C98A]/45 blur-2xl animate-glow-flicker pointer-events-none" />
      </div>

      {/* FLORAL FRAMING ON SCREEN EDGES */}
      <FloralFrame />

      {/* TOP PADDING SPACER */}
      <div className="w-full pt-4 sm:pt-6 pointer-events-none" />

      {/* CENTER ARCHED CONTENT CARD (Solid cream at 0.90 opacity for 4.5:1+ contrast) */}
      <div
        ref={contentCardRef}
        className="relative z-20 w-full max-w-[340px] xs:max-w-[370px] sm:max-w-md md:max-w-lg px-4 sm:px-6 my-auto text-center"
      >
        <div className="relative rounded-[2rem] sm:rounded-[2.5rem] bg-[#FFF8F3]/90 backdrop-blur-md px-5 py-7 sm:px-8 sm:py-9 border border-[#E3C98A]/70 shadow-[0_12px_45px_rgba(62,26,54,0.24)] ring-1 ring-[#C9A24B]/30">
          {/* Inner Golden Border Inset */}
          <div className="absolute inset-1.5 sm:inset-2 rounded-[1.7rem] sm:rounded-[2.2rem] border border-[#C9A24B]/30 pointer-events-none" />

          {/* Corner Ornamental Flourishes */}
          <div className="absolute top-3 left-3 text-[#C9A24B]/60 text-xs select-none">✦</div>
          <div className="absolute top-3 right-3 text-[#C9A24B]/60 text-xs select-none">✦</div>
          <div className="absolute bottom-3 left-3 text-[#C9A24B]/60 text-xs select-none">✦</div>
          <div className="absolute bottom-3 right-3 text-[#C9A24B]/60 text-xs select-none">✦</div>

          {/* 1. BISMILLAH IN AMIRI (Weight 700) */}
          <div className="hero-stagger-item font-arabic font-bold text-xl sm:text-2xl md:text-3xl text-[#5B2A4E] leading-relaxed drop-shadow-sm mb-1">
            {wedding.bismillah}
          </div>

          {/* 2. GOLD DIVIDER */}
          <div className="hero-stagger-item my-1 sm:my-2">
            <GoldDivider />
          </div>

          {/* 3. TOGETHER WITH THEIR FAMILIES */}
          <p className="hero-stagger-item font-label text-xs sm:text-[13px] tracking-[0.2em] text-[#5B2A4E] uppercase font-bold mt-1 mb-2">
            Together With Their Families
          </p>

          {/* 4. BRIDE NAME (Great Vibes Script - one line on mobile & desktop) */}
          <h1 className="hero-stagger-item font-script text-[clamp(36px,8.5vw,72px)] text-[#3E1A36] leading-[1.15] name-script-shadow whitespace-nowrap sm:whitespace-normal [text-wrap:balance] my-0.5">
            {wedding.bride}
          </h1>

          {/* 5. "&" WITH SIDE LINES */}
          <div className="hero-stagger-item flex items-center justify-center gap-3 my-0.5">
            <div className="h-[1px] w-10 sm:w-16 bg-gradient-to-r from-transparent via-[#C9A24B]/70 to-[#C9A24B]" />
            <span className="font-script text-3xl sm:text-4xl text-[#8A6414] font-bold name-script-shadow select-none">
              &amp;
            </span>
            <div className="h-[1px] w-10 sm:w-16 bg-gradient-to-l from-transparent via-[#C9A24B]/70 to-[#C9A24B]" />
          </div>

          {/* 6. GROOM NAME */}
          <h2 className="hero-stagger-item font-script text-[clamp(36px,8.5vw,72px)] text-[#3E1A36] leading-[1.15] name-script-shadow [text-wrap:balance] my-0.5">
            {wedding.groom}
          </h2>

          {/* 7. TAGLINE FROM CONFIG (18px minimum) */}
          <p className="hero-stagger-item font-body font-medium italic text-lg sm:text-[19px] text-[#5B2A4E] mt-2 mb-3 max-w-xs mx-auto leading-relaxed">
            "{wedding.tagline}"
          </p>

          {/* Mini Gold Accent Line */}
          <div className="hero-stagger-item w-16 h-[1px] bg-[#C9A24B]/60 mx-auto my-2" />

          {/* 8. DATE & VENUE GENERATED FROM CONFIG */}
          <div className="hero-stagger-item font-label text-xs sm:text-[13px] tracking-[0.2em] text-[#3E1A36] font-bold uppercase mt-1">
            {heroDateString}
          </div>
        </div>
      </div>

      {/* 9. SCROLL INDICATOR */}
      <div
        ref={scrollIndicatorRef}
        className="hero-stagger-item relative z-30 pb-5 sm:pb-8 flex flex-col items-center justify-center text-center cursor-pointer pointer-events-auto group"
        onClick={() => {
          window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth',
          });
        }}
      >
        <span className="font-label text-xs sm:text-[13px] tracking-[0.2em] text-[#FFF8F3] uppercase drop-shadow-[0_1px_4px_rgba(62,26,54,0.8)] font-bold group-hover:text-[#E3C98A] transition-colors">
          Scroll to unfold our story
        </span>
        <div className="mt-1 p-1 rounded-full bg-[#3E1A36]/60 backdrop-blur-sm border border-[#E3C98A]/60 text-[#E3C98A] animate-bounce-soft shadow-md group-hover:scale-110 transition-transform">
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>
    </section>
  );
}
