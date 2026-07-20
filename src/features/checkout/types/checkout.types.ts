import { z } from "zod";

export const shippingFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  address: z.string().min(5, "Delivery address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(3, "Postal code is required"),
  notes: z.string().optional(),
});

export type ShippingFormData = z.infer<typeof shippingFormSchema>;

export type DeliveryMethodOption = "standard" | "express" | "pickup";

export interface DeliveryMethod {
  id: DeliveryMethodOption;
  title: string;
  description: string;
  cost: number;
  estimatedDays: string;
}

export type PaymentMethodOption = "card" | "transfer" | "cod";

export const DELIVERY_OPTIONS: DeliveryMethod[] = [
  {
    id: "standard",
    title: "Standard AgroExpress",
    description: "Eco-friendly temperature-controlled transit to local hub.",
    cost: 5.99,
    estimatedDays: "2 - 3 business days",
  },
  {
    id: "express",
    title: "Express Same-Day Priority",
    description: "Dispatched within 2 hours direct from harvested farm.",
    cost: 12.99,
    estimatedDays: "Same-Day Delivery",
  },
  {
    id: "pickup",
    title: "Farm Location Pickup",
    description: "Self-pickup direct at producer farm gate.",
    cost: 0.0,
    estimatedDays: "Ready tomorrow morning",
  },
];
