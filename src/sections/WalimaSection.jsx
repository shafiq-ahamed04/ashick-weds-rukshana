import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { wedding, getFullEventDateLine, getGoogleMapsUrl } from '../config/wedding';
import GoldDivider from '../components/GoldDivider';
import FloralFrame from '../components/FloralFrame';
import { MapPin, Navigation, Calendar, Clock, ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function WalimaSection() {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const sectionRef = useRef(null);
  const contentCardRef = useRef(null);
  const floralRef = useRef(null);

  const walima = wedding.events.walima;
  const fullDateLine = getFullEventDateLine('walima');
  const mapsUrl = getGoogleMapsUrl(walima.mapQuery);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (!prefersReducedMotion) {
        // Content staggered fade-up on scroll
        gsap.fromTo(
          '.walima-stagger-item',
          {
            opacity: 0,
            y: 35,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: contentCardRef.current,
              start: 'top 80%',
              once: true,
            },
          }
        );

        // Floral parallax drifting
        gsap.to(floralRef.current, {
          y: -35,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        });
      } else {
        gsap.set('.walima-stagger-item', { opacity: 1, y: 0 });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-16 sm:py-24 px-4 sm:px-6 md:px-8 overflow-hidden flex flex-col items-center justify-center text-center selection:bg-[#F4C6D7] selection:text-[#3E1A36]"
      style={{
        background: 'linear-gradient(180deg, #FBE6EE 0%, #FDEEE4 35%, #F7D4B5 80%, #FFF8F3 100%)',
      }}
      aria-label="The Walima Celebration"
    >
      {/* MIRRORED FLORAL FRAMING FOR RHYTHM (Flipped horizontally) */}
      <div
        ref={floralRef}
        className="pointer-events-none absolute inset-0 z-10 transform -scale-x-100"
        aria-hidden="true"
      >
        <FloralFrame />
      </div>

      {/* CENTER EVENT CARD (Max width 560px) */}
      <div
        ref={contentCardRef}
        className="relative z-20 w-full max-w-[560px] mx-auto my-auto"
      >
        <div className="relative rounded-[2.5rem] bg-[#FFF8F3]/90 backdrop-blur-md px-6 py-9 sm:px-10 sm:py-12 border border-[#E3C98A]/70 shadow-[0_15px_45px_rgba(62,26,54,0.18)]">
          {/* Inner hairline border */}
          <div className="absolute inset-2 rounded-[2.2rem] border border-[#C9A24B]/30 pointer-events-none" />

          {/* Corner Flourishes */}
          <div className="absolute top-4 left-4 text-[#C9A24B]/60 text-xs select-none">✦</div>
          <div className="absolute top-4 right-4 text-[#C9A24B]/60 text-xs select-none">✦</div>
          <div className="absolute bottom-4 left-4 text-[#C9A24B]/60 text-xs select-none">✦</div>
          <div className="absolute bottom-4 right-4 text-[#C9A24B]/60 text-xs select-none">✦</div>

          {/* 1. KICKER */}
          <span className="walima-stagger-item font-label text-xs sm:text-[13px] tracking-[0.2em] text-[#5B2A4E] uppercase font-bold mb-2 block">
            {walima.kicker}
          </span>

          {/* 2. DISPLAY HEADING ("The Walima") */}
          <h2 className="walima-stagger-item font-display font-bold text-[clamp(34px,7.5vw,60px)] text-[#3E1A36] leading-[1.15] my-1 drop-shadow-sm capitalize">
            {walima.label.toLowerCase()}
          </h2>

          {/* 3. GOLD DIVIDER */}
          <div className="walima-stagger-item my-2">
            <GoldDivider />
          </div>

          {/* 4. BLURB */}
          <p className="walima-stagger-item font-body font-medium italic text-lg sm:text-[19px] text-[#5B2A4E] leading-[1.6] max-w-md mx-auto mb-4">
            "{walima.blurb}"
          </p>

          {/* 5. DATE LINE & TIME */}
          <div className="walima-stagger-item my-3 space-y-1.5">
            <div className="font-body font-semibold text-xl sm:text-2xl text-[#3E1A36] flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4 text-[#C9A24B]" />
              <span>{fullDateLine}</span>
            </div>
            <div className="font-label text-xs sm:text-[13px] tracking-[0.2em] text-[#5B2A4E] font-bold uppercase flex items-center justify-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#C9A24B]" />
              <span>{walima.time}</span>
            </div>
          </div>

          {/* 6. VENUE NAME & CITY */}
          <div className="walima-stagger-item my-4 pt-3 border-t border-[#C9A24B]/25">
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#3E1A36] leading-snug [text-wrap:balance]">
              {walima.venue}
            </h3>
            <p className="font-body italic text-base sm:text-lg text-[#5B2A4E] mt-1 flex items-center justify-center gap-1">
              <MapPin className="w-4 h-4 text-[#C9A24B]" />
              <span>{walima.city}</span>
            </p>
          </div>

          {/* 7. ACTION BUTTONS */}
          <div className="walima-stagger-item flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-full border-2 border-[#C9A24B] bg-gradient-to-r from-[#FFF8F3] to-[#FBE6EE] text-[#3E1A36] font-label text-xs sm:text-[13px] tracking-[0.2em] uppercase font-bold flex items-center justify-center gap-2 shadow-[0_2px_15px_rgba(201,162,75,0.35)] hover:shadow-[0_4px_22px_rgba(201,162,75,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 group cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-[#C9A24B] group-hover:rotate-45 transition-transform" />
              <span>Get Directions</span>
            </a>

            <button
              onClick={() => setIsDetailsOpen((prev) => !prev)}
              aria-expanded={isDetailsOpen}
              className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-full border border-[#5B2A4E]/40 text-[#5B2A4E] hover:text-[#3E1A36] hover:border-[#5B2A4E] font-label text-xs sm:text-[13px] tracking-[0.2em] uppercase font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>The details</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-300 ${
                  isDetailsOpen ? 'rotate-180 text-[#C9A24B]' : ''
                }`}
              />
            </button>
          </div>

          {/* 8. ACCORDION EXPANSION PANEL */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out text-left ${
              isDetailsOpen ? 'max-h-72 opacity-100 mt-5 pt-4 border-t border-[#C9A24B]/30' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="bg-[#FFF8F3]/95 rounded-2xl p-4 border border-[#E3C98A]/50 space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between items-center py-1 border-b border-[#C9A24B]/15">
                <span className="font-label text-xs tracking-wider text-[#8A6414] uppercase font-bold">Event</span>
                <span className="font-body text-[#3E1A36] font-semibold">{walima.label}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#C9A24B]/15">
                <span className="font-label text-xs tracking-wider text-[#8A6414] uppercase font-bold">Date</span>
                <span className="font-body text-[#3E1A36]">{fullDateLine}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#C9A24B]/15">
                <span className="font-label text-xs tracking-wider text-[#8A6414] uppercase font-bold">Time</span>
                <span className="font-body text-[#3E1A36]">{walima.time}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#C9A24B]/15">
                <span className="font-label text-xs tracking-wider text-[#8A6414] uppercase font-bold">Venue</span>
                <span className="font-body text-[#3E1A36] font-medium text-right max-w-[60%]">{walima.venue}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="font-label text-xs tracking-wider text-[#8A6414] uppercase font-bold">Location</span>
                <span className="font-body text-[#3E1A36] text-right">{walima.city}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
