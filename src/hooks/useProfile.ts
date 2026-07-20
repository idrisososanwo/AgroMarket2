import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "../services/profile.service";
import type { UserProfile, UpdateProfileInput } from "../types";

export const PROFILE_KEYS = {
  all: ["profiles"] as const,
  user: (userId: string) => ["profiles", userId] as const,
  current: ["profiles", "current"] as const,
};

/**
 * Hook to fetch profile by user_id
 */
export function useProfile(userId?: string) {
  return useQuery<UserProfile | null, Error>({
    queryKey: PROFILE_KEYS.user(userId || ""),
    queryFn: () => profileService.getProfile(userId!),
    enabled: Boolean(userId),
  });
}

/**
 * Hook to fetch current authenticated user profile
 */
export function useCurrentProfile() {
  return useQuery<UserProfile | null, Error>({
    queryKey: PROFILE_KEYS.current,
    queryFn: () => profileService.getCurrentProfile(),
  });
}

/**
 * Hook to update profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<UserProfile, Error, { userId: string; updates: UpdateProfileInput }>({
    mutationFn: ({ userId, updates }) => profileService.updateProfile(userId, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.user(data.user_id) });
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.current });
    },
  });
}
