import { Package, Truck, CheckCircle2, Clock, XCircle, Eye } from "lucide-react";
import ProductImage from "../../../components/common/ProductImage";
import { formatPrice } from "../../../utils/formatters";

import type { Order } from "../../../types";

interface OrderCardProps {
  order: Order;
  onViewDetails: (order: Order) => void;
}

export default function OrderCard({ order, onViewDetails }: OrderCardProps) {
  const getStatusBadge = () => {
    switch (order.status) {
      case "Delivered":
        return {
          bg: "bg-emerald-100 text-emerald-800 border-emerald-200",
          icon: CheckCircle2,
          iconColor: "text-emerald-600",
        };
      case "Shipped":
        return {
          bg: "bg-blue-100 text-blue-800 border-blue-200",
          icon: Truck,
          iconColor: "text-blue-600",
        };
      case "Processing":
      case "Confirmed":
        return {
          bg: "bg-purple-100 text-purple-800 border-purple-200",
          icon: Package,
          iconColor: "text-purple-600",
        };
      case "Cancelled":
        return {
          bg: "bg-rose-100 text-rose-800 border-rose-200",
          icon: XCircle,
          iconColor: "text-rose-600",
        };
      case "Pending":
      default:
        return {
          bg: "bg-amber-100 text-amber-800 border-amber-200",
          icon: Clock,
          iconColor: "text-amber-600",
        };
    }
  };

  const badge = getStatusBadge();
  const BadgeIcon = badge.icon;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs transition-all hover:shadow-md font-sans space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 font-extrabold text-xs text-emerald-700">
            #{order.id.slice(-4)}
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">Order #{order.id}</h4>
            <span className="text-2xs text-gray-400">Placed on {order.date}</span>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-2xs font-extrabold self-start sm:self-auto ${badge.bg}`}
        >
          <BadgeIcon className={`h-3.5 w-3.5 ${badge.iconColor}`} />
          <span>{order.status}</span>
        </span>
      </div>

      {/* Items List */}
      <div className="space-y-2">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs text-gray-700">
            <div className="flex items-center gap-2 truncate">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-emerald-50 border border-gray-100 overflow-hidden">
                <ProductImage src={item.image} alt={item.name} className="h-full w-full object-cover" />
              </div>
              <span className="font-semibold truncate">{item.name}</span>
              <span className="text-2xs text-gray-400">×{item.qty ?? item.quantity ?? 1}</span>
            </div>
            <span className="font-bold text-gray-900">
              {formatPrice((item.qty ?? item.quantity ?? 1) * item.price)}
            </span>
          </div>
        ))}

      </div>

      {/* Footer Details */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-100 pt-3">
        <div className="text-xs">
          <span className="text-gray-400">Total Amount: </span>
          <span className="text-sm font-extrabold text-emerald-700">{formatPrice(order.total)}</span>

          <span className="text-2xs text-gray-400 block font-mono">
            Tracking: {order.tracking || order.tracking_number}
          </span>
        </div>

        <button
          onClick={() => onViewDetails(order)}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gray-100 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-200 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Eye className="h-4 w-4 text-emerald-600" />
          <span>View Details & Track</span>
        </button>
      </div>
    </div>
  );
}
