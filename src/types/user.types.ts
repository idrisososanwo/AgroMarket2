export type UserRole = "buyer" | "seller" | "admin";

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  farm_name?: string;
  avatar_url?: string;
  phone?: string;
  address?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
}

export type CreateProfileInput = Omit<UserProfile, "id" | "created_at" | "updated_at">;
export type UpdateProfileInput = Partial<Omit<UserProfile, "id" | "user_id" | "created_at" | "updated_at">>;

export interface RegisterInput {
  email: string;
  password: string;
  full_name: string;
  role?: UserRole;
  phone?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
