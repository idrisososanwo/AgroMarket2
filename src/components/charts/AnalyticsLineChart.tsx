import { useState } from "react";

export interface LineChartPoint {
  label: string;
  value: number;
}

interface AnalyticsLineChartProps {
  data: LineChartPoint[];
  height?: number;
  valuePrefix?: string;
  color?: string;
}

export default function AnalyticsLineChart({
  data,
  height = 220,
  valuePrefix = "",
  color = "#10b981", // emerald-500
}: AnalyticsLineChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{ point: LineChartPoint; x: number; y: number } | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-xs text-gray-400 font-sans">
        No sales data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const padding = 35;
  const chartWidth = 500;
  const chartHeight = height;

  const points = data.map((d, index) => {
    const x = padding + (index / (data.length - 1 || 1)) * (chartWidth - padding * 2);
    const y = chartHeight - padding - (d.value / maxValue) * (chartHeight - padding * 2);
    return { x, y, point: d };
  });

  // Construct SVG path string
  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  // Area path for gradient fill under line
  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`;

  return (
    <div className="relative w-full overflow-hidden font-sans">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-auto max-h-[240px] overflow-visible"
      >
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal Gridlines */}
        {[0, 0.33, 0.66, 1].map((ratio, i) => {
          const y = chartHeight - padding - ratio * (chartHeight - padding * 2);
          const val = Math.round(ratio * maxValue);
          return (
            <g key={i}>
              <line
                x1={padding}
                y1={y}
                x2={chartWidth - padding}
                y2={y}
                stroke="#f3f4f6"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={padding - 8}
                y={y + 3}
                fill="#9ca3af"
                fontSize="9"
                textAnchor="end"
                fontWeight="600"
              >
                {valuePrefix}{val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
              </text>
            </g>
          );
        })}

        {/* Filled Area */}
        <path d={areaD} fill="url(#lineGrad)" />

        {/* Smooth Line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data Interactive Dots */}
        {points.map((p, i) => (
          <g key={i} className="cursor-pointer">
            <circle
              cx={p.x}
              cy={p.y}
              r="5"
              fill="#ffffff"
              stroke={color}
              strokeWidth="3"
              className="transition-all hover:r-7"
              onMouseEnter={() => setHoveredPoint(p)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
            {/* X Axis Labels */}
            <text
              x={p.x}
              y={chartHeight - 10}
              fill="#6b7280"
              fontSize="10"
              fontWeight="700"
              textAnchor="middle"
            >
              {p.point.label}
            </text>
          </g>
        ))}
      </svg>

      {/* Interactive Tooltip Card */}
      {hoveredPoint && (
        <div
          className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-12 rounded-xl bg-gray-900 px-3 py-1.5 text-3xs text-white shadow-xl border border-gray-800"
          style={{
            left: `${(hoveredPoint.x / chartWidth) * 100}%`,
            top: `${(hoveredPoint.y / chartHeight) * 100}%`,
          }}
        >
          <div className="font-extrabold text-emerald-400">{hoveredPoint.point.label}</div>
          <div>
            Value: {valuePrefix}
            {hoveredPoint.point.value.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
