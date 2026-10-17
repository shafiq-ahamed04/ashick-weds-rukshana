import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { wedding, getEventStartDate } from '../config/wedding';
import GoldDivider from '../components/GoldDivider';

gsap.registerPlugin(ScrollTrigger);

export default function CountdownSection() {
  const sectionRef = useRef(null);
  const cardContainerRef = useRef(null);

  const nikahDate = getEventStartDate('nikah');
  const walimaDate = getEventStartDate('walima');

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const nikahTime = nikahDate.getTime();
    const walimaTime = walimaDate.getTime();

    if (now >= walimaTime) {
      return { stage: 'completed', days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    if (now >= nikahTime) {
      const diff = Math.max(0, walimaTime - now);
      return {
        stage: 'walima',
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    }

    const diff = Math.max(0, nikahTime - now);
    return {
      stage: 'nikah',
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Entrance animation
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (!prefersReducedMotion) {
        gsap.fromTo(
          '.countdown-stagger-item',
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
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
        gsap.set('.countdown-stagger-item', { opacity: 1, y: 0 });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const formatDigit = (num) => String(num).padStart(2, '0');

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-20 sm:py-28 px-4 sm:px-6 md:px-12 overflow-hidden flex flex-col items-center justify-center text-center selection:bg-[#C9A24B]/30 selection:text-[#FFF8F3]"
      style={{
        background: 'linear-gradient(180deg, #35142E 0%, #2F1329 45%, #3E1A36 80%, #4D2142 100%)',
      }}
      aria-label="Wedding Countdown Timer"
    >
      {/* TWINKLING GOLDEN STARS & ATMOSPHERIC DUSK PARTICLES */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-[12%] left-[12%] w-1.5 h-1.5 rounded-full bg-[#E3C98A] shadow-[0_0_8px_#C9A24B] animate-pulse" />
        <div className="absolute top-[28%] right-[16%] w-1.5 h-1.5 rounded-full bg-[#E3C98A] shadow-[0_0_8px_#C9A24B] animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-[65%] left-[18%] w-1 h-1 rounded-full bg-[#FFF8F3] shadow-[0_0_6px_#C9A24B] animate-pulse" style={{ animationDelay: '2.5s' }} />
        <div className="absolute bottom-[20%] right-[22%] w-1.5 h-1.5 rounded-full bg-[#E3C98A] shadow-[0_0_8px_#C9A24B] animate-pulse" style={{ animationDelay: '0.8s' }} />

        {/* Ambient warm radial dusk glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#C9A24B]/10 blur-[100px]" />
      </div>

      {/* HEADING BLOCK */}
      <div className="countdown-stagger-item relative z-20 max-w-xl mx-auto mb-8 sm:mb-12">
        <span className="font-label text-xs sm:text-[13px] tracking-[0.2em] text-[#E3C98A] uppercase font-bold mb-2 block drop-shadow-sm">
          {timeLeft.stage === 'walima' ? 'COUNTING DOWN TO WALIMA' : 'UNTIL OUR BEAUTIFUL BEGINNING'}
        </span>

        <h2 className="font-display font-bold text-[clamp(34px,7.5vw,60px)] text-[#FFF8F3] leading-[1.15] my-2 drop-shadow-md">
          {timeLeft.stage === 'completed'
            ? 'Jazakumullahu khairan'
            : timeLeft.stage === 'walima'
            ? 'The celebration has begun'
            : 'Counting the days'}
        </h2>

        <div className="my-2">
          <GoldDivider className="opacity-80" />
        </div>

        {timeLeft.stage === 'completed' ? (
          <p className="font-body font-medium italic text-lg sm:text-[19px] text-[#FBE6EE] mt-3">
            Jazakumullahu khairan for your duas and gracious presence.
          </p>
        ) : (
          <p className="font-body font-medium italic text-base sm:text-lg text-[#FBE6EE] mt-1">
            {timeLeft.stage === 'walima'
              ? 'Gathering for the Walima celebration'
              : 'Counting down every precious moment to our Nikah'}
          </p>
        )}
      </div>

      {/* COUNTDOWN GLASS CARDS (Hidden if completed) */}
      {timeLeft.stage !== 'completed' && (
        <div
          ref={cardContainerRef}
          className="countdown-stagger-item relative z-20 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 w-full max-w-xs sm:max-w-xl md:max-w-2xl mx-auto"
        >
          {/* Days Card */}
          <div className="relative rounded-2xl bg-[#FFF8F3]/10 backdrop-blur-md p-4 sm:p-6 border border-[#E3C98A]/40 shadow-[0_8px_30px_rgba(0,0,0,0.35)] flex flex-col items-center justify-center">
            <span className="font-display text-3xl sm:text-5xl md:text-6xl text-[#FFF8F3] font-bold tabular-nums tracking-tight drop-shadow-[0_2px_10px_rgba(201,162,75,0.4)]">
              {formatDigit(timeLeft.days)}
            </span>
            <span className="font-label text-xs sm:text-[13px] tracking-[0.2em] text-[#E3C98A] uppercase font-bold mt-1.5">
              Days
            </span>
          </div>

          {/* Hours Card */}
          <div className="relative rounded-2xl bg-[#FFF8F3]/10 backdrop-blur-md p-4 sm:p-6 border border-[#E3C98A]/40 shadow-[0_8px_30px_rgba(0,0,0,0.35)] flex flex-col items-center justify-center">
            <span className="font-display text-3xl sm:text-5xl md:text-6xl text-[#FFF8F3] font-bold tabular-nums tracking-tight drop-shadow-[0_2px_10px_rgba(201,162,75,0.4)]">
              {formatDigit(timeLeft.hours)}
            </span>
            <span className="font-label text-xs sm:text-[13px] tracking-[0.2em] text-[#E3C98A] uppercase font-bold mt-1.5">
              Hours
            </span>
          </div>

          {/* Minutes Card */}
          <div className="relative rounded-2xl bg-[#FFF8F3]/10 backdrop-blur-md p-4 sm:p-6 border border-[#E3C98A]/40 shadow-[0_8px_30px_rgba(0,0,0,0.35)] flex flex-col items-center justify-center">
            <span className="font-display text-3xl sm:text-5xl md:text-6xl text-[#FFF8F3] font-bold tabular-nums tracking-tight drop-shadow-[0_2px_10px_rgba(201,162,75,0.4)]">
              {formatDigit(timeLeft.minutes)}
            </span>
            <span className="font-label text-xs sm:text-[13px] tracking-[0.2em] text-[#E3C98A] uppercase font-bold mt-1.5">
              Minutes
            </span>
          </div>

          {/* Seconds Card */}
          <div className="relative rounded-2xl bg-[#FFF8F3]/10 backdrop-blur-md p-4 sm:p-6 border border-[#E3C98A]/40 shadow-[0_8px_30px_rgba(0,0,0,0.35)] flex flex-col items-center justify-center">
            <span className="font-display text-3xl sm:text-5xl md:text-6xl text-[#E3C98A] font-bold tabular-nums tracking-tight drop-shadow-[0_2px_10px_rgba(201,162,75,0.6)]">
              {formatDigit(timeLeft.seconds)}
            </span>
            <span className="font-label text-xs sm:text-[13px] tracking-[0.2em] text-[#E3C98A] uppercase font-bold mt-1.5">
              Seconds
            </span>
          </div>
        </div>
      )}

      {/* DECEMBER 2026 CALENDAR WITH HEART-SHAPED HIGHLIGHTS */}
      <div className="countdown-stagger-item relative z-20 w-full max-w-sm sm:max-w-md mx-auto mt-12 sm:mt-16">
        <div className="relative rounded-3xl bg-[#FFF8F3]/[0.08] backdrop-blur-md p-5 sm:p-7 border border-[#E3C98A]/35 shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
          {/* Calendar Header */}
          <div className="text-center mb-5">
            <span className="font-label text-[11px] sm:text-xs tracking-[0.25em] text-[#E3C98A] uppercase font-bold block mb-1">
              Save The Dates
            </span>
            <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#FFF8F3] tracking-wide">
              December 2026
            </h3>
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#E3C98A]/60 to-transparent mx-auto mt-2" />
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <span
                key={day}
                className="font-label text-[11px] sm:text-xs tracking-wider text-[#E3C98A]/90 font-bold uppercase py-1"
              >
                {day}
              </span>
            ))}
          </div>

          {/* Calendar Days Grid (Dec 1, 2026 is Tuesday -> 2 empty offset cells) */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center items-center">
            {/* Offset empty slots for Sun, Mon */}
            <div className="aspect-square" />
            <div className="aspect-square" />

            {/* Days 1 to 31 */}
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
              const isNikah = day === 27;
              const isWalima = day === 30;

              if (isNikah) {
                return (
                  <div
                    key={day}
                    className="relative aspect-square flex items-center justify-center group"
                    title="The Nikah · Dec 27, 2026"
                  >
                    {/* Heart Highlight SVG */}
                    <svg
                      viewBox="0 0 24 24"
                      className="absolute inset-0 m-auto w-8 h-8 sm:w-10 sm:h-10 text-[#C9A24B] drop-shadow-[0_2px_12px_rgba(201,162,75,0.7)] animate-pulse"
                      fill="currentColor"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <span className="relative z-10 font-display font-extrabold text-xs sm:text-sm text-[#250D20] pt-0.5">
                      {day}
                    </span>
                  </div>
                );
              }

              if (isWalima) {
                return (
                  <div
                    key={day}
                    className="relative aspect-square flex items-center justify-center group"
                    title="The Walima · Dec 30, 2026"
                  >
                    {/* Heart Highlight SVG */}
                    <svg
                      viewBox="0 0 24 24"
                      className="absolute inset-0 m-auto w-8 h-8 sm:w-10 sm:h-10 text-[#F4C6D7] drop-shadow-[0_2px_12px_rgba(244,198,215,0.7)] animate-pulse"
                      fill="currentColor"
                    >
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    <span className="relative z-10 font-display font-extrabold text-xs sm:text-sm text-[#250D20] pt-0.5">
                      {day}
                    </span>
                  </div>
                );
              }

              return (
                <div
                  key={day}
                  className="aspect-square flex items-center justify-center rounded-xl text-xs sm:text-sm font-body font-medium text-[#FFF8F3]/85 hover:bg-white/10 transition-colors"
                >
                  {day}
                </div>
              );
            })}
          </div>

          {/* Calendar Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 pt-4 border-t border-[#E3C98A]/20">
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-[#C9A24B] drop-shadow-[0_0_6px_rgba(201,162,75,0.6)]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="font-label text-[11px] sm:text-xs tracking-wider text-[#FFF8F3] font-semibold">
                Dec 27 · The Nikah
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-4 h-4 text-[#F4C6D7] drop-shadow-[0_0_6px_rgba(244,198,215,0.6)]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="font-label text-[11px] sm:text-xs tracking-wider text-[#FFF8F3] font-semibold">
                Dec 30 · The Walima
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
