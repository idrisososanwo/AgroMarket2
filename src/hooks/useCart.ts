import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "../services/cart.service";
import type { CartItem, AddToCartInput, UpdateCartQuantityInput } from "../types";

export const CART_KEYS = {
  all: ["cart"] as const,
  user: (userId: string) => ["cart", userId] as const,
};

/**
 * Reusable hook to fetch user's cart
 */
export function useCart(userId?: string) {
  return useQuery<CartItem[], Error>({
    queryKey: CART_KEYS.user(userId || ""),
    queryFn: () => cartService.getCart(userId!),
    enabled: Boolean(userId),
  });
}

/**
 * Hook to add item to cart
 */
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation<CartItem, Error, AddToCartInput>({
    mutationFn: (input) => cartService.addToCart(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CART_KEYS.user(variables.user_id) });
    },
  });
}

/**
 * Hook to update item quantity in cart
 */
export function useUpdateCartQuantity() {
  const queryClient = useQueryClient();

  return useMutation<CartItem, Error, UpdateCartQuantityInput & { userId: string }>({
    mutationFn: ({ cart_item_id, quantity }) =>
      cartService.updateCartItemQuantity({ cart_item_id, quantity }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CART_KEYS.user(variables.userId) });
    },
  });
}

/**
 * Hook to remove item from cart
 */
export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, { cartItemId: string; userId: string }>({
    mutationFn: ({ cartItemId }) => cartService.removeFromCart(cartItemId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CART_KEYS.user(variables.userId) });
    },
  });
}

/**
 * Hook to clear cart
 */
export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: (userId) => cartService.clearCart(userId),
    onSuccess: (_, userId) => {
      queryClient.invalidateQueries({ queryKey: CART_KEYS.user(userId) });
    },
  });
}
