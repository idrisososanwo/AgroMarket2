import { Package, CheckCircle2, ShoppingBag, DollarSign } from "lucide-react";
import type { SellerStatsData } from "../types/seller.types";
import { formatPrice } from "../../../utils/formatters";


interface SellerStatsProps {
  stats: SellerStatsData;
  isLoading?: boolean;
}

export default function SellerStats({ stats, isLoading = false }: SellerStatsProps) {
  const statCards = [
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-emerald-500",
      textColor: "text-emerald-700",
      bgColor: "bg-emerald-50",
    },
    {
      label: "Active Listings",
      value: stats.activeProducts,
      icon: CheckCircle2,
      color: "bg-blue-500",
      textColor: "text-blue-700",
      bgColor: "bg-blue-50",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "bg-amber-500",
      textColor: "text-amber-700",
      bgColor: "bg-amber-50",
    },
    {
      label: "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      color: "bg-purple-500",
      textColor: "text-purple-700",
      bgColor: "bg-purple-50",
    },

  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="h-28 rounded-2xl border border-gray-100 bg-white p-6 shadow-2xs animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-white ${stat.color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 font-sans">
                {stat.label}
              </p>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-1 font-sans">
                {stat.value}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
