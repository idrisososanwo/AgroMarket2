import { z } from "zod";

export const productFormSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a product category"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  stock_quantity: z.coerce.number().min(0, "Quantity cannot be negative"),
  status: z.enum(["Active", "Draft"]),
  image: z.string().min(1, "Product image or emoji icon is required"),
  location: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

export interface SellerStatsData {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  totalRevenue: number;
}
