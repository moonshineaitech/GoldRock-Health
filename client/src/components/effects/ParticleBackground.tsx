import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  hue: number;
}

export default function ParticleBackground({ intensity = 25 }: { intensity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const frameCountRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const actualIntensity = Math.min(intensity, 30);
    particlesRef.current = Array.from({ length: actualIntensity }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.4 + 0.1,
      hue: 180 + Math.random() * 40,
    }));

    const animate = () => {
      frameCountRef.current++;
      if (frameCountRef.current % 2 !== 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.fillStyle = "rgba(10, 22, 40, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.speedX *= 0.995;
        particle.speedY *= 0.995;
        particle.speedX += (Math.random() - 0.5) * 0.005;
        particle.speedY += (Math.random() - 0.5) * 0.005;

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 100%, 60%, ${particle.opacity})`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}

export function FloatingOrbs() {
  const orbs = [
    { size: 350, x: "15%", y: "25%", color: "cyan" },
    { size: 280, x: "75%", y: "35%", color: "purple" },
    { size: 300, x: "55%", y: "70%", color: "pink" },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {orbs.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full blur-[100px]"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: orb.color === "cyan" 
              ? "radial-gradient(circle, rgba(0,240,255,0.12) 0%, transparent 70%)"
              : orb.color === "purple"
              ? "radial-gradient(circle, rgba(138,43,226,0.10) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)",
          }}
        />
      ))}
    </div>
  );
}

export function DNAHelixLoader({ size = 60 }: { size?: number }) {
  const strands = 8;
  
  return (
    <div className="relative" style={{ width: size, height: size * 1.5 }}>
      {Array.from({ length: strands }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 rounded-full"
          style={{
            width: 8,
            height: 8,
            marginLeft: -4,
            top: (i / strands) * size * 1.2,
            background: i % 2 === 0 
              ? "linear-gradient(135deg, #00f0ff, #0080ff)" 
              : "linear-gradient(135deg, #8b5cf6, #ec4899)",
            boxShadow: i % 2 === 0
              ? "0 0 8px #00f0ff"
              : "0 0 8px #8b5cf6",
          }}
          animate={{
            x: [
              Math.sin((i / strands) * Math.PI * 2) * 12,
              Math.sin((i / strands) * Math.PI * 2 + Math.PI) * 12,
              Math.sin((i / strands) * Math.PI * 2) * 12,
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function GlowingBorder({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative group ${className}`}>
      <div
        className="absolute -inset-0.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "linear-gradient(90deg, #00f0ff, #8b5cf6, #ec4899)",
        }}
      />
      <div className="relative bg-background rounded-xl">{children}</div>
    </div>
  );
}

export function PulseRing({ color = "cyan" }: { color?: "cyan" | "purple" | "pink" }) {
  const colors = {
    cyan: "rgba(0, 240, 255, 0.4)",
    purple: "rgba(138, 43, 226, 0.4)",
    pink: "rgba(236, 72, 153, 0.4)",
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border"
          style={{ borderColor: colors[color] }}
          animate={{
            scale: [1, 1.8],
            opacity: [0.4, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 1,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
