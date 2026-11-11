import React from "react";
import {
  LayoutDashboard,
  History,
  Heart,
  Bell,
  User,
  LogOut,
  Camera,
  ChevronRight,
  Zap
} from "lucide-react";
import { PriceLensLogo } from "./PriceLensLogo";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCamera: () => void;
  onLogout: () => void;
  historyCount: number;
  wishlistCount: number;
  alertsCount: number;
  hasResults?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCamera,
  onLogout,
  historyCount,
  wishlistCount,
  alertsCount,
  hasResults
}) => {
  const navItems = [
    { id: "dashboard", label: "Discover", icon: LayoutDashboard },
    { id: "history", label: "Search History", icon: History, count: historyCount },
    { id: "wishlist", label: "Wishlist", icon: Heart, count: wishlistCount },
    { id: "alerts", label: "Price Alerts", icon: Bell, count: alertsCount },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <aside
      className="w-64 hidden md:flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none"
      style={{
        background: "rgba(10,8,20,0.95)",
        borderRight: "1px solid rgba(168,85,247,0.12)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Subtle grid bg */}
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{
        backgroundImage: "linear-gradient(rgba(168,85,247,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.05) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }} />

      <div className="relative z-10 flex flex-col h-full p-4 gap-5">
        {/* Brand logo */}
        <div
          className="px-2 pt-2 pb-1 cursor-pointer"
          onClick={() => setActiveTab("dashboard")}
        >
          <PriceLensLogo size="md" showText={true} showTagline={false} />
        </div>

        {/* Live Camera Action Card */}
        <div
          className="relative rounded-2xl p-4 overflow-hidden cursor-pointer group"
          style={{
            background: "linear-gradient(135deg, rgba(168,85,247,0.12), rgba(6,182,212,0.06))",
            border: "1px solid rgba(168,85,247,0.25)",
          }}
          onClick={onOpenCamera}
        >
          <div className="absolute top-2 right-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">Live</span>
          </div>

          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #a855f7, #06b6d4)" }}>
              <Camera className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-black text-white">PriceLens Scanner</span>
          </div>
          <p className="text-[10px] leading-relaxed mb-2.5" style={{ color: "rgba(203,213,225,0.6)" }}>
            Scan any product to compare store prices.
          </p>
          <div
            className="w-full py-1.5 rounded-xl text-center text-xs font-black text-white transition-all group-hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #7c3aed, #a855f7)" }}
          >
            Open Camera →
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group relative"
                style={{
                  background: isActive ? "rgba(168,85,247,0.12)" : "transparent",
                  color: isActive ? "#e9d5ff" : "rgba(148,163,184,0.8)",
                  borderLeft: isActive ? "2px solid #a855f7" : "2px solid transparent",
                }}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className="w-4 h-4 transition-colors"
                    style={{ color: isActive ? "#c084fc" : undefined }}
                  />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className="px-1.5 py-0.5 rounded-full text-[10px] font-black"
                      style={{
                        background: isActive ? "rgba(168,85,247,0.3)" : "rgba(255,255,255,0.06)",
                        color: isActive ? "#e9d5ff" : "#64748b",
                      }}
                    >
                      {item.count}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3 h-3" style={{ color: "#a855f7" }} />}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div
        className="relative z-10 p-4"
        style={{ borderTop: "1px solid rgba(168,85,247,0.1)" }}
      >
        {hasResults && (
          <button
            onClick={() => setActiveTab("results")}
            className="w-full flex items-center justify-center gap-2 py-2 mb-3 rounded-xl text-xs font-bold transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.15), rgba(59,130,246,0.1))", color: "#67e8f9", border: "1px solid rgba(6,182,212,0.2)" }}
          >
            <Zap className="w-3.5 h-3.5" />
            View Active Results
          </button>
        )}

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all hover:bg-red-950/30"
          style={{ color: "rgba(248,113,113,0.8)" }}
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
