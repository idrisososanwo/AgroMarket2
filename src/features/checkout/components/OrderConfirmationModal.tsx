import { Link } from "react-router-dom";
import { CheckCircle2, Package, ArrowRight, Truck } from "lucide-react";
import type { Order } from "../../../types";

interface OrderConfirmationModalProps {
  order: Order | null;
}

export default function OrderConfirmationModal({ order }: OrderConfirmationModalProps) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl sm:p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <span className="text-2xs font-extrabold uppercase tracking-widest text-emerald-600 font-sans">
          Order Successfully Placed!
        </span>
        <h2 className="text-2xl font-black text-gray-900 font-sans mt-1">
          Thank you for your order!
        </h2>
        <p className="text-xs text-gray-500 font-sans mt-1">
          The farm producer has received your harvest request and is preparing packaging.
        </p>

        <div className="my-6 rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4 text-left space-y-2 font-sans text-xs">
          <div className="flex justify-between">
            <span className="text-gray-500">Order Number:</span>
            <span className="font-extrabold text-gray-900">{order.id}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Tracking Code:</span>
            <span className="font-bold text-emerald-700">{order.tracking || order.tracking_number}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Total Paid:</span>
            <span className="font-extrabold text-gray-900">${order.total.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Estimated Dispatch:</span>
            <span className="font-bold text-gray-800 flex items-center gap-1">
              <Truck className="h-3.5 w-3.5 text-emerald-600" />
              {order.carrier || "AgroExpress Local"}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            to="/orders"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all font-sans cursor-pointer"
          >
            <Package className="h-4 w-4" />
            <span>View Order History & Track</span>
          </Link>

          <Link
            to="/"
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-200 py-3.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all font-sans cursor-pointer"
          >
            <span>Back to Marketplace</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
