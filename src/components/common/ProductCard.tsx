import { Link, useNavigate } from "react-router-dom";
import { Star, ShoppingCart, CheckCircle, XCircle, Store, Heart, MapPin } from "lucide-react";

import type { Product } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { useAddToCart } from "../../hooks/useCart";
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from "../../hooks/useWishlist";
import { toast } from "sonner";
import ProductImage from "./ProductImage";
import HighlightText from "./HighlightText";
import { formatPrice } from "../../utils/formatters";

interface ProductCardProps {
  product: Product;
  searchQuery?: string;
}

export default function ProductCard({ product, searchQuery }: ProductCardProps) {

  const navigate = useNavigate();
  const { user } = useAuth();
  const addToCartMutation = useAddToCart();
  const addToWishlistMutation = useAddToWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  const { data: wishlist = [] } = useWishlist(user?.id);
  const isInWishlist = wishlist.some((p) => p.id === product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      toast.info("Please sign in to save items to your wishlist", {
        action: {
          label: "Sign In",
          onClick: () => navigate("/login"),
        },
      });
      return;
    }

    if (isInWishlist) {
      removeFromWishlistMutation.mutate(
        { userId: user.id, productId: product.id },
        {
          onSuccess: () => {
            toast.success(`Removed ${product.name} from wishlist.`);
          },
          onError: (err) => {
            toast.error(err.message || "Could not remove item from wishlist.");
          },
        }
      );
    } else {
      addToWishlistMutation.mutate(
        { userId: user.id, product },
        {
          onSuccess: () => {
            toast.success(`Added ${product.name} to wishlist!`);
          },
          onError: (err) => {
            toast.error(err.message || "Could not add item to wishlist.");
          },
        }
      );
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      toast.info("Please sign in to add items to your cart", {
        action: {
          label: "Sign In",
          onClick: () => navigate("/login"),
        },
      });
      return;
    }

    if (!product.inStock && product.in_stock === false) {
      toast.error("This product is currently out of stock.");
      return;
    }

    addToCartMutation.mutate(
      {
        user_id: user.id,
        product_id: product.id,
        quantity: 1,
      },
      {
        onSuccess: () => {
          toast.success(`Added ${product.name} to cart!`);
        },
        onError: (err) => {
          toast.error(err.message || "Could not add item to cart.");
        },
      }
    );
  };

  const isAvailable = product.inStock !== false && product.in_stock !== false;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div>
        {/* Product Image Header */}
        <Link to={`/product/${product.id}`} className="block">
          <div className="relative mb-4 flex h-48 w-full items-center justify-center rounded-xl bg-emerald-50/50 overflow-hidden transition-colors group-hover:bg-emerald-100/40">
            <ProductImage
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Category Tag */}
            <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-emerald-800 shadow-sm backdrop-blur-xs capitalize font-sans">
              {product.category}
            </span>

            {/* Heart Wishlist Button */}
            <button
              onClick={handleToggleWishlist}
              aria-label={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              className={`absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 cursor-pointer ${
                isInWishlist
                  ? "bg-white text-rose-500 shadow-md scale-105"
                  : "bg-white/85 text-gray-400 hover:bg-white hover:text-rose-500 shadow-xs backdrop-blur-xs hover:scale-110"
              }`}
            >
              <Heart className={`h-4 w-4 transition-colors ${isInWishlist ? "fill-rose-500 text-rose-500" : ""}`} />
            </button>

            {/* Availability Status Badge */}
            <span
              className={`absolute bottom-3 left-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-2xs font-semibold shadow-xs font-sans backdrop-blur-xs ${
                isAvailable
                  ? "bg-emerald-100/90 text-emerald-800"
                  : "bg-rose-100/90 text-rose-800"
              }`}
            >
              {isAvailable ? (
                <>
                  <CheckCircle className="h-3 w-3 text-emerald-600" /> In Stock
                </>
              ) : (
                <>
                  <XCircle className="h-3 w-3 text-rose-600" /> Out of Stock
                </>
              )}
            </span>
          </div>
        </Link>

        {/* Product Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-xs font-semibold text-amber-500 font-sans">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{product.rating ? product.rating.toFixed(1) : "5.0"}</span>
            <span className="text-gray-400">
              ({product.reviews ?? product.reviews_count ?? 0})
            </span>
          </div>

          <Link to={`/product/${product.id}`}>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-emerald-700 transition-colors font-sans">
              <HighlightText text={product.name} highlight={searchQuery} />
            </h3>
          </Link>

          {/* Seller Name & Location */}
          <div className="flex flex-col gap-1 text-xs text-gray-500 font-sans pt-0.5">
            <Link
              to={`/seller/${encodeURIComponent(product.seller_id || product.seller)}`}
              className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <Store className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span className="truncate font-medium hover:underline">
                <HighlightText text={product.seller || "Local Farm Seller"} highlight={searchQuery} />
              </span>
            </Link>

            {product.location && (
              <div className="flex items-center gap-1.5 text-2xs text-gray-400 font-medium">
                <MapPin className="h-3 w-3 text-emerald-600 shrink-0" />
                <span className="truncate">
                  <HighlightText text={product.location} highlight={searchQuery} />
                </span>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Footer: Price & Add to Cart */}
      <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
        <div>
          <span className="text-xs text-gray-400 font-sans block">Price</span>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-extrabold text-emerald-700 font-sans">
              {formatPrice(product.price)}
            </span>

            <span className="text-xs text-gray-500 font-sans">/ {product.unit || "kg"}</span>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!isAvailable || addToCartMutation.isPending}
          className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all font-sans cursor-pointer ${
            isAvailable
              ? "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 hover:shadow-md disabled:opacity-50"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          <ShoppingCart className="h-4 w-4" />
          <span>{addToCartMutation.isPending ? "Adding..." : "Add to Cart"}</span>
        </button>
      </div>
    </div>
  );
}
