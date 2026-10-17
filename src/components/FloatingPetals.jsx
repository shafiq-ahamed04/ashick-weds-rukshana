import React, { useEffect, useRef } from 'react';

/**
 * High-performance canvas animation for floating petals and glowing golden dust particles.
 * Optimized for mobile: devicePixelRatio capped at 2, reduced count on <768px screens,
 * and paused automatically when the tab is hidden.
 */
export default function FloatingPetals({ count = 24, dustCount = 30 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let isPaused = false;

    // Cap devicePixelRatio at 2 for mobile performance
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let cssWidth = window.innerWidth;
    let cssHeight = window.innerHeight;

    const updateCanvasSize = () => {
      if (!canvas) return;
      cssWidth = window.innerWidth;
      cssHeight = window.innerHeight;
      canvas.width = cssWidth * dpr;
      canvas.height = cssHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Visibility change handler to pause when tab is inactive
    const handleVisibilityChange = () => {
      isPaused = document.hidden;
      if (!isPaused) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Responsive particle count: reduce on mobile (<768px)
    const isMobile = window.innerWidth < 768;
    const activePetalCount = isMobile ? Math.min(count, 12) : count;
    const activeDustCount = isMobile ? Math.min(dustCount, 16) : dustCount;

    // Color palettes for rose & lilac petals
    const petalColors = [
      { r: 244, g: 198, b: 215, a: 0.65 }, // blush
      { r: 251, g: 230, b: 238, a: 0.75 }, // soft blush
      { r: 228, g: 215, b: 242, a: 0.60 }, // soft lilac
      { r: 247, g: 212, b: 181, a: 0.55 }, // peach
      { r: 255, g: 240, b: 245, a: 0.70 }, // white blossom
    ];

    // Petal class
    class Petal {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * cssWidth;
        this.y = init ? Math.random() * cssHeight : -20;
        this.size = Math.random() * 7 + 5;
        this.speedY = Math.random() * 0.6 + 0.35;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        this.color = petalColors[Math.floor(Math.random() * petalColors.length)];
        this.sway = Math.random() * 2;
        this.swaySpeed = Math.random() * 0.02 + 0.01;
      }

      update() {
        this.y += this.speedY;
        this.x += Math.sin(this.sway) * 0.5 + this.speedX;
        this.sway += this.swaySpeed;
        this.rotation += this.rotationSpeed;

        if (this.y > cssHeight + 20 || this.x < -20 || this.x > cssWidth + 20) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
        ctx.fill();
        ctx.restore();
      }
    }

    // Glowing dust particle class
    class DustParticle {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * cssWidth;
        this.y = init ? Math.random() * cssHeight : cssHeight + 10;
        this.size = Math.random() * 1.6 + 0.6;
        this.speedY = -(Math.random() * 0.3 + 0.12);
        this.speedX = (Math.random() - 0.5) * 0.25;
        this.alpha = Math.random() * 0.5 + 0.2;
        this.pulse = Math.random() * Math.PI;
        this.pulseSpeed = Math.random() * 0.03 + 0.01;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.pulse += this.pulseSpeed;

        if (this.y < -10 || this.x < -10 || this.x > cssWidth + 10) {
          this.reset();
        }
      }

      draw() {
        const currentAlpha = Math.max(0.1, this.alpha + Math.sin(this.pulse) * 0.2);
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(227, 201, 138, ${currentAlpha})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = 'rgba(201, 162, 75, 0.6)';
        ctx.fill();
        ctx.restore();
      }
    }

    const petals = Array.from({ length: activePetalCount }, () => new Petal());
    const dustParticles = Array.from({ length: activeDustCount }, () => new DustParticle());

    const render = () => {
      if (isPaused) return;

      ctx.clearRect(0, 0, cssWidth, cssHeight);

      for (let i = 0; i < dustParticles.length; i++) {
        dustParticles[i].update();
        dustParticles[i].draw();
      }

      for (let i = 0; i < petals.length; i++) {
        petals[i].update();
        petals[i].draw();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, [count, dustCount]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-20 h-full w-full"
      aria-hidden="true"
    />
  );
}
