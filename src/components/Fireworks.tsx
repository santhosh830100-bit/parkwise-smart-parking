import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  decay: number;
  gravity: number;
  friction: number;
  size: number;
}

export const Fireworks: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    // Handle resizing
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create a explosion burst
    const createBurst = (x: number, y: number, particleCount = 80) => {
      const baseHue = Math.random() * 360;
      const newParticles: Particle[] = [];
      
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        // Spreads out in circular shape with random velocity magnitude
        const speed = Math.random() * 7 + 3; 
        const hue = (baseHue + (Math.random() * 40 - 20) + 360) % 360;
        const saturation = 95 + Math.random() * 5;
        const lightness = 55 + Math.random() * 15;
        
        newParticles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: `hsla(${hue}, ${saturation}%, ${lightness}%, `,
          alpha: 1.0,
          decay: Math.random() * 0.015 + 0.012, // fades out after ~1.5 to 2.5 seconds
          gravity: 0.12,
          friction: 0.96,
          size: Math.random() * 2.5 + 1.5,
        });
      }
      particles.push(...newParticles);
    };

    // Trigger initial bursts on mount
    const triggerInitialBursts = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      // Spawn 5 burst crackers at various locations
      setTimeout(() => createBurst(w * 0.5, h * 0.35, 100), 0);
      setTimeout(() => createBurst(w * 0.3, h * 0.45, 80), 200);
      setTimeout(() => createBurst(w * 0.7, h * 0.4, 80), 400);
      setTimeout(() => createBurst(w * 0.4, h * 0.25, 90), 700);
      setTimeout(() => createBurst(w * 0.6, h * 0.3, 90), 900);
    };

    triggerInitialBursts();

    // Spawning random crackers bursts periodically
    const intervalId = setInterval(() => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const x = Math.random() * (w * 0.8) + (w * 0.1);
      const y = Math.random() * (h * 0.5) + (h * 0.15);
      createBurst(x, y, Math.floor(Math.random() * 40) + 50);
    }, 450);

    // Stop launching new crackers after 4.5 seconds (celebration peak)
    const stopSpawningTimeout = setTimeout(() => {
      clearInterval(intervalId);
    }, 4500);

    // Animation Loop
    const animate = () => {
      // Clear canvas but keep transparency
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles = particles.filter((p) => {
        p.vx *= p.friction;
        p.vy *= p.friction;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) return false;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.fill();
        return true;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      clearInterval(intervalId);
      clearTimeout(stopSpawningTimeout);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
