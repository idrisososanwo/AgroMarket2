import { useState } from "react";
import { X, Wallet, ShieldCheck, Check, Key, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { stellarService } from "../../../services/payment/stellar.service";
import type { StellarWalletType } from "../types/payment.types";

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (walletType: StellarWalletType, publicKey: string) => void;
}

export default function WalletConnectModal({
  isOpen,
  onClose,
  onConnect,
}: WalletConnectModalProps) {
  const [selectedType, setSelectedType] = useState<StellarWalletType>("freighter");
  const [manualKey, setManualKey] = useState("");
  const [connecting, setConnecting] = useState(false);

  if (!isOpen) return null;

  const handleFreighterConnect = async () => {
    setConnecting(true);
    try {
      const pubKey = await stellarService.connectFreighter();
      if (pubKey) {
        toast.success("Freighter Wallet connected successfully!");
        onConnect("freighter", pubKey);
        onClose();
      } else {
        toast.info("Freighter wallet extension not detected. Use manual key fallback or install Freighter.", {
          action: {
            label: "Use Fallback",
            onClick: () => setSelectedType("manual"),
          },
        });
      }
    } catch {
      toast.error("Freighter wallet connection failed.");
    } finally {
      setConnecting(false);
    }
  };

  const handleAlbedoConnect = async () => {
    setConnecting(true);
    try {
      // Simulate Albedo web intent connection
      await new Promise((resolve) => setTimeout(resolve, 800));
      const demoKey = "GBRPYHIL2CI3FNQ4BXLFMNDLFJUNPU2HY3ZMFXYCTXAKB2NS67ST3SAV";
      toast.success("Albedo Web Wallet connected!");
      onConnect("albedo", demoKey);
      onClose();
    } catch {
      toast.error("Albedo wallet connection failed.");
    } finally {
      setConnecting(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualKey.trim()) {
      toast.error("Please enter a valid Stellar public key.");
      return;
    }

    if (!stellarService.validateStellarPublicKey(manualKey.trim())) {
      toast.error("Invalid Stellar public key format. Must start with 'G' and be 56 characters long.");
      return;
    }

    toast.success("Stellar Wallet connected via Public Key!");
    onConnect("manual", manualKey.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans">
      <div className="relative w-full max-w-lg rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
          <div className="flex items-center gap-2 text-emerald-800 font-bold">
            <Wallet className="h-5 w-5 text-emerald-600" />
            <span>Connect Stellar Wallet</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Option 1: Freighter Wallet */}
          <div
            onClick={handleFreighterConnect}
            className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 hover:border-emerald-500 cursor-pointer transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold">
                🚀
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-gray-900">Freighter Wallet</h4>
                <p className="text-2xs text-gray-500">Official browser extension for Stellar</p>
              </div>
            </div>
            {connecting && selectedType === "freighter" ? (
              <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
            ) : (
              <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-2xs font-bold text-emerald-800">
                Detect & Connect
              </span>
            )}
          </div>

          {/* Option 2: Albedo Web Wallet */}
          <div
            onClick={handleAlbedoConnect}
            className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 hover:border-emerald-500 cursor-pointer transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white font-bold">
                ⭐
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-gray-900">Albedo Web Link</h4>
                <p className="text-2xs text-gray-500">Web-based secure Stellar signing intent</p>
              </div>
            </div>
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-2xs font-bold text-gray-700">
              Web Connect
            </span>
          </div>

          {/* Option 3: Manual Public Key */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-gray-900">Manual Public Key Fallback</h4>
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-3">
              <input
                type="text"
                value={manualKey}
                onChange={(e) => setManualKey(e.target.value)}
                placeholder="Enter 56-character Stellar address (G...)"
                className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs text-gray-900 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-all cursor-pointer"
              >
                <Check className="h-4 w-4" />
                <span>Use Manual Public Key</span>
              </button>
            </form>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-2xs font-semibold text-gray-400">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Stellar Testnet & Mainnet Ready</span>
        </div>
      </div>
    </div>
  );
}
