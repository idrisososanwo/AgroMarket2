import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "../services/review.service";
import type { Review, CreateReviewInput, UpdateReviewInput } from "../types";

export const REVIEW_KEYS = {
  all: ["reviews"] as const,
  product: (productId: string) => ["reviews", "product", productId] as const,
  user: (userId: string) => ["reviews", "user", userId] as const,
};

/**
 * Hook to fetch reviews for a specific product
 */
export function useProductReviews(productId?: string) {
  return useQuery<Review[], Error>({
    queryKey: REVIEW_KEYS.product(productId || ""),
    queryFn: () => reviewService.getProductReviews(productId!),
    enabled: Boolean(productId),
  });
}

/**
 * Hook to fetch reviews submitted by a user
 */
export function useUserReviews(userId?: string) {
  return useQuery<Review[], Error>({
    queryKey: REVIEW_KEYS.user(userId || ""),
    queryFn: () => reviewService.getUserReviews(userId!),
    enabled: Boolean(userId),
  });
}

/**
 * Hook to submit a review
 */
export function useCreateReview() {
  const queryClient = useQueryClient();

  return useMutation<Review, Error, CreateReviewInput>({
    mutationFn: (input) => reviewService.createReview(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.product(variables.product_id) });
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.user(variables.user_id) });
    },
  });
}

/**
 * Hook to update a review
 */
export function useUpdateReview() {
  const queryClient = useQueryClient();

  return useMutation<Review, Error, { id: string; updates: UpdateReviewInput }>({
    mutationFn: ({ id, updates }) => reviewService.updateReview(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.all });
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.product(data.product_id) });
    },
  });
}

/**
 * Hook to delete a review
 */
export function useDeleteReview() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, { id: string; productId: string }>({
    mutationFn: ({ id }) => reviewService.deleteReview(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: REVIEW_KEYS.product(variables.productId) });
    },
  });
}
