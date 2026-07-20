export const ROUTES = {
  HOME: "/",
  MARKETPLACE: "/marketplace",
  LOGIN: "/login",
  REGISTER: "/register",
  CART: "/cart",
  WISHLIST: "/wishlist",
  CHECKOUT: "/checkout",
  ORDERS: "/orders",
  PAYMENT: "/payment/:orderId",
  PRODUCT_DETAILS: "/product/:id",
  BUYER_DASHBOARD: "/buyer",
  SELLER_DASHBOARD: "/seller",
  SELLER_PROFILE: "/seller-profile/:sellerId",
  ADMIN_DASHBOARD: "/admin",
} as const;

