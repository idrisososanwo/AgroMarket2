export type OrderStatus = "Pending" | "Confirmed" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

export interface OrderItem {
  id?: string;
  order_id?: string;
  product_id?: string;
  name: string;
  qty: number;
  quantity?: number;
  price: number;
  unit?: string;
  image?: string;
}

export interface ShippingDetails {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  notes?: string;
}

export interface Order {
  id: string;
  buyer_id?: string;
  seller_id?: string;
  date: string;
  created_at?: string;
  items: OrderItem[];
  deliveryCost: number;
  delivery_cost?: number;
  tax: number;
  total: number;
  status: OrderStatus;
  statusDesc?: string;
  status_desc?: string;
  carrier?: string;
  tracking?: string;
  tracking_number?: string;
  shipping_address?: string;
  shipping_details?: ShippingDetails;
  payment_method?: string;
  payment_status?: "Paid" | "Pending" | "Failed";
  updated_at?: string;
}

export interface CreateOrderInput {
  buyer_id: string;
  seller_id?: string;
  items: Omit<OrderItem, "id" | "order_id">[];
  deliveryCost: number;
  tax: number;
  total: number;
  shipping_address?: string;
  shipping_details?: ShippingDetails;
  payment_method?: string;
  carrier?: string;
}

export interface UpdateOrderStatusInput {
  order_id: string;
  status: OrderStatus;
  statusDesc?: string;
}
