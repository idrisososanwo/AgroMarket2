import { Link, useNavigate } from "react-router-dom";
import { Star, ShoppingCart, CheckCircle, XCircle, Store } from "lucide-react";
import type { Product } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { useAddToCart } from "../../hooks/useCart";
import { toast } from "sonner";
import ProductImage from "./ProductImage";
import { formatPrice } from "../../utils/formatters";


interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const addToCartMutation = useAddToCart();

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

            {/* Availability Status Badge */}
            <span
              className={`absolute top-3 right-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold shadow-xs font-sans ${
                isAvailable
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-rose-100 text-rose-800"
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
            <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-emerald-700 transition-colors font-sans">
              {product.name}
            </h3>
          </Link>

          {/* Seller Name */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-sans">
            <Store className="h-3.5 w-3.5 text-emerald-600" />
            <span className="truncate font-medium">{product.seller || "Local Farm Seller"}</span>
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
