import { X, RotateCcw } from "lucide-react";
import { CATEGORIES } from "../../../lib/constants";
import { formatPrice } from "../../../utils/formatters";

interface FilterChipsBarProps {
  searchQuery: string;
  category: string;
  location: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock: boolean;
  featured: boolean;
  onRemoveSearch: () => void;
  onRemoveCategory: () => void;
  onRemoveLocation: () => void;
  onRemovePriceRange: () => void;
  onRemoveRating: () => void;
  onRemoveInStock: () => void;
  onRemoveFeatured: () => void;
  onClearAll: () => void;
  resultCount: number;
}

export default function FilterChipsBar({
  searchQuery,
  category,
  location,
  minPrice,
  maxPrice,
  minRating,
  inStock,
  featured,
  onRemoveSearch,
  onRemoveCategory,
  onRemoveLocation,
  onRemovePriceRange,
  onRemoveRating,
  onRemoveInStock,
  onRemoveFeatured,
  onClearAll,
  resultCount,
}: FilterChipsBarProps) {
  const categoryObj = CATEGORIES.find((c) => c.id === category);

  const hasActiveFilters = Boolean(
    searchQuery ||
      category ||
      location ||
      minPrice !== undefined ||
      maxPrice !== undefined ||
      minRating !== undefined ||
      inStock ||
      featured
  );

  if (!hasActiveFilters) {
    return (
      <div className="flex items-center justify-between text-xs text-gray-500 font-sans mb-4">
        <span>Showing <strong className="text-gray-900 font-bold">{resultCount}</strong> produce items</span>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs font-sans space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-700">
          Showing <strong className="text-emerald-700 font-extrabold">{resultCount}</strong> matching item{resultCount !== 1 ? "s" : ""}
        </span>

        <button
          onClick={onClearAll}
          className="inline-flex items-center gap-1 text-2xs font-bold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Clear All Filters</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Search Query Chip */}
        {searchQuery && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-2xs font-bold text-emerald-800 border border-emerald-200/60">
            <span>Search: "{searchQuery}"</span>
            <button onClick={onRemoveSearch} className="hover:text-emerald-950 cursor-pointer">
              <X className="h-3 w-3" />
            </button>
          </span>
        )}

        {/* Category Chip */}
        {category && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-2xs font-bold text-emerald-800 border border-emerald-200/60">
            <span>{categoryObj ? `${categoryObj.icon} ${categoryObj.name}` : category}</span>
            <button onClick={onRemoveCategory} className="hover:text-emerald-950 cursor-pointer">
              <X className="h-3 w-3" />
            </button>
          </span>
        )}

        {/* Location Chip */}
        {location && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-2xs font-bold text-blue-800 border border-blue-200/60">
            <span>State: {location}</span>
            <button onClick={onRemoveLocation} className="hover:text-blue-950 cursor-pointer">
              <X className="h-3 w-3" />
            </button>
          </span>
        )}

        {/* Price Range Chip */}
        {(minPrice !== undefined || maxPrice !== undefined) && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-2xs font-bold text-amber-800 border border-amber-200/60">
            <span>
              Price: {minPrice !== undefined ? formatPrice(minPrice) : "₦0"} –{" "}
              {maxPrice !== undefined ? formatPrice(maxPrice) : "Any"}
            </span>
            <button onClick={onRemovePriceRange} className="hover:text-amber-950 cursor-pointer">
              <X className="h-3 w-3" />
            </button>
          </span>
        )}

        {/* Minimum Rating Chip */}
        {minRating !== undefined && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-2xs font-bold text-purple-800 border border-purple-200/60">
            <span>Rating: {minRating}★ & above</span>
            <button onClick={onRemoveRating} className="hover:text-purple-950 cursor-pointer">
              <X className="h-3 w-3" />
            </button>
          </span>
        )}

        {/* In Stock Chip */}
        {inStock && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-2xs font-bold text-teal-800 border border-teal-200/60">
            <span>In Stock Only</span>
            <button onClick={onRemoveInStock} className="hover:text-teal-950 cursor-pointer">
              <X className="h-3 w-3" />
            </button>
          </span>
        )}

        {/* Featured Chip */}
        {featured && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-2xs font-bold text-rose-800 border border-rose-200/60">
            <span>Top Featured Harvests</span>
            <button onClick={onRemoveFeatured} className="hover:text-rose-950 cursor-pointer">
              <X className="h-3 w-3" />
            </button>
          </span>
        )}
      </div>
    </div>
  );
}
