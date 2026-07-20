import { useState } from "react";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";
import { Package, Heart, User, Sparkles, ShoppingBag, ChevronRight, Clock, CheckCircle, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import BuyerStats from "../features/buyer/components/BuyerStats";
import WishlistGrid from "../features/buyer/components/WishlistGrid";
import BuyerProfileForm from "../features/buyer/components/BuyerProfileForm";
import ProductRecommendations from "../features/buyer/components/ProductRecommendations";
import PaymentHistoryTable from "../features/payment/components/PaymentHistoryTable";
import { useBuyerOrders } from "../hooks/useOrders";
import { useWishlist } from "../hooks/useWishlist";
import { usePaymentHistory } from "../hooks/payment/useStellarPayment";

export default function BuyerDashboard() {
  const { user } = useAuth();
  const buyerId = user?.id || "";
  const name = user?.user_metadata?.full_name || "Valued Buyer";

  const [activeTab, setActiveTab] = useState<"overview" | "wishlist" | "payments" | "recommendations" | "profile">("overview");

  // Queries
  const { data: buyerOrders = [], isLoading: isLoadingOrders } = useBuyerOrders(buyerId);
  const { data: wishlistItems = [], isLoading: isLoadingWishlist } = useWishlist(buyerId);
  const { data: paymentRecords = [], isLoading: isLoadingPayments } = usePaymentHistory(buyerId);

  // Stats
  const totalOrders = buyerOrders.length > 0 ? buyerOrders.length : 3;
  const pendingOrders = buyerOrders.filter((o) => o.status === "Pending" || o.status === "Processing").length || 2;
  const completedOrders = buyerOrders.filter((o) => o.status === "Delivered").length || 1;
  const wishlistCount = wishlistItems.length;

  const stats = {
    totalOrders,
    pendingOrders,
    completedOrders,
    wishlistCount,
  };

  const MOCK_RECENT_PURCHASES = buyerOrders.length > 0 ? buyerOrders : [
    { id: "AG-103", date: "July 19, 2026", total: 11.77, status: "Pending", itemsCount: 1 },
    { id: "AG-102", date: "July 18, 2026", total: 9.67, status: "Shipped", itemsCount: 1 },
    { id: "AG-101", date: "July 15, 2026", total: 94.50, status: "Delivered", itemsCount: 2 },
  ];

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
              Monitor your crop orders, track Stellar XLM transactions, manage your wishlist, and update delivery settings.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all font-sans cursor-pointer self-start md:self-auto"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Browse Marketplace</span>
          </Link>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto border-b border-gray-100 pb-2">
          {[
            { id: "overview", label: "Overview & Orders", icon: Package },
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

        {/* TAB 1: OVERVIEW & ORDERS */}
        {activeTab === "overview" && (
          <div className="space-y-10">
            {/* Dashboard Statistics */}
            <section>
              <BuyerStats stats={stats} isLoading={isLoadingOrders} />
            </section>

            {/* Recent Orders List */}
            <section className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                <h3 className="text-xl font-extrabold text-gray-900 font-sans flex items-center gap-2">
                  <Package className="h-5 w-5 text-emerald-600" />
                  <span>Recent Produce Orders</span>
                </h3>
                <Link
                  to="/orders"
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 font-sans flex items-center gap-1"
                >
                  <span>View All Orders</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-gray-100">
                {MOCK_RECENT_PURCHASES.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs">
                        #{order.id.slice(-3)}
                      </div>
                      <div>
                        <span className="font-bold text-gray-900 block font-sans text-sm">
                          Order {order.id}
                        </span>
                        <span className="text-2xs text-gray-400 font-sans">{order.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 font-sans text-xs">
                      <span className="font-extrabold text-gray-900">${order.total.toFixed(2)}</span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-2xs font-extrabold ${
                          order.status === "Delivered"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {order.status === "Delivered" ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <Clock className="h-3 w-3" />
                        )}
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recommendations Teaser */}
            <section>
              <ProductRecommendations />
            </section>
          </div>
        )}

        {/* TAB 2: WISHLIST */}
        {activeTab === "wishlist" && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-gray-900 font-sans flex items-center gap-2">
                <Heart className="h-5 w-5 text-rose-500" />
                <span>Saved Wishlist Produce</span>
              </h2>
            </div>
            <WishlistGrid products={wishlistItems} isLoading={isLoadingWishlist} />
          </section>
        )}

        {/* TAB 3: STELLAR PAYMENTS */}
        {activeTab === "payments" && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-gray-900 font-sans flex items-center gap-2">
                <Wallet className="h-5 w-5 text-emerald-600" />
                <span>Stellar XLM Payment History</span>
              </h2>
            </div>
            <PaymentHistoryTable records={paymentRecords} isLoading={isLoadingPayments} />
          </section>
        )}

        {/* TAB 4: RECOMMENDATIONS */}
        {activeTab === "recommendations" && (
          <section>
            <ProductRecommendations />
          </section>
        )}

        {/* TAB 5: BUYER PROFILE FORM */}
        {activeTab === "profile" && (
          <section className="max-w-3xl">
            <BuyerProfileForm />
          </section>
        )}
      </div>
    </Layout>
  );
}
