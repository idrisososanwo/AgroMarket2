import { useState, useEffect } from "react";
import { X, Send, Loader2 } from "lucide-react";
import RatingStars from "./RatingStars";
import type { Review } from "../../../types";

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  isSubmitting?: boolean;
  reviewToEdit?: Review | null;
}

export default function ReviewFormModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  reviewToEdit,
}: ReviewFormModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRating(reviewToEdit?.rating ?? 5);
      setComment(reviewToEdit?.comment ?? "");
    }
  }, [isOpen, reviewToEdit]);


  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(rating, comment);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans">
      <div className="relative w-full max-w-md rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
          <h3 className="text-xl font-extrabold text-gray-900">
            {reviewToEdit ? "Edit Your Review" : "Write a Product Review"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Stars Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Rating (1 to 5 Stars) *
            </label>
            <RatingStars
              rating={rating}
              size="lg"
              interactive
              onRatingChange={(newRating) => setRating(newRating)}
            />
          </div>

          {/* Comment Area */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Your Written Review *
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe crop freshness, packaging quality, taste, and delivery experience..."
              className="w-full rounded-xl border border-gray-200 p-3 text-xs text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
              required
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !comment.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span>{reviewToEdit ? "Save Review" : "Submit Review"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
