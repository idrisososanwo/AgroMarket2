import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProductCard from "../components/common/ProductCard";
import ProductSkeleton from "../components/common/ProductSkeleton";
import ErrorState from "../components/common/ErrorState";
import ProductImage from "../components/common/ProductImage";
import { formatPrice } from "../utils/formatters";


import {
  Star,
  Truck,
  ShieldCheck,
  ShoppingCart,
  ArrowLeft,
  Store,
  MapPin,
  CheckCircle,
  XCircle,
  Plus,
  Minus,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useProduct, useProducts } from "../hooks/useProducts";
import { useAddToCart } from "../hooks/useCart";
import ReviewList from "../features/reviews/components/ReviewList";
import SellerRatingBadge from "../features/reviews/components/SellerRatingBadge";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [quantity, setQuantity] = useState(1);

  // Scroll to top when product ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // Queries
  const { data: product, isLoading, isError, error, refetch } = useProduct(id || "");

  const { data: relatedProducts = [] } = useProducts(
    product ? { category: product.category, limit: 4 } : undefined
  );

  // Mutations
  const addToCartMutation = useAddToCart();

  const isAvailable = product?.inStock !== false && product?.in_stock !== false;

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.info("Please sign in to add items to your cart", {
        action: {
          label: "Sign In",
          onClick: () => navigate("/login"),
        },
      });
      return;
    }

    if (!product || !isAvailable) {
      toast.error("This product is currently unavailable.");
      return;
    }

    addToCartMutation.mutate(
      {
        user_id: user.id,
        product_id: product.id,
        quantity,
      },
      {
        onSuccess: () => {
          toast.success(`Added ${quantity} ${product.unit}(s) of ${product.name} to cart!`);
        },
        onError: (err: Error) => {
          toast.error(err.message || "Failed to add product to cart.");
        },
      }
    );
  };


  if (isLoading) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <ProductSkeleton count={1} />
        </div>
      </Layout>
    );
  }

  if (isError || !product) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 mb-8 font-sans"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Marketplace</span>
          </Link>
          <ErrorState
            message={error?.message || "Product not found or has been removed."}
            onRetry={refetch}
          />
        </div>
      </Layout>
    );
  }

  // Filter out current product from related products
  const filteredRelated = relatedProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 font-sans cursor-pointer transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Marketplace</span>
          </Link>
        </div>

        {/* Main Product Layout Grid */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 mb-16">
          {/* Left Column: Large Image Showcase */}
          <div className="relative flex min-h-[350px] sm:min-h-[450px] items-center justify-center rounded-3xl border border-gray-100 bg-gradient-to-br from-emerald-50/40 via-white to-green-50/20 overflow-hidden shadow-sm">
            <ProductImage
              src={product.image}
              alt={product.name}
              className="h-full max-h-[450px] w-full object-cover rounded-3xl transition-transform duration-500 hover:scale-105"
            />


            {/* Category Tag */}
            <span className="absolute top-5 left-5 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-emerald-800 shadow-sm capitalize font-sans">
              {product.category}
            </span>

            {/* Stock Tag */}
            <span
              className={`absolute top-5 right-5 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold shadow-xs font-sans ${
                isAvailable
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-rose-100 text-rose-800"
              }`}
            >
              {isAvailable ? (
                <>
                  <CheckCircle className="h-4 w-4 text-emerald-600" /> In Stock
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-rose-600" /> Out of Stock
                </>
              )}
            </span>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              {/* Rating */}
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-amber-500 font-sans">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating || 5)
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span>{product.rating ? product.rating.toFixed(1) : "5.0"}</span>
                <span className="text-gray-400 font-normal">
                  ({product.reviews ?? product.reviews_count ?? 0} reviews)
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-sans tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Price & Unit */}
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-700 font-sans">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm font-semibold text-gray-500 font-sans">
                  per {product.unit || "kg"}
                </span>
              </div>


              {/* Description */}
              <p className="mt-6 text-sm sm:text-base text-gray-600 font-sans leading-relaxed">
                {product.description ||
                  "Freshly harvested agricultural product sourced directly from local producers. Quality tested and handled under strict hygiene standards."}
              </p>

              {/* Seller Information Card */}
              <div className="mt-6 rounded-2xl border border-gray-100 bg-emerald-50/30 p-4 sm:p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold text-lg font-sans">
                    <Store className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 font-sans">
                      {product.seller || "Green Valley Organic Farm"}
                    </h4>
                    <p className="text-xs text-gray-500 font-sans flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{product.location || "Verified AgroMarket Supplier"}</span>
                    </p>
                  </div>
                </div>

                <SellerRatingBadge
                  sellerName={product.seller || "Organic Farm Producer"}
                  rating={product.rating || 4.9}
                  totalReviews={product.reviews || 24}
                />
              </div>

              {/* Trust Badges */}
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-b border-gray-100 py-4">
                <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-600 font-sans">
                  <Truck className="h-4 w-4 text-emerald-600" />
                  <span>Fast Local Dispatch</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-600 font-sans">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>100% Organic Quality</span>
                </div>
              </div>
            </div>

            {/* Quantity Selector & Add to Cart Action */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider font-sans">
                  Quantity ({product.unit || "kg"})
                </span>
                <div className="flex items-center rounded-xl border border-gray-200 bg-white shadow-2xs">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2.5 text-gray-500 hover:text-emerald-600 disabled:opacity-30 cursor-pointer"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-gray-900 font-sans">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2.5 text-gray-500 hover:text-emerald-600 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!isAvailable || addToCartMutation.isPending}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-white shadow-md transition-all font-sans cursor-pointer ${
                    isAvailable
                      ? "bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg disabled:opacity-50"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>
                    {addToCartMutation.isPending
                      ? "Adding to Cart..."
                      : `Add ${quantity} to Cart • ${formatPrice(product.price * quantity)}`}

                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mb-16 rounded-3xl border border-gray-100 bg-white p-6 sm:p-10 shadow-xs">
          <ReviewList product={product} />
        </section>


        {/* Related Products Grid */}
        {filteredRelated.length > 0 && (
          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-gray-900 font-sans">
                Related Produce
              </h2>
              <Link
                to="/"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 font-sans"
              >
                View All Marketplace
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredRelated.map((relProduct) => (
                <ProductCard key={relProduct.id} product={relProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
