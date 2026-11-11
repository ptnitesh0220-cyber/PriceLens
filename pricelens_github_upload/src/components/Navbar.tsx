import React, { useState } from "react";
import { 
  Camera, 
  Search, 
  Bell, 
  User as UserIcon, 
  Sparkles, 
  Menu, 
  X, 
  LogOut,
  SlidersHorizontal,
  Bookmark,
  TrendingUp,
  History,
  Tag
} from "lucide-react";
import { UserProfile } from "../types";
import { PriceLensLogo } from "./PriceLensLogo";

interface NavbarProps {
  user: UserProfile | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
  onOpenCamera: () => void;
  onSearchQuery?: (query: string) => void;
  onLogout: () => void;
  alertsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onOpenCamera,
  onLogout,
  alertsCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center cursor-pointer select-none" onClick={() => setActiveTab("dashboard")}>
            <PriceLensLogo size="md" showText={true} showTagline={false} />
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Camera Button */}
            <button
              onClick={onOpenCamera}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-md shadow-cyan-950/40 hover:shadow-cyan-500/20 transition duration-200"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Lens Camera</span>
            </button>

            {/* Price Alerts Bell */}
            <button
              onClick={() => setActiveTab("alerts")}
              className="relative p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title="Price Alerts"
            >
              <Bell className="w-4 h-4" />
              {alertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-[10px] font-bold text-slate-950 flex items-center justify-center animate-pulse">
                  {alertsCount}
                </span>
              )}
            </button>

            {/* User Profile or Sign In */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-xl bg-slate-800/60 border border-slate-700/50 hover:border-cyan-500/40 transition"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-cyan-500/30"
                  />
                  <span className="text-xs font-medium text-slate-200 hidden lg:inline max-w-[100px] truncate">
                    {user.name}
                  </span>
                </button>

                {/* Profile Dropdown */}
                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl shadow-cyan-950/50 py-2 z-50 divide-y divide-slate-800/80">
                      <div className="px-4 py-2.5">
                        <p className="text-xs font-semibold text-white">{user.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => { setActiveTab("profile"); setUserDropdownOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition"
                        >
                          <UserIcon className="w-4 h-4" />
                          Profile Settings
                        </button>
                        <button
                          onClick={() => { setActiveTab("wishlist"); setUserDropdownOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition"
                        >
                          <Bookmark className="w-4 h-4" />
                          My Saved Products
                        </button>
                        <button
                          onClick={() => { setActiveTab("history"); setUserDropdownOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition"
                        >
                          <History className="w-4 h-4" />
                          Search History
                        </button>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => { onLogout(); setUserDropdownOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-1.5 rounded-xl border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 text-xs font-semibold transition"
              >
                Sign In
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300 md:hidden"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-800 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
              <button
                onClick={() => { setActiveTab("dashboard"); setMobileMenuOpen(false); }}
                className={`flex items-center gap-2 p-2.5 rounded-xl border ${activeTab === "dashboard" ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400" : "bg-slate-950/50 border-slate-800"}`}
              >
                <TrendingUp className="w-4 h-4" /> Dashboard
              </button>
              <button
                onClick={() => { setActiveTab("history"); setMobileMenuOpen(false); }}
                className={`flex items-center gap-2 p-2.5 rounded-xl border ${activeTab === "history" ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400" : "bg-slate-950/50 border-slate-800"}`}
              >
                <History className="w-4 h-4" /> History
              </button>
              <button
                onClick={() => { setActiveTab("wishlist"); setMobileMenuOpen(false); }}
                className={`flex items-center gap-2 p-2.5 rounded-xl border ${activeTab === "wishlist" ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400" : "bg-slate-950/50 border-slate-800"}`}
              >
                <Bookmark className="w-4 h-4" /> Wishlist
              </button>
              <button
                onClick={() => { setActiveTab("alerts"); setMobileMenuOpen(false); }}
                className={`flex items-center gap-2 p-2.5 rounded-xl border ${activeTab === "alerts" ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-400" : "bg-slate-950/50 border-slate-800"}`}
              >
                <Bell className="w-4 h-4" /> Price Alerts
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
