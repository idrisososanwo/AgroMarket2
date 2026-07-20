import { Check, Clock, Package, Truck, CheckCircle2, XCircle } from "lucide-react";
import type { OrderStatus } from "../../../types";

interface OrderTimelineProps {
  status: OrderStatus;
  statusDesc?: string;
  updatedAt?: string;
}

const TIMELINE_STEPS: { status: OrderStatus; label: string; icon: typeof Clock }[] = [
  { status: "Pending", label: "Order Received", icon: Clock },
  { status: "Confirmed", label: "Confirmed by Farm", icon: CheckCircle2 },
  { status: "Processing", label: "Crop Packaging", icon: Package },
  { status: "Shipped", label: "In Transit", icon: Truck },
  { status: "Delivered", label: "Delivered", icon: CheckCircle2 },
];

export default function OrderTimeline({ status, statusDesc, updatedAt }: OrderTimelineProps) {
  if (status === "Cancelled") {
    return (
      <div className="rounded-2xl border border-rose-100 bg-rose-50/40 p-4 font-sans text-xs flex items-center gap-3 text-rose-800">
        <XCircle className="h-6 w-6 text-rose-600 shrink-0" />
        <div>
          <span className="font-bold block text-sm">Order Cancelled</span>
          <p className="text-2xs text-rose-600 mt-0.5">
            {statusDesc || "This order has been cancelled and is no longer being processed."}
          </p>
        </div>
      </div>
    );
  }

  const getStepIndex = (s: OrderStatus) => {
    return TIMELINE_STEPS.findIndex((item) => item.status === s);
  };

  const currentIndex = getStepIndex(status);

  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 font-sans space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-2xs font-extrabold uppercase tracking-wider text-emerald-700">
          Order Status Tracker
        </span>
        {updatedAt && (
          <span className="text-2xs text-gray-400">
            Updated: {new Date(updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
      </div>

      {/* Progress Bar Stepper */}
      <div className="flex items-center justify-between">
        {TIMELINE_STEPS.map((item, idx) => {
          const Icon = item.icon;
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <div key={item.status} className="flex-1 relative flex flex-col items-center">
              {idx > 0 && (
                <div
                  className={`absolute top-3.5 -left-1/2 w-full h-0.5 -translate-y-1/2 transition-colors ${
                    idx <= currentIndex ? "bg-emerald-600" : "bg-gray-200"
                  }`}
                />
              )}

              <div
                className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  isCurrent
                    ? "bg-emerald-600 text-white ring-4 ring-emerald-100"
                    : isCompleted
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
              </div>

              <span
                className={`mt-1.5 text-3xs font-bold text-center hidden sm:block ${
                  isCurrent ? "text-emerald-800" : isCompleted ? "text-gray-700" : "text-gray-400"
                }`}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {statusDesc && (
        <p className="text-xs text-gray-600 bg-white p-3 rounded-xl border border-gray-100 font-sans leading-relaxed">
          <strong className="text-emerald-700 font-bold">Latest Update:</strong> {statusDesc}
        </p>
      )}
    </div>
  );
}
