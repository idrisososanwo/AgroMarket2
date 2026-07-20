import { Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-emerald-100 bg-gray-50 py-8 text-center text-gray-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-emerald-800 font-bold">
          <Leaf className="h-5 w-5 text-emerald-600" />
          <span>AgroMarket</span>
        </div>
        <p className="text-sm font-sans">
          &copy; {new Date().getFullYear()} AgroMarket. All rights reserved. Connecting local growers directly with buyers.
        </p>
      </div>
    </footer>
  );
}
