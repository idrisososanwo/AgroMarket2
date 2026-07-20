import { useState } from "react";

export interface PieChartSlice {
  label: string;
  value: number;
  color: string;
}

interface AnalyticsPieChartProps {
  data: PieChartSlice[];
  title?: string;
}

export default function AnalyticsPieChart({ data }: AnalyticsPieChartProps) {
  const [hoveredSlice, setHoveredSlice] = useState<PieChartSlice | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-xs text-gray-400 font-sans">
        No distribution data available
      </div>
    );
  }

  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const radius = 40;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;

  // Pure functional precalculation of cumulative angles without outer variable mutation
  const slicesWithOffsets = data.map((slice, index) => {
    const percentage = slice.value / total;
    const previousOffset = data
      .slice(0, index)
      .reduce((sum, item) => sum + item.value / total, 0);

    return {
      ...slice,
      percentage,
      strokeDasharray: `${percentage * circumference} ${circumference}`,
      strokeDashoffset: -previousOffset * circumference,
    };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 font-sans">
      {/* Donut SVG */}
      <div className="relative h-44 w-44 shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90 transform">
          {slicesWithOffsets.map((slice, index) => {
            const isHovered = hoveredSlice?.label === slice.label;

            return (
              <circle
                key={index}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
                strokeDasharray={slice.strokeDasharray}
                strokeDashoffset={slice.strokeDashoffset}
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredSlice(slice)}
                onMouseLeave={() => setHoveredSlice(null)}
              />
            );
          })}
        </svg>

        {/* Center Donut Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          {hoveredSlice ? (
            <>
              <span className="text-3xs font-extrabold uppercase text-gray-400">{hoveredSlice.label}</span>
              <span className="text-base font-extrabold text-gray-900">
                {Math.round((hoveredSlice.value / total) * 100)}%
              </span>
            </>
          ) : (
            <>
              <span className="text-3xs font-extrabold uppercase text-gray-400">Total Items</span>
              <span className="text-base font-extrabold text-gray-900">{total}</span>
            </>
          )}
        </div>
      </div>

      {/* Legend Column */}
      <div className="flex-1 space-y-2.5 w-full">
        {data.map((slice, index) => {
          const pct = Math.round((slice.value / total) * 100);
          const isHovered = hoveredSlice?.label === slice.label;

          return (
            <div
              key={index}
              onMouseEnter={() => setHoveredSlice(slice)}
              onMouseLeave={() => setHoveredSlice(null)}
              className={`flex items-center justify-between rounded-xl p-2 text-xs transition-all cursor-pointer ${
                isHovered ? "bg-gray-100 font-bold" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: slice.color }}></span>
                <span className="text-gray-700 truncate font-semibold">{slice.label}</span>
              </div>
              <span className="text-gray-900 font-extrabold ml-2">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
