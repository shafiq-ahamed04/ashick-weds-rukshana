import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll(isLocked = false) {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.0,
    });

    lenisRef.current = lenis;
    window.lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCb = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (!lenisRef.current) return;
    if (isLocked) {
      lenisRef.current.stop();
      document.body.style.overflow = 'hidden';
    } else {
      lenisRef.current.start();
      document.body.style.overflow = '';
      // Refresh ScrollTrigger after unlocking
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);
    }
  }, [isLocked]);

  return lenisRef;
}
