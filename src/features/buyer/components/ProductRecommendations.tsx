import { useState } from "react";
import ProductCard from "../../../components/common/ProductCard";
import ProductSkeleton from "../../../components/common/ProductSkeleton";
import { useRecentlyViewed } from "../../../hooks/useRecentlyViewed";
import { useProducts } from "../../../hooks/useProducts";
import { Sparkles, Clock, Flame, ThumbsUp } from "lucide-react";

export default function ProductRecommendations() {
  const [activeTab, setActiveTab] = useState<"recently_viewed" | "popular" | "similar">("recently_viewed");

  const { data: recentlyViewed = [] } = useRecentlyViewed();
  const { data: popularProducts = [], isLoading: isLoadingPopular } = useProducts({
    sortBy: "rating",
    limit: 4,
  });
  const { data: similarProducts = [], isLoading: isLoadingSimilar } = useProducts({
    sortBy: "newest",
    limit: 4,
  });

  const getActiveProducts = () => {
    switch (activeTab) {
      case "recently_viewed":
        return recentlyViewed;
      case "popular":
        return popularProducts;
      case "similar":
        return similarProducts;
      default:
        return [];
    }
  };

  const currentList = getActiveProducts();
  const isLoading = activeTab === "popular" ? isLoadingPopular : activeTab === "similar" ? isLoadingSimilar : false;

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-5 mb-6">
        <div>
          <h3 className="text-xl font-extrabold text-gray-900 font-sans flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-600" />
            <span>Recommended Produce for You</span>
          </h3>
          <p className="text-xs text-gray-500 font-sans mt-0.5">
            Handpicked farm recommendations based on your viewing history and seasonal trends.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto rounded-xl bg-gray-100 p-1">
          <button
            onClick={() => setActiveTab("recently_viewed")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all font-sans cursor-pointer whitespace-nowrap ${
              activeTab === "recently_viewed"
                ? "bg-white text-emerald-800 shadow-2xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Recently Viewed ({recentlyViewed.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("popular")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all font-sans cursor-pointer whitespace-nowrap ${
              activeTab === "popular"
                ? "bg-white text-emerald-800 shadow-2xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Flame className="h-3.5 w-3.5" />
            <span>Popular Harvests</span>
          </button>

          <button
            onClick={() => setActiveTab("similar")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all font-sans cursor-pointer whitespace-nowrap ${
              activeTab === "similar"
                ? "bg-white text-emerald-800 shadow-2xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>Similar Produce</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <ProductSkeleton count={4} />
      ) : currentList.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
          <p className="text-xs font-bold text-gray-500 font-sans">
            No products found in this recommendation tab yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {currentList.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
