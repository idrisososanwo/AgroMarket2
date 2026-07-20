import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Phone, MapPin, Upload, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { buyerProfileSchema, type BuyerProfileFormData } from "../types/buyer.types";
import { useAuth } from "../../../context/AuthContext";
import { useProfile, useUpdateProfile } from "../../../hooks/useProfile";
import { storageService } from "../../../services/storage.service";

export default function BuyerProfileForm() {
  const { user } = useAuth();
  const userId = user?.id || "";

  const { data: profile, isLoading: isLoadingProfile } = useProfile(userId);
  const updateProfileMutation = useUpdateProfile();

  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BuyerProfileFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(buyerProfileSchema) as any,
    defaultValues: {
      full_name: "",
      phone: "",
      address: "",
      avatar_url: "",
    },
  });

  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name || user?.user_metadata?.full_name || "",
        phone: profile.phone || "",
        address: profile.address || "",
        avatar_url: profile.avatar_url || "",
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAvatarPreview(profile.avatar_url || "");
    } else if (user) {

      reset({
        full_name: user.user_metadata?.full_name || "",
        phone: user.phone || "",
        address: "",
        avatar_url: "",
      });
    }
  }, [profile, user, reset]);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const publicUrl = await storageService.uploadProductImage(file);
      setValue("avatar_url", publicUrl, { shouldValidate: true });
      setAvatarPreview(publicUrl);
      toast.success("Profile photo uploaded!");
    } catch {
      toast.error("Failed to upload profile photo.");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (data: BuyerProfileFormData) => {
    if (!userId) {
      toast.error("User not authenticated.");
      return;
    }

    updateProfileMutation.mutate(
      {
        userId,
        updates: {
          full_name: data.full_name,
          phone: data.phone,
          address: data.address,
          avatar_url: data.avatar_url,
        },
      },
      {
        onSuccess: () => {
          toast.success("Buyer profile updated successfully!");
        },
        onError: (err) => {
          toast.error(err.message || "Failed to update profile.");
        },
      }
    );
  };

  if (isLoadingProfile) {
    return (
      <div className="rounded-3xl border border-gray-100 bg-white p-8 animate-pulse space-y-4">
        <div className="h-6 w-1/3 bg-gray-100 rounded-md" />
        <div className="h-10 w-full bg-gray-100 rounded-xl" />
        <div className="h-10 w-full bg-gray-100 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h3 className="text-xl font-extrabold text-gray-900 font-sans">Buyer Profile Settings</h3>
        <p className="text-xs text-gray-500 font-sans mt-0.5">
          Update your contact details and primary delivery address for fast order checkout.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex flex-col sm:flex-row items-center gap-6 rounded-2xl border border-gray-100 bg-gray-50/50 p-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold text-2xl overflow-hidden border-2 border-emerald-500/20 shadow-2xs">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <User className="h-10 w-10 text-emerald-600" />
            )}
          </div>

          <div>
            <label className="inline-flex items-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-700 shadow-2xs hover:bg-gray-50 transition-all font-sans cursor-pointer">
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
              ) : (
                <Upload className="h-4 w-4 text-emerald-600" />
              )}
              <span>{uploading ? "Uploading Photo..." : "Upload Profile Photo"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarFileChange}
                disabled={uploading}
                className="hidden"
              />
            </label>
            <p className="text-2xs text-gray-400 font-sans mt-1.5">
              Supports JPG, PNG or WEBP up to 5MB.
            </p>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 font-sans mb-1.5">
            Full Name *
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute top-3 left-3.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              {...register("full_name")}
              placeholder="John Doe"
              className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-10 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
            />
          </div>
          {errors.full_name && (
            <p className="mt-1 text-xs font-medium text-rose-600 font-sans">
              {errors.full_name.message}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 font-sans mb-1.5">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="pointer-events-none absolute top-3 left-3.5 h-4 w-4 text-gray-400" />
            <input
              type="tel"
              {...register("phone")}
              placeholder="+1 (555) 234-5678"
              className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-10 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-xs font-medium text-rose-600 font-sans">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Delivery Address */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 font-sans mb-1.5">
            Primary Delivery Address *
          </label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute top-3 left-3.5 h-4 w-4 text-gray-400" />
            <textarea
              rows={3}
              {...register("address")}
              placeholder="Enter street name, house/suite number, city, and postal code..."
              className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-10 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
            />
          </div>
          {errors.address && (
            <p className="mt-1 text-xs font-medium text-rose-600 font-sans">
              {errors.address.message}
            </p>
          )}
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={updateProfileMutation.isPending || uploading}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50 transition-all font-sans cursor-pointer"
          >
            {updateProfileMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving Profile...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
