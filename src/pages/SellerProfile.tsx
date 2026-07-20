import { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import ProductCard from "../components/common/ProductCard";
import ProductSkeleton from "../components/common/ProductSkeleton";
import ErrorState from "../components/common/ErrorState";
import SellerContactModal from "../features/seller/components/SellerContactModal";
import { useSellerProfile, useSellerPublicProducts } from "../hooks/useSellerProfile";
import {
  ShieldCheck,
  MapPin,
  Calendar,
  Star,
  Package,
  ShoppingBag,
  UserPlus,
  UserCheck,
  Search,
  ArrowUpDown,
  Phone,
  ArrowLeft,
  Store,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import { useDebounce } from "../hooks/useDebounce";

export default function SellerProfile() {
  const { sellerId } = useParams<{ sellerId: string }>();

  // Interactive follow state with localStorage persistence
  const [isFollowing, setIsFollowing] = useState<boolean>(() => {
    if (!sellerId) return false;
    const stored = localStorage.getItem("agromarket_following_sellers");
    if (!stored) return false;
    try {
      const list: string[] = JSON.parse(stored);
      return list.includes(sellerId);
    } catch {
      return false;
    }
  });

  const [isContactOpen, setIsContactOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 250);
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc" | "rating">("newest");
  const [visibleCount, setVisibleCount] = useState(6);

  const { data: seller, isLoading: isProfileLoading, isError: isProfileError, refetch: refetchProfile } = useSellerProfile(sellerId);

  const productQueryParams = useMemo(
    () => ({
      searchQuery: debouncedSearch || undefined,
      sortBy,
    }),
    [debouncedSearch, sortBy]
  );

  const {
    data: sellerProducts = [],
    isLoading: isProductsLoading,
  } = useSellerPublicProducts(sellerId, productQueryParams);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [sellerId]);

  const handleToggleFollow = () => {
    if (!sellerId || !seller) return;
    const stored = localStorage.getItem("agromarket_following_sellers");
    let list: string[] = [];
    if (stored) {
      try {
        list = JSON.parse(stored);
      } catch {
        list = [];
      }
    }

    if (isFollowing) {
      list = list.filter((id) => id !== sellerId);
      localStorage.setItem("agromarket_following_sellers", JSON.stringify(list));
      setIsFollowing(false);
      toast.info(`Unfollowed ${seller.name}`);
    } else {
      list.push(sellerId);
      localStorage.setItem("agromarket_following_sellers", JSON.stringify(list));
      setIsFollowing(true);
      toast.success(`You are now following ${seller.name}!`);
    }
  };

  const paginatedProducts = sellerProducts.slice(0, visibleCount);
  const hasMore = sellerProducts.length > visibleCount;

  if (isProfileLoading) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
          <div className="h-64 w-full animate-pulse rounded-3xl bg-gray-200"></div>
          <ProductSkeleton count={6} />
        </div>
      </Layout>
    );
  }

  if (isProfileError || !seller) {
    return (
      <Layout>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
          <ErrorState
            message="Seller profile could not be found or has been deactivated."
            onRetry={refetchProfile}
          />
          <div className="mt-6">
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 font-sans"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Return to Marketplace</span>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Cover Banner Header */}
      <section className="relative bg-emerald-950 text-white pb-12 pt-8">
        <div className="absolute inset-0 bg-cover bg-center opacity-25" style={{ backgroundImage: `url(${seller.banner_url})` }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/80 to-transparent"></div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <div className="mb-6 flex items-center gap-2 text-xs text-emerald-200 font-sans">
            <Link to="/marketplace" className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Marketplace</span>
            </Link>
            <span>/</span>
            <span className="text-white font-bold">{seller.name}</span>
          </div>

          {/* Seller Profile Header Card */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 rounded-3xl border border-white/10 bg-white/10 p-6 sm:p-8 backdrop-blur-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Profile Avatar / Photo */}
              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white p-1 shadow-xl overflow-hidden border-2 border-emerald-400">
                <img
                  src={seller.avatar_url}
                  alt={seller.name}
                  className="h-full w-full rounded-xl object-cover"
                />
              </div>

              {/* Name & Metadata */}
              <div className="space-y-2 font-sans">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {seller.name}
                  </h1>
                  {seller.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-0.5 text-3xs font-extrabold text-emerald-300">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Verified Producer</span>
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl leading-relaxed">
                  {seller.bio}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-200/80 pt-1">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{seller.location}</span>
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Member since {seller.joined_date}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Interaction Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/10">
              <button
                onClick={handleToggleFollow}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all cursor-pointer shadow-sm font-sans ${
                  isFollowing
                    ? "bg-white/20 text-white hover:bg-white/30 border border-white/30"
                    : "bg-white text-emerald-950 hover:bg-emerald-50"
                }`}
              >
                {isFollowing ? <UserCheck className="h-4 w-4 text-emerald-300" /> : <UserPlus className="h-4 w-4 text-emerald-700" />}
                <span>{isFollowing ? "Following Farmer" : "Follow Farmer"}</span>
              </button>

              <button
                onClick={() => setIsContactOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-emerald-950 hover:bg-emerald-400 transition-all cursor-pointer shadow-md font-sans"
              >
                <Phone className="h-4 w-4" />
                <span>Contact Seller</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Seller Statistics Cards */}
      <section className="mx-auto max-w-7xl px-4 -mt-6 sm:px-6 lg:px-8 relative z-10 font-sans">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stat 1: Active Listings */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-3xs font-extrabold uppercase tracking-wider text-gray-400">Active Listings</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Package className="h-4 w-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-gray-900">{seller.active_products}</div>
            <p className="text-3xs text-gray-400">Fresh crops in stock</p>
          </div>

          {/* Stat 2: Total Sales */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-3xs font-extrabold uppercase tracking-wider text-gray-400">Fulfilled Orders</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <ShoppingBag className="h-4 w-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-gray-900">{seller.completed_sales}+</div>
            <p className="text-3xs text-gray-400">Deliveries to buyers</p>
          </div>

          {/* Stat 3: Average Rating */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-3xs font-extrabold uppercase tracking-wider text-gray-400">Average Rating</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                <Star className="h-4 w-4 fill-amber-400" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-gray-900 flex items-center gap-1">
              <span>{seller.rating.toFixed(1)}</span>
              <span className="text-xs text-amber-500 font-normal">★</span>
            </div>
            <p className="text-3xs text-gray-400">From {seller.total_reviews} reviews</p>
          </div>

          {/* Stat 4: Experience */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-3xs font-extrabold uppercase tracking-wider text-gray-400">Producer Status</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-gray-900">Verified</div>
            <p className="text-3xs text-gray-400">{seller.years_on_platform}</p>
          </div>
        </div>
      </section>

      {/* Seller Products Section */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 font-sans">
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
              <Store className="h-5 w-5 text-emerald-600" />
              <span>{seller.name}'s Farm Harvests</span>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                {sellerProducts.length}
              </span>
            </h2>
            <p className="text-xs text-gray-500">
              Browse all direct produce listings offered by this certified farmer.
            </p>
          </div>

          {/* Search & Sort controls for Seller Inventory */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="pointer-events-none absolute top-3 left-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search seller's inventory..."
                className="w-full sm:w-64 rounded-xl border border-gray-200 py-2 pr-8 pl-9 text-xs text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700">
              <ArrowUpDown className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-transparent font-bold text-gray-900 focus:outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid / States */}
        {isProductsLoading ? (
          <ProductSkeleton count={6} />
        ) : sellerProducts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50/50 p-12 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Package className="h-7 w-7" />
            </div>
            <h3 className="text-base font-extrabold text-gray-900">No Produce Listings Found</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {searchInput
                ? `No items match "${searchInput}". Try clearing your search term.`
                : `${seller.name} has no active produce listings right now.`}
            </p>
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="mt-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} searchQuery={debouncedSearch} />
              ))}
            </div>

            {/* Pagination / Load More Button */}
            {hasMore && (
              <div className="text-center pt-4">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="rounded-xl border border-emerald-600 bg-emerald-50 px-6 py-3 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-all font-sans cursor-pointer shadow-2xs"
                >
                  Load More Produce ({sellerProducts.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Contact Seller Modal */}
      <SellerContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        seller={seller}
      />
    </Layout>
  );
}
