import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import WishlistGrid from "../features/buyer/components/WishlistGrid";
import { useWishlist } from "../hooks/useWishlist";
import { useAuth } from "../context/AuthContext";
import { Heart, ArrowLeft, ShoppingBag, ShoppingCart } from "lucide-react";

export default function WishlistPage() {
  const { user } = useAuth();
  const { data: wishlist = [], isLoading } = useWishlist(user?.id);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 border-b border-gray-100 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 font-sans"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Marketplace</span>
              </Link>
            </div>
            <h1 className="mt-2 text-3xl font-extrabold text-gray-900 font-sans flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <Heart className="h-6 w-6 fill-rose-500" />
              </span>
              My Saved Produce
            </h1>
            <p className="mt-1 text-sm text-gray-500 font-sans">
              Keep track of your favorite farm items and move them to your cart whenever you are ready to order.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/cart"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all font-sans cursor-pointer shadow-2xs"
            >
              <ShoppingCart className="h-4 w-4 text-emerald-600" />
              <span>View Shopping Cart</span>
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-all font-sans cursor-pointer shadow-sm"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>Explore Marketplace</span>
            </Link>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="min-h-[400px]">
          <WishlistGrid products={wishlist} isLoading={isLoading} />
        </div>
      </div>
    </Layout>
  );
}
