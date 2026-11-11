import React from "react";
import { Bookmark, Trash2, ExternalLink, Bell, TrendingDown, TrendingUp, Heart } from "lucide-react";
import { WishlistItem } from "../types";

interface WishlistViewProps {
  wishlist: WishlistItem[];
  onRemoveItem: (id: string) => void;
  onSetAlert: (item: WishlistItem) => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({ wishlist, onRemoveItem, onSetAlert }) => {
  const totalValue = wishlist.reduce((sum, item) => sum + item.product.price, 0);
  const totalSaved = wishlist.reduce((sum, item) => {
    const diff = (item.product.originalPrice || item.product.price) - item.product.price;
    return sum + Math.max(0, diff);
  }, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* Header */}
      <div className="relative overflow-hidden p-6 rounded-3xl"
        style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.08), rgba(13,13,26,1))", border: "1px solid rgba(168,85,247,0.2)" }}>
        <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.1), transparent 70%)" }} />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#a855f7" }}>
              <Bookmark className="w-4 h-4" /> Personal Collection
            </div>
            <h2 className="text-xl font-black text-white">Saved Wishlist</h2>
            <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>Track saved products and monitor price drops.</p>
          </div>
          {wishlist.length > 0 && (
            <div className="flex gap-3">
              <div className="text-center px-4 py-2 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <p className="text-xs font-black text-white">₹{totalValue.toLocaleString("en-IN")}</p>
                <p className="text-[10px]" style={{ color: "#64748b" }}>Total Value</p>
              </div>
              <div className="text-center px-4 py-2 rounded-2xl" style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.2)" }}>
                <p className="text-xs font-black" style={{ color: "#34d399" }}>₹{totalSaved.toLocaleString("en-IN")}</p>
                <p className="text-[10px]" style={{ color: "#64748b" }}>Saved</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[340px] gap-5 text-center rounded-3xl"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(168,85,247,0.2)" }}>
          <div className="relative">
            <div className="absolute -inset-4 rounded-full" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.1), transparent 70%)", animation: "pulseGlow 2.5s ease-in-out infinite" }} />
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative"
              style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)" }}>
              <Heart className="w-8 h-8" style={{ color: "#a855f7" }} />
            </div>
          </div>
          <div>
            <h3 className="text-base font-black text-white mb-1">Your Wishlist is Empty</h3>
            <p className="text-xs max-w-xs" style={{ color: "#475569" }}>Click the bookmark icon on any product card in comparison results to save items here.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map((item) => {
            const originalPrice = item.product.originalPrice || item.product.price;
            const priceDiff = item.initialPrice - item.product.price;
            const priceWentDown = priceDiff > 0;
            const priceChanged = Math.abs(priceDiff) > 0;

            return (
              <div key={item.id}
                className="group flex flex-col rounded-3xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>

                {/* Image */}
                <div className="relative aspect-video bg-slate-950/80 flex items-center justify-center p-4 overflow-hidden">
                  <img
                    src={item.imageUri || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"}
                    alt={item.productName}
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"; }}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
                  />
                  {/* Platform badge */}
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold" style={{ background: "rgba(168,85,247,0.15)", color: "#c084fc", border: "1px solid rgba(168,85,247,0.25)" }}>
                      {item.product.platform}
                    </span>
                  </div>
                  {/* Remove btn */}
                  <button onClick={() => onRemoveItem(item.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                    style={{ background: "rgba(13,13,26,0.85)", border: "1px solid rgba(244,63,94,0.3)", color: "#f87171" }}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Details */}
                <div className="p-4 flex flex-col gap-3 flex-1">
                  <div>
                    <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">{item.product.title}</h4>
                    <p className="text-[10px] mt-1" style={{ color: "#475569" }}>Saved {new Date(item.addedAt).toLocaleDateString()}</p>
                  </div>

                  <div className="flex items-end justify-between" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "10px" }}>
                    <div>
                      <p className="text-[10px] font-medium mb-0.5" style={{ color: "#64748b" }}>Current Price</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-white">₹{item.product.price.toLocaleString("en-IN")}</span>
                        {originalPrice > item.product.price && (
                          <span className="text-xs line-through" style={{ color: "#475569" }}>₹{originalPrice.toLocaleString("en-IN")}</span>
                        )}
                      </div>
                    </div>
                    {priceChanged && (
                      <span className="flex items-center gap-1 text-[11px] font-black px-2 py-1 rounded-lg"
                        style={{
                          background: priceWentDown ? "rgba(52,211,153,0.1)" : "rgba(248,113,113,0.1)",
                          color: priceWentDown ? "#34d399" : "#f87171",
                          border: `1px solid ${priceWentDown ? "rgba(52,211,153,0.2)" : "rgba(248,113,113,0.2)"}`,
                        }}>
                        {priceWentDown ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                        ₹{Math.abs(priceDiff).toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => onSetAlert(item)}
                      className="py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                      style={{ background: "rgba(255,255,255,0.04)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <Bell className="w-3.5 h-3.5" /> Alert
                    </button>
                    <a href={item.product.productUrl} target="_blank" rel="noopener noreferrer"
                      className="py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition hover:opacity-90"
                      style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", color: "#fff" }}>
                      Visit <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
