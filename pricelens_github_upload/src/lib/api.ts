import { UserProfile, SearchHistoryItem, WishlistItem, PriceAlert, AnalysisResult } from "../types";
import { apiUrl } from "./api-url";

export async function apiAnalyzeProduct(image: string | null, query?: string): Promise<AnalysisResult> {
  const res = await fetch(apiUrl("/api/analyze-product"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image, query }),
  });
  if (!res.ok) {
    throw new Error(`Server returned status ${res.status}`);
  }
  return await res.json();
}

export async function apiGetTrendingProducts(): Promise<any[]> {
  try {
    const res = await fetch(apiUrl("/api/trending-products"));
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error("API error fetching trending products:", e);
    return [];
  }
}

export async function apiFetchWishlist(userId: string): Promise<WishlistItem[]> {
  try {
    const res = await fetch(apiUrl(`/api/wishlist?userId=${encodeURIComponent(userId)}`));
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error("API error fetching wishlist:", e);
    return [];
  }
}

export async function apiSaveWishlistItem(userId: string, item: WishlistItem): Promise<void> {
  try {
    await fetch(apiUrl("/api/wishlist"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, userId }),
    });
  } catch (e) {
    console.error("API error saving wishlist item:", e);
  }
}

export async function apiRemoveWishlistItem(userId: string, id: string): Promise<void> {
  try {
    await fetch(apiUrl(`/api/wishlist/${encodeURIComponent(id)}?userId=${encodeURIComponent(userId)}`), {
      method: "DELETE",
    });
  } catch (e) {
    console.error("API error removing wishlist item:", e);
  }
}

export async function apiFetchSearchHistory(userId: string): Promise<SearchHistoryItem[]> {
  try {
    const res = await fetch(apiUrl(`/api/history?userId=${encodeURIComponent(userId)}`));
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error("API error fetching search history:", e);
    return [];
  }
}

export async function apiSaveSearchHistoryItem(userId: string, item: SearchHistoryItem): Promise<void> {
  try {
    await fetch(apiUrl("/api/history"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, userId }),
    });
  } catch (e) {
    console.error("API error saving search history item:", e);
  }
}

export async function apiFetchPriceAlerts(userId: string): Promise<PriceAlert[]> {
  try {
    const res = await fetch(apiUrl(`/api/alerts?userId=${encodeURIComponent(userId)}`));
    if (!res.ok) return [];
    return await res.json();
  } catch (e) {
    console.error("API error fetching price alerts:", e);
    return [];
  }
}

export async function apiSavePriceAlert(userId: string, alert: PriceAlert): Promise<void> {
  try {
    await fetch(apiUrl("/api/alerts"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...alert, userId }),
    });
  } catch (e) {
    console.error("API error saving price alert:", e);
  }
}

export async function apiRemovePriceAlert(userId: string, id: string): Promise<void> {
  try {
    await fetch(apiUrl(`/api/alerts/${encodeURIComponent(id)}?userId=${encodeURIComponent(userId)}`), {
      method: "DELETE",
    });
  } catch (e) {
    console.error("API error removing price alert:", e);
  }
}
