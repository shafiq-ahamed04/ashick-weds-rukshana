import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { wedding } from '../config/wedding';
import GoldDivider from '../components/GoldDivider';
import FloralFrame from '../components/FloralFrame';

gsap.registerPlugin(ScrollTrigger);

export default function BrideGroomSection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const brideCardRef = useRef(null);
  const groomCardRef = useRef(null);
  const floralRef = useRef(null);

  const { bride, groom } = wedding.people;
  const coupleCaption = wedding.couple.caption;

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (!prefersReducedMotion) {
        // Heading block staggered fade-up
        gsap.fromTo(
          '.people-heading-item',
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.14,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );

        // Floral parallax
        gsap.to(floralRef.current, {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });

        // Arch cards reveal
        [brideCardRef.current, groomCardRef.current].forEach((card) => {
          if (!card) return;

          const img = card.querySelector('.arch-photo');
          const frame = card.querySelector('.arch-frame');
          const details = card.querySelector('.person-details');

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: 'top 78%',
              once: true,
            },
          });

          tl.fromTo(
            frame,
            { opacity: 0.4, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' }
          )
            .fromTo(
              img,
              { scale: 1.12 },
              { scale: 1, duration: 1.4, ease: 'power2.out' },
              '<'
            )
            .fromTo(
              details,
              { opacity: 0, y: 15 },
              { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
              '-=0.4'
            );
        });
      } else {
        gsap.set('.people-heading-item', { opacity: 1, y: 0 });
        gsap.set('.person-details', { opacity: 1, y: 0 });
        gsap.set('.arch-frame', { opacity: 1, scale: 1 });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 sm:py-28 px-4 sm:px-6 md:px-12 overflow-hidden flex flex-col items-center justify-center text-center selection:bg-[#F4C6D7] selection:text-[#3E1A36]"
      style={{
        background: 'linear-gradient(180deg, #FFF8F3 0%, #FBE6EE 35%, #F4D3E5 65%, #E4D7F2 100%)',
      }}
      aria-label="Meet the Bride and Groom"
    >
      {/* FLORAL FRAMING ON SCREEN EDGES */}
      <div ref={floralRef} className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
        <FloralFrame />
      </div>

      {/* HEADING BLOCK */}
      <div ref={headingRef} className="relative z-20 max-w-xl mx-auto mb-10 sm:mb-14">
        <span className="people-heading-item font-label text-xs sm:text-[13px] tracking-[0.2em] text-[#8A6414] uppercase font-bold mb-2 block">
          Meet the Bride &amp; Groom
        </span>

        <h2 className="people-heading-item font-display font-bold text-[clamp(34px,7.5vw,60px)] text-[#3E1A36] leading-[1.15] my-1 drop-shadow-sm">
          {wedding.bride} &amp; {wedding.groom}
        </h2>

        <div className="people-heading-item my-3">
          <GoldDivider />
        </div>

        {coupleCaption && (
          <p className="people-heading-item font-body font-medium italic text-lg sm:text-[19px] text-[#5B2A4E] leading-[1.6] max-w-md mx-auto">
            "{coupleCaption}"
          </p>
        )}
      </div>

      {/* PORTRAIT CARDS CONTAINER: 2-column grid on desktop, aligned at top edge, no staggering */}
      <div className="relative z-20 w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-start justify-items-center gap-10 lg:gap-10">
        {/* BRIDE CARD (Left) */}
        <div
          ref={brideCardRef}
          className="group relative w-full max-w-[320px] flex flex-col items-center transition-transform duration-500 ease-out hover:-translate-y-2"
        >
          {/* Islamic Rounded Arch Photo Frame (Safari-compatible rounded arch, double gold border) */}
          <div className="arch-frame relative w-full aspect-[3/4.2] rounded-t-[140px] rounded-b-3xl p-1.5 bg-gradient-to-b from-[#E3C98A] via-[#C9A24B] to-[#9C7728] shadow-[0_15px_35px_rgba(62,26,54,0.2)]">
            <div className="relative w-full h-full p-1 bg-[#FFF8F3] rounded-t-[134px] rounded-b-[22px] overflow-hidden">
              <div className="w-full h-full rounded-t-[128px] rounded-b-[18px] overflow-hidden relative">
                <picture>
                  <source srcSet={bride.photoWebp} type="image/webp" />
                  <img
                    src={bride.photo}
                    alt={`${bride.name} - ${bride.role}`}
                    className="arch-photo w-full h-full object-cover transition-transform duration-700 will-change-transform"
                    style={{ objectPosition: bride.objectPosition || 'center 28%' }}
                    loading="lazy"
                    decoding="async"
                    width="700"
                    height="980"
                  />
                </picture>

                {/* Subtle vintage overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#5B2A4E]/15 via-transparent to-[#E3C98A]/10 mix-blend-soft-light" />
              </div>
            </div>

            {/* Corner Floral Flourish Overlapping Bottom */}
            <div className="pointer-events-none absolute -bottom-4 -left-4 w-16 h-16 drop-shadow-md z-10" aria-hidden="true">
              <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="35" cy="45" r="18" fill="#F4C6D7" opacity="0.9" />
                <circle cx="33" cy="43" r="13" fill="#FBE6EE" />
                <circle cx="35" cy="45" r="5" fill="#C9A24B" />
                <circle cx="55" cy="55" r="12" fill="#E4D7F2" opacity="0.85" />
              </svg>
            </div>
            <div className="pointer-events-none absolute -bottom-4 -right-4 w-16 h-16 drop-shadow-md z-10 transform -scale-x-100" aria-hidden="true">
              <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="35" cy="45" r="18" fill="#F4C6D7" opacity="0.9" />
                <circle cx="33" cy="43" r="13" fill="#FBE6EE" />
                <circle cx="35" cy="45" r="5" fill="#C9A24B" />
              </svg>
            </div>
          </div>

          {/* Under Photo Details - Shared min-height ensures identical baseline across cards */}
          <div className="person-details mt-5 text-center min-h-[96px] flex flex-col items-center justify-start">
            <span className="font-label text-xs sm:text-[13px] tracking-[0.2em] text-[#8A6414] uppercase font-bold block mb-1">
              {bride.role}
            </span>
            <h3 className="font-script text-[clamp(44px,6vw,56px)] text-[#3E1A36] leading-[1.15] name-script-shadow [text-wrap:balance]">
              {bride.name}
            </h3>
            {bride.oneLine && bride.oneLine.trim() !== '' && (
              <p className="font-body italic text-lg text-[#5B2A4E] mt-1 max-w-xs">
                {bride.oneLine}
              </p>
            )}
          </div>
        </div>

        {/* DESKTOP CENTER ORNAMENTAL VINE (Vertically centered with photos) */}
        <div className="hidden lg:flex flex-col items-center justify-center self-start w-12 pt-[180px]" aria-hidden="true">
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-[#C9A24B] to-[#C9A24B]" />
          <div className="my-2 p-1.5 rounded-full bg-[#FFF8F3] border border-[#E3C98A] shadow-[0_0_10px_rgba(201,162,75,0.4)] text-[#C9A24B]">
            {/* 8-Pointed Star Centerpiece */}
            <svg className="w-5 h-5 text-[#C9A24B]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L14.2 8.3L20.5 6.1L17.3 12L22 15.3L15.7 16.5L14.5 22.8L12 17.5L9.5 22.8L8.3 16.5L2 15.3L6.7 12L3.5 6.1L9.8 8.3L12 2Z" />
            </svg>
          </div>
          <div className="w-[1px] h-16 bg-gradient-to-b from-[#C9A24B] via-[#C9A24B] to-transparent" />
        </div>

        {/* GROOM CARD (Right, sharing identical top edge and dimensions with Bride card) */}
        <div
          ref={groomCardRef}
          className="group relative w-full max-w-[320px] flex flex-col items-center transition-transform duration-500 ease-out hover:-translate-y-2"
        >
          {/* Islamic Rounded Arch Photo Frame (Identical aspect-ratio and top alignment) */}
          <div className="arch-frame relative w-full aspect-[3/4.2] rounded-t-[140px] rounded-b-3xl p-1.5 bg-gradient-to-b from-[#E3C98A] via-[#C9A24B] to-[#9C7728] shadow-[0_15px_35px_rgba(62,26,54,0.2)]">
            <div className="relative w-full h-full p-1 bg-[#FFF8F3] rounded-t-[134px] rounded-b-[22px] overflow-hidden">
              <div className="w-full h-full rounded-t-[128px] rounded-b-[18px] overflow-hidden relative">
                <picture>
                  <source srcSet={groom.photoWebp} type="image/webp" />
                  <img
                    src={groom.photo}
                    alt={`${groom.name} - ${groom.role}`}
                    className="arch-photo w-full h-full object-cover transition-transform duration-700 will-change-transform"
                    style={{ objectPosition: groom.objectPosition || 'center 25%' }}
                    loading="lazy"
                    decoding="async"
                    width="700"
                    height="980"
                  />
                </picture>

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#5B2A4E]/15 via-transparent to-[#E3C98A]/10 mix-blend-soft-light" />
              </div>
            </div>

            {/* Corner Floral Flourish Overlapping Bottom */}
            <div className="pointer-events-none absolute -bottom-4 -left-4 w-16 h-16 drop-shadow-md z-10" aria-hidden="true">
              <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="35" cy="45" r="18" fill="#F4C6D7" opacity="0.9" />
                <circle cx="33" cy="43" r="13" fill="#FBE6EE" />
                <circle cx="35" cy="45" r="5" fill="#C9A24B" />
              </svg>
            </div>
            <div className="pointer-events-none absolute -bottom-4 -right-4 w-16 h-16 drop-shadow-md z-10 transform -scale-x-100" aria-hidden="true">
              <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="35" cy="45" r="18" fill="#F4C6D7" opacity="0.9" />
                <circle cx="33" cy="43" r="13" fill="#FBE6EE" />
                <circle cx="35" cy="45" r="5" fill="#C9A24B" />
                <circle cx="55" cy="55" r="12" fill="#E4D7F2" opacity="0.85" />
              </svg>
            </div>
          </div>

          {/* Under Photo Details - Shared min-height ensures identical baseline across cards */}
          <div className="person-details mt-5 text-center min-h-[96px] flex flex-col items-center justify-start">
            <span className="font-label text-xs sm:text-[13px] tracking-[0.2em] text-[#8A6414] uppercase font-bold block mb-1">
              {groom.role}
            </span>
            <h3 className="font-script text-[clamp(44px,6vw,56px)] text-[#3E1A36] leading-[1.15] name-script-shadow [text-wrap:balance]">
              {groom.name}
            </h3>
            {groom.oneLine && groom.oneLine.trim() !== '' && (
              <p className="font-body italic text-lg text-[#5B2A4E] mt-1 max-w-xs">
                {groom.oneLine}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
