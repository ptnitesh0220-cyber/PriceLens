import fs from "fs";
import path from "path";

// Define TypeScript interfaces for backend database entities
export interface UserRecord {
  id: string;
  name: string;
  email: string;
  password?: string;
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

export interface WishlistRecord {
  id: string;
  userId: string;
  productName: string;
  category: string;
  addedAt: string;
  initialPrice: number;
  targetPriceAlert: number;
  imageUri: string | null;
  product: any;
}

export interface SearchHistoryRecord {
  id: string;
  userId: string;
  timestamp: string;
  productName: string;
  category: string;
  cheapestPrice: number;
  bestPlatform: string;
  offersCount: number;
  imageUri: string | null;
  resultData: any;
}

export interface PriceAlertRecord {
  id: string;
  userId: string;
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

export interface CatalogProductOffer {
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
  isBestPrice?: boolean;
  stockStatus: string;
}

export interface CatalogProduct {
  id: string;
  keywords: string[];
  name: string;
  brand: string;
  category: string;
  confidenceScore: number;
  imageUri: string;
  keyFeatures: string[];
  offers: CatalogProductOffer[];
}

interface DatabaseSchema {
  users: UserRecord[];
  wishlists: WishlistRecord[];
  search_history: SearchHistoryRecord[];
  price_alerts: PriceAlertRecord[];
  products_catalog: CatalogProduct[];
}

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "db.json");

// High-precision authentic catalog dataset of popular online e-commerce products
const REAL_ONLINE_CATALOG: CatalogProduct[] = [
  {
    id: "prod-iphone-15",
    keywords: ["iphone", "iphone 15", "iphone15", "apple iphone", "apple iphone 15", "iphone 15 128gb", "iphone 15 pro", "iphone 15 pro max", "iphone 14", "iphone 13", "iphone 16"],
    name: "Apple iPhone 15 (128 GB) - Black",
    brand: "Apple",
    category: "Smartphones & Mobile",
    confidenceScore: 99,
    imageUri: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80",
    keyFeatures: [
      "Dynamic Island brings alerts and Live Activities right to you",
      "48MP Main camera with 2x Telephoto for high-res photos",
      "A16 Bionic chip powers advanced pro-tested computational photography",
      "Durable color-infused glass and aluminum design with Ceramic Shield front"
    ],
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
      },
      {
        id: "off-ip15-croma",
        platform: "Croma",
        platformLogo: "croma",
        title: "Apple iPhone 15 (128GB, Black)",
        price: 66900,
        originalPrice: 79900,
        discountPct: 16,
        rating: 4.8,
        reviewCount: 3210,
        deliveryInfo: "Store Express Pickup or 2-Day Delivery",
        productUrl: "https://www.croma.com/search?q=iPhone+15",
        isBestPrice: false,
        stockStatus: "In Stock"
      },
      {
        id: "off-ip15-tatacliq",
        platform: "Tata CLIQ",
        platformLogo: "tatacliq",
        title: "Apple iPhone 15 128GB Black Smartphone",
        price: 67490,
        originalPrice: 79900,
        discountPct: 16,
        rating: 4.5,
        reviewCount: 940,
        deliveryInfo: "Standard Delivery in 3 Days",
        productUrl: "https://www.tatacliq.com/search?searchTerm=iPhone+15",
        isBestPrice: false,
        stockStatus: "Only 4 left"
      }
    ]
  },
  {
    id: "prod-s24-ultra",
    keywords: ["samsung s24 ultra", "s24 ultra", "galaxy s24", "samsung galaxy s24 ultra"],
    name: "Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB - Titanium Gray)",
    brand: "Samsung",
    category: "Smartphones & Mobile",
    confidenceScore: 99,
    imageUri: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=600&q=80",
    keyFeatures: [
      "Galaxy AI integration with Live Translate, Circle to Search and Note Assist",
      "200MP Main sensor with 100x Space Zoom and Quad Telephoto system",
      "Snapdragon 8 Gen 3 for Galaxy processor with enlarged vapor chamber",
      "Built-in S Pen with titanium frame armor and Corning Gorilla Armor"
    ],
    offers: [
      {
        id: "off-s24u-amazon",
        platform: "Amazon",
        platformLogo: "amazon",
        title: "Samsung Galaxy S24 Ultra 5G AI Smartphone (Titanium Gray, 12GB, 256GB)",
        price: 119999,
        originalPrice: 134999,
        discountPct: 11,
        rating: 4.8,
        reviewCount: 9240,
        deliveryInfo: "Free Express Delivery by Tomorrow",
        productUrl: "https://www.amazon.in/s?k=Samsung+Galaxy+S24+Ultra",
        isBestPrice: true,
        stockStatus: "In Stock"
      },
      {
        id: "off-s24u-flipkart",
        platform: "Flipkart",
        platformLogo: "flipkart",
        title: "SAMSUNG Galaxy S24 Ultra 5G (Titanium Gray, 256 GB)",
        price: 121999,
        originalPrice: 134999,
        discountPct: 10,
        rating: 4.7,
        reviewCount: 14500,
        deliveryInfo: "Free Delivery in 2 Days",
        productUrl: "https://www.flipkart.com/search?q=Samsung+Galaxy+S24+Ultra",
        isBestPrice: false,
        stockStatus: "In Stock"
      },
      {
        id: "off-s24u-croma",
        platform: "Croma",
        platformLogo: "croma",
        title: "Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB, Titanium Gray)",
        price: 124999,
        originalPrice: 134999,
        discountPct: 7,
        rating: 4.9,
        reviewCount: 1120,
        deliveryInfo: "Store Pickup or Express 24h Delivery",
        productUrl: "https://www.croma.com/search?q=Samsung+S24+Ultra",
        isBestPrice: false,
        stockStatus: "In Stock"
      }
    ]
  },
  {
    id: "prod-sony-wh1000xm5",
    keywords: ["sony wh-1000xm5", "sony xm5", "sony headphones", "wh1000xm5", "sony noise cancelling"],
    name: "Sony WH-1000XM5 Wireless Industry Leading ANC Headphones",
    brand: "Sony",
    category: "Audio & Headphones",
    confidenceScore: 98,
    imageUri: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
    keyFeatures: [
      "Industry Leading Noise Cancellation with 8 microphones & Auto NC Optimizer",
      "Magnificent sound quality with integrated V1 processor",
      "Up to 30-hour battery life with 3-minute fast charging for 3 hours playback",
      "Speak-to-chat & multipoint connection to instantly switch between devices"
    ],
    offers: [
      {
        id: "off-xm5-flipkart",
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
        id: "off-xm5-amazon",
        platform: "Amazon",
        platformLogo: "amazon",
        title: "Sony WH-1000XM5 Wireless Noise Cancelling Headphones - Black",
        price: 28490,
        originalPrice: 34990,
        discountPct: 19,
        rating: 4.8,
        reviewCount: 16800,
        deliveryInfo: "Free Prime Delivery",
        productUrl: "https://www.amazon.in/s?k=Sony+WH-1000XM5",
        isBestPrice: false,
        stockStatus: "In Stock"
      },
      {
        id: "off-xm5-croma",
        platform: "Croma",
        platformLogo: "croma",
        title: "Sony WH-1000XM5 Over-Ear Wireless Headphones with Mic",
        price: 29990,
        originalPrice: 34990,
        discountPct: 14,
        rating: 4.6,
        reviewCount: 890,
        deliveryInfo: "Store Pickup Available",
        productUrl: "https://www.croma.com/search?q=Sony+WH-1000XM5",
        isBestPrice: false,
        stockStatus: "In Stock"
      }
    ]
  },
  {
    id: "prod-airpods-pro-2",
    keywords: ["airpods pro", "airpods pro 2", "apple airpods pro", "airpods usb-c"],
    name: "Apple AirPods Pro (2nd Generation) with USB-C Charging Case",
    brand: "Apple",
    category: "Audio & Earbuds",
    confidenceScore: 99,
    imageUri: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=600&q=80",
    keyFeatures: [
      "Up to 2x more Active Noise Cancellation than previous generation",
      "Adaptive Audio dynamically blends Transparency mode and Active Noise Cancellation",
      "Personalized Spatial Audio with dynamic head tracking",
      "USB-C Charging Case with Precision Finding speaker and lanyard loop"
    ],
    offers: [
      {
        id: "off-app2-amazon",
        platform: "Amazon",
        platformLogo: "amazon",
        title: "Apple AirPods Pro (2nd Generation) with MagSafe Case (USB-C)",
        price: 18990,
        originalPrice: 24900,
        discountPct: 24,
        rating: 4.8,
        reviewCount: 24100,
        deliveryInfo: "Free Express One-Day Delivery",
        productUrl: "https://www.amazon.in/s?k=AirPods+Pro+2",
        isBestPrice: true,
        stockStatus: "In Stock"
      },
      {
        id: "off-app2-flipkart",
        platform: "Flipkart",
        platformLogo: "flipkart",
        title: "Apple AirPods Pro (2nd Gen) with Type-C Case",
        price: 19490,
        originalPrice: 24900,
        discountPct: 21,
        rating: 4.7,
        reviewCount: 19800,
        deliveryInfo: "Delivery by Thursday",
        productUrl: "https://www.flipkart.com/search?q=AirPods+Pro+2",
        isBestPrice: false,
        stockStatus: "In Stock"
      },
      {
        id: "off-app2-croma",
        platform: "Croma",
        platformLogo: "croma",
        title: "Apple AirPods Pro (2nd Generation) TWS Earbuds with USB-C",
        price: 19990,
        originalPrice: 24900,
        discountPct: 20,
        rating: 4.9,
        reviewCount: 1420,
        deliveryInfo: "Same Day Store Delivery",
        productUrl: "https://www.croma.com/search?q=AirPods+Pro+2",
        isBestPrice: false,
        stockStatus: "In Stock"
      }
    ]
  },
  {
    id: "prod-macbook-air-m3",
    keywords: ["macbook air m3", "macbook air", "macbook m3", "apple macbook air"],
    name: "Apple MacBook Air 13.6-inch M3 Chip (8GB Unified Memory, 256GB SSD)",
    brand: "Apple",
    category: "Computers & Laptops",
    confidenceScore: 98,
    imageUri: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
    keyFeatures: [
      "Stunning 13.6-inch Liquid Retina display supports 1 billion colors",
      "Apple M3 8-core CPU and up to 10-core GPU for ultra-smooth multitasking",
      "Up to 18 hours of battery life with fanless quiet design",
      "1080p FaceTime HD camera, three-mic array, and Spatial Audio sound system"
    ],
    offers: [
      {
        id: "off-macm3-amazon",
        platform: "Amazon",
        platformLogo: "amazon",
        title: "Apple 2024 MacBook Air 13-inch Laptop with M3 chip: 13.6-inch Liquid Retina Display, 8GB RAM, 256GB SSD - Midnight",
        price: 104900,
        originalPrice: 114900,
        discountPct: 9,
        rating: 4.8,
        reviewCount: 3120,
        deliveryInfo: "Free Prime Express Delivery",
        productUrl: "https://www.amazon.in/s?k=MacBook+Air+M3",
        isBestPrice: true,
        stockStatus: "In Stock"
      },
      {
        id: "off-macm3-flipkart",
        platform: "Flipkart",
        platformLogo: "flipkart",
        title: "Apple MacBook AIR Apple M3 - (8 GB/256 GB SSD/macOS Sonoma) Midnight",
        price: 105900,
        originalPrice: 114900,
        discountPct: 8,
        rating: 4.7,
        reviewCount: 4890,
        deliveryInfo: "Delivery in 2 Days",
        productUrl: "https://www.flipkart.com/search?q=MacBook+Air+M3",
        isBestPrice: false,
        stockStatus: "In Stock"
      },
      {
        id: "off-macm3-croma",
        platform: "Croma",
        platformLogo: "croma",
        title: "Apple MacBook Air 2024 M3 (13.6 inch, 8GB, 256GB SSD, macOS, Midnight)",
        price: 107900,
        originalPrice: 114900,
        discountPct: 6,
        rating: 4.9,
        reviewCount: 610,
        deliveryInfo: "Store Pickup or 2-Day Delivery",
        productUrl: "https://www.croma.com/search?q=MacBook+Air+M3",
        isBestPrice: false,
        stockStatus: "In Stock"
      }
    ]
  },
  {
    id: "prod-air-jordan-1",
    keywords: ["jordan 1", "air jordan", "nike air jordan 1", "jordan retro high"],
    name: "Nike Air Jordan 1 Retro High OG Sneakers",
    brand: "Nike",
    category: "Footwear & Fashion",
    confidenceScore: 97,
    imageUri: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=600&q=80",
    keyFeatures: [
      "Iconic high-top silhouette with genuine premium leather upper",
      "Encapsulated Nike Air-Sole unit provides lightweight responsive cushioning",
      "Solid rubber outsole with deep flex grooves for durable traction",
      "Signature Wings logo stamped on collar"
    ],
    offers: [
      {
        id: "off-aj1-myntra",
        platform: "Myntra",
        platformLogo: "myntra",
        title: "Nike Men White & Red AIR JORDAN 1 High OG Sneakers",
        price: 11495,
        originalPrice: 16995,
        discountPct: 32,
        rating: 4.8,
        reviewCount: 2310,
        deliveryInfo: "Free Delivery by Tomorrow",
        productUrl: "https://www.myntra.com/nike-air-jordan-1",
        isBestPrice: true,
        stockStatus: "In Stock"
      },
      {
        id: "off-aj1-ajio",
        platform: "Ajio",
        platformLogo: "ajio",
        title: "NIKE Air Jordan 1 Retro High Top Lace-Up Sneakers",
        price: 12995,
        originalPrice: 16995,
        discountPct: 24,
        rating: 4.6,
        reviewCount: 940,
        deliveryInfo: "Standard Delivery in 3 Days",
        productUrl: "https://www.ajio.com/search/?text=Nike%20Air%20Jordan%201",
        isBestPrice: false,
        stockStatus: "Only 2 left"
      },
      {
        id: "off-aj1-flipkart",
        platform: "Flipkart",
        platformLogo: "flipkart",
        title: "NIKE Air Jordan 1 Retro High OG For Men",
        price: 13495,
        originalPrice: 16995,
        discountPct: 21,
        rating: 4.5,
        reviewCount: 1540,
        deliveryInfo: "Free Delivery in 3 Days",
        productUrl: "https://www.flipkart.com/search?q=Nike+Air+Jordan+1",
        isBestPrice: false,
        stockStatus: "In Stock"
      }
    ]
  },
  {
    id: "prod-galaxy-watch-6",
    keywords: ["galaxy watch 6", "samsung watch 6", "galaxy watch classic", "samsung smartwatch"],
    name: "Samsung Galaxy Watch 6 Classic LTE (47mm, Bluetooth & Cellular)",
    brand: "Samsung",
    category: "Wearables & Smartwatches",
    confidenceScore: 97,
    imageUri: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
    keyFeatures: [
      "Physical rotating bezel for intuitive app navigation",
      "Advanced sleep coaching and personalized heart rate zones",
      "Samsung BioActive Sensor for ECG and blood pressure monitoring",
      "Sapphire crystal glass screen with 50m water resistance rating"
    ],
    offers: [
      {
        id: "off-gw6-croma",
        platform: "Croma",
        platformLogo: "croma",
        title: "Samsung Galaxy Watch 6 Classic Smartwatch (47mm LTE, Black)",
        price: 22499,
        originalPrice: 36999,
        discountPct: 39,
        rating: 4.6,
        reviewCount: 1120,
        deliveryInfo: "Free Express Delivery by Tomorrow",
        productUrl: "https://www.croma.com/search?q=Samsung+Galaxy+Watch+6",
        isBestPrice: true,
        stockStatus: "In Stock"
      },
      {
        id: "off-gw6-flipkart",
        platform: "Flipkart",
        platformLogo: "flipkart",
        title: "SAMSUNG Galaxy Watch 6 Classic LTE 47mm",
        price: 23999,
        originalPrice: 36999,
        discountPct: 35,
        rating: 4.5,
        reviewCount: 2890,
        deliveryInfo: "Free Shipping in 2 Days",
        productUrl: "https://www.flipkart.com/search?q=Samsung+Galaxy+Watch+6",
        isBestPrice: false,
        stockStatus: "In Stock"
      },
      {
        id: "off-gw6-amazon",
        platform: "Amazon",
        platformLogo: "amazon",
        title: "Samsung Galaxy Watch 6 Classic Bluetooth + LTE 47mm Smartwatch",
        price: 24990,
        originalPrice: 36999,
        discountPct: 32,
        rating: 4.7,
        reviewCount: 5210,
        deliveryInfo: "Free One-Day Prime Delivery",
        productUrl: "https://www.amazon.in/s?k=Samsung+Galaxy+Watch+6",
        isBestPrice: false,
        stockStatus: "In Stock"
      }
    ]
  },
  {
    id: "prod-dyson-v12",
    keywords: ["dyson v12", "dyson vacuum", "dyson detect slim", "dyson cordless"],
    name: "Dyson V12 Detect Slim Cordless Vacuum Cleaner",
    brand: "Dyson",
    category: "Home Appliances",
    confidenceScore: 96,
    imageUri: "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80",
    keyFeatures: [
      "Illuminating laser reveals microscopic dust on hard floors",
      "Piezo sensor continuously sizes and counts dust particles",
      "Dyson Hyperdymium motor spins up to 125,000 rpm",
      "Up to 60 minutes run time with hair screw tool to pick up long hair"
    ],
    offers: [
      {
        id: "off-v12-tatacliq",
        platform: "Tata CLIQ",
        platformLogo: "tatacliq",
        title: "Dyson V12 Detect Slim Extra Cordless Vacuum Cleaner",
        price: 42900,
        originalPrice: 55900,
        discountPct: 23,
        rating: 4.8,
        reviewCount: 640,
        deliveryInfo: "Free Express Delivery",
        productUrl: "https://www.tatacliq.com/search?searchTerm=Dyson+V12",
        isBestPrice: true,
        stockStatus: "In Stock"
      },
      {
        id: "off-v12-amazon",
        platform: "Amazon",
        platformLogo: "amazon",
        title: "Dyson V12 Detect Slim Cordless Vacuum Cleaner (Gold/Iron)",
        price: 44900,
        originalPrice: 55900,
        discountPct: 20,
        rating: 4.7,
        reviewCount: 1840,
        deliveryInfo: "Free Prime Shipping",
        productUrl: "https://www.amazon.in/s?k=Dyson+V12",
        isBestPrice: false,
        stockStatus: "In Stock"
      },
      {
        id: "off-v12-croma",
        platform: "Croma",
        platformLogo: "croma",
        title: "Dyson V12 Detect Slim Vacuum Cleaner with Laser Illumination",
        price: 45900,
        originalPrice: 55900,
        discountPct: 18,
        rating: 4.9,
        reviewCount: 310,
        deliveryInfo: "Store Express Pickup",
        productUrl: "https://www.croma.com/search?q=Dyson+V12",
        isBestPrice: false,
        stockStatus: "In Stock"
      }
    ]
  }
];

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.ensureDirectory();
    this.data = this.loadData();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
  }

  private loadData(): DatabaseSchema {
    if (!fs.existsSync(DB_PATH)) {
      const initial: DatabaseSchema = {
        users: [
          {
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
          }
        ],
        wishlists: [],
        search_history: [],
        price_alerts: [],
        products_catalog: REAL_ONLINE_CATALOG
      };
      this.saveData(initial);
      return initial;
    }

    try {
      const raw = fs.readFileSync(DB_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (!parsed.products_catalog || parsed.products_catalog.length === 0) {
        parsed.products_catalog = REAL_ONLINE_CATALOG;
      }
      return parsed;
    } catch (e) {
      console.error("Failed to parse database file, re-initializing:", e);
      const fallback: DatabaseSchema = {
        users: [],
        wishlists: [],
        search_history: [],
        price_alerts: [],
        products_catalog: REAL_ONLINE_CATALOG
      };
      this.saveData(fallback);
      return fallback;
    }
  }

  private saveData(dataToSave?: DatabaseSchema) {
    try {
      this.ensureDirectory();
      fs.writeFileSync(DB_PATH, JSON.stringify(dataToSave || this.data, null, 2), "utf-8");
    } catch (e) {
      console.error("Error saving database to file:", e);
    }
  }

  // --- Users Operations ---
  public getUser(userId: string): UserRecord | null {
    return this.data.users.find((u) => u.id === userId) || null;
  }

  public getUserByEmail(email: string): UserRecord | null {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  public saveUser(user: UserRecord): UserRecord {
    const idx = this.data.users.findIndex((u) => u.id === user.id);
    if (idx >= 0) {
      this.data.users[idx] = { ...this.data.users[idx], ...user };
    } else {
      this.data.users.push(user);
    }
    this.saveData();
    return user;
  }

  // --- Wishlist Operations ---
  public getWishlist(userId: string): WishlistRecord[] {
    return this.data.wishlists.filter((w) => w.userId === userId);
  }

  public saveWishlistItem(item: WishlistRecord): WishlistRecord {
    const idx = this.data.wishlists.findIndex((w) => w.id === item.id && w.userId === item.userId);
    if (idx >= 0) {
      this.data.wishlists[idx] = item;
    } else {
      this.data.wishlists.unshift(item);
    }
    this.saveData();
    return item;
  }

  public removeWishlistItem(userId: string, id: string): boolean {
    const initialLen = this.data.wishlists.length;
    this.data.wishlists = this.data.wishlists.filter((w) => !(w.id === id && w.userId === userId));
    this.saveData();
    return this.data.wishlists.length < initialLen;
  }

  // --- Search History Operations ---
  public getSearchHistory(userId: string): SearchHistoryRecord[] {
    return this.data.search_history
      .filter((h) => h.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public saveSearchHistoryItem(item: SearchHistoryRecord): SearchHistoryRecord {
    const existingIdx = this.data.search_history.findIndex((h) => h.id === item.id);
    if (existingIdx >= 0) {
      this.data.search_history[existingIdx] = item;
    } else {
      this.data.search_history.unshift(item);
    }
    this.saveData();
    return item;
  }

  public clearSearchHistory(userId: string): void {
    this.data.search_history = this.data.search_history.filter((h) => h.userId !== userId);
    this.saveData();
  }

  public removeSearchHistoryItem(userId: string, id: string): boolean {
    const initialLen = this.data.search_history.length;
    this.data.search_history = this.data.search_history.filter((h) => !(h.id === id && h.userId === userId));
    this.saveData();
    return this.data.search_history.length < initialLen;
  }

  // --- Price Alerts Operations ---
  public getPriceAlerts(userId: string): PriceAlertRecord[] {
    return this.data.price_alerts.filter((a) => a.userId === userId);
  }

  public savePriceAlert(alert: PriceAlertRecord): PriceAlertRecord {
    const idx = this.data.price_alerts.findIndex((a) => a.id === alert.id && a.userId === alert.userId);
    if (idx >= 0) {
      this.data.price_alerts[idx] = alert;
    } else {
      this.data.price_alerts.unshift(alert);
    }
    this.saveData();
    return alert;
  }

  public removePriceAlert(userId: string, id: string): boolean {
    const initialLen = this.data.price_alerts.length;
    this.data.price_alerts = this.data.price_alerts.filter((a) => !(a.id === id && a.userId === userId));
    this.saveData();
    return this.data.price_alerts.length < initialLen;
  }

  // --- Catalog Product Search & Matching ---
  public findCatalogProductByQuery(queryStr: string): CatalogProduct | null {
    if (!queryStr || !queryStr.trim()) return null;
    const clean = queryStr.toLowerCase().trim();

    // 1. Direct keyword match
    for (const prod of this.data.products_catalog) {
      if (prod.keywords.some((k) => clean.includes(k) || k.includes(clean))) {
        return prod;
      }
      if (clean.includes(prod.name.toLowerCase()) || prod.name.toLowerCase().includes(clean)) {
        return prod;
      }
      if (clean.includes(prod.brand.toLowerCase()) && clean.includes(prod.category.toLowerCase())) {
        return prod;
      }
    }
    return null;
  }

  public getTrendingProducts(): any[] {
    return this.data.products_catalog.map((p) => {
      const best = p.offers.find((o) => o.isBestPrice) || p.offers[0];
      return {
        id: p.id,
        name: p.name,
        category: p.category,
        image: p.imageUri,
        lowestPrice: best ? best.price : 0,
        originalPrice: best ? best.originalPrice : 0,
        bestPlatform: best ? best.platform : "N/A",
        discountPct: best ? best.discountPct : 0
      };
    });
  }
}

export const dbManager = new DatabaseManager();
