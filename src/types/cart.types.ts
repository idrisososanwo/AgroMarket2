import type { Product } from "./product.types";

export interface CartItem {
  id: string;
  user_id?: string;
  product_id?: string;
  product?: Product;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  image: string;
  seller: string;
  created_at?: string;
  updated_at?: string;
}

export interface AddToCartInput {
  user_id: string;
  product_id: string;
  quantity?: number;
}

export interface UpdateCartQuantityInput {
  cart_item_id: string;
  quantity: number;
}
