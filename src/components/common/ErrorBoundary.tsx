import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Reusable Error Boundary component to prevent whole-app crashes
 * and present a clean fallback UI with retry/reload capabilities.
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an unhandled application error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 bg-emerald-50/20 font-sans">
          <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <h2 className="text-xl font-extrabold text-gray-900">
              Something went wrong
            </h2>
            <p className="mt-2 text-xs text-gray-500 max-w-xs mx-auto">
              {this.state.error?.message || "An unexpected error occurred while loading this view."}
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-all cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Reload Page</span>
              </button>

              <a
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
