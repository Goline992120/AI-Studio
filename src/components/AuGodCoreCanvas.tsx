import React, { useEffect, useRef } from 'react';

interface AuGodCoreCanvasProps {
  width?: number;
  height?: number;
  isProcessing?: boolean;
  intensity?: number;
}

export const AuGodCoreCanvas: React.FC<AuGodCoreCanvasProps> = ({
  width = 390,
  height = 390,
  isProcessing = false,
  intensity = 1.0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angleOuter = 0;
    let angleMiddle = 0;
    let angleInner = 0;
    let pulseScale = 1;
    let pulseDirection = 1;

    // Particle nodes for quantum flux
    const particles = Array.from({ length: 36 }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 60 + Math.random() * 110,
      speed: (0.005 + Math.random() * 0.015) * (Math.random() > 0.5 ? 1 : -1),
      size: 1 + Math.random() * 2.5,
      alpha: 0.2 + Math.random() * 0.8,
      color: Math.random() > 0.4 ? '#f59e0b' : '#06b6d4',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;

      // Speed multipliers based on processing state
      const speedMult = isProcessing ? 2.5 : 1.0;
      angleOuter += 0.008 * speedMult;
      angleMiddle -= 0.012 * speedMult;
      angleInner += 0.018 * speedMult;

      // Center pulse oscillation
      pulseScale += 0.004 * pulseDirection * speedMult;
      if (pulseScale > 1.06) pulseDirection = -1;
      if (pulseScale < 0.96) pulseDirection = 1;

      // 1. Quantum Radial Glow Aura
      const glowGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, 180);
      glowGrad.addColorStop(0, isProcessing ? 'rgba(245, 158, 11, 0.25)' : 'rgba(245, 158, 11, 0.12)');
      glowGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.06)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Quantum Orbiting Particles
      particles.forEach((p) => {
        p.angle += p.speed * speedMult;
        const px = cx + Math.cos(p.angle) * p.radius;
        const py = cy + Math.sin(p.angle) * p.radius;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      // 3. Ring 1 (Outer Hex/Dashed Ring - Radius: 175)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angleOuter);
      ctx.beginPath();
      ctx.arc(0, 0, 172, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 12, 2, 12]);
      ctx.stroke();

      // Outer tick accents (4 cardinal nodes)
      for (let i = 0; i < 8; i++) {
        const theta = (i * Math.PI) / 4;
        const tx = Math.cos(theta) * 172;
        const ty = Math.sin(theta) * 172;
        ctx.beginPath();
        ctx.arc(tx, ty, i % 2 === 0 ? 3.5 : 2, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? '#f59e0b' : '#38bdf8';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 10;
        ctx.fill();
      }
      ctx.restore();

      // 4. Ring 2 (Middle Segmented Cyan Ring - Radius: 145)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angleMiddle);
      ctx.shadowBlur = 0;
      ctx.setLineDash([]);
      // Draw 3 arc segments
      for (let i = 0; i < 3; i++) {
        const start = (i * 2 * Math.PI) / 3 + 0.15;
        const end = start + (2 * Math.PI) / 3 - 0.3;
        ctx.beginPath();
        ctx.arc(0, 0, 142, start, end);
        ctx.strokeStyle = isProcessing ? 'rgba(6, 182, 212, 0.85)' : 'rgba(6, 182, 212, 0.55)';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      // Draw middle ring chevron/tick marks
      for (let i = 0; i < 24; i++) {
        const theta = (i * Math.PI) / 12;
        const r1 = 138;
        const r2 = i % 3 === 0 ? 148 : 144;
        ctx.beginPath();
        ctx.moveTo(Math.cos(theta) * r1, Math.sin(theta) * r1);
        ctx.lineTo(Math.cos(theta) * r2, Math.sin(theta) * r2);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.restore();

      // 5. Ring 3 (Inner Amber Dotted Ring - Radius: 118)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angleInner);
      ctx.beginPath();
      ctx.arc(0, 0, 115, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.restore();

      // 6. Center Pulse Arc Glow Wave
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(pulseScale, pulseScale);
      ctx.beginPath();
      ctx.arc(0, 0, 92, 0, Math.PI * 2);
      ctx.strokeStyle = isProcessing ? 'rgba(245, 158, 11, 0.9)' : 'rgba(245, 158, 11, 0.5)';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = isProcessing ? 25 : 15;
      ctx.setLineDash([]);
      ctx.stroke();
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [width, height, isProcessing, intensity]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ width: '100%', height: '100%' }}
    />
  );
};
