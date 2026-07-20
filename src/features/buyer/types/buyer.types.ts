import { z } from "zod";

export const buyerProfileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().optional(),
  address: z.string().min(5, "Delivery address must be at least 5 characters"),
  avatar_url: z.string().optional(),
  farm_name: z.string().optional(),
});

export type BuyerProfileFormData = z.infer<typeof buyerProfileSchema>;

export interface BuyerStatsData {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  wishlistCount: number;
}
