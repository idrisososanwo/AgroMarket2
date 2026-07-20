import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { stellarService } from "../../services/payment/stellar.service";
import type {
  StellarPaymentRecord,
  StellarPaymentRequest,
  StellarWalletType,
} from "../../features/payment/types/payment.types";

export const STELLAR_PAYMENT_KEYS = {
  all: ["stellar_payments"] as const,
  user: (userId: string) => ["stellar_payments", userId] as const,
  rate: ["stellar_rate"] as const,
};

/**
 * Hook to fetch current XLM/USD exchange rate
 */
export function useXlmExchangeRate() {
  return useQuery<number, Error>({
    queryKey: STELLAR_PAYMENT_KEYS.rate,
    queryFn: () => stellarService.getXlmExchangeRate(),
    refetchInterval: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to fetch user payment history
 */
export function usePaymentHistory(userId?: string) {
  return useQuery<StellarPaymentRecord[], Error>({
    queryKey: STELLAR_PAYMENT_KEYS.user(userId || ""),
    queryFn: () => stellarService.getPaymentHistory(userId!),
    enabled: Boolean(userId),
  });
}

/**
 * Hook to execute Stellar transaction
 */
export function useExecuteStellarPayment() {
  const queryClient = useQueryClient();

  return useMutation<
    StellarPaymentRecord,
    Error,
    {
      request: StellarPaymentRequest;
      senderPublicKey: string;
      walletType: StellarWalletType;
      userId: string;
    }
  >({
    mutationFn: async ({ request, senderPublicKey, walletType, userId }) => {
      const result = await stellarService.executeStellarTransaction(
        request,
        senderPublicKey,
        walletType
      );

      if (!result.success) {
        throw new Error(result.message || "Stellar transaction failed");
      }

      const record = await stellarService.savePaymentRecord({
        user_id: userId,
        order_id: request.orderId,
        tx_hash: result.txHash,
        wallet_address: senderPublicKey,
        amount_xlm: request.amountXlm,
        amount_usd: request.amountUsd,
        network: "Testnet",
        status: result.status,
      });

      return record;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: STELLAR_PAYMENT_KEYS.user(variables.userId) });
    },
  });
}
