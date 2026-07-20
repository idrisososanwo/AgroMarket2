export const ROUTES = {
  HOME: "/",
  MARKETPLACE: "/marketplace",
  LOGIN: "/login",
  REGISTER: "/register",
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDERS: "/orders",
  PAYMENT: "/payment/:orderId",
  PRODUCT_DETAILS: "/product/:id",
  BUYER_DASHBOARD: "/buyer",
  SELLER_DASHBOARD: "/seller",
  ADMIN_DASHBOARD: "/admin",
} as const;
