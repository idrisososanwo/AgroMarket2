import { Star, Store } from "lucide-react";

interface SellerRatingBadgeProps {
  sellerName: string;
  rating?: number;
  totalReviews?: number;
}

export default function SellerRatingBadge({
  sellerName,
  rating = 4.9,
  totalReviews = 36,
}: SellerRatingBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/40 px-3 py-1.5 font-sans text-xs">
      <Store className="h-4 w-4 text-emerald-600" />
      <span className="font-bold text-gray-900">{sellerName}</span>
      <div className="flex items-center gap-1 text-amber-500 font-bold border-l border-emerald-200/60 pl-2">
        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        <span>{rating.toFixed(1)}</span>
        <span className="text-2xs text-gray-400 font-normal">({totalReviews})</span>
      </div>
    </div>
  );
}
