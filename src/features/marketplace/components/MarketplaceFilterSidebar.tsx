import { CATEGORIES } from "../../../lib/constants";
import { Filter, RotateCcw, MapPin, Star, Sparkles, CheckCircle2 } from "lucide-react";

export interface FilterState {
  category: string;
  location: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock: boolean;
  featured: boolean;
}

interface MarketplaceFilterSidebarProps {
  filters: FilterState;
  onChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
}

const NIGERIAN_LOCATIONS = [
  { id: "", name: "All States & Locations" },
  { id: "Kano", name: "Kano State" },
  { id: "Benue", name: "Benue State (Gboko/Makurdi)" },
  { id: "Jos", name: "Plateau State (Jos)" },
  { id: "Oyo", name: "Oyo State (Ogbomoso/Ibadan)" },
  { id: "Kaduna", name: "Kaduna State" },
  { id: "Enugu", name: "Enugu State (Nsukka)" },
  { id: "Lagos", name: "Lagos State" },
  { id: "Ogun", name: "Ogun State" },
  { id: "Borno", name: "Borno State" },
  { id: "Akwa Ibom", name: "Akwa Ibom State (Oron)" },
];

export default function MarketplaceFilterSidebar({
  filters,
  onChange,
  onReset,
}: MarketplaceFilterSidebarProps) {
  const handlePricePreset = (min?: number, max?: number) => {
    onChange({ minPrice: min, maxPrice: max });
  };

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-6 font-sans">
      <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-xs space-y-6 sticky top-24">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2 text-gray-900 font-extrabold text-sm">
            <Filter className="h-4 w-4 text-emerald-600" />
            <span>Filter Harvests</span>
          </div>

          <button
            onClick={onReset}
            className="flex items-center gap-1 text-2xs font-bold text-gray-400 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        </div>

        {/* 1. Category Filter */}
        <div className="space-y-2.5">
          <label className="block text-2xs font-extrabold uppercase tracking-wider text-gray-400">
            Categories
          </label>
          <div className="space-y-1">
            <button
              onClick={() => onChange({ category: "" })}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
                filters.category === ""
                  ? "bg-emerald-50 text-emerald-800"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span>🌾 All Produce</span>
            </button>

            {CATEGORIES.map((cat) => {
              const isSelected = filters.category === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onChange({ category: isSelected ? "" : cat.id })}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-emerald-50 text-emerald-800 font-bold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Origin State / Location */}
        <div className="space-y-2.5 border-t border-gray-100 pt-5">
          <label className="block text-2xs font-extrabold uppercase tracking-wider text-gray-400 flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-emerald-600" />
            <span>Origin State</span>
          </label>
          <select
            value={filters.location}
            onChange={(e) => onChange({ location: e.target.value })}
            className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs font-bold text-gray-700 focus:border-emerald-500 focus:outline-none cursor-pointer"
          >
            {NIGERIAN_LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Price Range (Naira) */}
        <div className="space-y-3 border-t border-gray-100 pt-5">
          <label className="block text-2xs font-extrabold uppercase tracking-wider text-gray-400">
            Price Range (₦)
          </label>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-3xs font-bold text-gray-400 block mb-1">MIN PRICE</span>
              <input
                type="number"
                placeholder="₦0"
                value={filters.minPrice ?? ""}
                onChange={(e) =>
                  onChange({ minPrice: e.target.value ? Number(e.target.value) : undefined })
                }
                className="w-full rounded-xl border border-gray-200 p-2 text-xs font-semibold text-gray-900 focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <span className="text-3xs font-bold text-gray-400 block mb-1">MAX PRICE</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice ?? ""}
                onChange={(e) =>
                  onChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined })
                }
                className="w-full rounded-xl border border-gray-200 p-2 text-xs font-semibold text-gray-900 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Price Presets */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <button
              onClick={() => handlePricePreset(undefined, 15000)}
              className="rounded-lg bg-gray-100 px-2 py-1 text-3xs font-bold text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              &lt; ₦15,000
            </button>
            <button
              onClick={() => handlePricePreset(15000, 50000)}
              className="rounded-lg bg-gray-100 px-2 py-1 text-3xs font-bold text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              ₦15k – ₦50k
            </button>
            <button
              onClick={() => handlePricePreset(50000, 100000)}
              className="rounded-lg bg-gray-100 px-2 py-1 text-3xs font-bold text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              ₦50k – ₦100k
            </button>
            <button
              onClick={() => handlePricePreset(100000, undefined)}
              className="rounded-lg bg-gray-100 px-2 py-1 text-3xs font-bold text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              &gt; ₦100,000
            </button>
          </div>
        </div>

        {/* 4. Minimum Rating Filter */}
        <div className="space-y-2 border-t border-gray-100 pt-5">
          <label className="block text-2xs font-extrabold uppercase tracking-wider text-gray-400 flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-400" />
            <span>Minimum Rating</span>
          </label>

          <div className="space-y-1.5">
            {[
              { val: undefined, label: "All Ratings" },
              { val: 4.5, label: "4.5★ & above" },
              { val: 4.0, label: "4.0★ & above" },
              { val: 3.5, label: "3.5★ & above" },
            ].map((option) => (
              <label
                key={option.label}
                className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer hover:text-emerald-700"
              >
                <input
                  type="radio"
                  name="minRating"
                  checked={filters.minRating === option.val}
                  onChange={() => onChange({ minRating: option.val })}
                  className="accent-emerald-600"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 5. Availability & Special Flags */}
        <div className="space-y-3 border-t border-gray-100 pt-5">
          <label className="block text-2xs font-extrabold uppercase tracking-wider text-gray-400">
            Availability & Status
          </label>

          <label className="flex items-center gap-2.5 text-xs font-bold text-gray-700 cursor-pointer hover:text-emerald-700">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => onChange({ inStock: e.target.checked })}
              className="h-4 w-4 rounded-md accent-emerald-600 cursor-pointer"
            />
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              In Stock Only
            </span>
          </label>

          <label className="flex items-center gap-2.5 text-xs font-bold text-gray-700 cursor-pointer hover:text-emerald-700">
            <input
              type="checkbox"
              checked={filters.featured}
              onChange={(e) => onChange({ featured: e.target.checked })}
              className="h-4 w-4 rounded-md accent-emerald-600 cursor-pointer"
            />
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-rose-500" />
              Top Featured Harvests
            </span>
          </label>
        </div>
      </div>
    </aside>
  );
}
