import React, { lazy, Suspense, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, fetchUserProfileFromFirestore, fetchFirestoreWishlist, fetchFirestoreSearchHistory, fetchFirestorePriceAlerts, logoutFirebase } from "./lib/firebase";
import { 
  PriceLensLogo 
} from "./components/PriceLensLogo";
import { 
  Sidebar 
} from "./components/Sidebar";
import { 
  SplashScreen 
} from "./components/SplashScreen";
import { 
  HomeView 
} from "./components/HomeView";

const AuthModal = lazy(() => import("./components/AuthModal").then(({ AuthModal }) => ({ default: AuthModal })));
const CameraModal = lazy(() => import("./components/CameraModal").then(({ CameraModal }) => ({ default: CameraModal })));
const ProductResultsView = lazy(() => import("./components/ProductResultsView").then(({ ProductResultsView }) => ({ default: ProductResultsView })));
const SearchHistoryView = lazy(() => import("./components/SearchHistoryView").then(({ SearchHistoryView }) => ({ default: SearchHistoryView })));
const WishlistView = lazy(() => import("./components/WishlistView").then(({ WishlistView }) => ({ default: WishlistView })));
const PriceAlertsView = lazy(() => import("./components/PriceAlertsView").then(({ PriceAlertsView }) => ({ default: PriceAlertsView })));
const ProfileView = lazy(() => import("./components/ProfileView").then(({ ProfileView }) => ({ default: ProfileView })));

import { 
  getUser, 
  saveUser, 
  logoutUser, 
  getSearchHistory, 
  addSearchHistory, 
  clearSearchHistory, 
  getWishlist, 
  addToWishlist, 
  removeFromWishlist, 
  getPriceAlerts, 
  addPriceAlert, 
  removePriceAlert, 
  getUserAnalytics 
} from "./lib/storage";
import { apiUrl } from "./lib/api-url";

import { 
  UserProfile, 
  AnalysisResult, 
  SearchHistoryItem, 
  WishlistItem, 
  PriceAlert, 
  ProductOffer,
  UserAnalytics,
  TrendingItem
} from "./types";

import { 
  Sparkles, 
  Search, 
  Camera, 
  TrendingUp, 
  Award, 
  SlidersHorizontal, 
  Filter, 
  ArrowUpDown, 
  Zap, 
  ShieldCheck, 
  Tag,
  Home,
  History as HistoryIcon,
  Heart,
  Bell,
  UserRound
} from "lucide-react";

