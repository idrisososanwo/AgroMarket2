import { Link } from "react-router-dom";
import { Leaf, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50/50 px-4 text-center">
      <div className="flex items-center gap-2 text-2xl font-bold text-emerald-800 mb-8">
        <Leaf className="h-7 w-7 text-emerald-600 fill-emerald-600/10" />
        <span>AgroMarket</span>
      </div>

      <div className="relative">
        <span className="text-9xl font-extrabold text-emerald-100 select-none font-mono">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-black text-emerald-950 font-sans tracking-wide">
            Harvest Missing
          </span>
        </div>
      </div>

      <h2 className="mt-6 text-xl font-bold text-gray-900 font-sans">
        Wandered off the field?
      </h2>
      <p className="mt-2 text-sm text-gray-500 font-sans max-w-sm leading-normal">
        The page you are looking for has either been harvested, moved, or never sprouted in our database.
      </p>

      <div className="mt-10">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-emerald-700 hover:shadow-lg transition-all font-sans cursor-pointer"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
          <span>Return to Marketplace</span>
        </Link>
      </div>
    </div>
  );
}
