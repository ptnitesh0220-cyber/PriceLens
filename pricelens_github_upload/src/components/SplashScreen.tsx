import React, { useEffect, useState } from "react";
import { PriceLensLogo } from "./PriceLensLogo";
import { Cpu } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

const PARTICLES = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  left: `${8 + i * 9}%`,
  delay: `${i * 0.18}s`,
  duration: `${2.4 + (i % 3) * 0.5}s`,
  size: i % 3 === 0 ? 6 : i % 3 === 1 ? 4 : 3,
  opacity: 0.3 + (i % 4) * 0.15,
}));

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Animate progress bar
    const steps = [20, 45, 68, 85, 100];
    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) { setProgress(steps[i]); i++; }
      else clearInterval(interval);
    }, 300);

    // Fade out then complete
    const fadeTimer = setTimeout(() => setFadeOut(true), 1600);
    const doneTimer = setTimeout(() => onComplete(), 1900);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden select-none"
      style={{
        background: "linear-gradient(135deg, #080612 0%, #0d0a1f 50%, #060d1a 100%)",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 0.35s ease-out",
      }}
    >
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(168,85,247,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.04) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }} />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.18), transparent 70%)", animation: "pulseGlow 3s ease-in-out infinite" }} />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.12), transparent 70%)", animation: "pulseGlow 3s ease-in-out infinite 1.5s" }} />

      {/* Rising particles */}
      {PARTICLES.map((p) => (
        <div key={p.id} className="absolute bottom-0 rounded-full pointer-events-none"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            background: `rgba(168,85,247,${p.opacity})`,
            animation: `particleFloat ${p.duration} ${p.delay} ease-in infinite`,
          }}
        />
      ))}

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-6" style={{ animation: "slideInUp 0.5s ease-out both" }}>
        {/* Logo with glow ring */}
        <div className="relative">
          <div className="absolute -inset-8 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(168,85,247,0.35), transparent 70%)", animation: "pulseGlow 2s ease-in-out infinite" }} />
          <PriceLensLogo size="xl" showText={true} showTagline={true} className="flex-col text-center" />
        </div>

        {/* Tagline */}
        <div className="flex items-center gap-2 text-purple-400/70 text-sm font-semibold">
          <Cpu className="w-4 h-4" />
          <span>AI Visual Price Engine</span>
        </div>

        {/* Progress bar */}
        <div className="w-56 space-y-2">
          <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "rgba(168,85,247,0.15)" }}>
            <div className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #7c3aed, #a855f7, #d946ef)",
                boxShadow: "0 0 12px rgba(168,85,247,0.6)",
              }}
            />
          </div>
          <p className="text-center text-[11px] text-slate-500 font-medium">Initializing AI Lens...</p>
        </div>
      </div>
    </div>
  );
};
