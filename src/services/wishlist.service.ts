import { supabase } from "../lib/supabase";
import type { Product } from "../types";

const WISHLIST_STORAGE_KEY = "agromarket_wishlist";

export const wishlistService = {
  /**
   * Get wishlist products for a user
   */
  async getWishlist(userId: string): Promise<Product[]> {
    if (!userId) return [];
    try {
      const { data, error } = await supabase
        .from("wishlist")
        .select("*, products(*)")
        .eq("user_id", userId);

      if (error || !data) {
        return this.getLocalWishlist(userId);
      }

      const products = data
        .map((item) => item.products || item)
        .filter((p): p is Product => Boolean(p && p.id));

      if (products.length > 0) {
        try {
          localStorage.setItem(`${WISHLIST_STORAGE_KEY}_${userId}`, JSON.stringify(products));
        } catch {
          // ignore storage error
        }
        return products;
      }

      return this.getLocalWishlist(userId);
    } catch {
      return this.getLocalWishlist(userId);
    }
  },

  /**
   * Add a product to user wishlist
   */
  async addToWishlist(userId: string, product: Product): Promise<boolean> {
    if (!userId || !product?.id) return false;
    this.addLocalWishlist(userId, product);

    try {
      const { error } = await supabase
        .from("wishlist")
        .insert([{ user_id: userId, product_id: product.id }]);

      if (error) {
        console.warn("Notice: Saved wishlist item to local storage fallback", error.message);
      }
      return true;
    } catch (err) {
      console.warn("Notice: Saved wishlist item to local storage fallback", err);
      return true;
    }
  },

  /**
   * Remove a product from user wishlist
   */
  async removeFromWishlist(userId: string, productId: string): Promise<boolean> {
    if (!userId || !productId) return false;
    this.removeLocalWishlist(userId, productId);

    try {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId);

      if (error) {
        console.warn("Notice: Removed wishlist item from local storage fallback", error.message);
      }
      return true;
    } catch (err) {
      console.warn("Notice: Removed wishlist item from local storage fallback", err);
      return true;
    }
  },

  // Local Storage Fallbacks
  getLocalWishlist(userId: string): Product[] {
    if (!userId) return [];
    try {
      const raw = localStorage.getItem(`${WISHLIST_STORAGE_KEY}_${userId}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  addLocalWishlist(userId: string, product: Product) {
    if (!userId || !product?.id) return;
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
    if (!userId || !productId) return;
    try {
      const current = this.getLocalWishlist(userId);
      const updated = current.filter((p) => p.id !== productId);
      localStorage.setItem(`${WISHLIST_STORAGE_KEY}_${userId}`, JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed to remove item from local storage wishlist", e);
    }
  },
};
