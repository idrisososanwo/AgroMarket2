import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { recentlyViewedService } from "../services/recentlyViewed.service";
import type { Product } from "../types";

export const RECENTLY_VIEWED_KEYS = ["recently_viewed"] as const;

export function useRecentlyViewed() {
  return useQuery<Product[]>({
    queryKey: RECENTLY_VIEWED_KEYS,
    queryFn: () => recentlyViewedService.getRecentlyViewed(),
  });
}

export function useAddRecentlyViewed() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, Product>({
    mutationFn: async (product) => {
      recentlyViewedService.addRecentlyViewed(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RECENTLY_VIEWED_KEYS });
    },
  });
}
