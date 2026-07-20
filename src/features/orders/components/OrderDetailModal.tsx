import { useState } from "react";
import { X, Package, MapPin, CreditCard, Ban } from "lucide-react";
import OrderTimeline from "./OrderTimeline";
import type { Order, OrderStatus } from "../../../types";
import { useAuth } from "../../../context/AuthContext";
import { useUpdateOrderStatus, useCancelOrder } from "../../../hooks/useOrders";
import { toast } from "sonner";

interface OrderDetailModalProps {
  order: Order | null;
  onClose: () => void;
}

const ALL_STATUSES: OrderStatus[] = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const { user } = useAuth();
  const userRole = user?.user_metadata?.role;
  const isSeller = userRole === "seller" || userRole === "admin";

  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order?.status || "Pending");
  const [statusNote, setStatusNote] = useState("");

  const updateStatusMutation = useUpdateOrderStatus();
  const cancelOrderMutation = useCancelOrder();

  if (!order) return null;

  const canCancel = !isSeller && (order.status === "Pending" || order.status === "Processing" || order.status === "Confirmed");

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    updateStatusMutation.mutate(
      {
        order_id: order.id,
        status: selectedStatus,
        statusDesc: statusNote || `Order status updated to ${selectedStatus}`,
      },
      {
        onSuccess: () => {
          toast.success(`Order status updated to ${selectedStatus}!`);
          onClose();
        },
        onError: (err) => {
          toast.error(err.message || "Failed to update order status.");
        },
      }
    );
  };

  const handleCancelOrder = () => {
    if (confirm("Are you sure you want to cancel this order?")) {
      cancelOrderMutation.mutate(order.id, {
        onSuccess: () => {
          toast.success("Order has been cancelled.");
          onClose();
        },
        onError: (err) => {
          toast.error(err.message || "Failed to cancel order.");
        },
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl sm:p-8 max-h-[90vh] overflow-y-auto font-sans">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
          <div>
            <span className="text-2xs font-bold uppercase tracking-wider text-emerald-600">
              Order Details & Tracking
            </span>
            <h3 className="text-2xl font-extrabold text-gray-900 mt-0.5">
              Order #{order.id}
            </h3>
            <span className="text-2xs text-gray-400">Placed on {order.date}</span>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Timeline Component */}
        <div className="mb-6">
          <OrderTimeline
            status={order.status}
            statusDesc={order.statusDesc || order.status_desc}
            updatedAt={order.updated_at}
          />
        </div>

        {/* Items List */}
        <div className="mb-6 rounded-2xl border border-gray-100 p-5 bg-gray-50/50 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
            <Package className="h-4 w-4 text-emerald-600" />
            <span>Ordered Items ({order.items.length})</span>
          </h4>

          <div className="divide-y divide-gray-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-2xl select-none">{item.image || "🌾"}</span>
                  <div>
                    <span className="font-bold text-gray-900 block">{item.name}</span>
                    <span className="text-2xs text-gray-500">
                      Qty: {item.qty ?? item.quantity ?? 1} × ${item.price.toFixed(2)}
                    </span>
                  </div>
                </div>
                <span className="font-extrabold text-gray-900">
                  ${((item.qty ?? item.quantity ?? 1) * item.price).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Totals */}
          <div className="border-t border-gray-200/60 pt-3 space-y-1.5 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Delivery Cost:</span>
              <span className="font-bold text-gray-900">${(order.deliveryCost || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes:</span>
              <span className="font-bold text-gray-900">${(order.tax || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-1">
              <span>Grand Total:</span>
              <span className="text-emerald-700">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Meta */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
          <div className="rounded-2xl border border-gray-100 p-4 bg-white space-y-1">
            <h5 className="text-2xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-emerald-600" />
              <span>Shipping Information</span>
            </h5>
            <p className="text-xs font-bold text-gray-900">
              {order.shipping_details?.fullName || "Valued Customer"}
            </p>
            <p className="text-xs text-gray-600">
              {order.shipping_address || "Standard Local Delivery Address"}
            </p>
            {order.shipping_details?.phone && (
              <p className="text-2xs text-gray-500">Phone: {order.shipping_details.phone}</p>
            )}
          </div>

          <div className="rounded-2xl border border-gray-100 p-4 bg-white space-y-1">
            <h5 className="text-2xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
              <CreditCard className="h-3.5 w-3.5 text-emerald-600" />
              <span>Payment & Carrier</span>
            </h5>
            <p className="text-xs font-bold text-gray-900">
              Payment: {order.payment_method || "CARD"}
            </p>
            <p className="text-xs text-gray-600">
              Carrier: {order.carrier || "AgroExpress Local"}
            </p>
            <p className="text-2xs font-mono text-emerald-700">
              Tracking: {order.tracking || order.tracking_number || "AGR-TRACK-001"}
            </p>
          </div>
        </div>

        {/* Seller Update Status Controls */}
        {isSeller && (
          <form onSubmit={handleUpdateStatus} className="rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4 space-y-3 mb-6">
            <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Seller Control: Update Order Status
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                className="rounded-xl border border-gray-200 bg-white p-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                {ALL_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    Set Status: {st}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="Optional update status note..."
                className="rounded-xl border border-gray-200 bg-white p-2.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={updateStatusMutation.isPending}
              className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
            >
              {updateStatusMutation.isPending ? "Updating Status..." : "Update Status"}
            </button>
          </form>
        )}

        {/* Buyer Cancel Action */}
        {canCancel && (
          <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
            <span className="text-2xs text-gray-400">
              Need to modify or cancel this pending order?
            </span>
            <button
              onClick={handleCancelOrder}
              disabled={cancelOrderMutation.isPending}
              className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Ban className="h-3.5 w-3.5" />
              <span>Cancel Order</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
