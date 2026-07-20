import { supabase } from "../lib/supabase";
import type { RegisterInput } from "../types";

export const authService = {
  /**
   * Register a new user with email, password, and metadata
   */
  async register(input: RegisterInput) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            full_name: input.full_name,
            role: input.role || "buyer",
            phone: input.phone || "",
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (err: unknown) {
      if (err instanceof Error) throw err;
      throw new Error("Failed to register account.", { cause: err });
    }
  },

  /**
   * Sign in user with email and password
   */
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (err: unknown) {
      if (err instanceof Error) throw err;
      throw new Error("Failed to sign in.", { cause: err });
    }
  },

  /**
   * Sign out current user
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
    } catch (err: unknown) {
      if (err instanceof Error) throw err;
      throw new Error("Failed to sign out.", { cause: err });
    }
  },

  /**
   * Get currently authenticated user
   */
  async getCurrentUser() {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw new Error(error.message);
      return data.user;
    } catch (err: unknown) {
      if (err instanceof Error) throw err;
      throw new Error("Failed to get authenticated user.", { cause: err });
    }
  },
};
