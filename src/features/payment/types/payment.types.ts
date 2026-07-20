export type StellarWalletType = "freighter" | "albedo" | "manual";
export type StellarNetwork = "Testnet" | "Public";
export type StellarPaymentStatus = "Success" | "Failed" | "Pending" | "Rejected" | "Timeout" | "Duplicate";

export interface StellarPaymentRecord {
  id: string;
  user_id: string;
  order_id: string;
  tx_hash: string;
  wallet_address: string;
  amount_xlm: number;
  amount_usd: number;
  network: StellarNetwork;
  status: StellarPaymentStatus;
  created_at: string;
  error_message?: string;
}

export interface StellarPaymentRequest {
  orderId: string;
  amountUsd: number;
  amountXlm: number;
  exchangeRate: number;
  destinationPublicKey: string;
  memo: string;
}

export interface WalletConnectionState {
  isConnected: boolean;
  walletType: StellarWalletType | null;
  publicKey: string | null;
}
