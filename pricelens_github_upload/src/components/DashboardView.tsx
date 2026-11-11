import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  Search, 
  Camera, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  Tag, 
  ArrowRight, 
  Sliders, 
  CheckCircle2, 
  DollarSign, 
  TrendingDown, 
  Smartphone, 
  Headphones, 
  Laptop, 
  Watch, 
  ShoppingBag, 
  Flame,
  Award,
  Clock,
  ExternalLink,
  Upload,
  Eye,
  Scale,
  Bell,
  ChevronRight,
  MoreHorizontal
} from "lucide-react";
import { UserProfile, AnalysisResult } from "../types";
import { ImageUploadZone } from "./ImageUploadZone";

const homepageHero3DImage = new URL("../assets/images/homepage_hero_ai_lens.jpg", import.meta.url).href;

interface TrendingItem {
  id: string;
  name: string;
  category: string;
  image: string;
  lowestPrice: number;
  originalPrice: number;
  bestPlatform: string;
  discountPct: number;
}

interface DashboardViewProps {
  user: UserProfile | null;
  analysisResult: AnalysisResult | null;
  trending: TrendingItem[];
  onOpenCamera: () => void;
  onSearch: (query: string) => void;
  onImageSelected: (image: string) => void;
  onSelectTrending: (item: TrendingItem) => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  analysisResult,
  trending,
  onOpenCamera,
  onSearch,
  onImageSelected,
  onSelectTrending,
  onNavigateTab
}) => {
  const [searchInput, setSearchInput] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState(25000);

  // Quick preset search categories
  const categoryChips = [
    { label: "Smartphones", icon: Smartphone, query: "iPhone 15 Pro", color: "from-blue-600 to-cyan-500" },
    { label: "Audio & ANC", icon: Headphones, query: "Sony WH-1000XM5", color: "from-purple-600 to-indigo-500" },
    { label: "Laptops", icon: Laptop, query: "MacBook Air M3", color: "from-emerald-500 to-teal-600" },
    { label: "Smartwatches", icon: Watch, query: "Galaxy Watch 6", color: "from-amber-500 to-orange-600" },
    { label: "Sneakers", icon: ShoppingBag, query: "Air Jordan 1", color: "from-rose-500 to-pink-600" },
  ];

  // Quick popular search tags
  const popularTags = [
    "iPhone 15",
    "Sony WH-1000XM5",
    "Air Jordan 1",
    "MacBook Air M3",
    "Samsung S24 Ultra",
    "AirPods Pro 2",
    "Dyson V12"
  ];

  // Store network list
  const storeNetwork = [
    { name: "Amazon", logo: "amazon", label: "Lowest Price Guarantee", bg: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
    { name: "Flipkart", logo: "flipkart", label: "Instant Bank Coupons", bg: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
    { name: "Myntra", logo: "myntra", label: "Fashion Brand Deals", bg: "bg-pink-500/10 text-pink-400 border-pink-500/30" },
    { name: "Croma", logo: "croma", label: "Store Express Pickup", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
    { name: "Ajio", logo: "ajio", label: "Exclusive Wardrobe Sale", bg: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
    { name: "Tata CLIQ", logo: "tatacliq", label: "Luxury Tech Verified", bg: "bg-rose-500/10 text-rose-400 border-rose-500/30" },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearch(searchInput.trim());
    }
  };

  // Savings estimation logic
  const estimatedSavingsMonth = Math.round(monthlyBudget * 0.18);
  const estimatedSavingsYear = estimatedSavingsMonth * 12;

  // Sparkline SVG paths for stat cards
  const sparklines = {
    searches: "M0,30 L8,25 L16,28 L24,18 L32,22 L40,15 L48,10 L56,14 L64,8 L72,5",
    stores: "M0,28 L10,26 L20,22 L30,25 L40,18 L50,12 L60,16 L72,10",
    savings: "M0,32 L10,28 L20,30 L30,22 L40,18 L50,14 L60,10 L72,6"
  };

  // Category chips matching image
  const topCategoryChips = [
    { label: "Smartphones", icon: Smartphone },
    { label: "Laptops", icon: Laptop },
    { label: "Headphones", icon: Headphones },
    { label: "Watches", icon: Watch },
    { label: "Fashion", icon: ShoppingBag },
    { label: "Electronics", icon: Zap },
  ];

  // Platform logos floating in 3D visual
  const platformBadges = [
    { name: "A", color: "#FF9900", bg: "rgba(26,18,0,0.95)", border: "#FF9900", label: "Amazon", pos: "top-2 left-6" },
    { name: "f", color: "#2874F0", bg: "rgba(6,16,46,0.95)", border: "#2874F0", label: "Flipkart", pos: "top-2 right-10" },
    { name: "M", color: "#FF3F6C", bg: "rgba(26,0,16,0.95)", border: "#FF3F6C", label: "Meesho", pos: "top-16 left-2" },
    { name: "m", color: "#FF3F6C", bg: "rgba(26,0,10,0.95)", border: "#FF3F6C", label: "myntra", pos: "bottom-14 left-8" },
    { name: "A", color: "#9B59B6", bg: "rgba(20,0,30,0.95)", border: "#9B59B6", label: "AJIO", pos: "top-12 right-4" },
  ];

  return (
    <div className="space-y-0 animate-in fade-in duration-300">

      {/* ═══════════════════════════════════════════════════════════════
           HERO SECTION — matches reference image exactly
      ═══════════════════════════════════════════════════════════════ */}
      <div
        style={{
          background: "linear-gradient(135deg, #080c1a 0%, #0d1230 40%, #0a0f22 70%, #06080f 100%)",
          borderRadius: "0 0 2rem 2rem",
          padding: "2rem 1.5rem 1.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow blobs */}
        <div style={{ position: "absolute", top: "-80px", left: "-60px", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(99,58,240,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "30px", right: "20%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-40px", right: "-40px", width: "350px", height: "350px", background: "radial-gradient(circle, rgba(99,58,240,0.10) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* THREE-COLUMN GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 260px", gap: "2rem", alignItems: "center", position: "relative", zIndex: 10 }}>

          {/* ── LEFT: Headline + Search + Chips ── */}
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 900, color: "#fff", lineHeight: 1.15, marginBottom: "0.35rem", letterSpacing: "-0.02em" }}>
              Compare Smarter,{" "}
              <br />
              <span style={{ color: "#38bdf8" }}>Save Bigger</span>{" "}
              <span style={{ fontSize: "1.5rem" }}>🛒</span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "0.8rem", lineHeight: 1.6, marginBottom: "1.2rem", maxWidth: "380px" }}>
              Upload a product image or search and get<br />the best prices from top shopping platforms.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} style={{ marginBottom: "1rem" }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(15,23,42,0.95)",
                border: "1.5px solid rgba(99,102,241,0.4)",
                borderRadius: "14px",
                padding: "0.4rem 0.4rem 0.4rem 1rem",
                boxShadow: "0 0 0 1px rgba(99,102,241,0.15), 0 4px 24px rgba(0,0,0,0.4)",
              }}>
                <Search style={{ width: 16, height: 16, color: "#94a3b8", flexShrink: 0 }} />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search for products, brands or categories..."
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#fff",
                    fontSize: "0.8rem",
                    minWidth: 0,
                  }}
                />
                <button
                  type="submit"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.55rem 1.1rem",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    border: "none",
                    cursor: "pointer",
                    flexShrink: 0,
                    boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Zap style={{ width: 13, height: 13 }} />
                  Compare
                </button>
              </div>
            </form>

            {/* Category Chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", alignItems: "center" }}>
              {topCategoryChips.map((chip) => {
                const Icon = chip.icon;
                return (
                  <button
                    key={chip.label}
                    onClick={() => { setSearchInput(chip.label); onSearch(chip.label); }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      padding: "0.3rem 0.75rem",
                      borderRadius: "999px",
                      background: "rgba(15,23,42,0.8)",
                      border: "1px solid rgba(51,65,85,0.8)",
                      color: "#cbd5e1",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(99,102,241,0.6)"; (e.currentTarget as HTMLButtonElement).style.color = "#a5b4fc"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(51,65,85,0.8)"; (e.currentTarget as HTMLButtonElement).style.color = "#cbd5e1"; }}
                  >
                    <Icon style={{ width: 12, height: 12 }} />
                    {chip.label}
                  </button>
                );
              })}
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  padding: "0.3rem 0.75rem",
                  borderRadius: "999px",
                  background: "rgba(15,23,42,0.8)",
                  border: "1px solid rgba(51,65,85,0.8)",
                  color: "#94a3b8",
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <MoreHorizontal style={{ width: 12, height: 12 }} />
                More
              </button>
            </div>
          </div>

          {/* ── CENTER: 3D Visual with floating platform badges ── */}
          <div style={{ position: "relative", width: "340px", height: "240px", flexShrink: 0 }}>
            {/* Outer glow ring */}
            <div style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse at center, rgba(99,58,240,0.2) 0%, rgba(56,189,248,0.1) 40%, transparent 75%)",
              borderRadius: "50%",
              filter: "blur(12px)",
            }} />

            {/* Platform badges floating around */}
            {platformBadges.map((p, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  ...Object.fromEntries(p.pos.split(" ").map(cls => {
                    if (cls.startsWith("top-")) return ["top", `${parseInt(cls.replace("top-", "")) * 4}px`];
                    if (cls.startsWith("bottom-")) return ["bottom", `${parseInt(cls.replace("bottom-", "")) * 4}px`];
                    if (cls.startsWith("left-")) return ["left", `${parseInt(cls.replace("left-", "")) * 4}px`];
                    if (cls.startsWith("right-")) return ["right", `${parseInt(cls.replace("right-", "")) * 4}px`];
                    return [];
                  })),
                  padding: "0.3rem 0.65rem",
                  borderRadius: "10px",
                  background: p.bg,
                  border: `1.5px solid ${p.border}40`,
                  color: p.color,
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  boxShadow: `0 4px 16px ${p.color}30`,
                  zIndex: 20,
                  animation: `float-${i % 3} ${3 + i * 0.4}s ease-in-out infinite`,
                }}
              >
                {p.label}
              </div>
            ))}

            {/* Central holographic cart */}
            <div style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "130px",
              height: "130px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              {/* Glow platform disc */}
              <div style={{
                position: "absolute",
                bottom: "-18px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "120px",
                height: "18px",
                background: "radial-gradient(ellipse, rgba(56,189,248,0.6) 0%, rgba(99,58,240,0.3) 50%, transparent 80%)",
                borderRadius: "50%",
                filter: "blur(4px)",
              }} />
              {/* Cart SVG — neon blue holographic */}
              <svg viewBox="0 0 80 80" style={{ width: "110px", height: "110px", filter: "drop-shadow(0 0 18px rgba(56,189,248,0.8)) drop-shadow(0 0 40px rgba(99,58,240,0.5))" }}>
                {/* Cart body */}
                <path d="M15 18 L18 18 L26 52 L62 52 L70 28 L22 28" stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 28 L70 28 L62 52 L26 52" fill="rgba(56,189,248,0.08)" stroke="#38bdf8" strokeWidth="1.5" />
                {/* Wheels */}
                <circle cx="32" cy="58" r="4" fill="none" stroke="#7c3aed" strokeWidth="2.5" />
                <circle cx="56" cy="58" r="4" fill="none" stroke="#7c3aed" strokeWidth="2.5" />
                {/* Sparkle dots on cart */}
                <circle cx="40" cy="38" r="1.5" fill="#38bdf8" opacity="0.8" />
                <circle cx="48" cy="35" r="1" fill="#7c3aed" opacity="0.8" />
                <circle cx="36" cy="42" r="1" fill="#06b6d4" opacity="0.6" />
                {/* Top sparkle */}
                <path d="M42 8 L43.5 12 L47 12 L44.2 14.5 L45.5 18 L42 15.5 L38.5 18 L39.8 14.5 L37 12 L40.5 12 Z" fill="#38bdf8" opacity="0.9" />
              </svg>
            </div>

            {/* Magnifying glass icon top-right */}
            <div style={{
              position: "absolute",
              top: "8px",
              right: "20px",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(56,189,248,0.08)",
              borderRadius: "50%",
              border: "1px solid rgba(56,189,248,0.3)",
            }}>
              <Search style={{ width: 18, height: 18, color: "#38bdf8", opacity: 0.7 }} />
            </div>
          </div>

          {/* ── RIGHT: Stat Cards with sparklines ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {/* Searches Done */}
            <div style={{
              background: "rgba(13,18,40,0.9)",
              border: "1px solid rgba(51,65,85,0.5)",
              borderRadius: "12px",
              padding: "0.75rem 1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.75rem",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <TrendingUp style={{ width: 16, height: 16, color: "#f87171" }} />
                </div>
                <div>
                  <div style={{ color: "#64748b", fontSize: "0.65rem", fontWeight: 600, marginBottom: "0.1rem" }}>Searches Done</div>
                  <div style={{ color: "#fff", fontSize: "1.15rem", fontWeight: 800, lineHeight: 1 }}>1,248</div>
                </div>
              </div>
              <svg width="72" height="36" viewBox="0 0 72 36" fill="none">
                <path d={sparklines.searches} stroke="#f87171" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <path d={`${sparklines.searches} L72,36 L0,36 Z`} fill="url(#redGrad)" opacity="0.15" />
                <defs><linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f87171" /><stop offset="100%" stopColor="transparent" /></linearGradient></defs>
              </svg>
            </div>

            {/* Stores Compared */}
            <div style={{
              background: "rgba(13,18,40,0.9)",
              border: "1px solid rgba(51,65,85,0.5)",
              borderRadius: "12px",
              padding: "0.75rem 1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.75rem",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(34,211,238,0.10)", border: "1px solid rgba(34,211,238,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ShieldCheck style={{ width: 16, height: 16, color: "#22d3ee" }} />
                </div>
                <div>
                  <div style={{ color: "#64748b", fontSize: "0.65rem", fontWeight: 600, marginBottom: "0.1rem" }}>Stores Compared</div>
                  <div style={{ color: "#fff", fontSize: "1.15rem", fontWeight: 800, lineHeight: 1 }}>12+</div>
                </div>
              </div>
              <svg width="72" height="36" viewBox="0 0 72 36" fill="none">
                <path d={sparklines.stores} stroke="#22d3ee" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <path d={`${sparklines.stores} L72,36 L0,36 Z`} fill="url(#cyanGrad)" opacity="0.15" />
                <defs><linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#22d3ee" /><stop offset="100%" stopColor="transparent" /></linearGradient></defs>
              </svg>
            </div>

            {/* Total Savings */}
            <div style={{
              background: "rgba(13,18,40,0.9)",
              border: "1px solid rgba(51,65,85,0.5)",
              borderRadius: "12px",
              padding: "0.75rem 1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.75rem",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <TrendingDown style={{ width: 16, height: 16, color: "#34d399" }} />
                </div>
                <div>
                  <div style={{ color: "#64748b", fontSize: "0.65rem", fontWeight: 600, marginBottom: "0.1rem" }}>Total Savings</div>
                  <div style={{ color: "#fff", fontSize: "1.15rem", fontWeight: 800, lineHeight: 1 }}>₹24,580</div>
                </div>
              </div>
              <svg width="72" height="36" viewBox="0 0 72 36" fill="none">
                <path d={sparklines.savings} stroke="#34d399" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <path d={`${sparklines.savings} L72,36 L0,36 Z`} fill="url(#greenGrad)" opacity="0.15" />
                <defs><linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#34d399" /><stop offset="100%" stopColor="transparent" /></linearGradient></defs>
              </svg>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
             SCAN PRODUCT STRIP — directly below hero inside same dark block
        ═══════════════════════════════════════════════════════════════ */}
        <div style={{ marginTop: "1.75rem", paddingTop: "1.25rem", borderTop: "1px solid rgba(51,65,85,0.4)" }}>
          <div style={{ color: "#94a3b8", fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.85rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>Scan Product</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "0.75rem" }}>

            {/* Upload Product Image */}
            <div
              onClick={() => document.getElementById('dash-img-upload')?.click()}
              style={{
                background: "linear-gradient(135deg, rgba(16,27,60,0.9), rgba(20,10,50,0.9))",
                border: "1.5px solid rgba(99,102,241,0.45)",
                borderRadius: "14px",
                padding: "1.1rem 0.75rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
                transition: "all 0.2s",
                textAlign: "center",
                boxShadow: "0 4px 20px rgba(99,102,241,0.15)",
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Upload style={{ width: 20, height: 20, color: "#818cf8" }} />
              </div>
              <div style={{ color: "#fff", fontSize: "0.72rem", fontWeight: 700, lineHeight: 1.3 }}>Upload Product Image</div>
              <div style={{ color: "#64748b", fontSize: "0.63rem", lineHeight: 1.4 }}>
                Drag &amp; drop an image<br />
                <span style={{ color: "#818cf8" }}>or click to browse</span>
              </div>
              <input id="dash-img-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => onImageSelected(ev.target?.result as string);
                  reader.readAsDataURL(file);
                }
              }} />
            </div>

            {/* Take Photo */}
            <div
              onClick={onOpenCamera}
              style={{
                background: "linear-gradient(135deg, rgba(30,10,60,0.9), rgba(20,5,40,0.9))",
                border: "1.5px solid rgba(139,92,246,0.45)",
                borderRadius: "14px",
                padding: "1.1rem 0.75rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
                transition: "all 0.2s",
                textAlign: "center",
                boxShadow: "0 4px 20px rgba(139,92,246,0.15)",
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Camera style={{ width: 20, height: 20, color: "#a78bfa" }} />
              </div>
              <div style={{ color: "#fff", fontSize: "0.72rem", fontWeight: 700, lineHeight: 1.3 }}>Take Photo</div>
              <div style={{ color: "#64748b", fontSize: "0.63rem", lineHeight: 1.4 }}>Capture product<br />using camera</div>
            </div>

            {/* AI Vision Scan */}
            <div style={{
              background: "rgba(10,16,36,0.8)",
              border: "1px solid rgba(51,65,85,0.5)",
              borderRadius: "14px",
              padding: "1.1rem 0.75rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "0.5rem",
              cursor: "pointer",
            }}>
              <Eye style={{ width: 24, height: 24, color: "#22d3ee" }} />
              <div style={{ color: "#fff", fontSize: "0.72rem", fontWeight: 700, lineHeight: 1.3 }}>AI Vision Scan</div>
              <div style={{ color: "#64748b", fontSize: "0.62rem", lineHeight: 1.45 }}>AI analyzes product and finds similar items across all stores</div>
            </div>

            {/* Instant Compare */}
            <div style={{
              background: "rgba(10,16,36,0.8)",
              border: "1px solid rgba(51,65,85,0.5)",
              borderRadius: "14px",
              padding: "1.1rem 0.75rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "0.5rem",
              cursor: "pointer",
            }}>
              <Scale style={{ width: 24, height: 24, color: "#a78bfa" }} />
              <div style={{ color: "#fff", fontSize: "0.72rem", fontWeight: 700, lineHeight: 1.3 }}>Instant Compare</div>
              <div style={{ color: "#64748b", fontSize: "0.62rem", lineHeight: 1.45 }}>Get price comparison from multiple platforms instantly</div>
            </div>

            {/* Best Price Guarantee */}
            <div style={{
              background: "rgba(10,16,36,0.8)",
              border: "1px solid rgba(51,65,85,0.5)",
              borderRadius: "14px",
              padding: "1.1rem 0.75rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "0.5rem",
              cursor: "pointer",
            }}>
              <ShieldCheck style={{ width: 24, height: 24, color: "#34d399" }} />
              <div style={{ color: "#fff", fontSize: "0.72rem", fontWeight: 700, lineHeight: 1.3 }}>Best Price Guarantee</div>
              <div style={{ color: "#64748b", fontSize: "0.62rem", lineHeight: 1.45 }}>We ensure you get the most affordable price available</div>
            </div>

            {/* Price Drop Alerts */}
            <div style={{
              background: "rgba(10,16,36,0.8)",
              border: "1px solid rgba(51,65,85,0.5)",
              borderRadius: "14px",
              padding: "1.1rem 0.75rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "0.5rem",
              cursor: "pointer",
            }}>
              <Bell style={{ width: 24, height: 24, color: "#fbbf24" }} />
              <div style={{ color: "#fff", fontSize: "0.72rem", fontWeight: 700, lineHeight: 1.3 }}>Price Drop Alerts</div>
              <div style={{ color: "#64748b", fontSize: "0.62rem", lineHeight: 1.45 }}>Get notified when the price drops to your target price</div>
            </div>

          </div>
        </div>

        {/* Floating animation keyframes */}
        <style>{`
          @keyframes float-0 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
          @keyframes float-1 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-9px); } }
          @keyframes float-2 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-5px); } }
        `}</style>
      </div>

      {/* Spacer before rest of dashboard */}
      <div style={{ height: "2rem" }} />

      {/* 3. Interactive Category Presets Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-400" /> Browse & Compare by Category
            </h2>
            <p className="text-xs text-slate-400">Instant price scan presets for top shopping categories</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {categoryChips.map((chip) => {
            const Icon = chip.icon;
            return (
              <div
                key={chip.label}
                onClick={() => {
                  setSearchInput(chip.query);
                  onSearch(chip.query);
                }}
                className="group p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition duration-200 cursor-pointer shadow-lg flex flex-col justify-between space-y-3"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${chip.color} flex items-center justify-center shadow-md group-hover:scale-110 transition shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition">{chip.label}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Explore deals →</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Active Search Result Quick Banner (If user has an active query) */}
      {analysisResult && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/60 border border-cyan-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">
                Active Comparison: {analysisResult.detectedProductName}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Cheapest deal: <span className="text-cyan-400 font-bold">₹{analysisResult.priceRange.min.toLocaleString("en-IN")}</span> across {analysisResult.offers.length} verified e-stores
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab("results")}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shrink-0 transition shadow-md shadow-cyan-500/20 flex items-center gap-1.5"
          >
            <span>View Full Offers Page</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 5. Main Feature Section: Image Upload Zone */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Camera className="w-5 h-5 text-cyan-400" /> Image Lens Scanner
          </h2>
          <span className="text-xs text-slate-400">Drag & drop or upload any product photo</span>
        </div>

        <ImageUploadZone
          onImageSelected={onImageSelected}
          onOpenCamera={onOpenCamera}
        />
      </div>

      {/* 6. Unique Feature: Interactive AI Savings Calculator */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
              <DollarSign className="w-4 h-4" /> Smart Savings Predictor
            </div>
            <h3 className="text-xl font-bold text-white">How Much Can PriceLens Save You?</h3>
            <p className="text-xs text-slate-400">Select your average monthly online shopping spend</p>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-extrabold text-center">
            Est. Savings: ₹{estimatedSavingsYear.toLocaleString("en-IN")} / year
          </div>
        </div>

        {/* Interactive Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
            <span>Monthly Shopping Spend: <strong className="text-cyan-400 text-sm">₹{monthlyBudget.toLocaleString("en-IN")}</strong></span>
            <span className="text-slate-500">₹5,000 — ₹1,00,000</span>
          </div>

          <input
            type="range"
            min="5000"
            max="100000"
            step="5000"
            value={monthlyBudget}
            onChange={(e) => setMonthlyBudget(Number(e.target.value))}
            className="w-full h-2.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
              <p className="text-[11px] text-slate-400 font-medium">Est. Monthly Savings</p>
              <p className="text-base font-bold text-emerald-400 mt-0.5">₹{estimatedSavingsMonth.toLocaleString("en-IN")}</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
              <p className="text-[11px] text-slate-400 font-medium">Average Deal Discount</p>
              <p className="text-base font-bold text-cyan-400 mt-0.5">18% — 32% OFF</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-center">
              <p className="text-[11px] text-slate-400 font-medium">Monitored Platform Perks</p>
              <p className="text-base font-bold text-amber-400 mt-0.5">Free Shipping + Bank Coupons</p>
            </div>
          </div>
        </div>
      </div>

      {/* 7. Monitored E-Commerce Stores Network */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" /> Monitored E-Commerce Platforms
          </h2>
          <p className="text-xs text-slate-400">Direct real-time deal aggregation from verified retail stores</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {storeNetwork.map((store) => (
            <div key={store.name} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{store.name}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-semibold truncate ${store.bg}`}>
                {store.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 8. Trending Product Comparisons Section */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" /> Trending Deal Comparisons
            </h2>
            <p className="text-xs text-slate-400">Popular products matched by PriceLens shoppers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trending.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectTrending(item)}
              className="group p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 transition duration-200 cursor-pointer flex items-center gap-4 shadow-lg"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-xl object-cover group-hover:scale-105 transition shrink-0 bg-slate-950"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-cyan-400 font-semibold">{item.category}</span>
                <h4 className="text-xs font-bold text-white truncate group-hover:text-cyan-400 transition">
                  {item.name}
                </h4>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xs font-bold text-white">₹{item.lowestPrice.toLocaleString("en-IN")}</span>
                  <span className="text-[10px] text-slate-500 line-through">₹{item.originalPrice.toLocaleString("en-IN")}</span>
                  <span className="text-[10px] font-bold text-emerald-400">({item.discountPct}% OFF)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
