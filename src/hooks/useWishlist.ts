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
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, { userId: string; product: Product }, { previousWishlist?: Product[] }>({
    mutationFn: ({ userId, product }) => wishlistService.addToWishlist(userId, product),
    onMutate: async ({ userId, product }) => {
      await queryClient.cancelQueries({ queryKey: WISHLIST_KEYS.user(userId) });
      const previousWishlist = queryClient.getQueryData<Product[]>(WISHLIST_KEYS.user(userId)) || [];
      if (!previousWishlist.some((p) => p.id === product.id)) {
        queryClient.setQueryData<Product[]>(WISHLIST_KEYS.user(userId), [product, ...previousWishlist]);
      }
      return { previousWishlist };
    },
    onError: (_err, variables, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(WISHLIST_KEYS.user(variables.userId), context.previousWishlist);
      }
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_KEYS.user(variables.userId) });
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, { userId: string; productId: string }, { previousWishlist?: Product[] }>({
    mutationFn: ({ userId, productId }) => wishlistService.removeFromWishlist(userId, productId),
    onMutate: async ({ userId, productId }) => {
      await queryClient.cancelQueries({ queryKey: WISHLIST_KEYS.user(userId) });
      const previousWishlist = queryClient.getQueryData<Product[]>(WISHLIST_KEYS.user(userId)) || [];
      queryClient.setQueryData<Product[]>(
        WISHLIST_KEYS.user(userId),
        previousWishlist.filter((p) => p.id !== productId)
      );
      return { previousWishlist };
    },
    onError: (_err, variables, context) => {
      if (context?.previousWishlist) {
        queryClient.setQueryData(WISHLIST_KEYS.user(variables.userId), context.previousWishlist);
      }
    },
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({ queryKey: WISHLIST_KEYS.user(variables.userId) });
    },
  });
}
