import React from "react";
import { SearchX, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  onReset?: () => void;
}

export default function EmptyState({
  title = "No produce items found",
  description = "Try adjusting your search query or filters to find what you are looking for.",
  icon,
  actionText,
  actionHref,
  onAction,
  onReset,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-emerald-50/20 py-16 px-4 text-center font-sans">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100/60 text-emerald-600">
        {icon || <SearchX className="h-8 w-8" />}
      </div>
      <h3 className="text-xl font-extrabold text-gray-900 font-sans">{title}</h3>
      <p className="mt-2 max-w-md text-xs sm:text-sm text-gray-500 font-sans leading-relaxed">
        {description}
      </p>

      {/* Action CTA */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onAction && actionText && (
          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-all font-sans cursor-pointer"
          >
            <span>{actionText}</span>
          </button>
        )}

        {actionHref && actionText && !onAction && (
          <Link
            to={actionHref}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-all font-sans cursor-pointer"
          >
            <span>{actionText}</span>
          </Link>
        )}

        {onReset && (
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-xs font-bold text-gray-700 shadow-2xs hover:bg-gray-50 transition-all font-sans cursor-pointer"
          >
            <RotateCcw className="h-4 w-4 text-emerald-600" />
            <span>Reset All Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