// TrendingItem is now imported from ./types

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // State for search and analysis
  const [isScanning, setIsScanning] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [analytics, setAnalytics] = useState<UserAnalytics>(getUserAnalytics());
  const [trending, setTrending] = useState<TrendingItem[]>([]);

  // Filters and Sorts for Product Results Page
  const [sortBy, setSortBy] = useState<"cheapest" | "discount" | "rating">("cheapest");
  const [platformFilter, setPlatformFilter] = useState<string>("All");

  // Stable reference so SplashScreen's effect (which depends on onComplete)
  // doesn't reset its timer every time App re-renders while the splash is showing.
  const handleSplashComplete = React.useCallback(() => {
    setShowSplash(false);
    if (!getUser()) {
      setAuthOpen(true);
    }
  }, []);

  useEffect(() => {
    // Load local stored user & state first
    const currentUser = getUser();
    setUser(currentUser);
    if (!currentUser) {
      setAuthOpen(true);
    }
    setSearchHistory(getSearchHistory());
    setWishlist(getWishlist());
    setPriceAlerts(getPriceAlerts());

    // Listen to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        // Fetch user profile from Firestore
        const [profile, fsWishlist, fsHistory, fsAlerts] = await Promise.all([
          fetchUserProfileFromFirestore(fbUser.uid),
          fetchFirestoreWishlist(fbUser.uid),
          fetchFirestoreSearchHistory(fbUser.uid),
          fetchFirestorePriceAlerts(fbUser.uid),
        ]);
        if (profile) {
          setUser(profile);
          saveUser(profile);
          setAuthOpen(false);
        }

        if (fsWishlist.length > 0) setWishlist(fsWishlist);
        if (fsHistory.length > 0) setSearchHistory(fsHistory);
        if (fsAlerts.length > 0) setPriceAlerts(fsAlerts);
      } else {
        const storedUser = getUser();
        if (!storedUser) {
          setUser(null);
          setAuthOpen(true);
        }
      }
    });

    // Fetch trending items from server
    fetch(apiUrl("/api/trending-products"))
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTrending(data);
      })
      .catch(() => {});

    return () => unsubscribe();
  }, []);

  const refreshUserData = () => {
    setSearchHistory(getSearchHistory());
    setWishlist(getWishlist());
    setPriceAlerts(getPriceAlerts());
    setAnalytics(getUserAnalytics());
  };

  // Perform Product Analysis API request
  const performAnalysis = async (image: string | null, query?: string) => {
    setCurrentImage(image);
    setIsScanning(true);
    setAnalysisResult(null);
    setActiveTab("results");

    try {
      const response = await fetch(apiUrl("/api/analyze-product"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, query }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data: AnalysisResult = await response.json();

      // Wait a minimum time so user experiences the scanning animation steps
      setTimeout(() => {
        setIsScanning(false);
        if (data && Array.isArray(data.offers)) {
          setAnalysisResult(data);
          addSearchHistory(data);
          refreshUserData();
        }
      }, 2400);
    } catch (err) {
      console.error("Analysis failed:", err);
      setTimeout(() => {
        setIsScanning(false);
      }, 1000);
    }
  };

  const handleSelectSearchFromHistory = (item: SearchHistoryItem) => {
    setAnalysisResult(item.resultData);
    setCurrentImage(item.imageUri);
    setActiveTab("results");
  };

  const handleAddToWishlist = (offer: ProductOffer) => {
    if (!analysisResult) return;
    addToWishlist(offer, analysisResult.detectedProductName, analysisResult.category, currentImage);
    refreshUserData();
  };

  const handleSetPriceAlert = (offer: ProductOffer) => {
    const target = Math.round(offer.price * 0.9); // Target 10% lower
    addPriceAlert(offer.title, offer.price, target, offer.platform, offer.productUrl, currentImage);
    refreshUserData();
    setActiveTab("alerts");
  };

  const handleRemoveWishlist = (id: string) => {
    removeFromWishlist(id);
    refreshUserData();
  };

  const handleRemoveAlert = (id: string) => {
    removePriceAlert(id);
    refreshUserData();
  };

  const handleAddCustomAlert = (
    productName: string,
    currentPrice: number,
    targetPrice: number,
    platform: string,
    productUrl: string,
    imageUri: string | null
  ) => {
    addPriceAlert(productName, currentPrice, targetPrice, platform, productUrl, imageUri);
    refreshUserData();
  };

  const handleLogout = async () => {
    await logoutFirebase();
    logoutUser();
    setUser(null);
    setAuthOpen(true);
  };

  if (showSplash) {
    return (
      <SplashScreen
        onComplete={handleSplashComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col">
      
      {/* Mobile Header Bar (Only visible on small screens when sidebar is hidden) */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-30">
        <div className="flex items-center cursor-pointer" onClick={() => setActiveTab("dashboard")}>
          <PriceLensLogo size="sm" showText={true} showTagline={false} />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("alerts")}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-cyan-300 transition hover:bg-white/10"
            title="Price alerts"
          >
            <Bell aria-hidden="true" className="h-5 w-5" />
            {priceAlerts.length > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-cyan-500 px-1 text-[9px] font-bold text-slate-950">
                {priceAlerts.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Layout Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenCamera={() => setCameraOpen(true)}
          onLogout={handleLogout}
          historyCount={searchHistory.length}
          wishlistCount={wishlist.length}
          alertsCount={priceAlerts.length}
          hasResults={!!analysisResult}
        />

        {/* Main Content View Container */}
        <main className={`flex-1 overflow-y-auto ${
          activeTab === "dashboard" || activeTab === "profile"
            ? "p-0 pb-24 sm:p-0 sm:pb-24"
            : "p-4 pb-24 sm:p-6 sm:pb-24 lg:p-8 lg:pb-8"
        }`}>
          
          <Suspense fallback={
            <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="Loading view">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
            </div>
          }>
            {/* Dashboard / Home View */}
            {activeTab === "dashboard" && (
              <HomeView
                user={user}
                trending={trending}
                analysisResult={analysisResult}
                searchHistory={searchHistory}
                onSearch={(q) => performAnalysis(null, q)}
                onImageSelected={(img) => performAnalysis(img)}
                onOpenCamera={() => setCameraOpen(true)}
                onViewResults={() => setActiveTab("results")}
                onSetAlert={() => setActiveTab("alerts")}
                onNavigateTab={setActiveTab}
              />
            )}

            {/* Dedicated Product Results Page */}
            {activeTab === "results" && (
              <ProductResultsView
                analysisResult={analysisResult}
                isScanning={isScanning}
                currentImage={currentImage}
                onBack={() => setActiveTab("dashboard")}
                onAddToWishlist={handleAddToWishlist}
                onSetPriceAlert={handleSetPriceAlert}
                wishlist={wishlist}
                sortBy={sortBy}
                setSortBy={setSortBy}
                platformFilter={platformFilter}
                setPlatformFilter={setPlatformFilter}
                onNewSearch={() => {
                  setAnalysisResult(null);
                  setActiveTab("dashboard");
                }}
                onSearch={(q) => performAnalysis(null, q)}
                onImageSelected={(img) => performAnalysis(img)}
                onOpenCamera={() => setCameraOpen(true)}
              />
            )}

            {/* Search History View */}
            {activeTab === "history" && (
              <SearchHistoryView
                history={searchHistory}
                onSelectSearch={handleSelectSearchFromHistory}
                onClearHistory={() => {
                  clearSearchHistory();
                  refreshUserData();
                }}
              />
            )}

            {/* Wishlist View */}
            {activeTab === "wishlist" && (
              <WishlistView
                wishlist={wishlist}
                onRemoveItem={handleRemoveWishlist}
                onSetAlert={(item) => handleSetPriceAlert(item.product)}
              />
            )}

            {/* Price Alerts View */}
            {activeTab === "alerts" && (
              <PriceAlertsView
                alerts={priceAlerts}
                onRemoveAlert={handleRemoveAlert}
                onAddCustomAlert={handleAddCustomAlert}
              />
            )}

            {/* Profile Settings View */}
            {activeTab === "profile" && (
              <ProfileView
                user={user}
                analytics={analytics}
                onUpdateUser={(updated) => {
                  saveUser(updated);
                  setUser(updated);
                }}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onSearchQuery={(q) => performAnalysis(null, q)}
                alertsCount={priceAlerts.length}
                onLogout={handleLogout}
              />
            )}
          </Suspense>

        </main>
      </div>

      <nav
        aria-label="Main navigation"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-slate-800 bg-slate-950/95 px-2 pt-2 backdrop-blur-xl md:hidden"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        {[
          { id: "dashboard", label: "Home", icon: Home },
          { id: "results", label: "Compare", icon: Search },
          { id: "wishlist", label: "Wishlist", icon: Heart },
          { id: "history", label: "History", icon: HistoryIcon },
          { id: "profile", label: "Profile", icon: UserRound },
        ].map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id || (id === "dashboard" && activeTab === "dashboard");
          return (
            <button
              key={id}
              type="button"
              aria-current={isActive ? "page" : undefined}
              onClick={() => setActiveTab(id)}
              className={`flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold transition ${
                isActive ? "text-cyan-300" : "text-slate-500 hover:text-slate-200"
              }`}
            >
              <Icon aria-hidden="true" className="h-5 w-5" />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Auth Modal */}
      {authOpen && (
        <Suspense fallback={<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80" role="status">Loading...</div>}>
          <AuthModal
            isOpen={authOpen}
            onClose={() => setAuthOpen(false)}
            onLoginSuccess={(loggedUser) => {
              saveUser(loggedUser);
              setUser(loggedUser);
              refreshUserData();
            }}
          />
        </Suspense>
      )}

      {/* Live Camera Viewport Modal */}
      {cameraOpen && (
        <Suspense fallback={<div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80" role="status">Loading camera...</div>}>
          <CameraModal
            isOpen={cameraOpen}
            onClose={() => setCameraOpen(false)}
            onCapture={(imgData) => performAnalysis(imgData)}
          />
        </Suspense>
      )}

    </div>
  );
}
