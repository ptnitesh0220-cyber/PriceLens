import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Bell,
  Camera,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Eye,
  Grid2X2,
  Heart,
  History,
  LockKeyhole,
  LogOut,
  Mail,
  ShieldCheck,
  Store,
  UserRound,
  X,
} from "lucide-react";
import { UserProfile, UserAnalytics } from "../types";

const defaultUserAvatar = new URL("../assets/images/user_profile_avatar_1784733370687.jpg", import.meta.url).href;

interface ProfileViewProps {
  user: UserProfile | null;
  analytics: UserAnalytics;
  onUpdateUser: (updated: UserProfile) => void;
  onNavigateTab: (tab: string) => void;
  onSearchQuery?: (query: string) => void;
  alertsCount?: number;
  onLogout?: () => void;
}

type ModalName = "personal" | "notifications" | "privacy" | "currency" | "platforms" | null;

interface ProfileAction {
  label: string;
  description: string;
  icon: React.ElementType;
  badge?: string;
  onClick: () => void;
}

const STORE_OPTIONS = ["Amazon", "Flipkart", "Myntra", "Ajio", "Croma", "Tata CLIQ"];

function ActionGrid({
  title,
  subtitle,
  actions,
  columns = 4,
}: {
  title: string;
  subtitle?: string;
  actions: ProfileAction[];
  columns?: 2 | 4;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="mb-3 flex items-center justify-between gap-2 px-1">
        <div>
          <h2 className="text-sm font-extrabold text-slate-900">{title}</h2>
          {subtitle && <p className="mt-0.5 text-[10px] text-slate-500">{subtitle}</p>}
        </div>
        <ChevronRight aria-hidden="true" className="h-4 w-4 text-orange-500" />
      </div>
      <div className={`grid gap-2 ${columns === 2 ? "grid-cols-2" : "grid-cols-4"}`}>
        {actions.map(({ label, description, icon: Icon, badge, onClick }) => (
          <button
            type="button"
            key={label}
            onClick={onClick}
            className="relative flex min-h-[80px] min-w-0 flex-col items-center justify-center gap-1.5 rounded-xl border border-slate-100 bg-[#fbfbfd] px-1.5 py-3 text-center transition hover:border-orange-200 hover:bg-orange-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
          >
            <span className="relative text-orange-600">
              <Icon aria-hidden="true" className="h-5 w-5" />
              {badge && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan-500 px-1 text-[9px] font-bold text-slate-950">
                  {badge}
                </span>
              )}
            </span>
            <span className="text-[9px] font-bold leading-tight text-slate-800 sm:text-[10px]">{label}</span>
            <span className="hidden text-[9px] leading-tight text-slate-500 sm:block">{description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  analytics,
  onUpdateUser,
  onNavigateTab,
  alertsCount = 0,
  onLogout,
}) => {
  const [activeModal, setActiveModal] = useState<ModalName>(null);
  const [name, setName] = useState(user?.name || "Smart Shopper");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(user?.avatar || defaultUserAvatar);
  const [currency, setCurrency] = useState(user?.preferences?.currency || "INR");
  const [emailAlerts, setEmailAlerts] = useState(user?.preferences?.emailAlerts ?? true);
  const [priceDropNotifications, setPriceDropNotifications] = useState(user?.preferences?.priceDropNotifications ?? true);
  const [preferredPlatforms, setPreferredPlatforms] = useState(user?.preferences?.preferredPlatforms || ["Amazon", "Flipkart"]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (!user) return;
    setName(user.name || "Smart Shopper");
    setEmail(user.email || "");
    setAvatar(user.avatar || defaultUserAvatar);
    setCurrency(user.preferences?.currency || "INR");
    setEmailAlerts(user.preferences?.emailAlerts ?? true);
    setPriceDropNotifications(user.preferences?.priceDropNotifications ?? true);
    setPreferredPlatforms(user.preferences?.preferredPlatforms || ["Amazon", "Flipkart"]);
  }, [user]);

  const savePreferences = (event?: React.FormEvent) => {
    event?.preventDefault();
    const updatedUser: UserProfile = {
      id: user?.id || `user_${Date.now()}`,
      name: name.trim() || "Smart Shopper",
      email: email.trim(),
      avatar: avatar.trim() || defaultUserAvatar,
      joinedDate: user?.joinedDate || new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
      preferences: {
        emailAlerts,
        priceDropNotifications,
        currency,
        preferredPlatforms,
        darkMode: true,
      },
    };

    onUpdateUser(updatedUser);
    setSavedSuccess(true);
    setActiveModal(null);
    window.setTimeout(() => setSavedSuccess(false), 2500);
  };

  const toggleStore = (store: string) => {
    setPreferredPlatforms((current) =>
      current.includes(store) ? current.filter((item) => item !== store) : [...current, store],
    );
  };

  const myPriceLensActions: ProfileAction[] = [
    { label: "Saved products", description: `${analytics.wishlistCount} in wishlist`, icon: Heart, badge: analytics.wishlistCount ? String(analytics.wishlistCount) : undefined, onClick: () => onNavigateTab("wishlist") },
    { label: "Price drop alerts", description: "Track target prices", icon: Bell, badge: alertsCount ? String(alertsCount) : undefined, onClick: () => onNavigateTab("alerts") },
    { label: "Recently viewed", description: "Your latest comparisons", icon: Eye, onClick: () => onNavigateTab("history") },
    { label: "Search history", description: `${analytics.totalSearches} comparisons`, icon: History, onClick: () => onNavigateTab("history") },
  ];

  const accountActions: ProfileAction[] = [
    { label: "Personal info", description: "Name, email, photo", icon: UserRound, onClick: () => setActiveModal("personal") },
    { label: "Currency", description: `Prices in ${currency}`, icon: CircleDollarSign, onClick: () => setActiveModal("currency") },
    { label: "Login & security", description: "Privacy settings", icon: LockKeyhole, onClick: () => setActiveModal("privacy") },
    { label: "Notifications", description: "Deal alerts", icon: Bell, onClick: () => setActiveModal("notifications") },
  ];

  const shoppingActions: ProfileAction[] = [
    { label: "Preferred stores", description: `${preferredPlatforms.length} selected`, icon: Store, onClick: () => setActiveModal("platforms") },
    { label: "Browse categories", description: "Discover products", icon: Grid2X2, onClick: () => onNavigateTab("dashboard") },
    { label: "Price alerts", description: "Manage notifications", icon: Bell, onClick: () => onNavigateTab("alerts") },
  ];

  const modalTitle: Record<Exclude<ModalName, null>, string> = {
    personal: "Personal information",
    notifications: "Notification preferences",
    privacy: "Privacy & security",
    currency: "Price display",
    platforms: "Preferred stores",
  };

  return (
    <div className="pricelens-dark-theme min-h-screen w-full bg-slate-950 pb-5 text-slate-100">
      <div className="mx-auto max-w-5xl space-y-3.5 px-3 pb-6 pt-3 sm:space-y-5 sm:px-6 sm:pt-6 lg:px-8">
        <section className="relative isolate overflow-hidden rounded-b-[30px] rounded-t-[22px] bg-slate-950 px-4 pb-5 pt-4 text-center text-white shadow-md sm:rounded-[28px] sm:px-7 sm:pb-7 sm:pt-5">
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_0%,rgba(6,182,212,0.28),transparent_44%),radial-gradient(ellipse_at_0%_100%,rgba(124,58,237,0.32),transparent_45%),linear-gradient(130deg,#080a16,#0d1226_55%,#171235)]" />
          <div aria-hidden="true" className="absolute -bottom-20 -left-8 -z-10 h-28 w-[120%] -rotate-3 rounded-[50%] bg-gradient-to-r from-violet-700 via-cyan-500 to-violet-600 opacity-70 blur-[1px]" />
          <div aria-hidden="true" className="absolute -bottom-24 -left-8 -z-10 h-28 w-[120%] -rotate-3 rounded-[50%] bg-slate-950" />

          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-orange-300">Your PriceLens account</p>
          <div className="relative mx-auto mt-3 h-[90px] w-[90px] rounded-full bg-gradient-to-br from-purple-500 via-violet-600 to-cyan-400 p-[3px] shadow-lg shadow-cyan-950/40 sm:h-24 sm:w-24">
            <img
              src={avatar}
              alt={`${name}'s profile`}
              onError={(event) => {
                event.currentTarget.src = defaultUserAvatar;
              }}
              className="h-full w-full rounded-full border-[3px] border-slate-950 object-cover"
            />
            <button type="button" onClick={() => setActiveModal("personal")} aria-label="Edit profile photo" className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#25180f] bg-orange-500 text-white shadow-md">
              <Camera aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
          <h1 className="mt-2 text-lg font-extrabold tracking-tight sm:text-xl">{name}</h1>
          <p className="mt-0.5 inline-flex max-w-full items-center justify-center gap-1.5 truncate text-xs text-orange-50/80">
            <Mail aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{email || "Add an email to your profile"}</span>
          </p>
          <div className="mt-2 flex justify-center">
            <span className="inline-flex items-center gap-1 rounded-full border border-orange-400/40 bg-orange-950/50 px-3 py-1 text-[10px] font-bold text-orange-200">
              <SparkleIcon />
              PriceLens member
            </span>
          </div>
          <button type="button" onClick={() => setActiveModal("personal")} className="mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-full border border-orange-300/30 bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/15">
            Edit profile <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
        </section>

        {savedSuccess && (
          <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
            <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
            Your profile preferences have been saved.
          </div>
        )}

        <ActionGrid title="My Account" subtitle="Your profile and account preferences" actions={accountActions} />
        <ActionGrid title="My PriceLens" subtitle="Your saved items and shopping activity" actions={myPriceLensActions} />
        <ActionGrid title="Shopping preferences" subtitle="Make your comparisons more personal" actions={shoppingActions} />

        <button
          type="button"
          onClick={onLogout}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 px-4 py-3 text-sm font-extrabold text-white shadow-md shadow-cyan-950 transition hover:from-violet-500 hover:to-cyan-400"
        >
          <LogOut aria-hidden="true" className="h-4 w-4" />
          Log out
        </button>

        <p className="pb-2 text-center text-[10px] font-medium text-slate-500">Compare more. Save smarter.</p>
      </div>

      {activeModal && (
        <div className="pricelens-dark-theme fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setActiveModal(null);
        }}>
          <section role="dialog" aria-modal="true" aria-labelledby="profile-modal-title" className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6">
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 id="profile-modal-title" className="text-base font-extrabold text-slate-900">{modalTitle[activeModal]}</h2>
              <button type="button" aria-label="Close dialog" onClick={() => setActiveModal(null)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900">
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>

            {activeModal === "personal" && (
              <form onSubmit={savePreferences} className="space-y-4">
                <label className="block space-y-1.5 text-xs font-semibold text-slate-700">
                  Full name
                  <input value={name} onChange={(event) => setName(event.target.value)} required className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
                </label>
                <label className="block space-y-1.5 text-xs font-semibold text-slate-700">
                  Email address
                  <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
                </label>
                <label className="block space-y-1.5 text-xs font-semibold text-slate-700">
                  Profile image URL
                  <input type="url" value={avatar} onChange={(event) => setAvatar(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal text-slate-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100" />
                </label>
                <button type="submit" className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600">Save profile</button>
              </form>
            )}

            {activeModal === "notifications" && (
              <form onSubmit={savePreferences} className="space-y-3">
                <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">
                  <span><span className="block text-sm font-bold text-slate-800">Email alerts</span><span className="mt-1 block text-xs text-slate-500">Receive updates about price drops.</span></span>
                  <input type="checkbox" checked={emailAlerts} onChange={(event) => setEmailAlerts(event.target.checked)} className="h-4 w-4 accent-orange-500" />
                </label>
                <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">
                  <span><span className="block text-sm font-bold text-slate-800">Price drop notifications</span><span className="mt-1 block text-xs text-slate-500">Enable notifications for tracked prices.</span></span>
                  <input type="checkbox" checked={priceDropNotifications} onChange={(event) => setPriceDropNotifications(event.target.checked)} className="h-4 w-4 accent-orange-500" />
                </label>
                <button type="submit" className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600">Save preferences</button>
              </form>
            )}

            {activeModal === "privacy" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <ShieldCheck aria-hidden="true" className="mb-2 h-5 w-5 text-orange-500" />
                  <p className="text-sm font-bold text-slate-800">Your account data</p>
                  <p className="mt-1 text-xs leading-5 text-slate-600">Profile settings, search history, saved products, and price alerts are associated with your PriceLens account.</p>
                </div>
                <button type="button" onClick={() => { setActiveModal(null); onNavigateTab("history"); }} className="flex w-full items-center justify-between rounded-xl border border-slate-200 p-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  View your search history <ChevronRight aria-hidden="true" className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => setActiveModal(null)} className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600">Done</button>
              </div>
            )}

            {activeModal === "currency" && (
              <form onSubmit={savePreferences} className="space-y-4">
                <label className="block space-y-1.5 text-xs font-semibold text-slate-700">
                  Display currency
                  <select value={currency} onChange={(event) => setCurrency(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-normal text-slate-900 outline-none focus:border-orange-400">
                    <option value="INR">INR (₹) · Indian Rupee</option>
                    <option value="USD">USD ($) · US Dollar</option>
                    <option value="EUR">EUR (€) · Euro</option>
                    <option value="GBP">GBP (£) · British Pound</option>
                  </select>
                </label>
                <p className="text-xs leading-5 text-slate-500">Store prices are shown in the currency selected in your preferences.</p>
                <button type="submit" className="w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600">Save currency</button>
              </form>
            )}

            {activeModal === "platforms" && (
              <form onSubmit={savePreferences} className="space-y-2">
                <p className="mb-3 text-xs leading-5 text-slate-500">Choose the stores you want to prioritize when comparing products.</p>
                {STORE_OPTIONS.map((store) => (
                  <label key={store} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-800">
                    {store}
                    <input type="checkbox" checked={preferredPlatforms.includes(store)} onChange={() => toggleStore(store)} className="h-4 w-4 accent-orange-500" />
                  </label>
                ))}
                <button type="submit" className="mt-2 w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white hover:bg-orange-600">Save preferred stores</button>
              </form>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

function SparkleIcon() {
  return <CircleDollarSign aria-hidden="true" className="h-3.5 w-3.5" />;
}
