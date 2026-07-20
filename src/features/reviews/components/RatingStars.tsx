import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export default function RatingStars({
  rating,
  maxStars = 5,
  size = "md",
  interactive = false,
  onRatingChange,
}: RatingStarsProps) {
  const sizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-4 w-4",
    lg: "h-6 w-6",
  }[size];

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxStars }).map((_, idx) => {
        const starValue = idx + 1;
        const isFilled = starValue <= Math.round(rating);

        if (interactive) {
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onRatingChange && onRatingChange(starValue)}
              className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
            >
              <Star
                className={`${sizeClasses} ${
                  isFilled
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300 hover:text-amber-300"
                }`}
              />
            </button>
          );
        }

        return (
          <Star
            key={idx}
            className={`${sizeClasses} ${
              isFilled ? "fill-amber-400 text-amber-400" : "text-gray-300"
            }`}
          />
        );
      })}
    </div>
  );
}
