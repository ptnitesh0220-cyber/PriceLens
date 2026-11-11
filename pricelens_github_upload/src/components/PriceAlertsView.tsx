import React, { useState } from "react";
import { Bell, Plus, Trash2, ExternalLink, CheckCircle2, X, Target } from "lucide-react";
import { PriceAlert } from "../types";

interface PriceAlertsViewProps {
  alerts: PriceAlert[];
  onRemoveAlert: (id: string) => void;
  onAddCustomAlert: (productName: string, currentPrice: number, targetPrice: number, platform: string, productUrl: string, imageUri: string | null) => void;
}

function CircleProgress({ pct, size = 56 }: { pct: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * (pct / 100);
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" strokeWidth={4} stroke="rgba(168,85,247,0.1)" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" strokeWidth={4}
        stroke={pct >= 100 ? "#34d399" : "#a855f7"}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.5s ease" }}
      />
    </svg>
  );
}

export const PriceAlertsView: React.FC<PriceAlertsViewProps> = ({ alerts, onRemoveAlert, onAddCustomAlert }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [currentPrice, setCurrentPrice] = useState(19990);
  const [targetPrice, setTargetPrice] = useState(16500);
  const [platform, setPlatform] = useState("Amazon");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName) return;
    onAddCustomAlert(
      productName, Number(currentPrice), Number(targetPrice), platform,
      `https://www.${platform.toLowerCase().replace(/\s+/g, "")}.com/search?q=${encodeURIComponent(productName)}`,
      null
    );
    setModalOpen(false);
    setProductName("");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* Header */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl"
        style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.08), rgba(13,13,26,1))", border: "1px solid rgba(168,85,247,0.2)" }}>
        <div className="absolute right-0 top-0 w-44 h-44 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.12), transparent 70%)" }} />
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#a855f7" }}>
            <Bell className="w-4 h-4" /> Smart Price Radar
          </div>
          <h2 className="text-xl font-black text-white">Target Price Alerts</h2>
          <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>PriceLens notifies you the moment a product hits your target price.</p>
        </div>
        <button onClick={() => setModalOpen(true)}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black text-white transition hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 0 20px rgba(168,85,247,0.25)" }}>
          <Plus className="w-4 h-4" /> Create Alert
        </button>
      </div>

      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[340px] gap-5 text-center rounded-3xl"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(168,85,247,0.2)" }}>
          <div className="relative">
            <div className="absolute -inset-4 rounded-full" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.1), transparent 70%)", animation: "pulseGlow 2.5s ease-in-out infinite" }} />
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative"
              style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.25)" }}>
              <Bell className="w-8 h-8" style={{ color: "#a855f7" }} />
            </div>
          </div>
          <div>
            <h3 className="text-base font-black text-white mb-1">No Alerts Set</h3>
            <p className="text-xs max-w-xs" style={{ color: "#475569" }}>Set a target price for any product and get notified when it drops!</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const dropNeeded = alert.currentPrice > 0
              ? Math.max(0, Math.round(((alert.currentPrice - alert.targetPrice) / alert.currentPrice) * 100))
              : 0;
            const progressPct = alert.isTriggered ? 100 : Math.min(100, Math.max(0, 100 - dropNeeded));

            return (
              <div key={alert.id}
                className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl transition-all"
                style={{
                  background: alert.isTriggered ? "rgba(52,211,153,0.05)" : "rgba(255,255,255,0.03)",
                  border: alert.isTriggered ? "1px solid rgba(52,211,153,0.25)" : "1px solid rgba(255,255,255,0.07)",
                }}>

                <div className="flex items-center gap-4 min-w-0">
                  {/* Progress ring + image */}
                  <div className="relative shrink-0">
                    <CircleProgress pct={progressPct} size={56} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src={alert.imageUri || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=80"}
                        alt={alert.productName}
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=100&q=80"; }}
                        className="w-9 h-9 rounded-lg object-cover"
                      />
                    </div>
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold" style={{ background: "rgba(168,85,247,0.1)", color: "#c084fc" }}>{alert.platform}</span>
                      {alert.isTriggered ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black" style={{ background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}>
                          <CheckCircle2 className="w-3 h-3" /> 🎉 Target Reached!
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold" style={{ background: "rgba(251,191,36,0.1)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.2)" }}>Monitoring</span>
                      )}
                    </div>
                    <h4 className="text-xs font-black text-white truncate">{alert.productName}</h4>
                    <p className="text-[10px]" style={{ color: "#475569" }}>Since {new Date(alert.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", marginTop: 0, paddingTop: 0 }}>
                  <div className="text-right">
                    <p className="text-[10px] mb-0.5" style={{ color: "#64748b" }}>Current → Target</p>
                    <p className="text-xs font-black text-white">
                      ₹{alert.currentPrice.toLocaleString("en-IN")} → <span style={{ color: "#c084fc" }}>₹{alert.targetPrice.toLocaleString("en-IN")}</span>
                    </p>
                    <p className="text-[10px] font-bold mt-0.5" style={{ color: "#34d399" }}>
                      {dropNeeded}% drop needed · {progressPct}% there
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={alert.productUrl} target="_blank" rel="noopener noreferrer"
                      className="p-2.5 rounded-xl transition-all" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#94a3b8" }}>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button onClick={() => onRemoveAlert(alert.id)}
                      className="p-2.5 rounded-xl transition-all" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", color: "#64748b" }}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(8,6,18,0.85)", backdropFilter: "blur(12px)" }}>
          <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl" style={{ background: "#0d0d1a", border: "1px solid rgba(168,85,247,0.3)" }}>
            {/* Modal header */}
            <div className="relative p-6" style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(13,13,26,1))", borderBottom: "1px solid rgba(168,85,247,0.15)" }}>
              <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.15), transparent 70%)" }} />
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: "rgba(168,85,247,0.2)" }}>
                      <Target className="w-4 h-4" style={{ color: "#a855f7" }} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#a855f7" }}>New Alert</span>
                  </div>
                  <h3 className="text-lg font-black text-white">Set Target Price Alert</h3>
                </div>
                <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-xl transition" style={{ color: "#64748b" }}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: "#94a3b8" }}>Product Name</label>
                <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Sony WH-1000XM5" required
                  className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none transition"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(168,85,247,0.2)", color: "#f8fafc" }} />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5" style={{ color: "#94a3b8" }}>Platform</label>
                <select value={platform} onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none transition"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(168,85,247,0.2)", color: "#f8fafc" }}>
                  {["Amazon","Flipkart","Myntra","Croma","Ajio"].map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: "#94a3b8" }}>Current Price (₹)</label>
                  <input type="number" value={currentPrice} onChange={(e) => setCurrentPrice(Number(e.target.value))} required
                    className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none transition"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(168,85,247,0.2)", color: "#c084fc", fontWeight: 700 }} />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5" style={{ color: "#94a3b8" }}>Target Price (₹)</label>
                  <input type="number" value={targetPrice} onChange={(e) => setTargetPrice(Number(e.target.value))} required
                    className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none transition"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(168,85,247,0.2)", color: "#c084fc", fontWeight: 700 }} />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold transition"
                  style={{ background: "rgba(255,255,255,0.05)", color: "#64748b", border: "1px solid rgba(255,255,255,0.07)" }}>Cancel</button>
                <button type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-black text-white transition hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)", boxShadow: "0 0 20px rgba(168,85,247,0.25)" }}>
                  Activate Alert 🔔
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
