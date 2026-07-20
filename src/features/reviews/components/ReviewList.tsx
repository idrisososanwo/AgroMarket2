import { useState, useMemo } from "react";
import { Plus, MessageSquare, ChevronDown, SlidersHorizontal } from "lucide-react";
import RatingSummaryCard from "./RatingSummaryCard";
import ReviewCard from "./ReviewCard";
import ReviewFormModal from "./ReviewFormModal";
import type { Review, Product } from "../../../types";
import { useAuth } from "../../../context/AuthContext";
import { useProductReviews, useCreateReview, useUpdateReview, useDeleteReview } from "../../../hooks/useReviews";
import { useBuyerOrders } from "../../../hooks/useOrders";
import { useCreateNotification } from "../../../hooks/useNotifications";
import { toast } from "sonner";

interface ReviewListProps {
  product: Product;
}

type SortOption = "recent" | "highest" | "lowest";

export default function ReviewList({ product }: ReviewListProps) {
  const { user } = useAuth();
  const userId = user?.id || "";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [displayCount, setDisplayCount] = useState(4);
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  // Queries
  const { data: reviews = [], isLoading } = useProductReviews(product.id);
  const { data: buyerOrders = [] } = useBuyerOrders(userId);
  const createNotifMutation = useCreateNotification();

  // Mutations
  const createReviewMutation = useCreateReview();
  const updateReviewMutation = useUpdateReview();
  const deleteReviewMutation = useDeleteReview();

  // Check if current user has purchased this product
  const hasPurchased = buyerOrders.some((order) =>
    order.items.some((item) => item.product_id === product.id || item.name === product.name)
  );

  // Check if user already reviewed
  const userExistingReview = reviews.find((r) => r.user_id === userId);

  // Sorting logic
  const sortedReviews = useMemo(() => {
    const copy = [...reviews];
    if (sortBy === "highest") {
      return copy.sort((a, b) => b.rating - a.rating);
    }
    if (sortBy === "lowest") {
      return copy.sort((a, b) => a.rating - b.rating);
    }
    // "recent" default
    return copy.sort(
      (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );
  }, [reviews, sortBy]);

  const handleOpenCreateModal = () => {
    if (!user) {
      toast.info("Please sign in to post a review.");
      return;
    }

    if (userExistingReview) {
      toast.info("You have already reviewed this product. You can edit your existing review.");
      setEditingReview(userExistingReview);
      setIsModalOpen(true);
      return;
    }

    if (!hasPurchased && buyerOrders.length > 0) {
      toast.info("You can review products you have ordered.", {
        description: "Verified buyer reviews help maintain authentic farm ratings.",
      });
    }

    setEditingReview(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (review: Review) => {
    setEditingReview(review);
    setIsModalOpen(true);
  };

  const handleDeleteReview = (review: Review) => {
    if (confirm("Are you sure you want to delete your review?")) {
      deleteReviewMutation.mutate(
        { id: review.id, productId: product.id },
        {
          onSuccess: () => {
            toast.success("Review deleted successfully.");
          },
          onError: (err) => {
            toast.error(err.message || "Failed to delete review.");
          },
        }
      );
    }
  };

  const handleFormSubmit = ({ rating, title, comment }: { rating: number; title: string; comment: string }) => {
    if (editingReview) {
      updateReviewMutation.mutate(
        {
          id: editingReview.id,
          updates: { rating, title, comment },
        },
        {
          onSuccess: () => {
            toast.success("Review updated successfully!");
            setIsModalOpen(false);
          },
          onError: (err) => {
            toast.error(err.message || "Failed to update review.");
          },
        }
      );
    } else {
      createReviewMutation.mutate(
        {
          product_id: product.id,
          user_id: userId,
          user_name: user?.user_metadata?.full_name || "Verified Agro Buyer",
          title,
          rating,
          comment,
        },
        {
          onSuccess: () => {
            toast.success("Review submitted! Thank you for rating this harvest.");
            setIsModalOpen(false);

            // Notify seller of review
            if (product.seller_id) {
              createNotifMutation.mutate({
                user_id: product.seller_id,
                type: "review_received",
                title: "New Product Review Received",
                message: `A buyer gave ${rating} stars for "${product.name}".`,
              });
            }
          },
          onError: (err) => {
            toast.error(err.message || "Failed to submit review.");
          },
        }
      );
    }
  };

  const visibleReviews = sortedReviews.slice(0, displayCount);
  const isSubmitting = createReviewMutation.isPending || updateReviewMutation.isPending;

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-emerald-600" />
            <span>Customer Reviews & Ratings</span>
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Real feedback from verified buyers who received this produce.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>{userExistingReview ? "Edit Your Review" : "Write a Review"}</span>
        </button>
      </div>

      {/* Summary Breakdown */}
      <RatingSummaryCard reviews={reviews} overallRating={product.rating} />

      {/* Reviews Controls Bar (Sort Selector) */}
      {reviews.length > 0 && (
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <span className="text-xs font-bold text-gray-700 font-sans">
            Showing {Math.min(displayCount, sortedReviews.length)} of {reviews.length} reviews
          </span>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-3.5 w-3.5 text-gray-400" />
            <span className="text-xs text-gray-500 font-medium font-sans">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-700 shadow-2xs focus:border-emerald-500 focus:outline-none cursor-pointer font-sans"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="h-28 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50/50 p-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <MessageSquare className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-gray-900 font-sans">No reviews written yet.</p>
            <p className="text-xs text-gray-500 mt-1 font-sans">
              Be the first verified buyer to share feedback on this harvest!
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-all font-sans cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Write the First Review</span>
            </button>
          </div>
        ) : (
          visibleReviews.map((rev) => (
            <ReviewCard
              key={rev.id}
              review={rev}
              isOwner={rev.user_id === userId}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteReview}
            />
          ))
        )}
      </div>

      {/* Pagination / View More */}
      {sortedReviews.length > displayCount && (
        <div className="text-center pt-2">
          <button
            onClick={() => setDisplayCount((prev) => prev + 4)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all cursor-pointer font-sans"
          >
            <span>Load More Reviews ({sortedReviews.length - displayCount} remaining)</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Review Form Modal */}
      <ReviewFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        reviewToEdit={editingReview}
      />
    </div>
  );
}
