import React, { useRef, useState } from "react";
import {
  ArrowRight,
  Bell,
  Camera,
  ChevronRight,
  Gamepad2,
  Heart,
  Headphones,
  Laptop,
  Search,
  ShieldCheck,
  Shirt,
  Smartphone,
  Tag,
  Upload,
  Watch,
  Zap,
} from "lucide-react";
import { UserProfile, AnalysisResult, SearchHistoryItem, TrendingItem } from "../types";

interface HomeViewProps {
  user: UserProfile | null;
  trending: TrendingItem[];
  analysisResult: AnalysisResult | null;
  searchHistory: SearchHistoryItem[];
  onSearch: (query: string) => void;
  onImageSelected: (img: string) => void;
  onOpenCamera: () => void;
  onViewResults: () => void;
  onSetAlert: () => void;
  onNavigateTab: (tab: string) => void;
}

const QUICK_CATEGORIES = [
  { label: "Mobiles", query: "Smartphones", icon: Smartphone },
  { label: "Laptops", query: "Laptops", icon: Laptop },
  { label: "Electronics", query: "Electronics", icon: Headphones },
  { label: "Fashion", query: "Fashion", icon: Shirt },
  { label: "Footwear", query: "Sneakers", icon: Tag },
  { label: "Watches", query: "Smartwatches", icon: Watch },
  { label: "Gaming", query: "Gaming", icon: Gamepad2 },
];

