export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinedDate: string;
  preferences: {
    emailAlerts: boolean;
    priceDropNotifications: boolean;
    currency: string;
    preferredPlatforms: string[];
    darkMode: boolean;
  };
}

export interface ProductOffer {
  id: string;
  platform: string;
  platformLogo: string;
  title: string;
  price: number;
  originalPrice: number;
  discountPct: number;
  rating: number;
  reviewCount: number;
  deliveryInfo: string;
  productUrl: string;
  imageUrl?: string;
  isBestPrice: boolean;
  stockStatus: string;
}

export interface AnalysisResult {
  queryId: string;
  detectedProductName: string;
  detectedBrand: string;
  category: string;
  confidenceScore: number;
  imageUri: string | null;
  priceSource?: "live" | "estimated";
  keyFeatures: string[];
  offers: ProductOffer[];
  priceRange: {
    min: number;
    max: number;
    avg: number;
  };
  totalSavings: number;
  timestamp: string;
}

export interface SearchHistoryItem {
  id: string;
  timestamp: string;
  imageUri: string | null;
  productName: string;
  category: string;
  cheapestPrice: number;
  bestPlatform: string;
  offersCount: number;
  resultData: AnalysisResult;
}

export interface WishlistItem {
  id: string;
  product: ProductOffer;
  productName: string;
  category: string;
  imageUri: string | null;
  addedAt: string;
  targetPriceAlert?: number;
  initialPrice: number;
}

export interface PriceAlert {
  id: string;
  productId: string;
  productName: string;
  imageUri: string | null;
  currentPrice: number;
  targetPrice: number;
  platform: string;
  productUrl: string;
  isTriggered: boolean;
  createdAt: string;
}

export interface PlatformStat {
  name: string;
  count: number;
  color: string;
}

export interface MonthlyTrend {
  month: string;
  searches: number;
  savings: number;
}

export interface TrendingItem {
  id: string;
  name: string;
  category: string;
  image: string;
  lowestPrice: number;
  originalPrice: number;
  bestPlatform: string;
  discountPct: number;
}

export interface UserAnalytics {
  totalSearches: number;
  totalSavedAmount: number;
  wishlistCount: number;
  activeAlertsCount: number;
  topPlatforms: PlatformStat[];
  monthlyTrend: MonthlyTrend[];
}
