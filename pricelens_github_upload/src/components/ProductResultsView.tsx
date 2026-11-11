import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft, Sparkles, RefreshCw,
  CheckCircle2, SlidersHorizontal, TrendingDown,
  Search, Zap, Camera, Upload, X
} from "lucide-react";
import { AnalysisResult, ProductOffer, WishlistItem } from "../types";
import { ProductCard } from "./ProductCard";
import { ScanningAnimation } from "./ScanningAnimation";

interface ProductResultsViewProps {
  analysisResult: AnalysisResult | null;
  isScanning: boolean;
  currentImage: string | null;
  onBack: () => void;
  onAddToWishlist: (offer: ProductOffer) => void;
  onSetPriceAlert: (offer: ProductOffer) => void;
  wishlist: WishlistItem[];
  sortBy: "cheapest" | "discount" | "rating";
  setSortBy: (sort: "cheapest" | "discount" | "rating") => void;
  platformFilter: string;
  setPlatformFilter: (platform: string) => void;
  onNewSearch: () => void;
  onSearch: (query: string) => void;
  onImageSelected?: (img: string) => void;
  onOpenCamera?: () => void;
}

const PLATFORMS = ["All", "Amazon", "Flipkart", "Myntra", "Croma", "Ajio"];
const PLATFORM_COLORS: Record<string, string> = {
  All: "#a855f7",
  Amazon: "#FF9900",
  Flipkart: "#2874F0",
  Myntra: "#FF3F6C",
  Croma: "#00A651",
  Ajio: "#9B59B6",
};

