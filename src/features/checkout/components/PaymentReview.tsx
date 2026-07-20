import { useState } from "react";
import { CreditCard, Landmark, Banknote, Lock, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import type { ShippingFormData, PaymentMethodOption } from "../types/checkout.types";

interface PaymentReviewProps {
  shippingData: ShippingFormData;
  paymentMethod: PaymentMethodOption;
  setPaymentMethod: (method: PaymentMethodOption) => void;
  onPlaceOrder: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export default function PaymentReview({
  shippingData,
  paymentMethod,
  setPaymentMethod,
  onPlaceOrder,
  onBack,
  isSubmitting,
}: PaymentReviewProps) {
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [expiry, setExpiry] = useState("12/28");
  const [cvc, setCvc] = useState("•••");

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs space-y-6">
      <div>
        <h3 className="text-xl font-extrabold text-gray-900 font-sans border-b border-gray-100 pb-4 mb-2">
          Payment Method & Final Review
        </h3>
        <p className="text-xs text-gray-500 font-sans">
          Select how you wish to pay for your harvest order and review your shipping address.
        </p>
      </div>

      {/* Address Review Banner */}
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4 font-sans text-xs">
        <span className="text-2xs font-bold uppercase tracking-wider text-emerald-800 block mb-1">
          Delivering To:
        </span>
        <p className="font-bold text-gray-900">{shippingData.fullName}</p>
        <p className="text-gray-600">{shippingData.address}, {shippingData.city}, {shippingData.state} {shippingData.postalCode}</p>
        <p className="text-gray-500 mt-1">Phone: {shippingData.phone}</p>
      </div>

      {/* Payment Options */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 font-sans">
          Payment Option
        </label>

        {[
          { id: "card", label: "Credit / Debit Card", icon: CreditCard, desc: "Instant secure online payment" },
          { id: "transfer", label: "Direct Farm Bank Transfer", icon: Landmark, desc: "Transfer directly to verified farm account" },
          { id: "cod", label: "Cash on Harvest Delivery", icon: Banknote, desc: "Pay upon physical inspection and arrival" },
        ].map((option) => {
          const Icon = option.icon;
          const isSelected = paymentMethod === option.id;
          return (
            <div
              key={option.id}
              onClick={() => setPaymentMethod(option.id as PaymentMethodOption)}
              className={`flex items-center gap-4 rounded-2xl border p-4 cursor-pointer transition-all ${
                isSelected
                  ? "border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20 shadow-xs"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold transition-colors ${
                  isSelected ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-gray-900 font-sans">{option.label}</h4>
                <p className="text-2xs text-gray-500 font-sans">{option.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Simulated Card Form if Card selected */}
      {paymentMethod === "card" && (
        <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 space-y-3">
          <div>
            <label className="block text-2xs font-bold text-gray-600 font-sans mb-1">Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-2xs font-bold text-gray-600 font-sans mb-1">Expiration</label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
              />
            </div>
            <div>
              <label className="block text-2xs font-bold text-gray-600 font-sans mb-1">CVC Code</label>
              <input
                type="password"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
              />
            </div>
          </div>
        </div>
      )}

      {/* Security note */}
      <div className="flex items-center gap-2 text-2xs font-semibold text-gray-500 font-sans bg-gray-50 p-3 rounded-xl">
        <Lock className="h-3.5 w-3.5 text-emerald-600" />
        <span>256-bit encrypted checkout. Your payment details are protected.</span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-6">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all font-sans cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Delivery</span>
        </button>

        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-7 py-3.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50 transition-all font-sans cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing Order...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Confirm & Place Order</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
