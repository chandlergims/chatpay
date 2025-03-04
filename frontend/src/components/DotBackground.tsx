import React, { useEffect, useRef } from 'react';
import './DotBackground.css';

interface Dot {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  maxDistance: number;
  phase: number;
}

const DotBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initial resize
    resizeCanvas();

    // Resize on window resize
    window.addEventListener('resize', resizeCanvas);

    // Dots array
    const dots: Dot[] = [];
    const spacing = 20; // Spacing between dots

    // Create dots in a grid pattern
    const createDots = () => {
      dots.length = 0;
      for (let x = -spacing; x <= canvas.width + spacing; x += spacing) {
        for (let y = -spacing; y <= canvas.height + spacing; y += spacing) {
          dots.push({
            x,
            y,
            baseX: x,
            baseY: y,
            size: 1.5,
            maxDistance: 20,
            phase: 0
          });
        }
      }
    };

    createDots();
    window.addEventListener('resize', createDots);

    // Update dot position with wave motion
    const updateDot = (dot: Dot, time: number) => {
      // Calculate distance from center for wave effect
      const distanceFromCenter = Math.sqrt(
        Math.pow(dot.baseX - window.innerWidth / 2, 2) + 
        Math.pow(dot.baseY - window.innerHeight / 2, 2)
      );

      // Wave pattern radiating from center
      dot.phase = time + distanceFromCenter * 0.003;

      // Combine multiple wave functions for more complex movement
      const waveX = Math.sin(dot.phase) * dot.maxDistance * 
                    Math.cos(dot.baseY * 0.02);
      const waveY = Math.cos(dot.phase) * dot.maxDistance * 
                    Math.sin(dot.baseX * 0.02);

      dot.x = dot.baseX + waveX;
      dot.y = dot.baseY + waveY;
    };

    // Draw dot on canvas
    const drawDot = (dot: Dot) => {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
      
      // Add opacity based on position in wave
      const opacity = 0.3 + Math.abs(Math.sin(dot.phase)) * 0.7;
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fill();
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = Date.now() / 1500; // Animation speed

      dots.forEach(dot => {
        updateDot(dot, time);
        drawDot(dot);
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('resize', createDots);
    };
  }, []);

  return <canvas ref={canvasRef} className="dot-background" />;
};

export default DotBackground;