export const ProductResultsView: React.FC<ProductResultsViewProps> = ({
  analysisResult, isScanning, currentImage, onBack, onAddToWishlist,
  onSetPriceAlert, wishlist, sortBy, setSortBy, platformFilter, setPlatformFilter, onNewSearch,
  onSearch, onImageSelected, onOpenCamera
}) => {
  const [searchQuery, setSearchQuery] = useState(
    analysisResult?.detectedProductName || ""
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (analysisResult?.detectedProductName) {
      setSearchQuery(analysisResult.detectedProductName);
    }
  }, [analysisResult?.detectedProductName]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onImageSelected) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") onImageSelected(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const displayImage = currentImage || analysisResult?.imageUri ||
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80";

  const filteredOffers = analysisResult?.offers ? [...analysisResult.offers]
    .filter((o) => platformFilter === "All" || o.platform === platformFilter)
    .sort((a, b) => {
      if (sortBy === "cheapest") return a.price - b.price;
      if (sortBy === "discount") return b.discountPct - a.discountPct;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    }) : [];

  const priceMin = analysisResult?.priceRange.min || 0;
  const priceMax = analysisResult?.priceRange.max || 0;
  const priceAvg = analysisResult?.priceRange.avg || 0;
  const priceSpread = priceMax - priceMin || 1;
  const avgPct = Math.min(100, Math.max(0, ((priceAvg - priceMin) / priceSpread) * 100));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* Persistent Sticky Top Search Option Bar */}
      <div
        className="sticky top-0 z-20 backdrop-blur-xl p-3.5 sm:p-4 rounded-3xl space-y-3 transition-all"
        style={{
          background: "linear-gradient(135deg, rgba(18,11,36,0.96), rgba(15,10,32,0.98))",
          border: "1px solid rgba(168,85,247,0.35)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)"
        }}
      >
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition hover:bg-slate-800/80 shrink-0 self-start md:self-auto"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#cbd5e1"
            }}
            title="Back to Home / Dashboard"
          >
            <ArrowLeft className="w-4 h-4 text-purple-400" />
            <span>Home</span>
          </button>

          {/* Top Search Input Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative flex items-center gap-2">
            <div
              className={`relative flex-1 flex items-center rounded-full p-1.5 pl-4 transition-all focus-within:ring-2 focus-within:ring-purple-500/50 ${
                isScanning ? "ring-1 ring-purple-500/60" : ""
              }`}
              style={{
                background: "#080612",
                border: isScanning ? "1px solid rgba(168,85,247,0.7)" : "1px solid rgba(168,85,247,0.45)",
                boxShadow: isScanning ? "0 0 25px rgba(168,85,247,0.35)" : "0 0 20px rgba(168,85,247,0.2)"
              }}
            >
              <Search className={`w-4.5 h-4.5 shrink-0 mr-2 ${isScanning ? "text-purple-300 animate-pulse" : "text-purple-400"}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search another product to compare prices across stores..."
                className="flex-1 bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
              />
              {isScanning && (
                <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold mr-1 shrink-0"
                  style={{ background: "rgba(168,85,247,0.2)", color: "#e9d5ff", border: "1px solid rgba(168,85,247,0.4)" }}>
                  <Sparkles className="w-3 h-3 animate-spin text-purple-300" />
                  Scanning...
                </span>
              )}
              {searchQuery && !isScanning && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-1 rounded-full text-slate-500 hover:text-slate-300 mr-1"
                  title="Clear text"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="submit"
                className="px-5 py-2 rounded-full text-xs font-black text-white shrink-0 transition hover:opacity-90 active:scale-95 flex items-center gap-1.5 shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #a855f7, #7c3aed)",
                  boxShadow: "0 0 15px rgba(168,85,247,0.5)"
                }}
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                Compare
              </button>
            </div>
          </form>

          {/* Camera & Image Upload Buttons */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
            {onOpenCamera && (
              <button
                onClick={onOpenCamera}
                className="p-2.5 rounded-2xl text-xs font-bold text-white transition hover:scale-105 flex items-center gap-1.5 shadow-md"
                style={{
                  background: "linear-gradient(135deg, #00c6ff, #0072ff)",
                }}
                title="Scan product via camera"
              >
                <Camera className="w-4 h-4" />
                <span className="hidden sm:inline">Camera</span>
              </button>
            )}

            {onImageSelected && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 rounded-2xl text-xs font-bold text-purple-300 transition hover:scale-105 flex items-center gap-1.5"
                  style={{
                    background: "rgba(168,85,247,0.15)",
                    border: "1px solid rgba(168,85,247,0.3)"
                  }}
                  title="Upload product image"
                >
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline">Image</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area based on scanning / results state */}
      {isScanning ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-purple-300 animate-pulse">Scanning prices across stores...</span>
          </div>
          <ScanningAnimation imageUri={currentImage} />
        </div>
      ) : !analysisResult ? (
        <div className="flex flex-col items-center justify-center min-h-[350px] gap-6 text-center animate-in fade-in duration-300">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center" style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)" }}>
            <Sparkles className="w-10 h-10" style={{ color: "#a855f7" }} />
          </div>
          <div>
            <h2 className="text-lg font-black text-white mb-2">No Results Yet</h2>
            <p className="text-xs max-w-sm" style={{ color: "#64748b" }}>Use the search option at the top to search any product or upload an image.</p>
          </div>
          <button onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black text-white transition hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}>
            <ArrowLeft className="w-4 h-4" /> Go to Dashboard
          </button>
        </div>
      ) : (
        <>
          {/* Product overview */}
          <div className="p-6 rounded-3xl relative overflow-hidden"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(168,85,247,0.15)" }}>
            <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(168,85,247,0.08), transparent 70%)" }} />

            <div className="flex flex-col md:flex-row md:items-start gap-6 relative z-10">
              <div className="flex items-start gap-5 flex-1 min-w-0">
                <div className="w-24 h-24 rounded-2xl bg-slate-950 overflow-hidden shrink-0 p-1.5"
                  style={{ border: "1px solid rgba(168,85,247,0.2)" }}>
                  <img src={displayImage} alt={analysisResult.detectedProductName}
                    className="w-full h-full object-cover rounded-xl" />
                </div>
                <div className="space-y-2 min-w-0">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      style={{ background: "rgba(168,85,247,0.12)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.25)" }}>
                      {analysisResult.category}
                    </span>
                    <span className="text-[11px] font-bold flex items-center gap-1" style={{ color: "#34d399" }}>
                      <CheckCircle2 className="w-3.5 h-3.5" /> {analysisResult.confidenceScore}% Match
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-white">{analysisResult.detectedProductName}</h1>
                  <p className="text-xs" style={{ color: "#64748b" }}>
                    Brand: <span className="text-white font-semibold">{analysisResult.detectedBrand}</span>
                    {" • "}<span style={{ color: "#c084fc", fontWeight: 700 }}>{analysisResult.offers.length} stores found</span>
                  </p>
                  {analysisResult.keyFeatures?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {analysisResult.keyFeatures.map((f, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-medium"
                          style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.07)" }}>
                          ✓ {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Price widget */}
              <div className="shrink-0 p-4 rounded-2xl space-y-3" style={{ background: "rgba(13,13,26,0.8)", border: "1px solid rgba(168,85,247,0.2)", minWidth: 200 }}>
                <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "#64748b" }}>Lowest Deal</p>
                <p className="text-3xl font-black" style={{ color: "#c084fc" }}>₹{priceMin.toLocaleString("en-IN")}</p>
                <div className="flex items-center gap-1 text-[11px] font-bold" style={{ color: "#34d399" }}>
                  <TrendingDown className="w-3.5 h-3.5" /> Save ₹{analysisResult.totalSavings.toLocaleString("en-IN")}
                </div>

                {/* Price range bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px]" style={{ color: "#475569" }}>
                    <span>₹{priceMin.toLocaleString("en-IN")}</span>
                    <span>₹{priceMax.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="h-1.5 rounded-full relative overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div className="absolute inset-y-0 left-0 rounded-full" style={{ background: "linear-gradient(90deg, #7c3aed, #a855f7, #d946ef)", width: `${avgPct}%` }} />
                  </div>
                  <p className="text-[10px] text-center" style={{ color: "#64748b" }}>Avg ₹{priceAvg.toLocaleString("en-IN")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter & Sort toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            {/* Platform pills */}
            <div className="flex items-center gap-2 flex-wrap">
              <SlidersHorizontal className="w-4 h-4 shrink-0" style={{ color: "#64748b" }} />
              {PLATFORMS.map((p) => {
                const isActive = platformFilter === p;
                const color = PLATFORM_COLORS[p] || "#a855f7";
                return (
                  <button key={p} onClick={() => setPlatformFilter(p)}
                    className="px-3 py-1 rounded-full text-[11px] font-bold transition-all"
                    style={{
                      background: isActive ? `${color}22` : "rgba(255,255,255,0.04)",
                      color: isActive ? color : "#64748b",
                      border: isActive ? `1px solid ${color}55` : "1px solid rgba(255,255,255,0.07)",
                    }}>
                    {p}
                  </button>
                );
              })}
            </div>

            {/* Sort buttons */}
            <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {(["cheapest", "discount", "rating"] as const).map((s) => (
                <button key={s} onClick={() => setSortBy(s)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={{
                    background: sortBy === s ? "rgba(168,85,247,0.2)" : "transparent",
                    color: sortBy === s ? "#c084fc" : "#64748b",
                    border: sortBy === s ? "1px solid rgba(168,85,247,0.35)" : "1px solid transparent",
                  }}>
                  {s === "cheapest" ? "Lowest Price" : s === "discount" ? "Best Discount" : "Top Rated"}
                </button>
              ))}
            </div>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOffers.map((offer) => (
              <ProductCard
                key={offer.id}
                offer={offer}
                productName={analysisResult.detectedProductName}
                category={analysisResult.category}
                productImage={displayImage}
                onAddToWishlist={onAddToWishlist}
                onSetPriceAlert={onSetPriceAlert}
                isWishlisted={wishlist.some((w) => w.product.id === offer.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

