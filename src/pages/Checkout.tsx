import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import CheckoutStepper from "../features/checkout/components/CheckoutStepper";
import ShippingForm from "../features/checkout/components/ShippingForm";
import DeliveryMethodSelector from "../features/checkout/components/DeliveryMethodSelector";
import PaymentReview from "../features/checkout/components/PaymentReview";
import OrderSummaryCard from "../features/checkout/components/OrderSummaryCard";
import OrderConfirmationModal from "../features/checkout/components/OrderConfirmationModal";
import ProductImage from "../components/common/ProductImage";
import { formatPrice } from "../utils/formatters";

import { ArrowLeft, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useCart, useClearCart } from "../hooks/useCart";
import { useCreateOrder } from "../hooks/useOrders";
import { productService } from "../services/product.service";
import type { ShippingFormData, DeliveryMethod, DeliveryMethodOption, PaymentMethodOption } from "../features/checkout/types/checkout.types";
import type { Order } from "../types";

export default function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userId = user?.id || "";

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(null);
  const [deliveryOption, setDeliveryOption] = useState<DeliveryMethodOption>("standard");
  const [deliveryFee, setDeliveryFee] = useState<number>(5.99);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodOption>("card");
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Queries & Mutations
  const { data: cartItems = [], isLoading: isLoadingCart } = useCart(userId);
  const createOrderMutation = useCreateOrder();
  const clearCartMutation = useClearCart();

  const handleShippingSubmit = (data: ShippingFormData) => {
    setShippingData(data);
    setCurrentStep(3); // Move to Delivery Method
  };

  const handleDeliverySelect = (method: DeliveryMethod) => {
    setDeliveryOption(method.id);
    setDeliveryFee(method.cost);
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Please sign in to place an order.");
      navigate("/login");
      return;
    }

    if (!shippingData) {
      toast.error("Please complete your shipping information.");
      setCurrentStep(2);
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      navigate("/cart");
      return;
    }

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const tax = subtotal * 0.05;
    const total = subtotal + deliveryFee + tax;

    const formattedAddress = `${shippingData.address}, ${shippingData.city}, ${shippingData.state} ${shippingData.postalCode}`;

    createOrderMutation.mutate(
      {
        buyer_id: user.id,
        seller_id: cartItems[0]?.seller || "Farm Producer",
        items: cartItems.map((ci) => ({
          product_id: ci.product_id,
          name: ci.name,
          qty: ci.quantity,
          price: ci.price,
          unit: ci.unit,
          image: ci.image,
        })),
        deliveryCost: deliveryFee,
        tax,
        total,
        shipping_address: formattedAddress,
        shipping_details: {
          fullName: shippingData.fullName,
          phone: shippingData.phone,
          address: shippingData.address,
          city: shippingData.city,
          state: shippingData.state,
          postalCode: shippingData.postalCode,
          notes: shippingData.notes,
        },
        payment_method: paymentMethod.toUpperCase(),
        carrier: deliveryOption === "express" ? "FreshRoute Express" : "AgroExpress Local",
      },
      {
        onSuccess: async (order) => {
          // Reduce product inventory automatically
          for (const item of cartItems) {
            if (item.product_id) {
              try {
                const prod = await productService.getProductById(item.product_id);
                if (prod && prod.stock_quantity !== undefined) {
                  const newStock = Math.max(0, prod.stock_quantity - item.quantity);
                  await productService.updateProduct(item.product_id, {
                    stock_quantity: newStock,
                    inStock: newStock > 0,
                  });
                }
              } catch (e) {
                console.warn("Failed to update inventory count", e);
              }
            }
          }

          // Clear user cart
          clearCartMutation.mutate(user.id);

          setCreatedOrder(order);
          setCurrentStep(5);
          toast.success(`Order ${order.id} confirmed!`);
        },
        onError: (err) => {
          toast.error(err.message || "Failed to place order.");
        },
      }
    );
  };

  if (isLoadingCart) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="h-64 rounded-3xl bg-gray-100 animate-pulse" />
        </div>
      </Layout>
    );
  }

  if (cartItems.length === 0 && currentStep < 5) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 font-sans">No items in your cart</h2>
          <p className="text-xs text-gray-500 font-sans mt-1">Add produce from the marketplace before checking out.</p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 font-sans cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Browse Marketplace</span>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Navigation back */}
        <div className="mb-4">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 font-sans"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Cart</span>
          </Link>
        </div>

        {/* Stepper */}
        <CheckoutStepper currentStep={currentStep} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column: Active Step View */}
          <div className="lg:col-span-2">
            {/* Step 1: Review Cart */}
            {currentStep === 1 && (
              <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900 font-sans border-b border-gray-100 pb-4 mb-2">
                    Step 1: Review Your Cart Items
                  </h3>
                  <p className="text-xs text-gray-500 font-sans">
                    Confirm your selected produce items and quantities before entering shipping details.
                  </p>
                </div>

                <div className="divide-y divide-gray-100">
                  {cartItems.map((item) => (
                    <div key={item.id} className="py-4 flex items-center justify-between gap-4 font-sans text-xs">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 border border-gray-100 overflow-hidden">
                          <ProductImage src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{item.name}</h4>
                          <span className="text-2xs text-gray-500">Seller: {item.seller}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-gray-900 block">
                          {item.quantity} × {formatPrice(item.price)}
                        </span>
                        <span className="font-extrabold text-emerald-700 text-sm">
                          {formatPrice(item.price * item.quantity)}
                        </span>

                      </div>
                    </div>
                  ))}
                </div>


                <div className="flex justify-end border-t border-gray-100 pt-6">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all font-sans cursor-pointer"
                  >
                    <span>Proceed to Shipping Details</span>
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Shipping Form */}
            {currentStep === 2 && (
              <ShippingForm initialData={shippingData} onSubmit={handleShippingSubmit} />
            )}

            {/* Step 3: Delivery Method */}
            {currentStep === 3 && (
              <DeliveryMethodSelector
                selectedMethod={deliveryOption}
                onSelect={handleDeliverySelect}
                onNext={() => setCurrentStep(4)}
                onBack={() => setCurrentStep(2)}
              />
            )}

            {/* Step 4: Payment Review */}
            {currentStep === 4 && shippingData && (
              <PaymentReview
                shippingData={shippingData}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                onPlaceOrder={handlePlaceOrder}
                onBack={() => setCurrentStep(3)}
                isSubmitting={createOrderMutation.isPending}
              />
            )}
          </div>

          {/* Right Column: Order Summary Sidebar */}
          <div>
            <OrderSummaryCard items={cartItems} deliveryFee={deliveryFee} />
          </div>
        </div>

        {/* Confirmation Modal */}
        <OrderConfirmationModal order={createdOrder} />
      </div>
    </Layout>
  );
}
