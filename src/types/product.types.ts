export interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  unit: string;
  rating: number;
  reviews: number;
  reviews_count?: number;
  image: string;
  seller: string;
  seller_id?: string;
  location?: string;
  inStock: boolean;
  in_stock?: boolean;
  stock_quantity?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductQueryParams {
  category?: string;
  searchQuery?: string;
  sellerId?: string;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  minRating?: number;
  featured?: boolean;
  sortBy?: "price_asc" | "price_desc" | "rating" | "newest" | "best_selling" | "name_asc";
  limit?: number;
  offset?: number;
}

export type CreateProductInput = Omit<Product, "id" | "rating" | "reviews" | "created_at" | "updated_at"> & {
  seller_id: string;
};

export type UpdateProductInput = Partial<Omit<Product, "id" | "seller_id" | "created_at" | "updated_at">>;
