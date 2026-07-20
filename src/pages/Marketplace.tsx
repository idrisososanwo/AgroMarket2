import { useState } from "react";
import Layout from "../components/layout/Layout";
import ProductCard from "../components/common/ProductCard";
import ProductSkeleton from "../components/common/ProductSkeleton";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";
import { Search, Filter, SlidersHorizontal, Sparkles, TrendingUp, ShieldCheck, X } from "lucide-react";
import { CATEGORIES } from "../lib/constants";
import { useProducts } from "../hooks/useProducts";
import type { ProductQueryParams } from "../types";

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc" | "rating">("newest");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  const queryParams: ProductQueryParams = {
    searchQuery: searchQuery || undefined,
    category: selectedCategory || undefined,
    sortBy,
    inStock: inStockOnly ? true : undefined,
  };

  const { data: products, isLoading, isError, error, refetch } = useProducts(queryParams);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSortBy("newest");
    setInStockOnly(false);
  };

  return (
    <Layout>
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-950 py-16 md:py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.1),transparent)]"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-300 mb-6">
              <Sparkles className="h-3.5 w-3.5" /> Direct Farm to Table Marketplace
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-sans leading-tight">
              Fresh Local Produce, Straight from Certified Farmers.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-emerald-100/80 font-sans leading-relaxed">
              Explore high-quality grains, fresh organic vegetables, orchard fruits, and dairy harvested daily by local agricultural partners.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-emerald-200 font-sans">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Verified Producers</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span>Fair Pricing Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Search & Filter Bar */}
        <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, grains, vegetables, or farm sellers..."
                className="w-full rounded-xl border border-gray-200 py-3 pr-10 pl-11 text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute top-3.5 right-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sort & Quick Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Category Filter Dropdown */}
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pr-8 pl-4 text-sm font-semibold text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans cursor-pointer"
                >
                  <option value="">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By Dropdown */}
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="w-full rounded-xl border border-gray-200 bg-white py-3 pr-8 pl-4 text-sm font-semibold text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans cursor-pointer"
                >
                  <option value="newest">Sort: Newest</option>
                  <option value="price_asc">Sort: Price Low → High</option>
                  <option value="price_desc">Sort: Price High → Low</option>
                  <option value="rating">Sort: Highest Rated</option>
                </select>
              </div>

              {/* In Stock Toggle Button */}
              <button
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold transition-all font-sans cursor-pointer ${
                  inStockOnly
                    ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Filter className="h-4 w-4" />
                <span>In Stock Only</span>
              </button>
            </div>
          </div>

          {/* Quick Category Pills */}
          <div className="mt-5 flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory("")}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all font-sans whitespace-nowrap cursor-pointer ${
                selectedCategory === ""
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All Produce
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all font-sans whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Header Results Counter */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-gray-900 font-sans flex items-center gap-2">
            <span>Marketplace Listings</span>
            {products && (
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                {products.length}
              </span>
            )}
          </h2>

          {(selectedCategory || searchQuery || inStockOnly) && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 font-sans flex items-center gap-1 cursor-pointer"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>

        {/* Content States */}
        {isLoading ? (
          <ProductSkeleton count={8} />
        ) : isError ? (
          <ErrorState
            message={error?.message || "Failed to load products from marketplace."}
            onRetry={refetch}
          />
        ) : !products || products.length === 0 ? (
          <EmptyState onReset={handleResetFilters} />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
}
