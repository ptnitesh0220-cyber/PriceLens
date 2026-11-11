import React, { useMemo } from "react";
import { History, Search, Trash2, ArrowRight, Clock } from "lucide-react";
import { SearchHistoryItem } from "../types";

interface SearchHistoryViewProps {
  history: SearchHistoryItem[];
  onSelectSearch: (item: SearchHistoryItem) => void;
  onClearHistory: () => void;
}

function groupByDate(items: SearchHistoryItem[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const lastWeek = new Date(today); lastWeek.setDate(today.getDate() - 7);

  const groups: { label: string; items: SearchHistoryItem[] }[] = [
    { label: "Today", items: [] },
    { label: "Yesterday", items: [] },
    { label: "Last 7 Days", items: [] },
    { label: "Older", items: [] },
  ];

  for (const item of items) {
    const d = new Date(item.timestamp);
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    if (day >= today) groups[0].items.push(item);
    else if (day >= yesterday) groups[1].items.push(item);
    else if (day >= lastWeek) groups[2].items.push(item);
    else groups[3].items.push(item);
  }

  return groups.filter((g) => g.items.length > 0);
}

export const SearchHistoryView: React.FC<SearchHistoryViewProps> = ({ history, onSelectSearch, onClearHistory }) => {
  const groups = useMemo(() => groupByDate(history), [history]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl"
        style={{ background: "linear-gradient(135deg, rgba(168,85,247,0.07), rgba(13,13,26,1))", border: "1px solid rgba(168,85,247,0.18)" }}>
        <div className="absolute right-0 top-0 w-40 h-40 pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.1), transparent 70%)" }} />
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#a855f7" }}>
            <History className="w-4 h-4" /> Visual & Text Logs
          </div>
          <h2 className="text-xl font-black text-white">Search History</h2>
          <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>Reopen past scans and get updated live prices instantly.</p>
        </div>
        {history.length > 0 && (
          <button onClick={onClearHistory}
            className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
            style={{ background: "rgba(248,113,113,0.08)", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }}>
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[340px] gap-5 text-center rounded-3xl"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(168,85,247,0.2)" }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.2)" }}>
            <History className="w-8 h-8" style={{ color: "#a855f7" }} />
          </div>
          <div>
            <h3 className="text-base font-black text-white mb-1">No Search History</h3>
            <p className="text-xs max-w-xs" style={{ color: "#475569" }}>Upload an image or search by name on the home page to start comparing prices.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map((group) => (
            <div key={group.label}>
              {/* Group header */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-black uppercase tracking-wider" style={{ color: "#a855f7" }}>{group.label}</span>
                <div className="flex-1 h-px" style={{ background: "rgba(168,85,247,0.15)" }} />
                <span className="text-[10px] font-semibold" style={{ color: "#475569" }}>{group.items.length} search{group.items.length > 1 ? 'es' : ''}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {group.items.map((item) => {
                  const savings = item.resultData?.priceRange
                    ? item.resultData.priceRange.max - item.resultData.priceRange.min
                    : 0;
                  return (
                    <div key={item.id}
                      className="group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.01]"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
                      onClick={() => onSelectSearch(item)}>

                      {/* Thumbnail */}
                      <div className="w-16 h-16 rounded-xl bg-slate-950 overflow-hidden shrink-0 flex items-center justify-center"
                        style={{ border: "1px solid rgba(168,85,247,0.15)" }}>
                        {item.imageUri ? (
                          <img src={item.imageUri} alt={item.productName}
                            onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80"; }}
                            className="w-full h-full object-cover group-hover:scale-105 transition" />
                        ) : (
                          <Search className="w-7 h-7" style={{ color: "#334155" }} />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold" style={{ background: "rgba(168,85,247,0.1)", color: "#c084fc" }}>{item.category}</span>
                        <h4 className="text-xs font-black text-white truncate group-hover:text-purple-200 transition-colors">{item.productName}</h4>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold" style={{ color: "#94a3b8" }}>from ₹{item.cheapestPrice.toLocaleString("en-IN")}</span>
                          {savings > 0 && (
                            <span className="text-[10px] font-bold" style={{ color: "#34d399" }}>Save ₹{savings.toLocaleString("en-IN")}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-[10px]" style={{ color: "#475569" }}>
                          <Clock className="w-3 h-3" />
                          <span>{new Date(item.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                          <span>• {item.bestPlatform}</span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="p-2.5 rounded-xl shrink-0 transition-all group-hover:scale-110"
                        style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}>
                        <ArrowRight className="w-4 h-4" style={{ color: "#a855f7" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
