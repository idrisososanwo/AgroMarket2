import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "../services/product.service";
import type {
  Product,
  ProductQueryParams,
  CreateProductInput,
  UpdateProductInput,
} from "../types";

export const PRODUCT_KEYS = {
  all: ["products"] as const,
  list: (params?: ProductQueryParams) => ["products", "list", params] as const,
  detail: (id: string) => ["products", "detail", id] as const,
  seller: (sellerId: string) => ["products", "seller", sellerId] as const,
};

/**
 * Reusable hook to fetch products with optional parameters
 */
export function useProducts(params?: ProductQueryParams) {
  return useQuery<Product[], Error>({
    queryKey: PRODUCT_KEYS.list(params),
    queryFn: () => productService.getProducts(params),
  });
}

/**
 * Reusable hook to fetch a single product by ID
 */
export function useProduct(id: string) {
  return useQuery<Product | null, Error>({
    queryKey: PRODUCT_KEYS.detail(id),
    queryFn: () => productService.getProductById(id),
    enabled: Boolean(id),
  });
}

/**
 * Reusable hook to fetch seller products
 */
export function useSellerProducts(sellerId?: string) {
  return useQuery<Product[], Error>({
    queryKey: PRODUCT_KEYS.seller(sellerId || ""),
    queryFn: () => productService.getSellerProducts(sellerId!),
    enabled: Boolean(sellerId),
  });
}

/**
 * Hook to create a new product
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, CreateProductInput>({
    mutationFn: (input) => productService.createProduct(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
    },
  });
}

/**
 * Hook to update an existing product
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation<
    Product,
    Error,
    { id: string; updates: UpdateProductInput }
  >({
    mutationFn: ({ id, updates }) => productService.updateProduct(id, updates),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(data.id) });
    },
  });
}

/**
 * Hook to delete a product
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, string>({
    mutationFn: (id) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.all });
    },
  });
}
