import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import StellarPaymentModal from "../features/payment/components/StellarPaymentModal";
import { ArrowLeft, Wallet } from "lucide-react";
import { toast } from "sonner";
import { useOrderDetails } from "../hooks/useOrders";
import { useXlmExchangeRate } from "../hooks/payment/useStellarPayment";

export default function PaymentPage() {
  const { orderId } = useParams<{ orderId: string }>();

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(true);


  const { data: order, isLoading: isLoadingOrder } = useOrderDetails(orderId || "");
  const { data: exchangeRate = 0.12 } = useXlmExchangeRate();

  if (isLoadingOrder) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="h-64 rounded-3xl bg-gray-100 animate-pulse" />
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-4 py-16 text-center">
          <h2 className="text-2xl font-extrabold text-gray-900 font-sans">Order Not Found</h2>
          <Link
            to="/orders"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white font-sans"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to Orders</span>
          </Link>
        </div>
      </Layout>
    );
  }

  const amountUsd = order.total;
  const amountXlm = Number((amountUsd / exchangeRate).toFixed(2));

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 font-sans"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Orders</span>
          </Link>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-10 shadow-sm font-sans space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-6">
            <div>
              <span className="text-2xs font-extrabold uppercase tracking-widest text-emerald-600">
                Stellar XLM Payment Gateway
              </span>
              <h1 className="text-3xl font-extrabold text-gray-900 mt-1">
                Order #{order.id}
              </h1>
            </div>

            <span className="rounded-full bg-emerald-100 px-3.5 py-1 text-xs font-extrabold text-emerald-800">
              {order.payment_status === "Paid" ? "Paid via Stellar" : "Payment Pending"}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Order Summary Box */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Order Summary
              </h3>

              <div className="space-y-2 text-xs">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="text-gray-700 font-medium">{item.name} ×{item.qty ?? 1}</span>
                    <span className="font-extrabold text-gray-900">${((item.qty ?? 1) * item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200/60 pt-3 flex justify-between text-sm font-extrabold text-gray-900">
                <span>Grand Total (USD):</span>
                <span className="text-emerald-700">${amountUsd.toFixed(2)}</span>
              </div>
            </div>

            {/* Stellar Exchange Box */}
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 space-y-3 text-center flex flex-col justify-center">
              <span className="text-2xs font-extrabold uppercase tracking-widest text-emerald-800">
                Amount in XLM
              </span>
              <div className="text-4xl font-black text-emerald-700">
                {amountXlm} XLM
              </div>
              <span className="text-xs text-gray-500">
                Exchange Rate: 1 XLM = ${exchangeRate} USD
              </span>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setIsPaymentModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-7 py-3.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all cursor-pointer font-sans"
            >
              <Wallet className="h-4 w-4" />
              <span>{order.payment_status === "Paid" ? "View Payment Receipt" : "Open Stellar Payment Window"}</span>
            </button>
          </div>
        </div>

        {/* Modal Component */}
        <StellarPaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          order={order}
          onPaymentSuccess={() => {
            toast.success("Order payment processed!");
          }}
        />
      </div>
    </Layout>
  );
}
