import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "../services/analytics.service";

export const ANALYTICS_KEYS = {
  seller: (sellerId: string) => ["analytics", "seller", sellerId] as const,
  buyer: (buyerId: string) => ["analytics", "buyer", buyerId] as const,
};

export function useSellerAnalytics(sellerId?: string) {
  return useQuery({
    queryKey: ANALYTICS_KEYS.seller(sellerId || ""),
    queryFn: () => analyticsService.getSellerAnalytics(sellerId!),
    enabled: Boolean(sellerId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useBuyerAnalytics(buyerId?: string) {
  return useQuery({
    queryKey: ANALYTICS_KEYS.buyer(buyerId || ""),
    queryFn: () => analyticsService.getBuyerAnalytics(buyerId!),
    enabled: Boolean(buyerId),
    staleTime: 1000 * 60 * 5,
  });
}
