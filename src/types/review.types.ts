export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name?: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateReviewInput {
  product_id: string;
  user_id: string;
  user_name?: string;
  rating: number;
  comment: string;
}

export type UpdateReviewInput = Partial<Pick<Review, "rating" | "comment">>;
