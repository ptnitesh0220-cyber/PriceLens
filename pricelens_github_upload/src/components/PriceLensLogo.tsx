import React from "react";
import { Sparkles, Cpu } from "lucide-react";

const uploadedLogo = new URL("../assets/images/pricelens_logo_1784732952225.jpg", import.meta.url).href;

interface PriceLensLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
}

export const PriceLensLogo: React.FC<PriceLensLogoProps> = ({
  size = "md",
  showText = true,
  showTagline = false,
  className = ""
}) => {
  // Dimensions map
  const iconSizeMap = {
    sm: "w-8 h-8",
    md: "w-11 h-11",
    lg: "w-20 h-20",
    xl: "w-36 h-36"
  };

  const textSizeMap = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
    xl: "text-6xl"
  };

  const taglineSizeMap = {
    sm: "text-[10px]",
    md: "text-[12px]",
    lg: "text-sm",
    xl: "text-lg"
  };

  const aiBadgeSizeMap = {
    sm: "text-[9px] px-1.5 py-0.2",
    md: "text-[10px] px-2 py-0.5",
    lg: "text-xs px-2.5 py-1",
    xl: "text-sm px-3.5 py-1.5"
  };

  return (
    <div className={`flex items-center gap-3.5 ${className}`}>
      {/* Uploaded 6-Petal Purple Ribbon Logo Image */}
      <div className={`relative shrink-0 flex items-center justify-center rounded-2xl overflow-hidden shadow-lg shadow-purple-900/40 border border-purple-500/30 bg-slate-950 ${iconSizeMap[size]}`}>
        <img
          src={uploadedLogo}
          alt="PriceLens Logo"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-2xl transform hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Brand Typography with AI Badge */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className={`font-black tracking-tight leading-none ${textSizeMap[size]}`}>
              <span className="bg-gradient-to-r from-purple-300 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                Price
              </span>
              <span className="bg-gradient-to-r from-fuchsia-400 via-pink-400 to-violet-400 bg-clip-text text-transparent">
                Lens
              </span>
            </div>

            {/* Glowing Purple AI Badge */}
            <span className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-black tracking-wider uppercase shadow-lg shadow-purple-500/30 border border-purple-300/40 ${aiBadgeSizeMap[size]}`}>
              <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
              AI
            </span>
          </div>

          {showTagline && (
            <span className={`text-purple-300/70 font-semibold tracking-wide mt-1 flex items-center gap-1 ${taglineSizeMap[size]}`}>
              <Cpu className="w-3.5 h-3.5 text-purple-400 inline" /> AI Visual Price Engine
            </span>
          )}
        </div>
      )}
    </div>
  );
};
