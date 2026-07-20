import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistService } from "../services/wishlist.service";
import type { Product } from "../types";

export const WISHLIST_KEYS = {
  all: ["wishlist"] as const,
  user: (userId: string) => ["wishlist", userId] as const,
};

export function useWishlist(userId?: string) {
  return useQuery<Product[], Error>({
    queryKey: WISHLIST_KEYS.user(userId || ""),
    queryFn: () => wishlistService.getWishlist(userId!),
    enabled: Boolean(userId),
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, { userId: string; product: Product }>({
    mutationFn: ({ userId, product }) => wishlistService.addToWishlist(userId, product),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_KEYS.user(variables.userId) });
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, { userId: string; productId: string }>({
    mutationFn: ({ userId, productId }) => wishlistService.removeFromWishlist(userId, productId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_KEYS.user(variables.userId) });
    },
  });
}
