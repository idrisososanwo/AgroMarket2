import RatingStars from "./RatingStars";
import type { Review } from "../../../types";

interface RatingSummaryCardProps {
  reviews: Review[];
  overallRating?: number;
}

export default function RatingSummaryCard({ reviews, overallRating }: RatingSummaryCardProps) {
  const totalReviews = reviews.length;

  const averageRating = totalReviews > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
    : overallRating || 5.0;

  const counts = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  return (
    <div className="rounded-3xl border border-gray-100 bg-emerald-50/20 p-6 sm:p-8 font-sans space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-gray-100 pb-6">
        {/* Rating Score */}
        <div className="flex items-center gap-4">
          <div className="text-5xl font-black text-gray-900">
            {averageRating.toFixed(1)}
          </div>
          <div>
            <RatingStars rating={averageRating} size="lg" />
            <span className="text-xs font-semibold text-gray-500 block mt-1">
              Based on {totalReviews} customer review{totalReviews !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="text-2xs font-extrabold uppercase tracking-widest text-emerald-800 bg-white px-3.5 py-1.5 rounded-full border border-emerald-100 shadow-2xs self-start sm:self-auto">
          Verified Buyer Ratings
        </div>
      </div>

      {/* Distribution Bars */}
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((starKey) => {
          const count = counts[starKey as keyof typeof counts] || (totalReviews === 0 && starKey === 5 ? 1 : 0);
          const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : starKey === 5 ? 100 : 0;

          return (
            <div key={starKey} className="flex items-center gap-3 text-xs">
              <span className="w-8 font-bold text-gray-700">{starKey} ★</span>
              <div className="flex-1 h-2.5 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="w-10 text-right text-2xs font-semibold text-gray-400">
                {percent}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
