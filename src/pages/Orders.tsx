import { useState } from "react";
import Layout from "../components/layout/Layout";
import OrderCard from "../features/orders/components/OrderCard";
import OrderDetailModal from "../features/orders/components/OrderDetailModal";
import { Package, Search, ShoppingBag, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBuyerOrders, useSellerOrders } from "../hooks/useOrders";
import type { Order } from "../types";

export default function Orders() {
  const { user } = useAuth();
  const userId = user?.id || "";
  const role = user?.user_metadata?.role;
  const isSeller = role === "seller";

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Fetch orders based on role
  const {
    data: buyerOrders = [],
    isLoading: isLoadingBuyer,
    isError: isErrorBuyer,
    refetch: refetchBuyer,
  } = useBuyerOrders(isSeller ? undefined : userId);

  const {
    data: sellerOrders = [],
    isLoading: isLoadingSeller,
    isError: isErrorSeller,
    refetch: refetchSeller,
  } = useSellerOrders(isSeller ? userId : undefined);

  const orders = isSeller ? sellerOrders : buyerOrders;
  const isLoading = isSeller ? isLoadingSeller : isLoadingBuyer;
  const isError = isSeller ? isErrorSeller : isErrorBuyer;
  const refetch = isSeller ? refetchSeller : refetchBuyer;

  // Filter logic
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      !searchQuery ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.tracking && o.tracking.toLowerCase().includes(searchQuery.toLowerCase())) ||
      o.items.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = !statusFilter || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
  };

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 border-b border-gray-100 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 font-sans">
              {isSeller ? "Seller Fulfillments" : "Order Management"}
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 font-sans mt-0.5 flex items-center gap-2">
              <span>{isSeller ? "Received Crop Orders" : "Your Harvest Orders"}</span>
              <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">
                {orders.length}
              </span>
            </h1>
          </div>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all font-sans cursor-pointer self-start sm:self-auto"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Browse Marketplace</span>
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute top-3 left-3.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by order number (e.g. AG-101) or produce name..."
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

            {/* Status Filter Dropdown */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-8 pl-4 text-xs font-semibold text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans cursor-pointer"
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {(searchQuery || statusFilter) && (
                <button
                  onClick={handleResetFilters}
                  className="rounded-xl bg-gray-100 px-3 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-200 transition-all font-sans cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content States */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="h-48 rounded-2xl border border-gray-100 bg-white p-5 animate-pulse"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-3xl border border-rose-100 bg-rose-50/30 p-12 text-center">
            <p className="text-sm font-bold text-rose-700 font-sans">
              Failed to load order history.
            </p>
            <button
              onClick={() => refetch()}
              className="mt-4 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-rose-700 font-sans cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-emerald-50/20 p-12 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <Package className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold text-gray-900 font-sans">
              No matching orders found
            </h3>
            <p className="mt-1 text-xs text-gray-500 font-sans max-w-sm mx-auto">
              {searchQuery || statusFilter
                ? "Try clearing your search filters to view your orders."
                : "You haven't placed any crop orders on AgroMarket yet."}
            </p>

            {(searchQuery || statusFilter) && (
              <button
                onClick={handleResetFilters}
                className="mt-4 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white font-sans"
              >
                Reset Search Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewDetails={(ord) => setSelectedOrder(ord)}
              />
            ))}
          </div>
        )}

        {/* Order Details & Tracking Modal */}
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      </div>
    </Layout>
  );
}
