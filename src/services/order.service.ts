import { supabase } from "../lib/supabase";
import type {
  Order,
  OrderStatus,
  CreateOrderInput,
  UpdateOrderStatusInput,
} from "../types";

export const orderService = {
  /**
   * Fetch all orders placed by a specific buyer
   */
  async getBuyerOrders(buyerId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("buyer_id", buyerId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching buyer orders:", error.message);
        throw new Error(`Failed to fetch orders: ${error.message}`);
      }

      return (data || []).map((order) => this.mapOrderData(order));
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("An unexpected error occurred while fetching buyer orders.", { cause: err });
    }
  },

  /**
   * Fetch all orders received by a seller
   */
  async getSellerOrders(sellerId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("seller_id", sellerId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching seller orders:", error.message);
        throw new Error(`Failed to fetch seller orders: ${error.message}`);
      }

      return (data || []).map((order) => this.mapOrderData(order));
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("An unexpected error occurred while fetching seller orders.", { cause: err });
    }
  },

  /**
   * Fetch details for a specific order by ID
   */
  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("id", orderId)
        .single();

      if (error) {
        if (error.code === "PGRST116") return null;
        console.error("Error fetching order by ID:", error.message);
        throw new Error(`Failed to fetch order ${orderId}: ${error.message}`);
      }

      if (!data) return null;
      return this.mapOrderData(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("An unexpected error occurred while fetching order details.", { cause: err });
    }
  },

  /**
   * Create a new order with items
   */
  async createOrder(input: CreateOrderInput): Promise<Order> {
    try {
      const orderPayload = {
        buyer_id: input.buyer_id,
        user_id: input.buyer_id,
        seller_id: input.seller_id,
        delivery_cost: input.deliveryCost,
        tax: input.tax,
        total: input.total,
        status: "Pending" as OrderStatus,
        status_desc: "Order received by farm. Preparing for packaging.",
        carrier: input.carrier || "AgroExpress Local",
        tracking_number: `AGR-${Math.floor(100 + Math.random() * 900)}-${Date.now().toString().slice(-3)}`,
        shipping_address: input.shipping_address || "",
        payment_method: input.payment_method || "Card",
      };

      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([orderPayload])
        .select()
        .single();

      if (orderError) {
        console.error("Error creating order:", orderError.message);
        throw new Error(`Failed to create order: ${orderError.message}`);
      }

      // Insert associated order items
      if (input.items && input.items.length > 0) {
        const orderItemsPayload = input.items.map((item) => ({
          order_id: orderData.id,
          product_id: item.product_id,
          name: item.name,
          qty: item.qty ?? item.quantity ?? 1,
          price: item.price,
          unit: item.unit || "kg",
          image: item.image || "🌾",
        }));

        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItemsPayload);

        if (itemsError) {
          console.warn("Failed to insert order items record:", itemsError.message);
        }
      }

      const fullOrder = await this.getOrderById(orderData.id);
      if (!fullOrder) {
        return this.mapOrderData({ ...orderData, order_items: input.items });
      }
      return fullOrder;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("An unexpected error occurred while placing order.", { cause: err });
    }
  },

  /**
   * Update status of an order
   */
  async updateOrderStatus({
    order_id,
    status,
    statusDesc,
  }: UpdateOrderStatusInput): Promise<Order> {
    try {
      const updates: Record<string, unknown> = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (statusDesc) {
        updates.status_desc = statusDesc;
      }

      const { data, error } = await supabase
        .from("orders")
        .update(updates)
        .eq("id", order_id)
        .select("*, order_items(*)")
        .single();

      if (error) {
        console.error("Error updating order status:", error.message);
        throw new Error(`Failed to update order status: ${error.message}`);
      }

      return this.mapOrderData(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error("An unexpected error occurred while updating order status.", { cause: err });
    }
  },


  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string): Promise<Order> {
    return this.updateOrderStatus({
      order_id: orderId,
      status: "Cancelled",
      statusDesc: "Order was cancelled by customer.",
    });
  },

  /**
   * Helper method to convert Supabase order record to UI Order interface
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mapOrderData(data: any): Order {
    const createdDate = data.created_at
      ? new Date(data.created_at).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })
      : data.date || "Recent";

    const items = (data.order_items || data.items || []).map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (item: any) => ({
        id: item.id,
        order_id: item.order_id,
        product_id: item.product_id,
        name: item.name || "Agricultural Product",
        qty: item.qty ?? item.quantity ?? 1,
        price: item.price ?? 0,
        unit: item.unit || "kg",
        image: item.image || "🌾",
      })
    );

    return {
      id: data.id,
      buyer_id: data.buyer_id,
      seller_id: data.seller_id,
      date: createdDate,
      created_at: data.created_at,
      items,
      deliveryCost: data.delivery_cost ?? data.deliveryCost ?? 0,
      delivery_cost: data.delivery_cost ?? data.deliveryCost ?? 0,
      tax: data.tax ?? 0,
      total: data.total ?? 0,
      status: data.status || "Pending",
      statusDesc: data.status_desc ?? data.statusDesc ?? "",
      status_desc: data.status_desc ?? data.statusDesc ?? "",
      carrier: data.carrier || "AgroExpress Local",
      tracking: data.tracking_number ?? data.tracking ?? "",
      tracking_number: data.tracking_number ?? data.tracking ?? "",
      shipping_address: data.shipping_address,
      payment_method: data.payment_method,
      updated_at: data.updated_at,
    };
  },
};
