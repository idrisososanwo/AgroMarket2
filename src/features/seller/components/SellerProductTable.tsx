import { Eye, Edit3, Trash2 } from "lucide-react";

import ProductImage from "../../../components/common/ProductImage";
import { formatPrice } from "../../../utils/formatters";

import type { Product } from "../../../types";
import { useDeleteProduct } from "../../../hooks/useProducts";
import { toast } from "sonner";

interface SellerProductTableProps {
  products: Product[];
  isLoading?: boolean;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
}

export default function SellerProductTable({
  products,
  isLoading = false,
  onView,
  onEdit,
}: SellerProductTableProps) {
  const deleteProductMutation = useDeleteProduct();

  const handleDelete = (product: Product) => {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      deleteProductMutation.mutate(product.id, {
        onSuccess: () => {
          toast.success(`Product "${product.name}" deleted successfully.`);
        },
        onError: (err) => {
          toast.error(err.message || "Failed to delete product.");
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs animate-pulse">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="h-12 w-full rounded-xl bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-emerald-50/20 p-12 text-center">
        <p className="text-sm font-bold text-gray-700 font-sans">No produce listings found.</p>
        <p className="text-xs text-gray-500 font-sans mt-1">
          Click "Add New Product" to list your farm produce on AgroMarket.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50 text-2xs font-extrabold uppercase tracking-wider text-gray-400 font-sans">
              <th className="py-4 px-6">Product</th>
              <th className="py-4 px-4">Category</th>
              <th className="py-4 px-4">Price</th>
              <th className="py-4 px-4">Quantity</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-xs font-sans">
            {products.map((product) => {
              const isAvailable = product.inStock !== false && product.in_stock !== false;
              return (
                <tr key={product.id} className="hover:bg-emerald-50/20 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-2xl border border-gray-100">
                        <ProductImage
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover rounded-xl"
                        />

                      </div>
                      <div>
                        <span className="font-bold text-gray-900 block font-sans">
                          {product.name}
                        </span>
                        <span className="text-2xs text-gray-400 font-sans">
                          ID: #{product.id.slice(-6)}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-semibold text-gray-700 capitalize">
                    {product.category}
                  </td>

                  <td className="py-4 px-4 font-extrabold text-emerald-700">
                    {formatPrice(product.price)} / {product.unit || "kg"}
                  </td>

                  <td className="py-4 px-4 font-bold text-gray-900">
                    {product.stock_quantity ?? 10} units
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
                        isAvailable ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {isAvailable ? "Active" : "Draft"}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onView(product)}
                        title="View Product"
                        className="rounded-lg p-2 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors cursor-pointer"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => onEdit(product)}
                        title="Edit Product"
                        className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(product)}
                        title="Delete Product"
                        className="rounded-lg p-2 text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {products.map((product) => {
          const isAvailable = product.inStock !== false && product.in_stock !== false;
          return (
            <div
              key={product.id}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-2xl border border-gray-100">
                    <ProductImage
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover rounded-xl"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 font-sans text-sm">{product.name}</h4>
                    <span className="text-2xs text-gray-400 font-sans capitalize">{product.category}</span>
                  </div>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-2xs font-extrabold ${
                    isAvailable ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {isAvailable ? "Active" : "Draft"}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs font-sans border-t border-gray-50 pt-2">
                <span className="font-extrabold text-emerald-700">{formatPrice(product.price)} / {product.unit || "kg"}</span>
                <span className="text-gray-500 font-medium">{product.stock_quantity ?? 10} available</span>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-gray-50 pt-2">
                <button
                  onClick={() => onView(product)}
                  className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700"
                >
                  <Eye className="h-3.5 w-3.5" /> View
                </button>

                <button
                  onClick={() => onEdit(product)}
                  className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Edit
                </button>

                <button
                  onClick={() => handleDelete(product)}
                  className="flex items-center gap-1 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
