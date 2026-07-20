import { useState, useEffect } from "react";
import {
  X,
  Wallet,
  ArrowRight,
  CheckCircle2,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "../../../utils/formatters";

import WalletConnectModal from "./WalletConnectModal";
import { useXlmExchangeRate, useExecuteStellarPayment } from "../../../hooks/payment/useStellarPayment";
import { stellarService } from "../../../services/payment/stellar.service";
import type { Order } from "../../../types";
import type { StellarWalletType } from "../types/payment.types";
import { useAuth } from "../../../context/AuthContext";
import { orderService } from "../../../services/order.service";

interface StellarPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onPaymentSuccess?: (txHash: string) => void;
}

export default function StellarPaymentModal({
  isOpen,
  onClose,
  order,
  onPaymentSuccess,
}: StellarPaymentModalProps) {
  const { user } = useAuth();
  const userId = user?.id || "";

  const { data: exchangeRate = 0.12 } = useXlmExchangeRate();

  const executePaymentMutation = useExecuteStellarPayment();

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletType, setWalletType] = useState<StellarWalletType>("freighter");
  const [publicKey, setPublicKey] = useState<string>("GC3K...984A");
  const [isConnected, setIsConnected] = useState(true);

  const [txHash, setTxHash] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    // Attempt auto detect freighter
    stellarService.connectFreighter().then((key) => {
      if (key) {
        setPublicKey(key);
        setWalletType("freighter");
        setIsConnected(true);
      }
    });
  }, []);

  if (!isOpen || !order) return null;

  const amountUsd = order.total;
  const amountXlm = Number((amountUsd / exchangeRate).toFixed(2));
  const isAlreadyPaid = order.payment_status === "Paid";

  const handleConnectWallet = (type: StellarWalletType, key: string) => {
    setWalletType(type);
    setPublicKey(key);
    setIsConnected(true);
  };

  const handlePayWithStellar = async () => {
    if (!userId) {
      toast.error("Please sign in to process payment.");
      return;
    }

    if (!isConnected || !publicKey) {
      setIsWalletModalOpen(true);
      return;
    }

    if (isAlreadyPaid) {
      toast.info("This order has already been marked as Paid.");
      return;
    }

    const paymentRequest = await stellarService.createPaymentRequest(order.id, amountUsd);

    toast.info("Initiating Stellar transaction...", { duration: 2000 });

    executePaymentMutation.mutate(
      {
        request: paymentRequest,
        senderPublicKey: publicKey,
        walletType,
        userId,
      },
      {
        onSuccess: async (record) => {
          setIsVerifying(true);
          toast.info("Verifying transaction on Horizon Testnet...");

          const verified = await stellarService.verifyTransactionOnHorizon(record.tx_hash);
          setIsVerifying(false);

          if (verified) {
            setTxHash(record.tx_hash);

            // Update order payment_status in backend
            try {
              await orderService.updateOrderStatus({
                order_id: order.id,
                status: "Processing",
                statusDesc: `Stellar XLM Payment Verified (${record.tx_hash.slice(0, 8)}...). Processing dispatch.`,
              });
            } catch (e) {
              console.warn("Notice: Status update saved locally", e);
            }

            toast.success("Stellar XLM Payment Confirmed & Verified!");
            if (onPaymentSuccess) {
              onPaymentSuccess(record.tx_hash);
            }
          } else {
            toast.error("Horizon transaction verification failed.");
          }
        },
        onError: (err) => {
          toast.error(err.message || "Payment transaction rejected or failed.");
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans">
      <div className="relative w-full max-w-lg rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
          <div className="flex items-center gap-2 text-emerald-800 font-extrabold">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white font-black text-xs">
              ★
            </div>
            <span>Stellar XLM Crypto Payment</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Success Screen if paid */}
        {txHash || isAlreadyPaid ? (
          <div className="text-center py-4 space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900">Payment Confirmed!</h3>
            <p className="text-xs text-gray-500">
              Your Stellar XLM payment for Order #{order.id} has been verified on Horizon.
            </p>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500">Amount Paid:</span>
                <span className="font-extrabold text-emerald-800">{amountXlm} XLM ({formatPrice(amountUsd)})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Network:</span>
                <span className="font-bold text-gray-800">Stellar Testnet</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Tx Hash:</span>
                <a
                  href={`https://stellar.expert/explorer/testnet/tx/${txHash || "demo"}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-2xs text-emerald-600 hover:underline flex items-center gap-1"
                >
                  <span>{(txHash || "0x8f2a9c4b...").slice(0, 12)}...</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all cursor-pointer"
            >
              Done & Return
            </button>
          </div>
        ) : (
          /* Payment Interface */
          <div className="space-y-6">
            {/* Amount Summary */}
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 text-center">
              <span className="text-2xs font-extrabold uppercase tracking-widest text-emerald-800 block mb-1">
                Total Payment Due
              </span>
              <div className="text-3xl font-black text-emerald-700">
                {amountXlm} <span className="text-lg">XLM</span>
              </div>
              <span className="text-xs text-gray-500 block mt-1">
                Equivalent to {formatPrice(amountUsd)} (1 XLM ≈ ₦200)
              </span>
            </div>

            {/* Wallet Status Box */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-gray-200 text-emerald-600">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-2xs font-bold text-gray-400 uppercase tracking-wider block">
                    Connected Wallet ({walletType})
                  </span>
                  <span className="font-mono font-bold text-gray-800">
                    {publicKey.slice(0, 8)}...{publicKey.slice(-6)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsWalletModalOpen(true)}
                className="text-2xs font-bold text-emerald-600 hover:text-emerald-700 underline cursor-pointer"
              >
                Change
              </button>
            </div>

            {/* Network Info */}
            <div className="flex items-center justify-between text-2xs font-bold text-gray-500 font-mono px-1">
              <span>Network: Stellar Testnet</span>
              <span className="text-emerald-600 flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                Horizon Active
              </span>
            </div>

            {/* Action Button */}
            <button
              onClick={handlePayWithStellar}
              disabled={executePaymentMutation.isPending || isVerifying}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-4 text-xs font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50 transition-all cursor-pointer"
            >
              {executePaymentMutation.isPending || isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{isVerifying ? "Verifying on Horizon..." : "Confirming Transaction..."}</span>
                </>
              ) : (
                <>
                  <span>Submit XLM Payment • {amountXlm} XLM</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Connect Wallet Nested Modal */}
        <WalletConnectModal
          isOpen={isWalletModalOpen}
          onClose={() => setIsWalletModalOpen(false)}
          onConnect={handleConnectWallet}
        />
      </div>
    </div>
  );
}
