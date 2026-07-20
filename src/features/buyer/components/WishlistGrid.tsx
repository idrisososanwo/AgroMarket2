import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, ArrowRight } from "lucide-react";
import type { Product } from "../../../types";
import { useAuth } from "../../../context/AuthContext";
import { useAddToCart } from "../../../hooks/useCart";
import { useRemoveFromWishlist } from "../../../hooks/useWishlist";
import { toast } from "sonner";

interface WishlistGridProps {
  products: Product[];
  isLoading?: boolean;
}

export default function WishlistGrid({ products, isLoading = false }: WishlistGridProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const addToCartMutation = useAddToCart();
  const removeFromWishlistMutation = useRemoveFromWishlist();

  const handleMoveToCart = (product: Product) => {
    if (!user) {
      toast.info("Please sign in to add items to cart.");
      navigate("/login");
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
          removeFromWishlistMutation.mutate({
            userId: user.id,
            productId: product.id,
          });
          toast.success(`Moved ${product.name} to cart!`);
        },
        onError: (err) => {
          toast.error(err.message || "Could not move item to cart.");
        },
      }
    );
  };

  const handleRemove = (product: Product) => {
    if (!user) return;
    removeFromWishlistMutation.mutate(
      {
        userId: user.id,
        productId: product.id,
      },
      {
        onSuccess: () => {
          toast.success(`Removed ${product.name} from wishlist.`);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="h-44 rounded-2xl border border-gray-100 bg-white p-5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-gray-200 bg-rose-50/20 p-12 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
          <Heart className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-gray-900 font-sans">Your Wishlist is Empty</h3>
        <p className="mt-1 text-xs text-gray-500 font-sans">
          Save your favorite produce items while browsing the marketplace to quickly order them later.
        </p>
        <Link
          to="/"
          className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-all font-sans cursor-pointer"
        >
          <span>Browse Marketplace</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-xs transition-all hover:shadow-md"
        >
          <div className="flex gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-4xl border border-gray-100">
              {product.image.startsWith("data:") || product.image.startsWith("http") ? (
                <img src={product.image} alt={product.name} className="h-full w-full object-cover rounded-xl" />
              ) : (
                <span>{product.image || "🌾"}</span>
              )}
            </div>

            <div className="flex-1 space-y-1">
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-2xs font-bold text-emerald-800 font-sans capitalize">
                {product.category}
              </span>
              <h4 className="text-sm font-bold text-gray-900 font-sans line-clamp-1">
                {product.name}
              </h4>
              <p className="text-xs text-gray-500 font-sans">{product.seller}</p>
              <div className="text-sm font-extrabold text-emerald-700 font-sans pt-1">
                ${product.price.toFixed(2)} / {product.unit || "kg"}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3">
            <button
              onClick={() => handleMoveToCart(product)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-all font-sans cursor-pointer"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              <span>Move to Cart</span>
            </button>

            <button
              onClick={() => handleRemove(product)}
              title="Remove from Wishlist"
              className="rounded-xl border border-gray-200 p-2.5 text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
