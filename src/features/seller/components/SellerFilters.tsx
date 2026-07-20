import { Search, X } from "lucide-react";
import { CATEGORIES } from "../../../lib/constants";

interface SellerFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  onReset: () => void;
}

export default function SellerFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  sortBy,
  setSortBy,
  onReset,
}: SellerFiltersProps) {
  const isFiltered = Boolean(searchQuery || selectedCategory || selectedStatus || sortBy !== "newest");

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-xs mb-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-3 left-3.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search seller products by name..."
            className="w-full rounded-xl border border-gray-200 py-2.5 pr-8 pl-10 text-xs text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white py-2.5 px-3 text-xs font-semibold text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans cursor-pointer capitalize"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white py-2.5 px-3 text-xs font-semibold text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="draft">Draft Only</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white py-2.5 px-3 text-xs font-semibold text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans cursor-pointer"
          >
            <option value="newest">Sort: Newest</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
          </select>

          {isFiltered && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 rounded-xl bg-gray-100 px-3 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-200 transition-all font-sans cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
