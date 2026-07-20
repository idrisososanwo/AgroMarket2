import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Upload, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { productFormSchema, type ProductFormData } from "../types/seller.types";
import { CATEGORIES } from "../../../lib/constants";
import { storageService } from "../../../services/storage.service";
import { useCreateProduct, useUpdateProduct } from "../../../hooks/useProducts";
import type { Product } from "../../../types";
import { useAuth } from "../../../context/AuthContext";

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

const PRESET_AGRI_IMAGES = [
  { label: "Basmati Rice", url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80" },
  { label: "Vine Tomatoes", url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80" },
  { label: "Honey Apples", url: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80" },
  { label: "Farm Eggs", url: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=800&q=80" },
  { label: "Sweetcorn", url: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80" },
  { label: "White Yam", url: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=800&q=80" },
  { label: "Bell Peppers", url: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80" },
  { label: "Strawberries", url: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80" },
  { label: "Cassava Roots", url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80" },
];

export default function ProductFormModal({
  isOpen,
  onClose,
  productToEdit,
}: ProductFormModalProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const defaultImg = PRESET_AGRI_IMAGES[0].url;
  const [previewImage, setPreviewImage] = useState<string>(defaultImg);

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();

  const isEditing = Boolean(productToEdit);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(productFormSchema) as any,
    defaultValues: {
      name: "",
      description: "",
      category: "grains",
      price: 0,
      stock_quantity: 10,
      status: "Active",
      image: defaultImg,
      location: "",
    },
  });

  useEffect(() => {
    if (productToEdit) {
      reset({
        name: productToEdit.name,
        description: productToEdit.description || "",
        category: productToEdit.category,
        price: productToEdit.price,
        stock_quantity: productToEdit.stock_quantity ?? 10,
        status: productToEdit.inStock !== false ? "Active" : "Draft",
        image: productToEdit.image || defaultImg,
        location: productToEdit.location || "",
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPreviewImage(productToEdit.image || defaultImg);
    } else {
      reset({
        name: "",
        description: "",
        category: "grains",
        price: 0,
        stock_quantity: 10,
        status: "Active",
        image: defaultImg,
        location: "",
      });
      setPreviewImage(defaultImg);
    }
  }, [productToEdit, reset, isOpen, defaultImg]);


  if (!isOpen) return null;

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const publicUrl = await storageService.uploadProductImage(file);
      setValue("image", publicUrl, { shouldValidate: true });
      setPreviewImage(publicUrl);
      toast.success("Image uploaded successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload image. Please try again.";
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  const handlePresetSelect = (imageUrl: string) => {
    setValue("image", imageUrl, { shouldValidate: true });
    setPreviewImage(imageUrl);
  };


  const onSubmit = (data: ProductFormData) => {
    const sellerName =
      user?.user_metadata?.farm_name ||
      user?.user_metadata?.full_name ||
      "Organic Farm Producer";

    const sellerId = user?.id || "seller-id";

    if (isEditing && productToEdit) {
      updateProductMutation.mutate(
        {
          id: productToEdit.id,
          updates: {
            name: data.name,
            description: data.description,
            category: data.category,
            price: data.price,
            stock_quantity: data.stock_quantity,
            inStock: data.status === "Active",
            image: data.image,
            location: data.location,
          },
        },
        {
          onSuccess: () => {
            toast.success("Product updated successfully!");
            onClose();
          },
          onError: (err) => {
            toast.error(err.message || "Failed to update product.");
          },
        }
      );
    } else {
      createProductMutation.mutate(
        {
          name: data.name,
          description: data.description,
          category: data.category,
          price: data.price,
          unit: "kg",
          image: data.image,
          seller: sellerName,
          seller_id: sellerId,
          location: data.location || "Farm Field",
          inStock: data.status === "Active",
          stock_quantity: data.stock_quantity,
        },
        {
          onSuccess: () => {
            toast.success("New product listing created successfully!");
            onClose();
          },
          onError: (err) => {
            toast.error(err.message || "Failed to create product.");
          },
        }
      );
    }
  };

  const isSubmitting = createProductMutation.isPending || updateProductMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 font-sans">
              Seller Management
            </span>
            <h2 className="text-2xl font-extrabold text-gray-900 font-sans mt-0.5">
              {isEditing ? "Edit Product Listing" : "Add New Produce"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Product Name */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 font-sans mb-1.5">
                Product Name *
              </label>
              <input
                type="text"
                {...register("name")}
                placeholder="e.g. Organic Solar Dried Wheat Grains"
                className="w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
              />
              {errors.name && (
                <p className="mt-1 text-xs font-medium text-rose-600 font-sans">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 font-sans mb-1.5">
                Category *
              </label>
              <select
                {...register("category")}
                className="w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans cursor-pointer capitalize"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-xs font-medium text-rose-600 font-sans">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 font-sans mb-1.5">
                Listing Status *
              </label>
              <select
                {...register("status")}
                className="w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans cursor-pointer"
              >
                <option value="Active">Active (In Stock & Visible)</option>
                <option value="Draft">Draft (Hidden / Out of Stock)</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-xs font-medium text-rose-600 font-sans">
                  {errors.status.message}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 font-sans mb-1.5">
                Price ($ / kg or pack) *
              </label>
              <input
                type="number"
                step="0.01"
                {...register("price")}
                placeholder="25.00"
                className="w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
              />
              {errors.price && (
                <p className="mt-1 text-xs font-medium text-rose-600 font-sans">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Quantity Available */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 font-sans mb-1.5">
                Quantity Available *
              </label>
              <input
                type="number"
                {...register("stock_quantity")}
                placeholder="100"
                className="w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
              />
              {errors.stock_quantity && (
                <p className="mt-1 text-xs font-medium text-rose-600 font-sans">
                  {errors.stock_quantity.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 font-sans mb-1.5">
                Description *
              </label>
              <textarea
                rows={3}
                {...register("description")}
                placeholder="Provide detailed information on harvest date, farming techniques, organic certifications..."
                className="w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
              />
              {errors.description && (
                <p className="mt-1 text-xs font-medium text-rose-600 font-sans">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Image Upload & Picker */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 font-sans mb-1.5">
                Product Image (Supabase Storage / Emoji) *
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
                {/* Preview */}
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white border border-gray-200 overflow-hidden text-4xl shadow-2xs">
                  {previewImage.startsWith("data:") || previewImage.startsWith("http") ? (
                    <img src={previewImage} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <span>{previewImage || "🌾"}</span>
                  )}
                </div>

                {/* Upload & Preset Options */}
                <div className="flex-1 space-y-3 w-full">
                  <label className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-700 shadow-2xs hover:bg-gray-50 transition-all font-sans cursor-pointer">
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                    ) : (
                      <Upload className="h-4 w-4 text-emerald-600" />
                    )}
                    <span>{uploading ? "Uploading to Supabase..." : "Upload File to Supabase"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>

                  <div>
                    <span className="text-2xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5 font-sans">
                      Or select a high-quality agriculture photo preset:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {PRESET_AGRI_IMAGES.map((preset) => (
                        <button
                          key={preset.url}
                          type="button"
                          title={preset.label}
                          onClick={() => handlePresetSelect(preset.url)}
                          className={`group relative h-10 w-10 overflow-hidden rounded-lg border transition-all cursor-pointer ${
                            previewImage === preset.url
                              ? "border-emerald-600 ring-2 ring-emerald-600 scale-105"
                              : "border-gray-200 hover:border-emerald-400"
                          }`}
                        >
                          <img src={preset.url} alt={preset.label} className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
              {errors.image && (
                <p className="mt-1 text-xs font-medium text-rose-600 font-sans">
                  {errors.image.message}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 px-5 py-3 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all font-sans cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || uploading}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50 transition-all font-sans cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Saving Product...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>{isEditing ? "Save Changes" : "Create Product"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
