interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`animate-pulse rounded-2xl bg-gray-200/80 ${className}`} />;
}

export function ProductDetailsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 font-sans space-y-8 animate-pulse">
      <div className="h-6 w-48 rounded-md bg-gray-200"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="h-[400px] w-full rounded-3xl bg-gray-200"></div>
        <div className="space-y-6">
          <div className="h-8 w-3/4 rounded-lg bg-gray-200"></div>
          <div className="h-6 w-1/3 rounded-lg bg-gray-200"></div>
          <div className="h-24 w-full rounded-2xl bg-gray-200"></div>
          <div className="h-14 w-full rounded-2xl bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
}

export function ReviewSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4 font-sans">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-2xs animate-pulse space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-4 w-32 rounded-md bg-gray-200"></div>
            <div className="h-4 w-20 rounded-md bg-gray-200"></div>
          </div>
          <div className="h-4 w-1/2 rounded-md bg-gray-200"></div>
          <div className="h-12 w-full rounded-xl bg-gray-200"></div>
        </div>
      ))}
    </div>
  );
}

export function OrderSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4 font-sans">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-3xl border border-gray-100 bg-white p-6 shadow-2xs animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="h-5 w-36 rounded-md bg-gray-200"></div>
            <div className="h-6 w-24 rounded-full bg-gray-200"></div>
          </div>
          <div className="h-16 w-full rounded-2xl bg-gray-200"></div>
          <div className="flex items-center justify-between pt-2">
            <div className="h-4 w-28 rounded-md bg-gray-200"></div>
            <div className="h-6 w-24 rounded-lg bg-gray-200"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
