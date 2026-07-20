import { useState } from "react";

export interface BarChartItem {
  label: string;
  value: number;
}

interface AnalyticsBarChartProps {
  data: BarChartItem[];
  height?: number;
  valuePrefix?: string;
  barColor?: string;
}

export default function AnalyticsBarChart({
  data,
  height = 220,
  valuePrefix = "₦",
  barColor = "bg-emerald-600",
}: AnalyticsBarChartProps) {
  const [hoveredItem, setHoveredItem] = useState<BarChartItem | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-xs text-gray-400 font-sans">
        No bar chart data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="w-full font-sans space-y-3">
      <div className="flex items-end justify-between gap-2 sm:gap-4 border-b border-gray-100 pb-2" style={{ height: `${height}px` }}>
        {data.map((item, index) => {
          const heightPercent = Math.max(Math.round((item.value / maxValue) * 100), 6);
          const isHovered = hoveredItem?.label === item.label;

          return (
            <div
              key={index}
              className="relative flex flex-1 flex-col items-center h-full justify-end group cursor-pointer"
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Value Indicator on Hover */}
              <div
                className={`absolute -top-9 z-10 transition-all duration-200 pointer-events-none rounded-lg bg-gray-900 px-2 py-1 text-3xs font-bold text-white shadow-md ${
                  isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
                }`}
              >
                {valuePrefix}
                {item.value.toLocaleString()}
              </div>

              {/* Bar */}
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full max-w-[42px] rounded-t-xl transition-all duration-300 ${barColor} ${
                  isHovered ? "brightness-110 shadow-md scale-x-105" : "opacity-90 hover:opacity-100"
                }`}
              ></div>

              {/* Label */}
              <span className="mt-2 text-3xs font-bold text-gray-500 truncate max-w-[50px] text-center">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
