import { supabase } from "../lib/supabase";
import type { Product } from "../types";

const WISHLIST_STORAGE_KEY = "agromarket_wishlist";

export const wishlistService = {
  /**
   * Get wishlist products for a user
   */
  async getWishlist(userId: string): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from("wishlist")
        .select("*, products(*)")
        .eq("user_id", userId);

      if (error || !data) {
        return this.getLocalWishlist(userId);
      }

      return data.map((item) => item.products || item).filter(Boolean);
    } catch {
      return this.getLocalWishlist(userId);
    }
  },

  /**
   * Add a product to user wishlist
   */
  async addToWishlist(userId: string, product: Product): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("wishlist")
        .insert([{ user_id: userId, product_id: product.id }]);

      if (error) {
        this.addLocalWishlist(userId, product);
        return true;
      }

      this.addLocalWishlist(userId, product);
      return true;
    } catch {
      this.addLocalWishlist(userId, product);
      return true;
    }
  },

  /**
   * Remove a product from user wishlist
   */
  async removeFromWishlist(userId: string, productId: string): Promise<boolean> {
    try {
      await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId);

      this.removeLocalWishlist(userId, productId);
      return true;
    } catch {
      this.removeLocalWishlist(userId, productId);
      return true;
    }
  },

  // Local Storage Fallbacks
  getLocalWishlist(userId: string): Product[] {
    try {
      const raw = localStorage.getItem(`${WISHLIST_STORAGE_KEY}_${userId}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  addLocalWishlist(userId: string, product: Product) {
    try {
      const current = this.getLocalWishlist(userId);
      if (!current.some((p) => p.id === product.id)) {
        const updated = [product, ...current];
        localStorage.setItem(`${WISHLIST_STORAGE_KEY}_${userId}`, JSON.stringify(updated));
      }
    } catch (e) {
      console.warn("Failed to write wishlist to local storage", e);
    }
  },

  removeLocalWishlist(userId: string, productId: string) {
    try {
      const current = this.getLocalWishlist(userId);
      const updated = current.filter((p) => p.id !== productId);
      localStorage.setItem(`${WISHLIST_STORAGE_KEY}_${userId}`, JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed to remove item from local storage wishlist", e);
    }
  },
};
