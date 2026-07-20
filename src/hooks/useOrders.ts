import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "../services/order.service";
import type {
  Order,
  CreateOrderInput,
  UpdateOrderStatusInput,
} from "../types";

export const ORDER_KEYS = {
  all: ["orders"] as const,
  buyer: (buyerId: string) => ["orders", "buyer", buyerId] as const,
  seller: (sellerId: string) => ["orders", "seller", sellerId] as const,
  detail: (id: string) => ["orders", "detail", id] as const,
};

/**
 * Reusable hook to fetch buyer orders
 */
export function useBuyerOrders(buyerId?: string) {
  return useQuery<Order[], Error>({
    queryKey: ORDER_KEYS.buyer(buyerId || ""),
    queryFn: () => orderService.getBuyerOrders(buyerId!),
    enabled: Boolean(buyerId),
  });
}

/**
 * Reusable hook to fetch seller orders
 */
export function useSellerOrders(sellerId?: string) {
  return useQuery<Order[], Error>({
    queryKey: ORDER_KEYS.seller(sellerId || ""),
    queryFn: () => orderService.getSellerOrders(sellerId!),
    enabled: Boolean(sellerId),
  });
}

/**
 * Reusable hook to fetch order by ID
 */
export function useOrderDetails(orderId: string) {
  return useQuery<Order | null, Error>({
    queryKey: ORDER_KEYS.detail(orderId),
    queryFn: () => orderService.getOrderById(orderId),
    enabled: Boolean(orderId),
  });
}

/**
 * Hook to create a new order
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation<Order, Error, CreateOrderInput>({
    mutationFn: (input) => orderService.createOrder(input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.buyer(variables.buyer_id) });
      if (variables.seller_id) {
        queryClient.invalidateQueries({ queryKey: ORDER_KEYS.seller(variables.seller_id) });
      }
    },
  });
}

/**
 * Hook to update order status
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation<Order, Error, UpdateOrderStatusInput>({
    mutationFn: (input) => orderService.updateOrderStatus(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.detail(data.id) });
    },
  });
}

/**
 * Hook to cancel an order
 */
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation<Order, Error, string>({
    mutationFn: (orderId) => orderService.cancelOrder(orderId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.detail(data.id) });
    },
  });
}
