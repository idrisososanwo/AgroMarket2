import ProductImage from "../../../components/common/ProductImage";
import { formatPrice } from "../../../utils/formatters";

import { Truck, ShieldCheck } from "lucide-react";
import type { CartItem } from "../../../types";

interface OrderSummaryCardProps {
  items: CartItem[];
  deliveryFee: number;
  taxRate?: number;
}

export default function OrderSummaryCard({
  items,
  deliveryFee,
  taxRate = 0.05,
}: OrderSummaryCardProps) {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * taxRate;
  const grandTotal = subtotal + deliveryFee + tax;

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sticky top-24">
      <h3 className="text-lg font-extrabold text-gray-900 font-sans border-b border-gray-100 pb-4 mb-4">
        Order Summary
      </h3>

      {/* Cart items list */}
      <div className="max-h-60 overflow-y-auto space-y-3 pr-1 divide-y divide-gray-50 mb-4">
        {items.map((item) => (
          <div key={item.id} className="pt-2 flex items-center justify-between gap-3 text-xs font-sans">
            <div className="flex items-center gap-2.5 truncate">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 border border-gray-100 overflow-hidden">
                <ProductImage src={item.image} alt={item.name} className="h-full w-full object-cover" />
              </div>
              <div className="truncate">
                <span className="font-bold text-gray-900 truncate block">{item.name}</span>
                <span className="text-2xs text-gray-400">
                  Qty: {item.quantity} × {formatPrice(item.price)}
                </span>
              </div>
            </div>
            <span className="font-extrabold text-gray-900 shrink-0">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}

      </div>

      {/* Price breakdown */}
      <div className="space-y-3 text-xs font-sans border-t border-gray-100 pt-4">
        <div className="flex justify-between text-gray-600">
          <span>Items Subtotal</span>
          <span className="font-bold text-gray-900">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span className="flex items-center gap-1">
            <Truck className="h-3.5 w-3.5 text-emerald-600" /> Delivery Fee
          </span>
          <span className="font-bold text-gray-900">
            {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
          </span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Estimated Taxes ({(taxRate * 100).toFixed(0)}%)</span>
          <span className="font-bold text-gray-900">{formatPrice(tax)}</span>
        </div>

        <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-extrabold text-gray-900">
          <span>Grand Total</span>
          <span className="text-emerald-700">{formatPrice(grandTotal)}</span>
        </div>
      </div>


      <div className="mt-5 flex items-center justify-center gap-2 text-2xs font-semibold text-gray-400 font-sans">
        <ShieldCheck className="h-4 w-4 text-emerald-600" />
        <span>AgroMarket Quality & Freshness Guarantee</span>
      </div>
    </div>
  );
}
