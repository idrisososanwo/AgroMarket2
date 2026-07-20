import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { Trash2, ArrowRight, ArrowLeft, ShoppingBag, Plus, Minus, ShieldCheck, Truck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useCart, useUpdateCartQuantity, useRemoveFromCart, useClearCart } from "../hooks/useCart";

export default function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?.id || "";

  const { data: cartItems = [], isLoading, isError, refetch } = useCart(userId);
  const updateQuantityMutation = useUpdateCartQuantity();
  const removeFromCartMutation = useRemoveFromCart();
  const clearCartMutation = useClearCart();

  const handleUpdateQuantity = (cartItemId: string, currentQty: number, change: number) => {
    const newQty = currentQty + change;
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }

    updateQuantityMutation.mutate(
      { cart_item_id: cartItemId, quantity: newQty, userId },
      {
        onError: (err) => toast.error(err.message || "Failed to update quantity."),
      }
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    removeFromCartMutation.mutate(
      { cartItemId, userId },
      {
        onSuccess: () => toast.success("Item removed from cart."),
        onError: (err) => toast.error(err.message || "Failed to remove item."),
      }
    );
  };

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      clearCartMutation.mutate(userId, {
        onSuccess: () => toast.success("Cart cleared."),
        onError: (err) => toast.error(err.message || "Failed to clear cart."),
      });
    }
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryCost = cartItems.length > 0 ? 5.99 : 0;
  const tax = subtotal * 0.05; // 5% tax
  const estimatedTotal = subtotal + deliveryCost + tax;

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 font-sans">
              Shopping Basket
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 font-sans mt-0.5 flex items-center gap-2">
              <span>Your Agricultural Cart</span>
              <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">
                {cartItems.length} items
              </span>
            </h1>
          </div>

          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              disabled={clearCartMutation.isPending}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all font-sans cursor-pointer self-start sm:self-auto"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear Cart</span>
            </button>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="rounded-3xl border border-gray-100 bg-white p-8 animate-pulse space-y-4">
            <div className="h-8 w-1/4 bg-gray-100 rounded-md" />
            <div className="h-20 w-full bg-gray-100 rounded-xl" />
            <div className="h-20 w-full bg-gray-100 rounded-xl" />
          </div>
        ) : isError ? (
          <div className="rounded-3xl border border-rose-100 bg-rose-50/30 p-12 text-center">
            <p className="text-sm font-bold text-rose-700 font-sans">Failed to load cart items.</p>
            <button
              onClick={() => refetch()}
              className="mt-4 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-rose-700 font-sans cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-emerald-50/20 py-16 px-4 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100/60 text-emerald-600">
              <ShoppingBag className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900 font-sans">Your Cart is Empty</h3>
            <p className="mt-2 max-w-md text-sm text-gray-500 font-sans leading-relaxed">
              Explore local farm produce in our marketplace and fill your basket with fresh organic crops.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all font-sans cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Explore Produce Marketplace</span>
            </Link>
          </div>
        ) : (
          /* Cart Grid: Items List + Order Summary */
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Cart Items Column */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-xs transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-4xl border border-gray-100">
                      {item.image.startsWith("data:") || item.image.startsWith("http") ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover rounded-xl" />
                      ) : (
                        <span>{item.image || "🌾"}</span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-gray-900 font-sans">{item.name}</h4>
                      <p className="text-xs text-gray-500 font-sans">Seller: {item.seller}</p>
                      <p className="text-xs font-extrabold text-emerald-700 font-sans mt-1">
                        ${item.price.toFixed(2)} / {item.unit}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Controls & Remove */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                    {/* Quantity Stepper */}
                    <div className="flex items-center rounded-xl border border-gray-200 bg-white shadow-2xs">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                        className="p-2 text-gray-500 hover:text-emerald-600 cursor-pointer"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-gray-900 font-sans">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                        className="p-2 text-gray-500 hover:text-emerald-600 cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Total Price */}
                    <span className="text-base font-extrabold text-gray-900 font-sans w-20 text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      title="Remove item"
                      className="rounded-lg p-2 text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 font-sans cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sticky top-24">
                <h3 className="text-lg font-extrabold text-gray-900 font-sans border-b border-gray-100 pb-4 mb-4">
                  Order Summary
                </h3>

                <div className="space-y-3 text-xs font-sans">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span className="flex items-center gap-1">
                      <Truck className="h-3.5 w-3.5 text-emerald-600" /> Estimated Dispatch
                    </span>
                    <span className="font-bold text-gray-900">${deliveryCost.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Tax (5%)</span>
                    <span className="font-bold text-gray-900">${tax.toFixed(2)}</span>
                  </div>

                  <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-extrabold text-gray-900">
                    <span>Estimated Total</span>
                    <span className="text-emerald-700">${estimatedTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all font-sans cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-2xs font-semibold text-gray-400 font-sans">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Secured AgroMarket Payment Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
