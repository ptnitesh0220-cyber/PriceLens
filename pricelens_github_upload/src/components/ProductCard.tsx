import React, { useState } from "react";
import { ExternalLink, Star, Award, Bookmark, Bell, Truck, TrendingDown, Copy, Check } from "lucide-react";
import { ProductOffer } from "../types";

interface ProductCardProps {
  offer: ProductOffer;
  productName: string;
  category: string;
  productImage: string | null;
  onAddToWishlist: (offer: ProductOffer) => void;
  onSetPriceAlert: (offer: ProductOffer) => void;
  isWishlisted?: boolean;
}

const PLATFORM_COLORS: Record<string, { accent: string; bg: string; border: string }> = {
  Amazon:     { accent: "#FF9900", bg: "rgba(255,153,0,0.08)",   border: "rgba(255,153,0,0.25)" },
  Flipkart:   { accent: "#2874F0", bg: "rgba(40,116,240,0.08)",  border: "rgba(40,116,240,0.25)" },
  Myntra:     { accent: "#FF3F6C", bg: "rgba(255,63,108,0.08)",  border: "rgba(255,63,108,0.25)" },
  Croma:      { accent: "#00A651", bg: "rgba(0,166,81,0.08)",    border: "rgba(0,166,81,0.25)" },
  Ajio:       { accent: "#9B59B6", bg: "rgba(155,89,182,0.08)",  border: "rgba(155,89,182,0.25)" },
  Meesho:     { accent: "#F43397", bg: "rgba(244,51,151,0.08)",  border: "rgba(244,51,151,0.25)" },
  "Tata CLIQ":{ accent: "#A855F7", bg: "rgba(168,85,247,0.08)",  border: "rgba(168,85,247,0.25)" },
};

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star
          key={s}
          className="w-3 h-3"
          style={{
            color: s <= Math.round(rating) ? "#f59e0b" : "#334155",
            fill:  s <= Math.round(rating) ? "#f59e0b" : "transparent",
          }}
        />
      ))}
    </div>
  );
}

