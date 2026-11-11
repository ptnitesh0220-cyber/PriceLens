import React, { useState, useEffect } from "react";
import { Sparkles, CheckCircle, Store } from "lucide-react";

interface ScanningAnimationProps {
  imageUri: string | null;
}

const STEPS = [
  { text: "Preprocessing visual pixels...", icon: "🔍" },
  { text: "Extracting product features with Gemini AI...", icon: "🧠" },
  { text: "Matching barcode and design signatures...", icon: "📦" },
  { text: "Querying prices across Amazon, Flipkart, Myntra, Ajio...", icon: "🛒" },
  { text: "Selecting best offers & calculating discounts...", icon: "💰" },
];

export const ScanningAnimation: React.FC<ScanningAnimationProps> = ({ imageUri }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [visibleSteps, setVisibleSteps] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev < STEPS.length - 1 ? prev + 1 : prev;
        setVisibleSteps((vs) => [...new Set([...vs, next])]);
        return next;
      });
    }, 900);
    setVisibleSteps([0]);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[480px] p-6 text-center" style={{ animation: "slideInUp 0.4s ease-out" }}>

      {/* Scan frame */}
      <div
        className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden mb-8"
        style={{
          border: "2px solid rgba(168,85,247,0.5)",
          background: "#0d0d1a",
          boxShadow: "0 0 50px rgba(168,85,247,0.2), 0 0 100px rgba(168,85,247,0.08)",
        }}
      >
        {/* Product image */}
        {imageUri ? (
          <img src={imageUri} alt="Scanning" className="w-full h-full object-cover brightness-75" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: "rgba(168,85,247,0.05)" }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)" }}>
              <Sparkles className="w-8 h-8 animate-pulse" style={{ color: "#a855f7" }} />
            </div>
          </div>
        )}

        {/* Purple scan beam */}
        <div
          className="absolute inset-x-0 h-0.5 pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent, #a855f7, #d946ef, #a855f7, transparent)",
            boxShadow: "0 0 20px rgba(168,85,247,0.8)",
            animation: "scan 2s ease-in-out infinite",
          }}
        />

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(rgba(168,85,247,0.15) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }} />

        {/* Corner brackets — purple */}
        {[
          { top: "14px", left: "14px", bt: "border-t-2", bl: "border-l-2" },
          { top: "14px", right: "14px", bt: "border-t-2", br: "border-r-2" },
          { bottom: "14px", left: "14px", bb: "border-b-2", bl: "border-l-2" },
          { bottom: "14px", right: "14px", bb: "border-b-2", br: "border-r-2" },
        ].map((pos, i) => (
          <div key={i} className="absolute w-6 h-6" style={{
            ...pos,
            borderColor: "#a855f7",
            borderTopWidth: pos.bt ? 2 : 0,
            borderBottomWidth: pos.bb ? 2 : 0,
            borderLeftWidth: pos.bl ? 2 : 0,
            borderRightWidth: pos.br ? 2 : 0,
          }} />
        ))}

        {/* Badge */}
        <div className="absolute bottom-3 inset-x-3 flex justify-center">
          <div
            className="px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5"
            style={{
              background: "rgba(13,13,26,0.92)",
              border: "1px solid rgba(168,85,247,0.4)",
              backdropFilter: "blur(8px)",
              color: "#d8b4fe",
            }}
          >
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ color: "#a855f7" }} />
            Gemini AI Vision Active
          </div>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-lg sm:text-xl font-black text-white mb-1">
        Scanning & comparing prices...
      </h2>
      <p className="text-xs mb-6" style={{ color: "#94a3b8" }}>
        Checking live deals across Amazon, Flipkart, Myntra & more.
      </p>

      {/* Steps list */}
      <div
        className="w-full max-w-md rounded-2xl p-4 text-left space-y-2.5"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(168,85,247,0.15)" }}
      >
        {STEPS.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;
          const isVisible = visibleSteps.includes(idx) || isDone || isCurrent;

          return (
            <div
              key={idx}
              className="flex items-center gap-3 text-xs transition-all duration-500"
              style={{
                opacity: isVisible ? 1 : 0.25,
                color: isDone ? "#34d399" : isCurrent ? "#c084fc" : "#475569",
                animation: isVisible ? "slideInLeft 0.4s ease-out both" : undefined,
                animationDelay: `${idx * 0.08}s`,
              }}
            >
              {isDone ? (
                <CheckCircle className="w-4 h-4 shrink-0" style={{ color: "#34d399" }} />
              ) : isCurrent ? (
                <span className="w-4 h-4 rounded-full border-2 shrink-0 animate-spin"
                  style={{ borderColor: "#a855f7", borderTopColor: "transparent" }} />
              ) : (
                <span className="w-4 h-4 rounded-full border shrink-0"
                  style={{ borderColor: "rgba(168,85,247,0.25)" }} />
              )}
              <span className="font-medium">{step.icon} {step.text}</span>
            </div>
          );
        })}
      </div>

      {/* Platform row */}
      <div className="mt-6 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#475569" }}>
        <Store className="w-3.5 h-3.5" />
        <span>Amazon • Flipkart • Myntra • Ajio • Croma • Tata CLIQ</span>
      </div>
    </div>
  );
};
