import { Check, ShoppingCart, MapPin, Truck, CreditCard, CheckCircle2 } from "lucide-react";

interface CheckoutStepperProps {
  currentStep: number;
}

const STEPS = [
  { step: 1, label: "Review Cart", icon: ShoppingCart },
  { step: 2, label: "Shipping Info", icon: MapPin },
  { step: 3, label: "Delivery Method", icon: Truck },
  { step: 4, label: "Payment & Review", icon: CreditCard },
  { step: 5, label: "Confirmation", icon: CheckCircle2 },
];

export default function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  return (
    <div className="w-full py-4 mb-8">
      <div className="flex items-center justify-between">
        {STEPS.map((item, idx) => {
          const Icon = item.icon;
          const isCompleted = item.step < currentStep;
          const isCurrent = item.step === currentStep;

          return (
            <div key={item.step} className="flex-1 relative flex flex-col items-center">
              {/* Connector line */}
              {idx > 0 && (
                <div
                  className={`absolute top-4 -left-1/2 w-full h-0.5 -translate-y-1/2 transition-colors duration-300 ${
                    item.step <= currentStep ? "bg-emerald-600" : "bg-gray-200"
                  }`}
                />
              )}

              {/* Step Circle */}
              <div
                className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                  isCompleted
                    ? "bg-emerald-600 text-white shadow-xs"
                    : isCurrent
                    ? "bg-emerald-600 text-white ring-4 ring-emerald-100 shadow-sm"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>

              {/* Label */}
              <span
                className={`mt-2 text-2xs font-bold font-sans hidden sm:block ${
                  isCurrent ? "text-emerald-800" : isCompleted ? "text-gray-700" : "text-gray-400"
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
