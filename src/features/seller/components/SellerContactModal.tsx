import { X, Phone, Mail, MessageSquare, Copy, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { SellerProfileData } from "../../../types/seller.types";

interface SellerContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  seller: SellerProfileData;
}

export default function SellerContactModal({
  isOpen,
  onClose,
  seller,
}: SellerContactModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyDetails = () => {
    const text = `Seller: ${seller.name}\nPhone: ${seller.phone}\nEmail: ${seller.email}\nLocation: ${seller.location}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Seller contact details copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans">
      <div className="relative w-full max-w-md rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <span className="text-2xs font-extrabold uppercase tracking-wider text-emerald-600">
              Verified Producer Contact
            </span>
            <h3 className="text-xl font-extrabold text-gray-900 mt-0.5">
              Contact {seller.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Contact Method Options */}
        <div className="space-y-3">
          {/* Phone Call */}
          <a
            href={`tel:${seller.phone}`}
            className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/50 p-4 hover:border-emerald-200 hover:bg-emerald-50/40 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 group-hover:scale-105 transition-transform">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-gray-900 text-sm block">Direct Phone Call</span>
                <span className="text-xs text-gray-500 font-mono">{seller.phone}</span>
              </div>
            </div>
            <span className="rounded-full bg-emerald-600 px-3 py-1 text-2xs font-bold text-white shadow-2xs">
              Call Now
            </span>
          </a>

          {/* WhatsApp Direct */}
          <a
            href={`https://wa.me/${seller.whatsapp}?text=${encodeURIComponent(`Hello ${seller.name}, I found your farm produce on AgroMarket.`)}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4 hover:bg-emerald-50 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white group-hover:scale-105 transition-transform">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-gray-900 text-sm block">WhatsApp Chat</span>
                <span className="text-xs text-gray-500 font-mono">Instant Farm Inquiry</span>
              </div>
            </div>
            <span className="rounded-full bg-emerald-700 px-3 py-1 text-2xs font-bold text-white shadow-2xs">
              Chat
            </span>
          </a>

          {/* Email */}
          <a
            href={`mailto:${seller.email}?subject=AgroMarket Harvest Inquiry for ${encodeURIComponent(seller.name)}`}
            className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/50 p-4 hover:border-blue-200 hover:bg-blue-50/40 transition-all group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 group-hover:scale-105 transition-transform">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <span className="font-bold text-gray-900 text-sm block">Email Business</span>
                <span className="text-xs text-gray-500 font-mono truncate max-w-[180px] block">
                  {seller.email}
                </span>
              </div>
            </div>
            <span className="rounded-full bg-blue-600 px-3 py-1 text-2xs font-bold text-white shadow-2xs">
              Email
            </span>
          </a>
        </div>

        {/* Copy Button */}
        <div className="pt-2">
          <button
            onClick={handleCopyDetails}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all cursor-pointer font-sans"
          >
            {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-gray-500" />}
            <span>{copied ? "Details Copied!" : "Copy Contact Details"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
