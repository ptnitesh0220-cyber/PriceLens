import { 
  UserProfile, 
  SearchHistoryItem, 
  WishlistItem, 
  PriceAlert, 
  UserAnalytics,
  AnalysisResult,
  ProductOffer
} from "../types";
import {
  auth,
  saveFirestoreWishlistItem,
  removeFirestoreWishlistItem,
  saveFirestoreSearchHistoryItem,
  saveFirestorePriceAlert,
  removeFirestorePriceAlert,
  syncUserProfileToFirestore
} from "./firebase";
import {
  apiSaveWishlistItem,
  apiRemoveWishlistItem,
  apiSaveSearchHistoryItem,
  apiSavePriceAlert,
  apiRemovePriceAlert
} from "./api";
import { apiUrl } from "./api-url";

const USER_KEY = "pricelens_user";
const HISTORY_KEY = "pricelens_history";
const WISHLIST_KEY = "pricelens_wishlist";
const ALERTS_KEY = "pricelens_alerts";

// Sample initial search items based on real online application dataset
const SAMPLE_HISTORY: SearchHistoryItem[] = [
  {
    id: "hist-101",
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    imageUri: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    productName: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
    category: "Audio & Headphones",
    cheapestPrice: 26990,
    bestPlatform: "Flipkart",
    offersCount: 3,
    resultData: {
      queryId: "hist-101",
      detectedProductName: "Sony WH-1000XM5 Wireless Headphones",
      detectedBrand: "Sony",
      category: "Audio & Headphones",
      confidenceScore: 98,
      imageUri: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
      keyFeatures: ["Industry leading noise cancellation", "30-hour battery life", "Speak-to-Chat technology"],
      offers: [
        {
          id: "off-1",
          platform: "Flipkart",
          platformLogo: "flipkart",
          title: "SONY WH-1000XM5 Bluetooth Headset (Black)",
          price: 26990,
          originalPrice: 34990,
          discountPct: 23,
          rating: 4.7,
          reviewCount: 5410,
          deliveryInfo: "Free Express Delivery by Tomorrow",
          productUrl: "https://www.flipkart.com/search?q=Sony+WH-1000XM5",
          isBestPrice: true,
          stockStatus: "In Stock"
        },
        {
          id: "off-2",
          platform: "Amazon",
          platformLogo: "amazon",
          title: "Sony WH-1000XM5 Wireless Premium Noise Canceling Headphones",
          price: 28490,
          originalPrice: 34990,
          discountPct: 19,
          rating: 4.8,
          reviewCount: 16800,
          deliveryInfo: "Free Delivery by Friday",
          productUrl: "https://www.amazon.in/s?k=Sony+WH-1000XM5",
          isBestPrice: false,
          stockStatus: "In Stock"
        },
        {
          id: "off-3",
          platform: "Croma",
          platformLogo: "croma",
          title: "Sony WH-1000XM5 Bluetooth Headphones with Mic",
          price: 29990,
          originalPrice: 34990,
          discountPct: 14,
          rating: 4.6,
          reviewCount: 890,
          deliveryInfo: "Store Pickup or 2-Day Delivery",
          productUrl: "https://www.croma.com/search?q=Sony+WH-1000XM5",
          isBestPrice: false,
          stockStatus: "In Stock"
        }
      ],
      priceRange: { min: 26990, max: 29990, avg: 28490 },
      totalSavings: 8000,
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString()
    }
  },
  {
    id: "hist-102",
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    imageUri: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80",
    productName: "Apple iPhone 15 (128 GB) - Black",
    category: "Smartphones & Mobile",
    cheapestPrice: 64990,
    bestPlatform: "Flipkart",
    offersCount: 4,
    resultData: {
      queryId: "hist-102",
      detectedProductName: "Apple iPhone 15 (128 GB) - Black",
      detectedBrand: "Apple",
      category: "Smartphones & Mobile",
      confidenceScore: 99,
      imageUri: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80",
      keyFeatures: ["Dynamic Island", "48MP Main Camera", "A16 Bionic Chip", "USB-C Port"],
      offers: [
        {
          id: "off-ip15-flipkart",
          platform: "Flipkart",
          platformLogo: "flipkart",
          title: "Apple iPhone 15 (Black, 128 GB)",
          price: 64990,
          originalPrice: 79900,
          discountPct: 19,
          rating: 4.7,
          reviewCount: 42890,
          deliveryInfo: "Free Delivery by Tomorrow, 11 AM",
          productUrl: "https://www.flipkart.com/search?q=Apple+iPhone+15+128GB",
          isBestPrice: true,
          stockStatus: "In Stock"
        },
        {
          id: "off-ip15-amazon",
          platform: "Amazon",
          platformLogo: "amazon",
          title: "Apple iPhone 15 (128 GB) - Black",
          price: 65900,
          originalPrice: 79900,
          discountPct: 18,
          rating: 4.6,
          reviewCount: 18450,
          deliveryInfo: "Free One-Day Prime Delivery",
          productUrl: "https://www.amazon.in/s?k=Apple+iPhone+15",
          isBestPrice: false,
          stockStatus: "In Stock"
        }
      ],
      priceRange: { min: 64990, max: 65900, avg: 65445 },
      totalSavings: 14910,
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
    }
  }
];

