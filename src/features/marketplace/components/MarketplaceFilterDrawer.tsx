import { X, Filter, RotateCcw } from "lucide-react";
import MarketplaceFilterSidebar, { type FilterState } from "./MarketplaceFilterSidebar";

interface MarketplaceFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
  resultCount: number;
}

export default function MarketplaceFilterDrawer({
  isOpen,
  onClose,
  filters,
  onChange,
  onReset,
  resultCount,
}: MarketplaceFilterDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs font-sans lg:hidden">
      <div className="relative w-full max-w-xs sm:max-w-sm h-full bg-white p-6 shadow-2xl overflow-y-auto flex flex-col justify-between">
        {/* Drawer Header */}
        <div>
          <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-emerald-600" />
              <h3 className="text-lg font-extrabold text-gray-900">Filter Products</h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Sidebar controls re-used in drawer */}
          <MarketplaceFilterSidebar
            filters={filters}
            onChange={onChange}
            onReset={onReset}
          />
        </div>

        {/* Drawer Footer CTA */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 pt-4 mt-6 flex items-center gap-3">
          <button
            onClick={() => {
              onReset();
            }}
            className="flex-1 rounded-xl border border-gray-200 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 font-sans cursor-pointer flex items-center justify-center gap-1"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset All</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md hover:bg-emerald-700 font-sans cursor-pointer"
          >
            Show {resultCount} Results
          </button>
        </div>
      </div>
    </div>
  );
}
