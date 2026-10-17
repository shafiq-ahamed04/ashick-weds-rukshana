import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { wedding, getInvitationTimelineLine } from '../config/wedding';
import GoldDivider from '../components/GoldDivider';
import FloralFrame from '../components/FloralFrame';

gsap.registerPlugin(ScrollTrigger);

export default function InvitationSection() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const archPathRef = useRef(null);
  const floralLeftRef = useRef(null);
  const floralRightRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      // Staggered fade-up on scroll (trigger at top 80%, play once)
      if (!prefersReducedMotion) {
        gsap.fromTo(
          '.invite-stagger-item',
          {
            opacity: 0,
            y: 35,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            stagger: 0.14,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: contentRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );

        // Floral parallax drifting slowly with scroll
        gsap.to(floralLeftRef.current, {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });

        gsap.to(floralRightRef.current, {
          y: 40,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        });

        // Arched gateway draw animation on scroll
        if (archPathRef.current) {
          const length = archPathRef.current.getTotalLength();
          gsap.set(archPathRef.current, {
            strokeDasharray: length,
            strokeDashoffset: length,
          });

          gsap.to(archPathRef.current, {
            strokeDashoffset: 0,
            duration: 2.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: archPathRef.current,
              start: 'top 85%',
              once: true,
            },
          });
        }
      } else {
        // Fallback for reduced motion
        gsap.set('.invite-stagger-item', { opacity: 1, y: 0 });
        if (archPathRef.current) {
          gsap.set(archPathRef.current, { strokeDashoffset: 0 });
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const timelineString = getInvitationTimelineLine();

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-svh-screen py-24 sm:py-32 px-4 sm:px-6 md:px-8 overflow-hidden flex flex-col items-center justify-center text-center selection:bg-[#F4C6D7] selection:text-[#3E1A36]"
      style={{
        background: 'linear-gradient(180deg, #FFF8F3 0%, #FBE6EE 45%, #E4D7F2 85%, #B9A3D6 100%)',
      }}
      aria-label="Wedding Invitation Message Section"
    >
      {/* SOFT CLOUD LAYERS (Drifting subtly in background) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-35" aria-hidden="true">
        {/* Cloud 1 */}
        <div className="absolute top-[8%] -left-20 w-80 h-32 rounded-full bg-white/60 blur-2xl animate-float-slow" />
        {/* Cloud 2 */}
        <div
          className="absolute top-[35%] -right-24 w-96 h-36 rounded-full bg-white/50 blur-2xl animate-float-slow"
          style={{ animationDelay: '4s' }}
        />
        {/* Cloud 3 */}
        <div
          className="absolute bottom-[15%] left-[10%] w-72 h-28 rounded-full bg-white/40 blur-2xl animate-float-slow"
          style={{ animationDelay: '2s' }}
        />
      </div>

      {/* 3-4 DELICATE BUTTERFLIES IN LILAC / PINK FLUTTERING */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-15" aria-hidden="true">
        {/* Butterfly 1 (Blush pink, top-right) */}
        <div className="absolute top-[18%] right-[14%] animate-float-slow" style={{ animationDuration: '7s' }}>
          <svg className="w-6 h-6 text-[#F4C6D7] drop-shadow-[0_2px_4px_rgba(91,42,78,0.2)] animate-pulse" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 10C10 5 4 4 2 8C0 12 5 15 10 12C5 17 2 22 5 23C8 24 11 18 12 14C13 18 16 24 19 23C22 22 19 17 14 12C19 15 24 12 22 8C20 4 14 5 12 10Z" />
          </svg>
        </div>

        {/* Butterfly 2 (Lilac, mid-left) */}
        <div className="absolute top-[42%] left-[12%] animate-float-slow" style={{ animationDuration: '9s', animationDelay: '3s' }}>
          <svg className="w-5 h-5 text-[#B9A3D6] drop-shadow-[0_2px_4px_rgba(91,42,78,0.2)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 10C10 5 4 4 2 8C0 12 5 15 10 12C5 17 2 22 5 23C8 24 11 18 12 14C13 18 16 24 19 23C22 22 19 17 14 12C19 15 24 12 22 8C20 4 14 5 12 10Z" />
          </svg>
        </div>

        {/* Butterfly 3 (Soft Rose, lower right) */}
        <div className="absolute bottom-[28%] right-[18%] animate-float-slow" style={{ animationDuration: '8s', animationDelay: '1.5s' }}>
          <svg className="w-7 h-7 text-[#E4D7F2] drop-shadow-[0_2px_5px_rgba(201,162,75,0.3)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 10C10 5 4 4 2 8C0 12 5 15 10 12C5 17 2 22 5 23C8 24 11 18 12 14C13 18 16 24 19 23C22 22 19 17 14 12C19 15 24 12 22 8C20 4 14 5 12 10Z" />
          </svg>
        </div>

        {/* Butterfly 4 (Gold-tinted soft butterfly, lower left) */}
        <div className="absolute bottom-[18%] left-[20%] animate-float-slow" style={{ animationDuration: '10s', animationDelay: '5s' }}>
          <svg className="w-4 h-4 text-[#E3C98A] drop-shadow-[0_1px_4px_rgba(201,162,75,0.4)]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 10C10 5 4 4 2 8C0 12 5 15 10 12C5 17 2 22 5 23C8 24 11 18 12 14C13 18 16 24 19 23C22 22 19 17 14 12C19 15 24 12 22 8C20 4 14 5 12 10Z" />
          </svg>
        </div>
      </div>

      {/* FLORAL FRAMING WITH PARALLAX */}
      <div ref={floralLeftRef} className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
        <FloralFrame />
      </div>

      {/* CENTER CONTENT */}
      <div
        ref={contentRef}
        className="relative z-20 w-full max-w-xl mx-auto px-4 flex flex-col items-center justify-center my-auto"
      >
        {/* Soft frosted glass backing panel */}
        <div className="w-full rounded-[2.5rem] bg-[#FFF8F3]/75 backdrop-blur-md px-6 py-10 sm:px-10 sm:py-14 border border-[#E3C98A]/50 shadow-[0_12px_40px_rgba(91,42,78,0.12)]">
          {/* Cinzel label: "IN THE PRESENCE OF FAITH & FAMILY" */}
          <span className="invite-stagger-item font-label text-xs sm:text-[13px] tracking-[0.2em] text-[#8A6414] uppercase font-bold mb-3 block">
            {wedding.invitation.label}
          </span>

          {/* Large Display heading: "You're invited" */}
          <h2 className="invite-stagger-item font-display font-bold text-[clamp(34px,7.5vw,60px)] text-[#3E1A36] leading-[1.15] drop-shadow-sm my-1">
            {wedding.invitation.heading}
          </h2>

          {/* Gold divider with 8-pointed star */}
          <div className="invite-stagger-item my-3">
            <GoldDivider />
          </div>

          {/* Couple Names - Elegantly Shaped and Centered */}
          <div className="invite-stagger-item my-4 flex flex-col items-center justify-center text-center">
            <span className="font-script text-[clamp(40px,9vw,80px)] text-[#3E1A36] leading-[1.15] name-script-shadow block">
              {wedding.bride}
            </span>
            <div className="flex items-center justify-center gap-3 my-1">
              <span className="h-[1px] w-10 sm:w-16 bg-gradient-to-r from-transparent via-[#C9A24B] to-[#C9A24B]/70" />
              <span className="font-script text-2xl sm:text-3xl text-[#8A6414] font-bold name-script-shadow select-none">
                &amp;
              </span>
              <span className="h-[1px] w-10 sm:w-16 bg-gradient-to-l from-transparent via-[#C9A24B] to-[#C9A24B]/70" />
            </div>
            <span className="font-script text-[clamp(40px,9vw,80px)] text-[#3E1A36] leading-[1.15] name-script-shadow block">
              {wedding.groom}
            </span>
          </div>

          {/* Config message */}
          <p className="invite-stagger-item font-body font-medium text-lg sm:text-[19px] text-[#3E1A36] leading-[1.6] max-w-md mx-auto my-3">
            {wedding.message}
          </p>

          {/* Line: "Two hearts. Two families. One beautiful beginning." */}
          <p className="invite-stagger-item font-body font-medium italic text-lg sm:text-[19px] text-[#5B2A4E] my-2">
            {wedding.invitation.subline}
          </p>

          {/* Small Cinzel line: "NIKAH 27 DEC 2026 · WALIMA 30 DEC 2026" */}
          <div className="invite-stagger-item font-label text-xs sm:text-[13px] tracking-[0.2em] text-[#8A6414] uppercase font-bold mt-4 pt-4 border-t border-[#C9A24B]/30">
            {timelineString}
          </div>
        </div>

        {/* ILLUSTRATED SVG ARCHED GATEWAY IN PLUM AND GOLD */}
        <div className="invite-stagger-item relative w-full max-w-xs sm:max-w-sm mt-8 mx-auto" aria-hidden="true">
          <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-md">
            {/* Base platform */}
            <line x1="20" y1="195" x2="300" y2="195" stroke="#C9A24B" strokeWidth="2" strokeLinecap="round" />
            <line x1="40" y1="198" x2="280" y2="198" stroke="#5B2A4E" strokeWidth="1" strokeOpacity="0.5" />

            {/* Left Column */}
            <rect x="50" y="80" width="12" height="115" rx="2" fill="#5B2A4E" opacity="0.85" />
            <rect x="47" y="76" width="18" height="6" rx="1" fill="#C9A24B" />
            <rect x="47" y="190" width="18" height="5" rx="1" fill="#C9A24B" />

            {/* Right Column */}
            <rect x="258" y="80" width="12" height="115" rx="2" fill="#5B2A4E" opacity="0.85" />
            <rect x="255" y="76" width="18" height="6" rx="1" fill="#C9A24B" />
            <rect x="255" y="190" width="18" height="5" rx="1" fill="#C9A24B" />

            {/* Arched Gateway outline (Animated Stroke Drawing) */}
            <path
              ref={archPathRef}
              d="M56 80 C56 40 100 15 160 15 C220 15 264 40 264 80"
              stroke="#C9A24B"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              style={{
                filter: 'drop-shadow(0 0 6px rgba(201, 162, 75, 0.6))',
              }}
            />

            {/* Inner cusped arch motif */}
            <path
              d="M66 82 C66 52 108 30 160 30 C212 30 254 52 254 82"
              stroke="#5B2A4E"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              fill="none"
              opacity="0.8"
            />

            {/* Arch Apex Finial / Crescent Ornament */}
            <g transform="translate(160, 15)">
              <circle cx="0" cy="-6" r="3" fill="#C9A24B" />
              <path d="M0 -9 L0 -14" stroke="#C9A24B" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="0" cy="-15" r="1.5" fill="#E3C98A" />
            </g>

            {/* Hanging Wisteria falling over the arch */}
            <g opacity="0.9">
              {/* Left wisteria cascade */}
              <path d="M60 40 C65 55 58 75 52 90" stroke="#9D84C7" strokeWidth="2" strokeLinecap="round" />
              <ellipse cx="50" cy="95" rx="3" ry="5" fill="#E4D7F2" />
              <ellipse cx="54" cy="84" rx="4" ry="6" fill="#B9A3D6" />
              <ellipse cx="58" cy="70" rx="4" ry="7" fill="#9D84C7" />
              <ellipse cx="62" cy="55" rx="5" ry="8" fill="#E4D7F2" />

              {/* Right wisteria cascade */}
              <path d="M260 40 C255 55 262 75 268 90" stroke="#9D84C7" strokeWidth="2" strokeLinecap="round" />
              <ellipse cx="270" cy="95" rx="3" ry="5" fill="#E4D7F2" />
              <ellipse cx="266" cy="84" rx="4" ry="6" fill="#B9A3D6" />
              <ellipse cx="262" cy="70" rx="4" ry="7" fill="#9D84C7" />
              <ellipse cx="258" cy="55" rx="5" ry="8" fill="#E4D7F2" />

              {/* Center crest blossoms */}
              <circle cx="160" cy="30" r="5" fill="#F4C6D7" />
              <circle cx="152" cy="33" r="4" fill="#E4D7F2" />
              <circle cx="168" cy="33" r="4" fill="#E4D7F2" />
            </g>

            {/* Two hanging gold lanterns with flickering glow */}
            {/* Left Lantern */}
            <g transform="translate(85, 55)">
              <line x1="0" y1="0" x2="0" y2="28" stroke="#C9A24B" strokeWidth="1" />
              <rect x="-6" y="28" width="12" height="18" rx="2" fill="#5B2A4E" stroke="#C9A24B" strokeWidth="1" />
              {/* Flickering flame glow */}
              <circle cx="0" cy="37" r="3" fill="#E3C98A" className="animate-glow-flicker" />
              <circle cx="0" cy="37" r="8" fill="#E3C98A" opacity="0.3" className="animate-glow-flicker" />
            </g>

            {/* Right Lantern */}
            <g transform="translate(235, 55)">
              <line x1="0" y1="0" x2="0" y2="28" stroke="#C9A24B" strokeWidth="1" />
              <rect x="-6" y="28" width="12" height="18" rx="2" fill="#5B2A4E" stroke="#C9A24B" strokeWidth="1" />
              {/* Flickering flame glow */}
              <circle cx="0" cy="37" r="3" fill="#E3C98A" className="animate-glow-flicker" />
              <circle cx="0" cy="37" r="8" fill="#E3C98A" opacity="0.3" className="animate-glow-flicker" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
