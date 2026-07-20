import { supabase } from "../lib/supabase";
import type { Review, CreateReviewInput, UpdateReviewInput } from "../types";

export const reviewService = {
  /**
   * Fetch all reviews submitted for a specific product
   */
  async getProductReviews(productId: string): Promise<Review[]> {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching product reviews:", error.message);
        throw new Error(`Failed to fetch reviews: ${error.message}`);
      }

      return data || [];
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("An unexpected error occurred while fetching reviews.", { cause: err });
    }
  },

  /**
   * Fetch all reviews written by a specific user
   */
  async getUserReviews(userId: string): Promise<Review[]> {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching user reviews:", error.message);
        throw new Error(`Failed to fetch user reviews: ${error.message}`);
      }

      return data || [];
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("An unexpected error occurred while fetching user reviews.", { cause: err });
    }
  },

  /**
   * Fetch a single review by ID
   */
  async getReviewById(id: string): Promise<Review | null> {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null;
        console.error("Error fetching review:", error.message);
        throw new Error(`Failed to fetch review ${id}: ${error.message}`);
      }

      return data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("An unexpected error occurred while fetching review.", { cause: err });
    }
  },

  /**
   * Post a new review for a product
   */
  async createReview(input: CreateReviewInput): Promise<Review> {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .insert([input])
        .select()
        .single();

      if (error) {
        console.error("Error submitting review:", error.message);
        throw new Error(`Failed to submit review: ${error.message}`);
      }

      return data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("An unexpected error occurred while submitting review.", { cause: err });
    }
  },

  /**
   * Update an existing review
   */
  async updateReview(id: string, updates: UpdateReviewInput): Promise<Review> {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating review:", error.message);
        throw new Error(`Failed to update review: ${error.message}`);
      }

      return data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("An unexpected error occurred while updating review.", { cause: err });
    }
  },

  /**
   * Delete a review by ID
   */
  async deleteReview(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("reviews").delete().eq("id", id);

      if (error) {
        console.error("Error deleting review:", error.message);
        throw new Error(`Failed to delete review: ${error.message}`);
      }

      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("An unexpected error occurred while deleting review.", { cause: err });
    }
  },
};
