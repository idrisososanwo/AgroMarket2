import {
  ShoppingBag,
  Package,
  Clock,
  CheckCircle2,
  Heart,
  DollarSign,
  TrendingUp,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice } from "../../../utils/formatters";
import AnalyticsBarChart from "../../../components/charts/AnalyticsBarChart";
import AnalyticsPieChart from "../../../components/charts/AnalyticsPieChart";
import type { BuyerAnalyticsData } from "../../../services/analytics.service";
import ProductCard from "../../../components/common/ProductCard";

interface BuyerAnalyticsViewProps {
  analytics?: BuyerAnalyticsData;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export default function BuyerAnalyticsView({
  analytics,
  isLoading,
  isError,
  onRetry,
}: BuyerAnalyticsViewProps) {
  if (isLoading) {
    return (
      <div className="space-y-8 font-sans">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-gray-200 animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 rounded-3xl bg-gray-200 animate-pulse"></div>
          <div className="h-64 rounded-3xl bg-gray-200 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (isError || !analytics) {
    return (
      <div className="rounded-3xl border border-dashed border-rose-200 bg-rose-50/50 p-10 text-center font-sans space-y-4">
        <AlertTriangle className="h-10 w-10 text-rose-500 mx-auto" />
        <h3 className="text-base font-extrabold text-gray-900">Failed to Load Buyer Analytics</h3>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          We encountered an error fetching your purchase history and analytics. Please try again.
        </p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 font-sans cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Retry Analytics</span>
        </button>
      </div>
    );
  }

  const { summary, charts, activity } = analytics;

  return (
    <div className="space-y-8 font-sans">
      {/* 1. Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Orders */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-3xs font-extrabold uppercase tracking-wider text-gray-400">Total Orders</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-gray-900">{summary.totalOrders}</div>
          <span className="text-3xs text-gray-400">Crop purchases made</span>
        </div>

        {/* Completed Orders */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-3xs font-extrabold uppercase tracking-wider text-gray-400">Completed</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-gray-900">{summary.completedOrders}</div>
          <span className="text-3xs text-teal-600 font-bold">Successfully received</span>
        </div>

        {/* Pending Orders */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-3xs font-extrabold uppercase tracking-wider text-gray-400">In Transit / Pending</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-amber-700">{summary.pendingOrders}</div>
          <span className="text-3xs text-amber-600 font-bold">Active deliveries</span>
        </div>

        {/* Wishlist Items */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-3xs font-extrabold uppercase tracking-wider text-gray-400">Saved Produce</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-gray-900">{summary.wishlistCount}</div>
          <span className="text-3xs text-gray-400">Wishlist items</span>
        </div>

        {/* Total Amount Spent */}
        <div className="col-span-2 sm:col-span-1 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-3xs font-extrabold uppercase tracking-wider text-gray-400">Total Spent</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-emerald-800 truncate">
            {formatPrice(summary.totalSpent)}
          </div>
          <span className="text-3xs text-gray-400 font-mono">
            &approx; {(summary.totalSpent / 1450).toFixed(1)} XLM
          </span>
        </div>
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Spending */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <span>Monthly Spending Breakdown (₦)</span>
              </h3>
              <p className="text-2xs text-gray-500">Your produce purchases over recent months</p>
            </div>
          </div>
          <AnalyticsBarChart data={charts.monthlySpending} height={200} valuePrefix="₦" barColor="bg-emerald-600" />
        </div>

        {/* Purchases by Category */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-2xs space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-emerald-600" />
              <span>Purchases by Crop Category</span>
            </h3>
            <p className="text-2xs text-gray-500">Percentage distribution of bought items</p>
          </div>
          <AnalyticsPieChart data={charts.purchasesByCategory} />
        </div>
      </div>

      {/* 3. Recommended Produce Section */}
      {activity.recommendedProducts.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-gray-900">Recommended Harvests For You</h3>
              <p className="text-xs text-gray-500">Curated organic produce based on your shopping preferences</p>
            </div>

            <Link
              to="/marketplace"
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer font-sans"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activity.recommendedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
