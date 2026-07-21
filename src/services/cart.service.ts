import { supabase } from "../lib/supabase";
import type { CartItem, AddToCartInput, UpdateCartQuantityInput } from "../types";

export const cartService = {
  /**
   * Fetch all cart items for a given user
   */
  async getCart(userId: string): Promise<CartItem[]> {
    try {
      const { data, error } = await supabase
        .from("cart_items")
        .select("*, products(*)")
        .eq("user_id", userId);

      if (error) {
        console.error("Error fetching cart items:", error.message);
        throw new Error(`Failed to fetch cart: ${error.message}`);
      }

      return (data || []).map((item) => {
        const product = item.products;
        return {
          id: item.id,
          user_id: item.user_id,
          product_id: item.product_id,
          product: product,
          name: item.name || product?.name || "Product",
          price: item.price ?? product?.price ?? 0,
          unit: item.unit || product?.unit || "kg",
          quantity: item.quantity || 1,
          image: item.image || product?.image || "🌾",
          seller: item.seller || product?.seller || "Farm Seller",
          created_at: item.created_at,
          updated_at: item.updated_at,
        };
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("An unexpected error occurred while fetching cart.", { cause: err });
    }
  },

  /**
   * Add a product to user's cart or increase quantity if item already exists
   */
  async addToCart({ user_id, product_id, quantity = 1 }: AddToCartInput): Promise<CartItem> {
    try {
      // Check if product already exists in cart
      const { data: existingItem } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user_id)
        .eq("product_id", product_id)
        .maybeSingle();

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        return this.updateCartItemQuantity({
          cart_item_id: existingItem.id,
          quantity: newQuantity,
        });
      }

      // Fetch product info to embed snapshot
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq("id", product_id)
        .single();

      if (productError && productError.code !== "PGRST116") {
        console.warn("Product lookup failed when adding to cart:", productError.message);
      }

      const newItemPayload = {
        user_id,
        product_id,
        quantity,
        name: product?.name || "Product",
        price: product?.price || 0,
        unit: product?.unit || "kg",
        image: product?.image || "🌾",
        seller: product?.seller || "Farm Seller",
      };

      const { data, error } = await supabase
        .from("cart_items")
        .insert([newItemPayload])
        .select()
        .single();

      if (error) {
        console.error("Error adding to cart:", error.message);
        throw new Error(`Failed to add product to cart: ${error.message}`);
      }

      return {
        id: data.id,
        user_id: data.user_id,
        product_id: data.product_id,
        name: data.name,
        price: data.price,
        unit: data.unit,
        quantity: data.quantity,
        image: data.image,
        seller: data.seller,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("An unexpected error occurred while adding to cart.", { cause: err });
    }
  },

  /**
   * Update quantity of a specific cart item
   */
  async updateCartItemQuantity({
    cart_item_id,
    quantity,
  }: UpdateCartQuantityInput): Promise<CartItem> {
    try {
      if (quantity <= 0) {
        await this.removeFromCart(cart_item_id);
        throw new Error("Quantity must be greater than zero.");
      }

      const { data, error } = await supabase
        .from("cart_items")
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq("id", cart_item_id)
        .select()
        .single();

      if (error) {
        console.error("Error updating cart quantity:", error.message);
        throw new Error(`Failed to update cart quantity: ${error.message}`);
      }

      return {
        id: data.id,
        user_id: data.user_id,
        product_id: data.product_id,
        name: data.name,
        price: data.price,
        unit: data.unit,
        quantity: data.quantity,
        image: data.image,
        seller: data.seller,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("An unexpected error occurred while updating cart quantity.", { cause: err });
    }
  },

  /**
   * Remove an item from the cart by cart item ID
   */
  async removeFromCart(cartItemId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", cartItemId);

      if (error) {
        console.error("Error removing item from cart:", error.message);
        throw new Error(`Failed to remove item from cart: ${error.message}`);
      }

      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("An unexpected error occurred while removing item from cart.", { cause: err });
    }
  },

  /**
   * Clear all items in the user's cart
   */
  async clearCart(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", userId);

      if (error) {
        console.error("Error clearing cart:", error.message);
        throw new Error(`Failed to clear cart: ${error.message}`);
      }

      return true;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("An unexpected error occurred while clearing cart.", { cause: err });
    }
  },
};
