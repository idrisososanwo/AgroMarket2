import type { Product } from "../types";

const RECENTLY_VIEWED_KEY = "agromarket_recently_viewed";

export const recentlyViewedService = {
  getRecentlyViewed(): Product[] {
    try {
      const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  addRecentlyViewed(product: Product) {
    try {
      const current = this.getRecentlyViewed();
      const filtered = current.filter((p) => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, 10);
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed to store recently viewed product", e);
    }
  },

  clearRecentlyViewed() {
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
  },
};
