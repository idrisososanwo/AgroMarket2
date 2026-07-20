export type NotificationType =
  | "order_placed"
  | "payment_success"
  | "order_confirmed"
  | "order_shipped"
  | "order_delivered"
  | "product_approved"
  | "product_rejected"
  | "review_received";

export interface AppNotification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  created_at: string;
}

export interface CreateNotificationInput {
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}
