import { supabase } from "../lib/supabase";
import type { Review, CreateReviewInput, UpdateReviewInput } from "../types";

const REVIEWS_STORAGE_KEY = "agromarket_reviews";

export const reviewService = {
  /**
   * Fetch all reviews submitted for a specific product
   */
  async getProductReviews(productId: string): Promise<Review[]> {
    if (!productId) return [];
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (error || !data) {
        return this.getLocalReviews(productId);
      }

      // Sync local storage cache
      if (data.length > 0) {
        try {
          const allLocal = this.getAllLocalReviews();
          const filteredLocal = allLocal.filter((r) => r.product_id !== productId);
          const updated = [...data, ...filteredLocal];
          localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
        } catch {
          // ignore storage error
        }
        return data;
      }

      return this.getLocalReviews(productId);
    } catch {
      return this.getLocalReviews(productId);
    }
  },

  /**
   * Fetch all reviews written by a specific user
   */
  async getUserReviews(userId: string): Promise<Review[]> {
    if (!userId) return [];
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error || !data) {
        return this.getAllLocalReviews().filter((r) => r.user_id === userId);
      }

      return data;
    } catch {
      return this.getAllLocalReviews().filter((r) => r.user_id === userId);
    }
  },

  /**
   * Post a new review for a product
   */
  async createReview(input: CreateReviewInput): Promise<Review> {
    const newReview: Review = {
      id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      product_id: input.product_id,
      user_id: input.user_id,
      user_name: input.user_name || "Verified Agro Buyer",
      title: input.title || "Great Farm Product",
      rating: input.rating,
      comment: input.comment,
      created_at: new Date().toISOString(),
    };

    this.saveLocalReview(newReview);

    try {
      const { data, error } = await supabase
        .from("reviews")
        .insert([{
          product_id: input.product_id,
          user_id: input.user_id,
          user_name: input.user_name,
          title: input.title,
          rating: input.rating,
          comment: input.comment,
        }])
        .select()
        .single();

      if (error) {
        console.warn("Notice: Review saved to local storage fallback", error.message);
        return newReview;
      }

      return data || newReview;
    } catch (err) {
      console.warn("Notice: Review saved to local storage fallback", err);
      return newReview;
    }
  },

  /**
   * Update an existing review
   */
  async updateReview(id: string, updates: UpdateReviewInput): Promise<Review> {
    this.updateLocalReview(id, updates);

    try {
      const { data, error } = await supabase
        .from("reviews")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error || !data) {
        const local = this.getAllLocalReviews().find((r) => r.id === id);
        if (local) return { ...local, ...updates, updated_at: new Date().toISOString() };
        throw new Error(error?.message || "Failed to update review.");
      }

      return data;
    } catch {
      const local = this.getAllLocalReviews().find((r) => r.id === id);
      if (local) return { ...local, ...updates, updated_at: new Date().toISOString() };
      throw new Error("Failed to update review.");
    }
  },

  /**
   * Delete a review by ID
   */
  async deleteReview(id: string): Promise<boolean> {
    this.deleteLocalReview(id);

    try {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) {
        console.warn("Notice: Deleted review from local storage fallback", error.message);
      }
      return true;
    } catch (err) {
      console.warn("Notice: Deleted review from local storage fallback", err);
      return true;
    }
  },

  // Local Storage Utilities
  getAllLocalReviews(): Review[] {
    try {
      const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  getLocalReviews(productId: string): Review[] {
    return this.getAllLocalReviews().filter((r) => r.product_id === productId);
  },

  saveLocalReview(review: Review) {
    try {
      const all = this.getAllLocalReviews();
      const updated = [review, ...all.filter((r) => r.id !== review.id)];
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed to write review to local storage", e);
    }
  },

  updateLocalReview(id: string, updates: UpdateReviewInput) {
    try {
      const all = this.getAllLocalReviews();
      const updated = all.map((r) =>
        r.id === id ? { ...r, ...updates, updated_at: new Date().toISOString() } : r
      );
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed to update review in local storage", e);
    }
  },

  deleteLocalReview(id: string) {
    try {
      const all = this.getAllLocalReviews();
      const updated = all.filter((r) => r.id !== id);
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed to delete review from local storage", e);
    }
  },
};
