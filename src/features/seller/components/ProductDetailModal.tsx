import { X, CheckCircle, XCircle } from "lucide-react";
import type { Product } from "../../../types";
import ProductImage from "../../../components/common/ProductImage";
import { formatPrice } from "../../../utils/formatters";


interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  if (!product) return null;

  const isAvailable = product.inStock !== false && product.in_stock !== false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 font-sans">
            Seller Product Preview
          </span>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-emerald-50 shadow-inner overflow-hidden">
            <ProductImage src={product.image} alt={product.name} className="h-full w-full object-cover" />
          </div>


          <div>
            <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-2xs font-bold text-emerald-800 uppercase tracking-wider font-sans mb-1">
              {product.category}
            </span>
            <h3 className="text-2xl font-extrabold text-gray-900 font-sans">
              {product.name}
            </h3>
            <p className="text-xs text-gray-500 font-sans mt-1">
              {product.description || "No description provided."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full bg-gray-50/50 p-4 rounded-2xl border border-gray-100 text-left">
            <div>
              <span className="text-2xs text-gray-400 font-bold uppercase tracking-wider block font-sans">
                Selling Price
              </span>
              <span className="text-lg font-extrabold text-emerald-700 font-sans">
                {formatPrice(product.price)} / {product.unit || "kg"}
              </span>

            </div>

            <div>
              <span className="text-2xs text-gray-400 font-bold uppercase tracking-wider block font-sans">
                Stock Quantity
              </span>
              <span className="text-lg font-extrabold text-gray-900 font-sans">
                {product.stock_quantity ?? 10} units
              </span>
            </div>

            <div>
              <span className="text-2xs text-gray-400 font-bold uppercase tracking-wider block font-sans">
                Farm Seller
              </span>
              <span className="text-xs font-bold text-gray-700 font-sans truncate block">
                {product.seller || "Local Farm"}
              </span>
            </div>

            <div>
              <span className="text-2xs text-gray-400 font-bold uppercase tracking-wider block font-sans">
                Status
              </span>
              <span
                className={`inline-flex items-center gap-1 text-xs font-bold ${
                  isAvailable ? "text-emerald-700" : "text-rose-600"
                }`}
              >
                {isAvailable ? <CheckCircle className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                {isAvailable ? "Active" : "Draft / Out of Stock"}
              </span>
            </div>
          </div>

          <div className="w-full pt-2">
            <button
              onClick={onClose}
              className="w-full rounded-xl bg-gray-900 py-3 text-xs font-bold text-white shadow-sm hover:bg-gray-800 transition-all font-sans cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
