import { Truck, Check, ArrowRight, ArrowLeft } from "lucide-react";
import { DELIVERY_OPTIONS, type DeliveryMethod, type DeliveryMethodOption } from "../types/checkout.types";

interface DeliveryMethodSelectorProps {
  selectedMethod: DeliveryMethodOption;
  onSelect: (method: DeliveryMethod) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function DeliveryMethodSelector({
  selectedMethod,
  onSelect,
  onNext,
  onBack,
}: DeliveryMethodSelectorProps) {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs space-y-6">
      <div>
        <h3 className="text-xl font-extrabold text-gray-900 font-sans border-b border-gray-100 pb-4 mb-2">
          Select Delivery Method
        </h3>
        <p className="text-xs text-gray-500 font-sans">
          Choose how you would like your fresh farm produce delivered.
        </p>
      </div>

      <div className="space-y-4">
        {DELIVERY_OPTIONS.map((option) => {
          const isSelected = selectedMethod === option.id;
          return (
            <div
              key={option.id}
              onClick={() => onSelect(option)}
              className={`flex items-center justify-between rounded-2xl border p-5 cursor-pointer transition-all ${
                isSelected
                  ? "border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20 shadow-xs"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold transition-colors ${
                    isSelected ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {isSelected ? <Check className="h-5 w-5" /> : <Truck className="h-5 w-5" />}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-900 font-sans">{option.title}</h4>
                  <p className="text-xs text-gray-500 font-sans mt-0.5">{option.description}</p>
                  <span className="text-2xs font-semibold text-emerald-700 font-sans block mt-1">
                    Est: {option.estimatedDays}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-base font-extrabold text-gray-900 font-sans">
                  {option.cost === 0 ? "FREE" : `$${option.cost.toFixed(2)}`}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-6">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all font-sans cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Shipping</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all font-sans cursor-pointer"
        >
          <span>Continue to Payment</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
