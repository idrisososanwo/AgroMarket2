export interface SellerProfileData {
  id: string;
  seller_id: string;
  name: string;
  farm_name?: string;
  avatar_url?: string;
  banner_url?: string;
  verified: boolean;
  bio: string;
  location: string;
  phone?: string;
  email?: string;
  whatsapp?: string;
  joined_date: string;
  years_on_platform: string;
  rating: number;
  total_reviews: number;
  total_products: number;
  active_products: number;
  completed_sales: number;
}

export interface SellerContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  seller: SellerProfileData;
}
