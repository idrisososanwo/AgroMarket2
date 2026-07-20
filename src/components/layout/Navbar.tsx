import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ShoppingCart, LogOut, Package, Store, Leaf, Heart } from "lucide-react";
import { toast } from "sonner";
import NotificationBell from "../../features/notifications/components/NotificationBell";
import { useWishlist } from "../../hooks/useWishlist";

export default function Navbar() {
  const { session, user, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: wishlist = [] } = useWishlist(user?.id);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully!");
    navigate("/");
  };

  const userRole = user?.user_metadata?.role;
  const wishlistCount = wishlist.length;

  return (
    <nav className="sticky top-0 z-50 border-b border-emerald-100 bg-white/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-emerald-800 font-sans">
              <Leaf className="h-6 w-6 text-emerald-600 fill-emerald-600/10" />
              <span>AgroMarket</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm font-semibold text-gray-600 hover:text-emerald-700 transition-colors font-sans">
                Marketplace
              </Link>
              {session && (
                <>
                  <Link to="/wishlist" className="text-sm font-semibold text-gray-600 hover:text-emerald-700 transition-colors font-sans">
                    Wishlist
                  </Link>
                  <Link to="/orders" className="text-sm font-semibold text-gray-600 hover:text-emerald-700 transition-colors font-sans">
                    My Orders
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {session && <NotificationBell />}

            {/* Wishlist Icon Header Link */}
            <Link
              to="/wishlist"
              title="View Wishlist"
              className="relative p-2 text-gray-600 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-2xs font-sans">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Header Link */}
            <Link
              to="/cart"
              title="View Cart"
              className="relative p-2 text-gray-600 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              <ShoppingCart className="h-5 w-5" />
            </Link>

            {session ? (
              <div className="flex items-center gap-3">
                <Link
                  to={userRole === "seller" ? "/seller" : "/buyer"}
                  className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200/60 hover:bg-emerald-100 transition-all font-sans"
                >
                  {userRole === "seller" ? (
                    <Store className="h-3.5 w-3.5" />
                  ) : (
                    <Package className="h-3.5 w-3.5" />
                  )}
                  <span className="capitalize">{userRole || "User"} Panel</span>
                </Link>
                <div className="hidden sm:block text-right">
                  <p className="text-xs text-gray-400 font-medium font-sans">Logged in as</p>
                  <p className="text-xs font-semibold text-gray-700 truncate max-w-[120px] font-sans">
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center justify-center rounded-xl border border-gray-200 p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-gray-600 hover:text-emerald-700 px-3 py-2 transition-colors font-sans"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 hover:shadow-md transition-all font-sans"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
