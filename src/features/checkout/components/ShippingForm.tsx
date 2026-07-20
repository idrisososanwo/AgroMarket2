import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Phone, MapPin, Building, LandPlot, Mail, FileText, ArrowRight } from "lucide-react";
import { shippingFormSchema, type ShippingFormData } from "../types/checkout.types";

interface ShippingFormProps {
  initialData?: ShippingFormData | null;
  onSubmit: (data: ShippingFormData) => void;
}

export default function ShippingForm({ initialData, onSubmit }: ShippingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(shippingFormSchema) as any,
    defaultValues: initialData || {
      fullName: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      notes: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-xs">
        <h3 className="text-xl font-extrabold text-gray-900 font-sans border-b border-gray-100 pb-4 mb-6">
          Shipping & Delivery Details
        </h3>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Full Name */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 font-sans mb-1.5">
              Recipient Full Name *
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute top-3 left-3.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                {...register("fullName")}
                placeholder="Jane Doe"
                className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-10 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-xs font-medium text-rose-600 font-sans">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 font-sans mb-1.5">
              Contact Phone Number *
            </label>
            <div className="relative">
              <Phone className="pointer-events-none absolute top-3 left-3.5 h-4 w-4 text-gray-400" />
              <input
                type="tel"
                {...register("phone")}
                placeholder="+1 (555) 019-2834"
                className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-10 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-xs font-medium text-rose-600 font-sans">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Street Address */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 font-sans mb-1.5">
              Street Delivery Address *
            </label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute top-3 left-3.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                {...register("address")}
                placeholder="124 Farmstead Lane, Suite B"
                className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-10 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
              />
            </div>
            {errors.address && (
              <p className="mt-1 text-xs font-medium text-rose-600 font-sans">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 font-sans mb-1.5">
              City *
            </label>
            <div className="relative">
              <Building className="pointer-events-none absolute top-3 left-3.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                {...register("city")}
                placeholder="Greenfield"
                className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-10 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
              />
            </div>
            {errors.city && (
              <p className="mt-1 text-xs font-medium text-rose-600 font-sans">
                {errors.city.message}
              </p>
            )}
          </div>

          {/* State */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 font-sans mb-1.5">
              State / Province *
            </label>
            <div className="relative">
              <LandPlot className="pointer-events-none absolute top-3 left-3.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                {...register("state")}
                placeholder="California"
                className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-10 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
              />
            </div>
            {errors.state && (
              <p className="mt-1 text-xs font-medium text-rose-600 font-sans">
                {errors.state.message}
              </p>
            )}
          </div>

          {/* Postal Code */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 font-sans mb-1.5">
              Postal Code *
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-3 left-3.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                {...register("postalCode")}
                placeholder="90210"
                className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-10 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
              />
            </div>
            {errors.postalCode && (
              <p className="mt-1 text-xs font-medium text-rose-600 font-sans">
                {errors.postalCode.message}
              </p>
            )}
          </div>

          {/* Delivery Notes */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 font-sans mb-1.5">
              Delivery Notes / Special Instructions (Optional)
            </label>
            <div className="relative">
              <FileText className="pointer-events-none absolute top-3 left-3.5 h-4 w-4 text-gray-400" />
              <textarea
                rows={2}
                {...register("notes")}
                placeholder="Gate code, drop off at back porch, leave in shaded area..."
                className="w-full rounded-xl border border-gray-200 py-3 pr-4 pl-10 text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all font-sans cursor-pointer"
          >
            <span>Continue to Delivery Method</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </form>
  );
}
