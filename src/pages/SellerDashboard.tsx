import { useState } from "react";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";
import { Plus, Package, Store, ShieldCheck, ShoppingBag, BarChart3 } from "lucide-react";

import SellerFilters from "../features/seller/components/SellerFilters";
import SellerProductTable from "../features/seller/components/SellerProductTable";
import ProductFormModal from "../features/seller/components/ProductFormModal";
import ProductDetailModal from "../features/seller/components/ProductDetailModal";
import SellerAnalyticsView from "../features/seller/components/SellerAnalyticsView";
import OrderCard from "../features/orders/components/OrderCard";
import OrderDetailModal from "../features/orders/components/OrderDetailModal";
import { useSellerProducts } from "../hooks/useProducts";
import { useSellerOrders } from "../hooks/useOrders";
import { useSellerAnalytics } from "../hooks/useAnalytics";
import type { Product, Order } from "../types";

export default function SellerDashboard() {
  const { user } = useAuth();
  const farmName = user?.user_metadata?.farm_name || user?.user_metadata?.full_name || "GreenValley Organic Producer";
  const sellerId = user?.id || "seller-1";

  const [activeTab, setActiveTab] = useState<"analytics" | "products" | "orders">("analytics");

  // Data queries
  const { data: sellerProducts = [], isLoading: isLoadingProducts } = useSellerProducts(sellerId);
  const { data: sellerOrders = [] } = useSellerOrders(sellerId);
  const {
    data: analyticsData,
    isLoading: isLoadingAnalytics,
    isError: isAnalyticsError,
    refetch: refetchAnalytics,
  } = useSellerAnalytics(sellerId);

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToView, setProductToView] = useState<Product | null>(null);
  const [orderToView, setOrderToView] = useState<Order | null>(null);

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Filter & Sort Logic
  const filteredProducts = sellerProducts.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = !selectedCategory || p.category.toLowerCase() === selectedCategory.toLowerCase();

    const isAvailable = p.inStock !== false && p.in_stock !== false;
    const matchesStatus =
      !selectedStatus ||
      (selectedStatus === "active" && isAvailable) ||
      (selectedStatus === "draft" && !isAvailable);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (sortBy === "price_asc") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price_desc") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else {
    filteredProducts.sort((a, b) => new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime());
  }

  const handleOpenCreateModal = () => {
    setProductToEdit(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setProductToEdit(product);
    setIsFormOpen(true);
  };

  const handleOpenViewModal = (product: Product) => {
    setProductToView(product);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedStatus("");
    setSortBy("newest");
  };

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-widest font-sans mb-1">
              <Store className="h-3.5 w-3.5" />
              <span>Seller Management Portal</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 font-sans flex items-center gap-2">
              <span>{farmName}</span>
              <ShieldCheck className="h-6 w-6 text-emerald-600" />
            </h1>
            <p className="text-sm text-gray-500 font-sans mt-0.5">
              Monitor sales performance, manage farm catalog, and fulfill crop orders.
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 hover:shadow-lg transition-all font-sans cursor-pointer self-start md:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Produce</span>
          </button>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto border-b border-gray-100 pb-2">
          {[
            { id: "analytics", label: "Analytics & Overview", icon: BarChart3 },
            { id: "products", label: `Inventory (${sellerProducts.length})`, icon: Package },
            { id: "orders", label: `Orders (${sellerOrders.length})`, icon: ShoppingBag },
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

        {/* TAB 1: ANALYTICS & OVERVIEW */}
        {activeTab === "analytics" && (
          <SellerAnalyticsView
            analytics={analyticsData}
            isLoading={isLoadingAnalytics}
            isError={isAnalyticsError}
            onRetry={refetchAnalytics}
            onOpenAddProduct={handleOpenCreateModal}
            onNavigateTab={(t) => setActiveTab(t as typeof activeTab)}
          />
        )}

        {/* TAB 2: INVENTORY MANAGEMENT */}
        {activeTab === "products" && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-gray-900 font-sans flex items-center gap-2">
                <Package className="h-5 w-5 text-emerald-600" />
                <span>Produce Inventory Management</span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                  {filteredProducts.length}
                </span>
              </h2>
            </div>

            <SellerFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              sortBy={sortBy}
              setSortBy={setSortBy}
              onReset={handleResetFilters}
            />

            <SellerProductTable
              products={filteredProducts}
              isLoading={isLoadingProducts}
              onView={handleOpenViewModal}
              onEdit={handleOpenEditModal}
            />
          </section>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {activeTab === "orders" && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-gray-900 font-sans flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-emerald-600" />
                <span>Customer Orders</span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                  {sellerOrders.length}
                </span>
              </h2>
            </div>

            {sellerOrders.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50/50 p-12 text-center font-sans space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <ShoppingBag className="h-7 w-7" />
                </div>
                <h3 className="text-base font-extrabold text-gray-900">No Orders Received Yet</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  As buyers place orders for your produce, they will appear here in real time.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sellerOrders.map((order) => (
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

        {/* Modals */}
        <ProductFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          productToEdit={productToEdit}
        />

        <ProductDetailModal
          product={productToView}
          onClose={() => setProductToView(null)}
        />

        <OrderDetailModal
          order={orderToView}
          onClose={() => setOrderToView(null)}
        />

      </div>
    </Layout>
  );
}
