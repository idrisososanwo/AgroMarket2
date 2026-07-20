import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = "Failed to load products. Please check your network connection.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-rose-100 bg-rose-50/30 py-16 px-4 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 font-sans">Something went wrong</h3>
      <p className="mt-2 max-w-md text-sm text-rose-700/80 font-sans leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-rose-700 transition-all font-sans cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
