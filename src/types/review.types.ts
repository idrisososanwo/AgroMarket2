export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name?: string;
  user_avatar?: string;
  title?: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateReviewInput {
  product_id: string;
  user_id: string;
  user_name?: string;
  title?: string;
  rating: number;
  comment: string;
}

export type UpdateReviewInput = Partial<Pick<Review, "rating" | "title" | "comment">>;
