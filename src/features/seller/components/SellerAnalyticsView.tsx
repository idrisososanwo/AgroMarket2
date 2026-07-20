import {
  TrendingUp,
  DollarSign,
  Package,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  Star,
  Plus,
  ArrowUpRight,
  RotateCcw,
} from "lucide-react";

import { formatPrice } from "../../../utils/formatters";
import AnalyticsLineChart from "../../../components/charts/AnalyticsLineChart";
import AnalyticsBarChart from "../../../components/charts/AnalyticsBarChart";
import AnalyticsPieChart from "../../../components/charts/AnalyticsPieChart";
import type { SellerAnalyticsData } from "../../../services/analytics.service";
import ProductImage from "../../../components/common/ProductImage";

interface SellerAnalyticsViewProps {
  analytics?: SellerAnalyticsData;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onOpenAddProduct: () => void;
  onNavigateTab: (tab: string) => void;
}

export default function SellerAnalyticsView({
  analytics,
  isLoading,
  isError,
  onRetry,
  onOpenAddProduct,
  onNavigateTab,
}: SellerAnalyticsViewProps) {
  if (isLoading) {
    return (
      <div className="space-y-8 font-sans">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
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
        <h3 className="text-base font-extrabold text-gray-900">Failed to Load Analytics</h3>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          We encountered an error retrieving your store analytics. Please verify your network connection and try again.
        </p>
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-all cursor-pointer font-sans"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Retry Analytics</span>
        </button>
      </div>
    );
  }

  const { summary, charts, tables, insights } = analytics;

  return (
    <div className="space-y-8 font-sans">
      {/* Quick Action Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-950 p-6 text-white shadow-sm">
        <div className="space-y-1">
          <span className="text-2xs font-extrabold uppercase tracking-wider text-emerald-300">
            Producer Analytics & Performance Insights
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Real-Time Farm Sales Overview
          </h2>
          <p className="text-xs text-emerald-100/80 max-w-lg">
            Track revenue growth, monthly crop orders, inventory health, and customer satisfaction metrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenAddProduct}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-emerald-950 shadow-md hover:bg-emerald-400 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Product</span>
          </button>
          <button
            onClick={() => onNavigateTab("products")}
            className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 px-4 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition-all cursor-pointer"
          >
            <Package className="h-4 w-4" />
            <span>Manage Products</span>
          </button>
        </div>
      </div>

      {/* 1. Summary Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Revenue */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-3xs font-extrabold uppercase tracking-wider text-gray-400">Total Revenue</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="text-base sm:text-lg font-extrabold text-gray-900 truncate">
            {formatPrice(summary.totalRevenue)}
          </div>
          <div className="flex items-center text-3xs font-bold text-emerald-600 gap-0.5">
            <ArrowUpRight className="h-3 w-3" />
            <span>+14.2% vs last month</span>
          </div>
        </div>

        {/* Total Products */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-3xs font-extrabold uppercase tracking-wider text-gray-400">Total Products</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="text-base sm:text-lg font-extrabold text-gray-900">{summary.totalProducts}</div>
          <span className="text-3xs text-gray-400">Listed produce items</span>
        </div>

        {/* Total Orders */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-3xs font-extrabold uppercase tracking-wider text-gray-400">Total Orders</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="text-base sm:text-lg font-extrabold text-gray-900">{summary.totalOrders}</div>
          <span className="text-3xs text-gray-400">Lifetime buyer orders</span>
        </div>

        {/* Pending Orders */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-3xs font-extrabold uppercase tracking-wider text-gray-400">Pending Orders</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="text-base sm:text-lg font-extrabold text-amber-700">{summary.pendingOrders}</div>
          <span className="text-3xs text-amber-600 font-bold">Requires dispatch</span>
        </div>

        {/* Completed Orders */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-3xs font-extrabold uppercase tracking-wider text-gray-400">Completed Orders</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-base sm:text-lg font-extrabold text-gray-900">{summary.completedOrders}</div>
          <span className="text-3xs text-teal-600 font-bold">Successfully delivered</span>
        </div>

        {/* Low Stock Alert */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-3xs font-extrabold uppercase tracking-wider text-gray-400">Low Stock Alert</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="text-base sm:text-lg font-extrabold text-rose-700">{summary.lowStockProducts}</div>
          <span className="text-3xs text-rose-600 font-bold">Items &le; 10 units</span>
        </div>
      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart: Monthly Sales Volume */}
        <div className="lg:col-span-2 rounded-3xl border border-gray-100 bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <span>Monthly Orders Volume</span>
              </h3>
              <p className="text-2xs text-gray-500">Order count trend over recent 6 months</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-3xs font-extrabold text-emerald-800">
              6 Months Growth
            </span>
          </div>
          <AnalyticsLineChart data={charts.monthlySales} height={200} />
        </div>

        {/* Donut Chart: Product Category Distribution */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-2xs space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <Package className="h-4 w-4 text-emerald-600" />
              <span>Category Share</span>
            </h3>
            <p className="text-2xs text-gray-500">Listed produce breakdown by type</p>
          </div>
          <AnalyticsPieChart data={charts.categoryDistribution} />
        </div>
      </div>

      {/* Bar Chart: Monthly Revenue */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              <span>Monthly Revenue Breakdown (₦)</span>
            </h3>
            <p className="text-2xs text-gray-500">Total farm revenue generated per month</p>
          </div>
        </div>
        <AnalyticsBarChart data={charts.monthlyRevenue} height={200} valuePrefix="₦" />
      </div>

      {/* 3. Performance Insights Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Highest Selling Product */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs space-y-2">
          <span className="text-3xs font-extrabold uppercase tracking-wider text-emerald-600">
            🥇 Highest Selling Produce
          </span>
          {insights.highestSellingProduct ? (
            <div className="flex items-center gap-3">
              <ProductImage
                src={insights.highestSellingProduct.image}
                alt={insights.highestSellingProduct.name}
                className="h-10 w-10 rounded-xl object-cover"
              />
              <div className="truncate">
                <h4 className="text-xs font-bold text-gray-900 truncate">
                  {insights.highestSellingProduct.name}
                </h4>
                <p className="text-3xs text-gray-500">
                  {insights.highestSellingProduct.reviews ?? insights.highestSellingProduct.reviews_count ?? 0} reviews • {formatPrice(insights.highestSellingProduct.price)}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-400">No sales data yet</p>
          )}
        </div>

        {/* Lowest Selling Product */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs space-y-2">
          <span className="text-3xs font-extrabold uppercase tracking-wider text-amber-600">
            📉 Lowest Volume Produce
          </span>
          {insights.lowestSellingProduct ? (
            <div className="flex items-center gap-3">
              <ProductImage
                src={insights.lowestSellingProduct.image}
                alt={insights.lowestSellingProduct.name}
                className="h-10 w-10 rounded-xl object-cover opacity-80"
              />
              <div className="truncate">
                <h4 className="text-xs font-bold text-gray-900 truncate">
                  {insights.lowestSellingProduct.name}
                </h4>
                <p className="text-3xs text-gray-500">
                  {insights.lowestSellingProduct.reviews ?? 0} reviews • {formatPrice(insights.lowestSellingProduct.price)}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-gray-400">No sales data yet</p>
          )}
        </div>

        {/* Average Rating */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs space-y-2">
          <span className="text-3xs font-extrabold uppercase tracking-wider text-purple-600">
            ⭐ Store Average Rating
          </span>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-gray-900">{insights.avgRating}</span>
            <div className="flex text-amber-400 text-xs">★★★★★</div>
          </div>
          <p className="text-3xs text-gray-400">Customer feedback score</p>
        </div>

        {/* Conversion Rate */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs space-y-2">
          <span className="text-3xs font-extrabold uppercase tracking-wider text-teal-600">
            🎯 Store Conversion Rate
          </span>
          <div className="flex items-center gap-1.5 text-2xl font-extrabold text-gray-900">
            <span>{insights.conversionRate}</span>
            <ArrowUpRight className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="text-3xs text-gray-400">Listing visits into completed orders</p>
        </div>
      </div>

      {/* 4. Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table 1: Best Selling Products */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-600" />
              <span>Top Harvest Products</span>
            </h3>
            <button
              onClick={() => onNavigateTab("products")}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {tables.bestSellingProducts.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">No produce items listed yet</p>
            ) : (
              tables.bestSellingProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between rounded-2xl border border-gray-100 p-3 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all"
                >
                  <div className="flex items-center gap-3 truncate">
                    <ProductImage
                      src={product.image}
                      alt={product.name}
                      className="h-10 w-10 rounded-xl object-cover shrink-0"
                    />
                    <div className="truncate">
                      <h4 className="text-xs font-bold text-gray-900 truncate">{product.name}</h4>
                      <p className="text-3xs text-gray-500 capitalize">{product.category} • {product.unit}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className="text-xs font-extrabold text-emerald-700">{formatPrice(product.price)}</span>
                    <div className="text-3xs font-semibold text-amber-500">★ {product.rating || 5.0}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Table 2: Recent Customer Reviews */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500 fill-amber-400" />
              <span>Recent Customer Feedback</span>
            </h3>
          </div>

          <div className="space-y-3">
            {tables.recentReviews.length === 0 ? (
              <div className="text-center py-6 text-xs text-gray-400">
                No recent reviews submitted yet
              </div>
            ) : (
              tables.recentReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="rounded-2xl border border-gray-100 p-3.5 space-y-1.5 hover:bg-gray-50/60 transition-all"
                >
                  <div className="flex items-center justify-between text-2xs">
                    <span className="font-bold text-gray-900">{rev.user_name || "Verified Buyer"}</span>
                    <div className="flex text-amber-400 font-bold">
                      {"★".repeat(rev.rating)}
                    </div>
                  </div>
                  <h5 className="text-xs font-extrabold text-gray-800">{rev.title}</h5>
                  <p className="text-xs text-gray-600 line-clamp-2">{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