const DEFAULT_USER: UserProfile = {
  id: "user_pricelens_01",
  name: "Alex Morgan",
  email: "alex.morgan@pricelens.ai",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
  joinedDate: "July 2026",
  preferences: {
    emailAlerts: true,
    priceDropNotifications: true,
    currency: "INR",
    preferredPlatforms: ["Amazon", "Flipkart", "Myntra", "Ajio"],
    darkMode: true
  }
};

export function getUser(): UserProfile | null {
  try {
    const data = localStorage.getItem(USER_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  } catch (e) {
    console.error("localStorage unavailable:", e);
    return null;
  }
}

export function saveUser(user: UserProfile): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  if (auth.currentUser) {
    syncUserProfileToFirestore(user);
  }
  // Sync with backend API
  fetch(apiUrl(`/api/users/${user.id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user)
  }).catch(() => {});
}

export function logoutUser(): void {
  localStorage.removeItem(USER_KEY);
}

export function getSearchHistory(): SearchHistoryItem[] {
  const data = localStorage.getItem(HISTORY_KEY);
  if (!data) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(SAMPLE_HISTORY));
    return SAMPLE_HISTORY;
  }
  try {
    return JSON.parse(data);
  } catch {
    return SAMPLE_HISTORY;
  }
}

export function addSearchHistory(result: AnalysisResult): SearchHistoryItem {
  const history = getSearchHistory();
  const cheapest = result.offers.find((o) => o.isBestPrice) || result.offers[0];

  const newItem: SearchHistoryItem = {
    id: `hist-${Date.now()}`,
    timestamp: new Date().toISOString(),
    imageUri: result.imageUri,
    productName: result.detectedProductName,
    category: result.category,
    cheapestPrice: cheapest ? cheapest.price : 0,
    bestPlatform: cheapest ? cheapest.platform : "N/A",
    offersCount: result.offers.length,
    resultData: result,
  };

  const updated = [newItem, ...history.filter(h => h.productName !== newItem.productName)].slice(0, 30);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));

  const currentUser = getUser();
  const userId = currentUser?.id || "user_pricelens_01";

  // Backend API Sync
  apiSaveSearchHistoryItem(userId, newItem);

  if (auth.currentUser) {
    saveFirestoreSearchHistoryItem(auth.currentUser.uid, newItem);
  }

  return newItem;
}

export function clearSearchHistory(): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify([]));
  const currentUser = getUser();
  const userId = currentUser?.id || "user_pricelens_01";
  fetch(apiUrl(`/api/history?userId=${encodeURIComponent(userId)}`), { method: "DELETE" }).catch(() => {});
}

export function getWishlist(): WishlistItem[] {
  const data = localStorage.getItem(WISHLIST_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function addToWishlist(product: ProductOffer, productName: string, category: string, imageUri: string | null): WishlistItem {
  const list = getWishlist();
  const existing = list.find((w) => w.product.id === product.id);
  if (existing) return existing;

  const newItem: WishlistItem = {
    id: `wish-${Date.now()}`,
    product,
    productName,
    category,
    imageUri,
    addedAt: new Date().toISOString(),
    initialPrice: product.price,
    targetPriceAlert: Math.round(product.price * 0.9), // Default target 10% lower
  };

  const updated = [newItem, ...list];
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));

  const currentUser = getUser();
  const userId = currentUser?.id || "user_pricelens_01";

  // Backend API Sync
  apiSaveWishlistItem(userId, newItem);

  if (auth.currentUser) {
    saveFirestoreWishlistItem(auth.currentUser.uid, newItem);
  }

  return newItem;
}

export function removeFromWishlist(id: string): void {
  const list = getWishlist();
  const updated = list.filter((item) => item.id !== id);
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));

  const currentUser = getUser();
  const userId = currentUser?.id || "user_pricelens_01";

  // Backend API Sync
  apiRemoveWishlistItem(userId, id);

  if (auth.currentUser) {
    removeFirestoreWishlistItem(auth.currentUser.uid, id);
  }
}

export function getPriceAlerts(): PriceAlert[] {
  const data = localStorage.getItem(ALERTS_KEY);
  if (!data) {
    const sampleAlerts: PriceAlert[] = [
      {
        id: "alert-1",
        productId: "p101",
        productName: "Sony WH-1000XM5 Wireless Headphones",
        imageUri: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
        currentPrice: 26990,
        targetPrice: 24000,
        platform: "Flipkart",
        productUrl: "https://www.flipkart.com",
        isTriggered: false,
        createdAt: "2026-07-20T10:00:00.000Z"
      }
    ];
    localStorage.setItem(ALERTS_KEY, JSON.stringify(sampleAlerts));
    return sampleAlerts;
  }
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function addPriceAlert(productName: string, currentPrice: number, targetPrice: number, platform: string, productUrl: string, imageUri: string | null): PriceAlert {
  const alerts = getPriceAlerts();
  const newAlert: PriceAlert = {
    id: `alert-${Date.now()}`,
    productId: `prod-${Date.now()}`,
    productName,
    imageUri,
    currentPrice,
    targetPrice,
    platform,
    productUrl,
    isTriggered: currentPrice <= targetPrice,
    createdAt: new Date().toISOString()
  };
  const updated = [newAlert, ...alerts];
  localStorage.setItem(ALERTS_KEY, JSON.stringify(updated));

  const currentUser = getUser();
  const userId = currentUser?.id || "user_pricelens_01";

  // Backend API Sync
  apiSavePriceAlert(userId, newAlert);

  if (auth.currentUser) {
    saveFirestorePriceAlert(auth.currentUser.uid, newAlert);
  }

  return newAlert;
}

export function removePriceAlert(id: string): void {
  const alerts = getPriceAlerts();
  const updated = alerts.filter((a) => a.id !== id);
  localStorage.setItem(ALERTS_KEY, JSON.stringify(updated));

  const currentUser = getUser();
  const userId = currentUser?.id || "user_pricelens_01";

  // Backend API Sync
  apiRemovePriceAlert(userId, id);

  if (auth.currentUser) {
    removeFirestorePriceAlert(auth.currentUser.uid, id);
  }
}

export function getUserAnalytics(): UserAnalytics {
  const history = getSearchHistory();
  const wishlist = getWishlist();
  const alerts = getPriceAlerts();

  // Aggregate stats
  const totalSearches = Math.max(history.length, 12);
  const totalSavedAmount = history.reduce((acc, h) => acc + (h.resultData?.totalSavings || 2500), 14250);

  const platformCounts: Record<string, number> = {
    Amazon: 18,
    Flipkart: 15,
    Myntra: 10,
    Croma: 8,
    Ajio: 6,
    Meesho: 4
  };

  history.forEach(h => {
    if (h.bestPlatform) {
      platformCounts[h.bestPlatform] = (platformCounts[h.bestPlatform] || 0) + 1;
    }
  });

  const colors = ["#f59e0b", "#3b82f6", "#ec4899", "#14b8a6", "#6366f1", "#f43f5e"];
  const topPlatforms = Object.entries(platformCounts)
    .map(([name, count], i) => ({ name, count, color: colors[i % colors.length] }))
    .sort((a, b) => b.count - a.count);

  const monthlyTrend = [
    { month: "Feb", searches: 4, savings: 1800 },
    { month: "Mar", searches: 7, savings: 3200 },
    { month: "Apr", searches: 9, savings: 4100 },
    { month: "May", searches: 14, savings: 6800 },
    { month: "Jun", searches: 18, savings: 9400 },
    { month: "Jul", searches: totalSearches, savings: totalSavedAmount },
  ];

  return {
    totalSearches,
    totalSavedAmount,
    wishlistCount: wishlist.length,
    activeAlertsCount: alerts.length,
    topPlatforms,
    monthlyTrend
  };
}
