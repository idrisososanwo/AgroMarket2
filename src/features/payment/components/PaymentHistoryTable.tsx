import { ExternalLink, CheckCircle2, XCircle } from "lucide-react";
import type { StellarPaymentRecord } from "../types/payment.types";
import { formatPrice } from "../../../utils/formatters";


interface PaymentHistoryTableProps {
  records: StellarPaymentRecord[];
  isLoading?: boolean;
}

export default function PaymentHistoryTable({ records, isLoading = false }: PaymentHistoryTableProps) {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs animate-pulse">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="h-12 w-full rounded-xl bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-emerald-50/20 p-10 text-center font-sans">
        <p className="text-xs font-bold text-gray-700">No Stellar XLM payment records found.</p>
        <p className="text-2xs text-gray-500 mt-1">
          Payments completed using Stellar crypto wallets will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs font-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50 text-2xs font-extrabold uppercase tracking-wider text-gray-400">
              <th className="py-3.5 px-5">Tx Hash</th>
              <th className="py-3.5 px-4">Wallet Address</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Network</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-5 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs">
            {records.map((record) => (
              <tr key={record.id} className="hover:bg-emerald-50/20 transition-colors">
                <td className="py-3.5 px-5 font-mono text-2xs">
                  <a
                    href={`https://stellar.expert/explorer/testnet/tx/${record.tx_hash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <span>{record.tx_hash.slice(0, 10)}...</span>
                    <ExternalLink className="h-3 w-3 text-emerald-500" />
                  </a>
                </td>

                <td className="py-3.5 px-4 font-mono text-2xs text-gray-600">
                  {record.wallet_address.slice(0, 8)}...{record.wallet_address.slice(-6)}
                </td>

                <td className="py-3.5 px-4 font-extrabold text-emerald-800">
                  {record.amount_xlm} XLM
                  <span className="text-2xs text-gray-400 font-normal block">
                    ({formatPrice(record.amount_usd)})
                  </span>
                </td>


                <td className="py-3.5 px-4 font-mono text-2xs font-bold text-gray-700">
                  {record.network}
                </td>

                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-3xs font-extrabold ${
                      record.status === "Success"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-rose-100 text-rose-800"
                    }`}
                  >
                    {record.status === "Success" ? (
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                    ) : (
                      <XCircle className="h-3 w-3 text-rose-600" />
                    )}
                    {record.status}
                  </span>
                </td>

                <td className="py-3.5 px-5 text-right text-2xs text-gray-400">
                  {new Date(record.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