export const ProductCard: React.FC<ProductCardProps> = ({
  offer,
  productName,
  category,
  productImage,
  onAddToWishlist,
  onSetPriceAlert,
  isWishlisted = false,
}) => {
  const [saved, setSaved] = useState(isWishlisted);
  const [copied, setCopied] = useState(false);

  const platform = PLATFORM_COLORS[offer.platform] || {
    accent: "#a855f7",
    bg: "rgba(168,85,247,0.08)",
    border: "rgba(168,85,247,0.2)",
  };

  const handleWishlist = () => { setSaved(!saved); onAddToWishlist(offer); };

  const handleCopyPrice = () => {
    navigator.clipboard.writeText(`${offer.platform}: ₹${offer.price} — ${offer.productUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-3xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
      style={{
        background: offer.isBestPrice
          ? "linear-gradient(135deg, rgba(168,85,247,0.06), rgba(13,13,26,1))"
          : "rgba(255,255,255,0.025)",
        border: offer.isBestPrice
          ? `1px solid rgba(168,85,247,0.45)`
          : "1px solid rgba(255,255,255,0.06)",
        boxShadow: offer.isBestPrice
          ? "0 0 30px rgba(168,85,247,0.12)"
          : undefined,
        // Platform color left stripe
        borderLeft: `3px solid ${platform.accent}`,
      }}
    >
      {/* Best price shimmer banner */}
      {offer.isBestPrice && (
        <div
          className="absolute top-3 left-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide text-white shadow-lg"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #a855f7, #d946ef)",
            backgroundSize: "200% 100%",
            animation: "gradientShift 3s linear infinite",
            boxShadow: "0 0 16px rgba(168,85,247,0.5)",
          }}
        >
          <Award className="w-3 h-3" /> Best Price
        </div>
      )}

      {/* Action buttons */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
        <button
          onClick={handleCopyPrice}
          title="Copy price link"
          className="p-1.5 rounded-xl backdrop-blur-md transition-all"
          style={{
            background: "rgba(13,13,26,0.8)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: copied ? "#34d399" : "#64748b",
          }}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={handleWishlist}
          title={saved ? "Saved" : "Save to Wishlist"}
          className="p-1.5 rounded-xl backdrop-blur-md transition-all"
          style={{
            background: saved ? "rgba(244,63,94,0.2)" : "rgba(13,13,26,0.8)",
            border: saved ? "1px solid rgba(244,63,94,0.4)" : "1px solid rgba(255,255,255,0.08)",
            color: saved ? "#fb7185" : "#64748b",
          }}
        >
          <Bookmark className="w-3.5 h-3.5" style={{ fill: saved ? "currentColor" : "transparent" }} />
        </button>
        <button
          onClick={() => onSetPriceAlert(offer)}
          title="Set Price Alert"
          className="p-1.5 rounded-xl backdrop-blur-md transition-all"
          style={{ background: "rgba(13,13,26,0.8)", border: "1px solid rgba(255,255,255,0.08)", color: "#64748b" }}
        >
          <Bell className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Image */}
      <div className="relative aspect-video bg-slate-950/80 flex items-center justify-center p-4 overflow-hidden">
        <img
          src={offer.imageUrl || productImage || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"}
          alt={offer.title}
          onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"; }}
          className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-lg"
        />
        {/* Platform badge */}
        <div className="absolute bottom-2 left-2">
          <span
            className="px-2.5 py-1 rounded-xl text-[11px] font-bold backdrop-blur-md"
            style={{ background: platform.bg, color: platform.accent, border: `1px solid ${platform.border}` }}
          >
            {offer.platform}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="p-5 flex-1 flex flex-col gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: platform.accent }}>{category}</p>
          <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-purple-200 transition-colors">
            {offer.title}
          </h3>
        </div>

        {/* Stars + review count */}
        <div className="flex items-center gap-2">
          <StarRow rating={offer.rating} />
          <span className="text-[11px] font-bold" style={{ color: "#f59e0b" }}>{offer.rating}</span>
          <span className="text-[10px]" style={{ color: "#475569" }}>({offer.reviewCount.toLocaleString()})</span>
        </div>

        {/* Delivery & stock */}
        <div className="py-2 space-y-1" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-2">
            <Truck className="w-3.5 h-3.5 shrink-0" style={{ color: "#06b6d4" }} />
            <span className="text-[11px] truncate" style={{ color: "#94a3b8" }}>{offer.deliveryInfo}</span>
          </div>
          <p className="text-[10px] font-semibold" style={{ color: "#34d399" }}>✓ {offer.stockStatus}</p>
        </div>

        {/* Price row */}
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-white">₹{offer.price.toLocaleString("en-IN")}</span>
            {offer.originalPrice > offer.price && (
              <span className="text-xs line-through" style={{ color: "#475569" }}>₹{offer.originalPrice.toLocaleString("en-IN")}</span>
            )}
          </div>
          {offer.discountPct > 0 && (
            <span
              className="flex items-center gap-0.5 px-2 py-0.5 rounded-lg text-xs font-black"
              style={{ background: "rgba(16,185,129,0.1)", color: "#34d399", border: "1px solid rgba(16,185,129,0.2)" }}
            >
              <TrendingDown className="w-3 h-3" />{offer.discountPct}%
            </span>
          )}
        </div>

        {/* Open store button */}
        <a
          href={offer.productUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
          style={{
            background: offer.isBestPrice
              ? "linear-gradient(135deg, #7c3aed, #a855f7)"
              : "rgba(255,255,255,0.05)",
            color: offer.isBestPrice ? "#fff" : "#94a3b8",
            border: offer.isBestPrice ? "none" : "1px solid rgba(255,255,255,0.08)",
            boxShadow: offer.isBestPrice ? "0 0 20px rgba(168,85,247,0.25)" : undefined,
          }}
        >
          View on {offer.platform}
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
