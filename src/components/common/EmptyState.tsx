import { SearchX, RotateCcw } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
}

export default function EmptyState({
  title = "No products found",
  description = "Try adjusting your search query or filters to find what you are looking for.",
  onReset,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-emerald-50/20 py-16 px-4 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100/60 text-emerald-600">
        <SearchX className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 font-sans">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-gray-500 font-sans leading-relaxed">
        {description}
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-all font-sans cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset All Filters</span>
        </button>
      )}
    </div>
  );
}
