import { useQuery } from "@tanstack/react-query";
import { sellerService } from "../services/seller.service";

export const SELLER_KEYS = {
  profile: (sellerId: string) => ["seller", "profile", sellerId] as const,
  products: (sellerId: string, query?: string, sort?: string) =>
    ["seller", "products", sellerId, query, sort] as const,
};

export function useSellerProfile(sellerId?: string) {
  return useQuery({
    queryKey: SELLER_KEYS.profile(sellerId || ""),
    queryFn: () => sellerService.getSellerProfile(sellerId!),
    enabled: Boolean(sellerId),
    staleTime: 1000 * 60 * 5,
  });
}

export function useSellerPublicProducts(
  sellerId?: string,
  params?: { searchQuery?: string; sortBy?: "newest" | "price_asc" | "price_desc" | "rating" }
) {
  return useQuery({
    queryKey: SELLER_KEYS.products(sellerId || "", params?.searchQuery, params?.sortBy),
    queryFn: () => sellerService.getSellerProducts(sellerId!, params),
    enabled: Boolean(sellerId),
  });
}
