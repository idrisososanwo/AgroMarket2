export default function ProductSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-xs animate-pulse"
        >
          <div>
            <div className="mb-4 h-48 w-full rounded-xl bg-gray-100"></div>
            <div className="mb-2 h-4 w-1/3 rounded-md bg-gray-100"></div>
            <div className="mb-2 h-6 w-3/4 rounded-md bg-gray-100"></div>
            <div className="h-4 w-1/2 rounded-md bg-gray-100"></div>
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
            <div className="h-6 w-20 rounded-md bg-gray-100"></div>
            <div className="h-10 w-28 rounded-xl bg-gray-100"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
