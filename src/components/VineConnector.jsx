import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Vertical gold vine connector that grows as user scrolls between events,
 * with small leaves and an ornamental crescent icon in the center.
 */
export default function VineConnector() {
  const containerRef = useRef(null);
  const vineTopRef = useRef(null);
  const vineBottomRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      if (!prefersReducedMotion) {
        if (vineTopRef.current) {
          const topLen = vineTopRef.current.getTotalLength();
          gsap.set(vineTopRef.current, { strokeDasharray: topLen, strokeDashoffset: topLen });
          gsap.to(vineTopRef.current, {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 85%',
              end: 'center center',
              scrub: 1,
            },
          });
        }

        if (vineBottomRef.current) {
          const bottomLen = vineBottomRef.current.getTotalLength();
          gsap.set(vineBottomRef.current, { strokeDasharray: bottomLen, strokeDashoffset: bottomLen });
          gsap.to(vineBottomRef.current, {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'center center',
              end: 'bottom 50%',
              scrub: 1,
            },
          });
        }
      } else {
        if (vineTopRef.current) gsap.set(vineTopRef.current, { strokeDashoffset: 0 });
        if (vineBottomRef.current) gsap.set(vineBottomRef.current, { strokeDashoffset: 0 });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full py-6 sm:py-10 flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #B9A3D6 0%, #D8C3E5 40%, #F5CAD8 75%, #FBE6EE 100%)',
      }}
      aria-hidden="true"
    >
      <div className="relative flex flex-col items-center justify-center h-32 sm:h-44 w-24">
        {/* Upper growing vine with leaves */}
        <svg viewBox="0 0 40 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-16 sm:h-20">
          <path
            ref={vineTopRef}
            d="M20 0 C22 15 15 30 20 45 C25 60 18 75 20 80"
            stroke="#C9A24B"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Leaves */}
          <path d="M20 20 C14 16 12 12 16 10 C18 12 19 16 20 20 Z" fill="#C9A24B" opacity="0.8" />
          <path d="M20 38 C26 34 28 30 24 28 C22 30 21 34 20 38 Z" fill="#E3C98A" opacity="0.8" />
          <path d="M20 56 C14 52 12 48 16 46 C18 48 19 52 20 56 Z" fill="#C9A24B" opacity="0.8" />
        </svg>

        {/* Center Ornamental Crescent & Star Emblem */}
        <div className="relative my-1 p-2 rounded-full bg-[#FFF8F3] border border-[#E3C98A] shadow-[0_0_15px_rgba(201,162,75,0.4)] z-10 flex items-center justify-center">
          <svg className="w-5 h-5 text-[#C9A24B]" viewBox="0 0 24 24" fill="currentColor">
            {/* Islamic Crescent Moon and Star */}
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C14.15 22 16.14 21.32 17.78 20.17C14.07 19.46 11.27 16.23 11.27 12.33C11.27 8.43 14.07 5.2 17.78 4.49C16.14 3.34 14.15 2 12 2Z" />
            <polygon points="17.5,7.5 18.5,10 21,10 19,11.5 19.8,14 17.5,12.5 15.2,14 16,11.5 14,10 16.5,10" fill="#E3C98A" />
          </svg>
        </div>

        {/* Lower growing vine with leaves */}
        <svg viewBox="0 0 40 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-16 sm:h-20">
          <path
            ref={vineBottomRef}
            d="M20 0 C18 15 25 30 20 45 C15 60 22 75 20 80"
            stroke="#C9A24B"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Leaves */}
          <path d="M20 22 C26 18 28 14 24 12 C22 14 21 18 20 22 Z" fill="#C9A24B" opacity="0.8" />
          <path d="M20 42 C14 38 12 34 16 32 C18 34 19 38 20 42 Z" fill="#E3C98A" opacity="0.8" />
          <path d="M20 62 C26 58 28 54 24 52 C22 54 21 58 20 62 Z" fill="#C9A24B" opacity="0.8" />
        </svg>
      </div>
    </div>
  );
}
