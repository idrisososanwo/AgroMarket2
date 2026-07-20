import { supabase } from "../lib/supabase";
import type { UserProfile, CreateProfileInput, UpdateProfileInput } from "../types";

export const profileService = {
  /**
   * Get user profile by user_id
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null;
        console.error("Error fetching user profile:", error.message);
        throw new Error(`Failed to fetch user profile: ${error.message}`);
      }

      return data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("An unexpected error occurred while fetching user profile.", { cause: err });
    }
  },

  /**
   * Get profile for currently authenticated user session
   */
  async getCurrentProfile(): Promise<UserProfile | null> {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) return null;

      return this.getProfile(user.id);
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("An unexpected error occurred while retrieving current session profile.", { cause: err });
    }
  },

  /**
   * Create a new user profile record
   */
  async createProfile(input: CreateProfileInput): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .insert([input])
        .select()
        .single();

      if (error) {
        console.error("Error creating user profile:", error.message);
        throw new Error(`Failed to create profile: ${error.message}`);
      }

      return data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("An unexpected error occurred while creating profile.", { cause: err });
    }
  },

  /**
   * Update an existing user profile
   */
  async updateProfile(userId: string, updates: UpdateProfileInput): Promise<UserProfile> {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("user_id", userId)
        .select()
        .single();

      if (error) {
        console.error("Error updating user profile:", error.message);
        throw new Error(`Failed to update profile: ${error.message}`);
      }

      return data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("An unexpected error occurred while updating profile.", { cause: err });
    }
  },

  /**
   * Delete a user profile
   */
  async deleteProfile(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("user_id", userId);

      if (error) {
        console.error("Error deleting user profile:", error.message);
        throw new Error(`Failed to delete profile: ${error.message}`);
      }

      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("An unexpected error occurred while deleting profile.", { cause: err });
    }
  },
};
