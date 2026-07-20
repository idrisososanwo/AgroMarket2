import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProductCard from "../components/common/ProductCard";
import ProductSkeleton from "../components/common/ProductSkeleton";
import ErrorState from "../components/common/ErrorState";
import { Search, Filter, Sparkles, TrendingUp, ShieldCheck, X, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { CATEGORIES } from "../lib/constants";
import { useProducts } from "../hooks/useProducts";
import { useDebounce } from "../hooks/useDebounce";
import MarketplaceFilterSidebar, { type FilterState } from "../features/marketplace/components/MarketplaceFilterSidebar";
import MarketplaceFilterDrawer from "../features/marketplace/components/MarketplaceFilterDrawer";
import FilterChipsBar from "../features/marketplace/components/FilterChipsBar";
import type { ProductQueryParams } from "../types";

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Read initial states from URL params
  const [searchInput, setSearchInput] = useState<string>(searchParams.get("q") || "");
  const debouncedSearchQuery = useDebounce(searchInput, 250);

  const selectedCategory = searchParams.get("category") || "";
  const selectedLocation = searchParams.get("location") || "";
  const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
  const minRating = searchParams.get("minRating") ? Number(searchParams.get("minRating")) : undefined;
  const inStockOnly = searchParams.get("inStock") === "true";
  const featuredOnly = searchParams.get("featured") === "true";
  const sortBy = (searchParams.get("sort") as ProductQueryParams["sortBy"]) || "newest";

  // Sync debounced search to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedSearchQuery) {
      params.set("q", debouncedSearchQuery);
    } else {
      params.delete("q");
    }
    setSearchParams(params, { replace: true });
  }, [debouncedSearchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  // Helper to update URL search parameters
  const updateUrlParams = (newFilters: Record<string, string | undefined | number | boolean>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val !== undefined && val !== "" && val !== false) {
        params.set(key, String(val));
      } else {
        params.delete(key);
      }
    });
    setSearchParams(params, { replace: true });
  };

  const handleFilterChange = (updates: Partial<FilterState>) => {
    const urlMap: Record<string, string | undefined | number | boolean> = {};
    if ("category" in updates) urlMap.category = updates.category;
    if ("location" in updates) urlMap.location = updates.location;
    if ("minPrice" in updates) urlMap.minPrice = updates.minPrice;
    if ("maxPrice" in updates) urlMap.maxPrice = updates.maxPrice;
    if ("minRating" in updates) urlMap.minRating = updates.minRating;
    if ("inStock" in updates) urlMap.inStock = updates.inStock;
    if ("featured" in updates) urlMap.featured = updates.featured;
    updateUrlParams(urlMap);
  };

  const handleSortChange = (newSort: ProductQueryParams["sortBy"]) => {
    updateUrlParams({ sort: newSort });
  };

  const handleResetFilters = () => {
    setSearchInput("");
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  const filterState: FilterState = useMemo(
    () => ({
      category: selectedCategory,
      location: selectedLocation,
      minPrice,
      maxPrice,
      minRating,
      inStock: inStockOnly,
      featured: featuredOnly,
    }),
    [selectedCategory, selectedLocation, minPrice, maxPrice, minRating, inStockOnly, featuredOnly]
  );

  const queryParams: ProductQueryParams = useMemo(
    () => ({
      searchQuery: debouncedSearchQuery || undefined,
      category: selectedCategory || undefined,
      location: selectedLocation || undefined,
      minPrice,
      maxPrice,
      minRating,
      inStock: inStockOnly ? true : undefined,
      featured: featuredOnly ? true : undefined,
      sortBy,
    }),
    [debouncedSearchQuery, selectedCategory, selectedLocation, minPrice, maxPrice, minRating, inStockOnly, featuredOnly, sortBy]
  );

  const { data: products = [], isLoading, isError, error, refetch } = useProducts(queryParams);

  const activeFiltersCount = [
    Boolean(searchInput),
    Boolean(selectedCategory),
    Boolean(selectedLocation),
    minPrice !== undefined,
    maxPrice !== undefined,
    minRating !== undefined,
    inStockOnly,
    featuredOnly,
  ].filter(Boolean).length;

  return (
    <Layout>
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-950 py-12 sm:py-16 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.1),transparent)]"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1 text-xs font-bold text-emerald-300 mb-4 font-sans">
              <Sparkles className="h-3.5 w-3.5" /> Direct Farm to Table Marketplace
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-sans leading-tight">
              Fresh Local Produce, Straight from Certified Farmers.
            </h1>
            <p className="mt-3 text-sm sm:text-base text-emerald-100/80 font-sans leading-relaxed">
              Explore high-quality grains, fresh organic vegetables, orchard fruits, tubers, and livestock harvested daily across Nigeria.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-emerald-200 font-sans">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Verified Nigerian Producers</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span>Transparent Farm Gate Prices</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Top Controls Bar */}
        <div className="mb-6 rounded-3xl border border-gray-100 bg-white p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-emerald-600" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by produce name, farmer, state, or category..."
                className="w-full rounded-2xl border border-gray-200 py-3 pr-10 pl-11 text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans shadow-2xs"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput("")}
                  className="absolute top-3.5 right-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                  title="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Controls Right */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile Filter Toggle Button */}
              <button
                onClick={() => setIsMobileDrawerOpen(true)}
                className="flex lg:hidden items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all font-sans cursor-pointer shadow-2xs"
              >
                <Filter className="h-4 w-4 text-emerald-600" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-3xs font-extrabold text-white">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Sorting Dropdown */}
              <div className="relative flex-1 md:flex-none">
                <div className="flex items-center gap-1.5 rounded-2xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-bold text-gray-700 shadow-2xs font-sans">
                  <ArrowUpDown className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="hidden sm:inline text-gray-400 font-medium">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value as typeof sortBy)}
                    className="bg-transparent font-bold text-gray-900 focus:outline-none cursor-pointer pr-1"
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="price_asc">Price: Low → High</option>
                    <option value="price_desc">Price: High → Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="best_selling">Best Selling</option>
                    <option value="name_asc">Alphabetical (A–Z)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Category Horizontal Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none border-t border-gray-100">
            <button
              onClick={() => updateUrlParams({ category: "" })}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all font-sans whitespace-nowrap cursor-pointer ${
                selectedCategory === ""
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              🌾 All Produce
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateUrlParams({ category: selectedCategory === cat.id ? "" : cat.id })}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all font-sans whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        <FilterChipsBar
          searchQuery={debouncedSearchQuery}
          category={selectedCategory}
          location={selectedLocation}
          minPrice={minPrice}
          maxPrice={maxPrice}
          minRating={minRating}
          inStock={inStockOnly}
          featured={featuredOnly}
          onRemoveSearch={() => {
            setSearchInput("");
            updateUrlParams({ q: undefined });
          }}
          onRemoveCategory={() => updateUrlParams({ category: undefined })}
          onRemoveLocation={() => updateUrlParams({ location: undefined })}
          onRemovePriceRange={() => updateUrlParams({ minPrice: undefined, maxPrice: undefined })}
          onRemoveRating={() => updateUrlParams({ minRating: undefined })}
          onRemoveInStock={() => updateUrlParams({ inStock: undefined })}
          onRemoveFeatured={() => updateUrlParams({ featured: undefined })}
          onClearAll={handleResetFilters}
          resultCount={products.length}
        />

        {/* Layout: Sidebar + Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Desktop Left Sidebar */}
          <div className="hidden lg:block shrink-0">
            <MarketplaceFilterSidebar
              filters={filterState}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>

          {/* Product Grid Area */}
          <div className="flex-1 w-full min-h-[450px]">
            {isLoading ? (
              <ProductSkeleton count={8} />
            ) : isError ? (
              <ErrorState
                message={error?.message || "Failed to load products from marketplace."}
                onRetry={refetch}
              />
            ) : products.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50/50 p-12 text-center font-sans space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Search className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-gray-900">No Produce Matches Your Search</h3>
                  <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
                    We couldn't find any agricultural items matching your current filters. Try expanding your price range, clearing some filters, or searching for another crop.
                  </p>
                </div>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-all cursor-pointer font-sans"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    <span>Clear All Filters</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} searchQuery={debouncedSearchQuery} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile Filter Slide-over Drawer */}
      <MarketplaceFilterDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        filters={filterState}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        resultCount={products.length}
      />
    </Layout>
  );
}
