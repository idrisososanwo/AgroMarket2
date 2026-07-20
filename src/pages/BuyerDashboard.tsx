import { useState } from "react";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";
import { Package, Heart, User, Sparkles, ShoppingBag, ChevronRight, Wallet, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import WishlistGrid from "../features/buyer/components/WishlistGrid";
import BuyerProfileForm from "../features/buyer/components/BuyerProfileForm";
import ProductRecommendations from "../features/buyer/components/ProductRecommendations";
import PaymentHistoryTable from "../features/payment/components/PaymentHistoryTable";
import BuyerAnalyticsView from "../features/buyer/components/BuyerAnalyticsView";
import OrderCard from "../features/orders/components/OrderCard";
import OrderDetailModal from "../features/orders/components/OrderDetailModal";
import { useBuyerOrders } from "../hooks/useOrders";
import { useWishlist } from "../hooks/useWishlist";
import { usePaymentHistory } from "../hooks/payment/useStellarPayment";
import { useBuyerAnalytics } from "../hooks/useAnalytics";
import type { Order } from "../types";

export default function BuyerDashboard() {
  const { user } = useAuth();
  const buyerId = user?.id || "";
  const name = user?.user_metadata?.full_name || "Valued Buyer";

  const [activeTab, setActiveTab] = useState<"analytics" | "orders" | "wishlist" | "payments" | "recommendations" | "profile">("analytics");
  const [orderToView, setOrderToView] = useState<Order | null>(null);

  // Queries
  const { data: buyerOrders = [] } = useBuyerOrders(buyerId);
  const { data: wishlistItems = [] } = useWishlist(buyerId);
  const { data: paymentRecords = [] } = usePaymentHistory(buyerId);
  const {
    data: buyerAnalytics,
    isLoading: isLoadingAnalytics,
    isError: isAnalyticsError,
    refetch: refetchAnalytics,
  } = useBuyerAnalytics(buyerId);

  const wishlistCount = wishlistItems.length;

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Banner */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 font-sans">
              Buyer Portal
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-1 font-sans">
              Welcome back, {name}!
            </h1>
            <p className="text-sm text-gray-500 font-sans mt-0.5">
              Monitor your crop spending, track Stellar XLM payments, manage saved produce, and update profile settings.
            </p>
          </div>

          <Link
            to="/marketplace"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all font-sans cursor-pointer self-start md:self-auto"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Browse Marketplace</span>
          </Link>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto border-b border-gray-100 pb-2">
          {[
            { id: "analytics", label: "Analytics & Spending", icon: BarChart3 },
            { id: "orders", label: `Orders (${buyerOrders.length})`, icon: Package },
            { id: "wishlist", label: `Wishlist (${wishlistCount})`, icon: Heart },
            { id: "payments", label: `Stellar Payments (${paymentRecords.length})`, icon: Wallet },
            { id: "recommendations", label: "Recommended Produce", icon: Sparkles },
            { id: "profile", label: "Profile & Address", icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all font-sans cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: ANALYTICS & SPENDING */}
        {activeTab === "analytics" && (
          <BuyerAnalyticsView
            analytics={buyerAnalytics}
            isLoading={isLoadingAnalytics}
            isError={isAnalyticsError}
            onRetry={refetchAnalytics}
          />
        )}

        {/* TAB 2: ORDERS */}
        {activeTab === "orders" && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-gray-900 font-sans flex items-center gap-2">
                <Package className="h-5 w-5 text-emerald-600" />
                <span>Your Produce Orders</span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                  {buyerOrders.length}
                </span>
              </h2>

              <Link
                to="/marketplace"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-sans"
              >
                <span>Continue Shopping</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {buyerOrders.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50/50 p-12 text-center font-sans space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Package className="h-7 w-7" />
                </div>
                <h3 className="text-base font-extrabold text-gray-900">No Orders Placed Yet</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Explore fresh farm produce on the marketplace and place your first harvest order.
                </p>
                <Link
                  to="/marketplace"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 font-sans"
                >
                  <span>Start Shopping</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {buyerOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onViewDetails={() => setOrderToView(order)}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 3: WISHLIST */}
        {activeTab === "wishlist" && <WishlistGrid products={wishlistItems} />}

        {/* TAB 4: PAYMENTS */}
        {activeTab === "payments" && <PaymentHistoryTable records={paymentRecords} />}

        {/* TAB 5: RECOMMENDATIONS */}
        {activeTab === "recommendations" && <ProductRecommendations />}

        {/* TAB 6: PROFILE */}
        {activeTab === "profile" && <BuyerProfileForm />}

        {/* Order Details Modal */}
        <OrderDetailModal
          order={orderToView}
          onClose={() => setOrderToView(null)}
        />

      </div>
    </Layout>
  );
}
