import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { wedding } from '../config/wedding';

/**
 * Phase 5.5: Cinematic AR Logo Reveal Intro
 * - 100svh full-viewport cream -> blush -> lilac gradient with grain & gentle gold dust
 * - Zero user interaction, fully automatic ~3.6s sequence
 * - Center: Ornate AR monogram logo with circle expansion, soft gold shimmer, breathing scale
 * - Exit: scale to 1.12, fade out while cross-fading to reveal hero underneath
 * - Failsafe at 7s, scroll lock until finished
 */
export default function IntroSplash({ onOpen }) {
  const [isRendered, setIsRendered] = useState(true);
  const containerRef = useRef(null);
  const logoWrapperRef = useRef(null);
  const logoImgRef = useRef(null);
  const shimmerRef = useRef(null);

  const introConfig = wedding.intro || {
    duration: 3.6,
    openStart: 0.3,
    openEnd: 1.5,
    shimmerStart: 1.2,
    shimmerEnd: 2.2,
    breatheStart: 1.0,
    breatheEnd: 2.8,
    exitStart: 2.8,
    exitEnd: 3.6,
    heroTextStart: 3.2,
    maxWait: 4.0,
    failsafe: 7.0,
  };

  useEffect(() => {
    let isCancelled = false;
    let timeline = null;

    // Hard failsafe timer to dismiss intro if anything hangs
    const failsafeTimer = setTimeout(() => {
      if (!isCancelled) {
        onOpen();
        setIsRendered(false);
      }
    }, introConfig.failsafe * 1000);

    const initAnimation = async () => {
      // Asset readiness: wait for logo, hero background & fonts (max wait: 4s)
      const maxWaitPromise = new Promise((resolve) =>
        setTimeout(resolve, introConfig.maxWait * 1000)
      );

      const assetLoadPromise = (async () => {
        try {
          const promises = [];

          // 1. Logo image decode
          const logo = new Image();
          logo.src = wedding.logo.webp;
          if (logo.decode) {
            promises.push(logo.decode().catch(() => {}));
          }

          // 2. Hero background decode
          const heroBg = new Image();
          heroBg.src = wedding.heroBg.webp;
          if (heroBg.decode) {
            promises.push(heroBg.decode().catch(() => {}));
          }

          // 3. Fonts ready
          if (document.fonts && document.fonts.ready) {
            promises.push(document.fonts.ready.catch(() => {}));
          }

          await Promise.all(promises);
        } catch {
          // Continue on asset decode error
        }
      })();

      await Promise.race([assetLoadPromise, maxWaitPromise]);

      if (isCancelled || !containerRef.current) return;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      timeline = gsap.timeline({
        onComplete: () => {
          clearTimeout(failsafeTimer);
          setIsRendered(false);
        },
      });

      if (prefersReducedMotion) {
        // Reduced motion: 0.4s fade in, 0.8s hold, 0.4s fade out
        timeline
          .fromTo(logoWrapperRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' })
          .to({}, { duration: 0.8 })
          .call(() => onOpen())
          .to(containerRef.current, { opacity: 0, duration: 0.4, ease: 'power2.in' });
        return;
      }

      // Normal cinematic reveal timeline (~3.6s)
      if (!logoImgRef.current || !shimmerRef.current || !logoWrapperRef.current || !containerRef.current) return;

      // Initial states
      gsap.set(logoImgRef.current, {
        clipPath: 'circle(0% at 50% 50%)',
        scale: 0.9,
        filter: 'blur(10px)',
        opacity: 0,
      });
      gsap.set(shimmerRef.current, {
        xPercent: -120,
        opacity: 0,
      });

      // 0.3s -> 1.5s: circle expands, scale 0.9 -> 1, blur 10px -> 0, opacity 0 -> 1
      timeline.to(
        logoImgRef.current,
        {
          clipPath: 'circle(75% at 50% 50%)',
          scale: 1,
          filter: 'blur(0px)',
          opacity: 1,
          duration: introConfig.openEnd - introConfig.openStart,
          ease: 'power3.out',
        },
        introConfig.openStart
      );

      // 1.2s -> 2.2s: diagonal gold shimmer sweep across logo
      timeline
        .to(shimmerRef.current, { opacity: 0.85, duration: 0.15 }, introConfig.shimmerStart)
        .to(
          shimmerRef.current,
          {
            xPercent: 130,
            duration: introConfig.shimmerEnd - introConfig.shimmerStart,
            ease: 'power2.inOut',
          },
          introConfig.shimmerStart
        )
        .to(shimmerRef.current, { opacity: 0, duration: 0.2 }, introConfig.shimmerEnd - 0.2);

      // 1.0s -> 2.8s: gentle breathing scale 1 -> 1.03
      timeline.to(
        logoWrapperRef.current,
        {
          scale: 1.03,
          duration: introConfig.breatheEnd - introConfig.breatheStart,
          ease: 'sine.inOut',
        },
        introConfig.breatheStart
      );

      // 2.8s -> 3.6s: exit - scale 1.12, fade out while cross-fading
      timeline.to(
        logoWrapperRef.current,
        {
          scale: 1.12,
          opacity: 0,
          duration: introConfig.exitEnd - introConfig.exitStart,
          ease: 'power2.in',
        },
        introConfig.exitStart
      );

      timeline.to(
        containerRef.current,
        {
          opacity: 0,
          duration: introConfig.exitEnd - introConfig.exitStart,
          ease: 'power2.inOut',
        },
        introConfig.exitStart
      );

      // Start hero text entrance animation at 3.2s
      timeline.call(() => onOpen(), null, introConfig.heroTextStart);
    };

    initAnimation();

    return () => {
      isCancelled = true;
      clearTimeout(failsafeTimer);
      if (timeline) timeline.kill();
    };
  }, []);

  if (!isRendered) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 h-screen h-svh-screen w-full overflow-hidden flex flex-col items-center justify-center pointer-events-none select-none"
      style={{
        background: 'radial-gradient(ellipse at 50% 45%, #FFF8F3 0%, #FBE6EE 42%, #E4D7F2 100%)',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Wedding Monogram Reveal"
    >
      {/* Film grain layer */}
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#5B2A4E_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {/* Floating golden dust particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-[20%] left-[22%] w-1.5 h-1.5 rounded-full bg-[#E3C98A] shadow-[0_0_8px_#C9A24B] animate-pulse" />
        <div className="absolute top-[35%] right-[25%] w-2 h-2 rounded-full bg-[#E3C98A] shadow-[0_0_10px_#C9A24B] animate-pulse" style={{ animationDelay: '1.2s' }} />
        <div className="absolute bottom-[28%] left-[30%] w-1.5 h-1.5 rounded-full bg-[#FFF8F3] shadow-[0_0_8px_#C9A24B] animate-pulse" style={{ animationDelay: '2.0s' }} />
        <div className="absolute bottom-[22%] right-[20%] w-2 h-2 rounded-full bg-[#E3C98A] shadow-[0_0_10px_#C9A24B] animate-pulse" style={{ animationDelay: '0.6s' }} />
      </div>

      {/* AR LOGO DISPLAY */}
      <div
        ref={logoWrapperRef}
        className="relative z-10 flex items-center justify-center w-[78vw] max-w-[520px] aspect-[3/2]"
      >
        <div ref={logoImgRef} className="relative w-full h-full flex items-center justify-center">
          <picture>
            <source srcSet={wedding.logo.webp} type="image/webp" />
            <img
              src={wedding.logo.png}
              alt={wedding.logo.alt}
              width="520"
              height="347"
              className="w-full h-auto object-contain"
              style={{
                maxHeight: '70svh',
                filter: 'drop-shadow(0 6px 18px rgba(91,42,78,0.25))',
              }}
            />
          </picture>

          {/* Diagonal Gold Shimmer Overlay */}
          <div
            ref={shimmerRef}
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{
              maskImage: `url(${wedding.logo.png})`,
              WebkitMaskImage: `url(${wedding.logo.png})`,
              maskSize: 'contain',
              WebkitMaskSize: 'contain',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              maskPosition: 'center',
              WebkitMaskPosition: 'center',
            }}
            aria-hidden="true"
          >
            <div
              className="w-full h-full"
              style={{
                background:
                  'linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.7) 50%, transparent 80%)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