const formatPrice = (price: number) => `₹${price.toLocaleString("en-IN")}`;
const homepageHeroImage = new URL("../assets/images/homepage_hero_ai_lens_clean.jpg", import.meta.url).href;

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  trending,
  analysisResult,
  searchHistory,
  onSearch,
  onImageSelected,
  onOpenCamera,
  onViewResults,
  onSetAlert,
  onNavigateTab,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      onSearch(query);
      setSearchQuery("");
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      window.alert("Please choose an image file.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onImageSelected(reader.result);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  return (
    <div className="pricelens-dark-theme min-h-screen w-full bg-slate-950 pb-5 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-5 px-3 pb-6 pt-3 sm:space-y-7 sm:px-6 sm:pt-6 lg:px-8">
        <section className="relative isolate aspect-[16/9] w-full overflow-hidden rounded-[26px] bg-slate-950 text-white shadow-lg">
          <div aria-hidden="true" className="absolute inset-0">
            <img src={homepageHeroImage} alt="" fetchPriority="high" className="h-full w-full object-contain" />
          </div>
          <span aria-hidden="true" className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            <i className="h-1.5 w-4 rounded-full bg-orange-500" />
            <i className="h-1.5 w-1.5 rounded-full bg-white/50" />
            <i className="h-1.5 w-1.5 rounded-full bg-white/50" />
            <i className="h-1.5 w-1.5 rounded-full bg-white/50" />
          </span>
        </section>

        <form onSubmit={handleSubmit} role="search">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm transition focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100">
            <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-slate-500" />
            <input
              ref={searchInputRef}
              aria-label="Search products"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              type="search"
              placeholder="Search for products..."
              className="min-w-0 flex-1 bg-transparent py-2 text-sm text-slate-900 outline-none placeholder:text-slate-500"
            />
            <button
              type="button"
              onClick={onOpenCamera}
              aria-label="Scan a product with camera"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
            >
              <Camera aria-hidden="true" className="h-5 w-5" />
            </button>
            <button
              type="submit"
              disabled={!searchQuery.trim()}
              className="sr-only"
            >
              Compare prices
            </button>
          </div>
        </form>

        <div className="grid grid-cols-4 gap-2" aria-label="Shopping shortcuts">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="group flex min-h-[74px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-slate-100 bg-white px-1 py-3 text-center shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-950/20"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-300/15 bg-gradient-to-br from-cyan-400/15 to-blue-500/10 text-cyan-300 shadow-inner shadow-cyan-300/10 transition duration-200 group-hover:border-cyan-300/35 group-hover:from-cyan-400/25 group-hover:to-blue-500/20">
              <Upload aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={2.25} />
            </span>
            <span className="text-[10px] font-bold leading-tight text-slate-700 transition group-hover:text-cyan-300 sm:text-xs">Upload image</span>
          </button>
          <button
            type="button"
            onClick={() => searchInputRef.current?.focus()}
            className="group flex min-h-[74px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-slate-100 bg-white px-1 py-3 text-center shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-950/20"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-300/15 bg-gradient-to-br from-cyan-400/15 to-blue-500/10 text-cyan-300 shadow-inner shadow-cyan-300/10 transition duration-200 group-hover:border-cyan-300/35 group-hover:from-cyan-400/25 group-hover:to-blue-500/20">
              <Zap aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={2.25} />
            </span>
            <span className="text-[10px] font-bold leading-tight text-slate-700 transition group-hover:text-cyan-300 sm:text-xs">Price compare</span>
          </button>
          <button
            type="button"
            onClick={onSetAlert}
            className="group relative flex min-h-[74px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-slate-100 bg-white px-1 py-3 text-center shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-950/20"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-300/15 bg-gradient-to-br from-cyan-400/15 to-blue-500/10 text-cyan-300 shadow-inner shadow-cyan-300/10 transition duration-200 group-hover:border-cyan-300/35 group-hover:from-cyan-400/25 group-hover:to-blue-500/20">
              <Bell aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={2.25} />
            </span>
            <span className="text-[10px] font-bold leading-tight text-slate-700 transition group-hover:text-cyan-300 sm:text-xs">Price alerts</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab("wishlist")}
            className="group flex min-h-[74px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-slate-100 bg-white px-1 py-3 text-center shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-950/20"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-300/15 bg-gradient-to-br from-cyan-400/15 to-blue-500/10 text-cyan-300 shadow-inner shadow-cyan-300/10 transition duration-200 group-hover:border-cyan-300/35 group-hover:from-cyan-400/25 group-hover:to-blue-500/20">
              <Heart aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={2.25} />
            </span>
            <span className="text-[10px] font-bold leading-tight text-slate-700 transition group-hover:text-cyan-300 sm:text-xs">Wishlist</span>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>

        {analysisResult && (
          <section aria-label="Your latest comparison" className="flex flex-col gap-3 rounded-2xl border border-orange-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600">Your latest comparison</p>
              <p className="mt-1 truncate text-sm font-bold text-slate-900">{analysisResult.detectedProductName}</p>
              <p className="mt-1 text-xs text-slate-600">
                Best price <span className="font-bold text-emerald-700">{formatPrice(analysisResult.priceRange.min)}</span>
                {" · "}{analysisResult.offers.length} stores
              </p>
            </div>
            <button type="button" onClick={onViewResults} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-xs font-bold text-white transition hover:bg-orange-600">
              See comparison
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </section>
        )}

        {trending.length > 0 && (
          <section aria-labelledby="trending-heading">
            <div className="mb-3 flex items-center justify-between">
              <h2 id="trending-heading" className="text-base font-extrabold tracking-tight text-slate-900 sm:text-lg">
                Trending deals <span aria-hidden="true">🔥</span>
              </h2>
              <button type="button" onClick={() => onSearch("Trending deals")} className="inline-flex items-center gap-0.5 text-xs font-bold text-orange-600">
                View all <ChevronRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
            <div className="hide-scrollbar -mx-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-3 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0 lg:grid-cols-4">
              {trending.map((item) => {
                const savings = Math.max(0, item.originalPrice - item.lowestPrice);
                return (
                  <article key={item.id} className="w-[172px] shrink-0 snap-start overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:w-auto">
                    <button type="button" onClick={() => onSearch(item.name)} className="block w-full text-left">
                      <div className="relative flex h-28 items-center justify-center bg-white p-3 sm:h-36">
                        <img src={item.image} alt={item.name} loading="lazy" className="h-full w-full object-contain" />
                        {item.discountPct > 0 && (
                          <span className="absolute right-2 top-2 rounded-full bg-orange-500 px-2 py-1 text-[10px] font-bold text-white">
                            -{item.discountPct}%
                          </span>
                        )}
                      </div>
                      <div className="px-3 pb-2">
                        <h3 className="line-clamp-2 min-h-9 text-[11px] font-semibold leading-4 text-slate-800">{item.name}</h3>
                        <div className="mt-1 flex flex-wrap items-baseline gap-1.5">
                          <span className="text-sm font-extrabold text-orange-600">{formatPrice(item.lowestPrice)}</span>
                          {item.originalPrice > item.lowestPrice && (
                            <span className="text-[10px] text-slate-400 line-through">{formatPrice(item.originalPrice)}</span>
                          )}
                        </div>
                      </div>
                    </button>
                    <button type="button" onClick={() => onSearch(item.name)} className="mx-2 mb-2 flex min-h-8 w-[calc(100%-1rem)] items-center justify-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2 text-[10px] font-bold text-slate-700 transition hover:bg-orange-100">
                      Compare prices <ArrowRight aria-hidden="true" className="h-3 w-3 text-orange-600" />
                    </button>
                    {savings > 0 && <span className="sr-only">Save up to {formatPrice(savings)}</span>}
                  </article>
                );
              })}
            </div>
          </section>
        )}

        <section aria-label="PriceLens price alerts" className="flex items-center justify-between gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 px-4 py-4 text-white shadow-md sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-white">
              <ShieldCheck aria-hidden="true" className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold">PriceLens Price Watch</p>
              <p className="mt-0.5 text-[10px] text-orange-100/70 sm:text-xs">Keep an eye on prices that matter to you.</p>
            </div>
          </div>
          <button type="button" onClick={onSetAlert} className="inline-flex min-h-9 shrink-0 items-center gap-1 rounded-full bg-orange-500 px-3 py-2 text-[10px] font-bold text-white transition hover:bg-orange-400 sm:px-4 sm:text-xs">
            Set an alert <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
        </section>

        <section aria-labelledby="categories-heading">
          <div className="mb-3 flex items-center justify-between">
            <h2 id="categories-heading" className="text-base font-extrabold tracking-tight text-slate-900 sm:text-lg">Popular categories</h2>
            <button type="button" onClick={() => onSearch("Popular products")} className="inline-flex items-center gap-0.5 text-xs font-bold text-orange-600">
              Explore <ChevronRight aria-hidden="true" className="h-4 w-4" />
            </button>
          </div>
          <div className="hide-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:px-0 lg:grid-cols-7">
            {QUICK_CATEGORIES.map(({ label, query, icon: Icon }) => (
              <button key={label} type="button" onClick={() => onSearch(query)} className="group flex w-[76px] shrink-0 flex-col items-center gap-2 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-cyan-400/40 hover:shadow-lg hover:shadow-cyan-950/20 sm:w-auto">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/15 bg-gradient-to-br from-cyan-400/15 to-blue-500/10 text-cyan-300 shadow-inner shadow-cyan-300/10 transition duration-200 group-hover:border-cyan-300/35 group-hover:from-cyan-400/25 group-hover:to-blue-500/20">
                  <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={2.1} />
                </span>
                <span className="text-[10px] font-bold text-slate-700 transition group-hover:text-cyan-300">{label}</span>
              </button>
            ))}
          </div>
        </section>

        {searchHistory.length > 0 && (
          <section aria-labelledby="recent-heading" className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 id="recent-heading" className="text-base font-extrabold tracking-tight text-slate-900">Recently compared</h2>
              <button type="button" onClick={() => onNavigateTab("history")} className="inline-flex items-center gap-0.5 text-xs font-bold text-orange-600">
                History <ChevronRight aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {searchHistory.slice(0, 3).map((item) => (
                <button key={item.id} type="button" onClick={() => onSearch(item.resultData?.detectedProductName || item.productName)} className="flex w-full min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-orange-200">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-50">
                    {item.imageUri ? <img src={item.imageUri} alt="" loading="lazy" className="h-full w-full object-cover" /> : <Zap aria-hidden="true" className="h-5 w-5 text-orange-500" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-bold text-slate-800">{item.productName}</span>
                    <span className="mt-1 block text-[10px] text-slate-500">From {formatPrice(item.cheapestPrice)} at {item.bestPlatform}</span>
                  </span>
                  <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-orange-500" />
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
