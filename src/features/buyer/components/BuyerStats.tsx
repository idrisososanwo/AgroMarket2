import { ShoppingBag, Clock, CheckCircle2, Heart } from "lucide-react";
import type { BuyerStatsData } from "../types/buyer.types";

interface BuyerStatsProps {
  stats: BuyerStatsData;
  isLoading?: boolean;
}

export default function BuyerStats({ stats, isLoading = false }: BuyerStatsProps) {
  const statCards = [
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "bg-blue-500",
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      color: "bg-amber-500",
    },
    {
      label: "Completed Deliveries",
      value: stats.completedOrders,
      icon: CheckCircle2,
      color: "bg-emerald-500",
    },
    {
      label: "Saved Wishlist Produce",
      value: stats.wishlistCount,
      icon: Heart,
      color: "bg-rose-500",
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
