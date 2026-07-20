import { User, ShieldCheck, Edit3, Trash2 } from "lucide-react";
import RatingStars from "./RatingStars";
import type { Review } from "../../../types";

interface ReviewCardProps {
  review: Review;
  isOwner?: boolean;
  onEdit?: (review: Review) => void;
  onDelete?: (review: Review) => void;
}

export default function ReviewCard({
  review,
  isOwner = false,
  onEdit,
  onDelete,
}: ReviewCardProps) {
  const formattedDate = review.created_at
    ? new Date(review.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Verified Buyer";

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs font-sans space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs shadow-2xs">
            {review.user_avatar ? (
              <img
                src={review.user_avatar}
                alt={review.user_name || "User"}
                className="h-full w-full object-cover rounded-full"
              />
            ) : (
              <User className="h-5 w-5 text-emerald-600" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 text-sm">
                {review.user_name || "Verified Agro Buyer"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-3xs font-extrabold text-emerald-700">
                <ShieldCheck className="h-3 w-3 text-emerald-600" /> Verified Purchase
              </span>
            </div>
            <span className="text-2xs text-gray-400 block">{formattedDate}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <RatingStars rating={review.rating} size="sm" />

          {isOwner && (
            <div className="flex items-center gap-1 border-l border-gray-100 pl-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(review)}
                  title="Edit Review"
                  className="p-1 text-gray-400 hover:text-emerald-600 cursor-pointer"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(review)}
                  title="Delete Review"
                  className="p-1 text-gray-400 hover:text-rose-600 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-700 leading-relaxed font-sans pt-1">
        {review.comment}
      </p>
    </div>
  );
}
