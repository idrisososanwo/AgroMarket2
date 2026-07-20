import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Leaf, Lock, Mail, Eye, EyeOff, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success("Welcome back to AgroMarket!");
    const role = data.user?.user_metadata?.role;
    if (role === "seller") {
      navigate("/seller", { replace: true });
    } else if (role === "buyer") {
      navigate("/buyer", { replace: true });
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Form Section */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-emerald-800">
              <Leaf className="h-7 w-7 text-emerald-600 fill-emerald-600/10" />
              <span>AgroMarket</span>
            </Link>
            <h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900 font-sans">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-500 font-sans">
              Or{" "}
              <Link to="/register" className="font-semibold text-emerald-600 hover:text-emerald-500">
                create a new farm/buyer account
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 font-sans">
                  Email address
                </label>
                <div className="relative mt-1.5 rounded-md shadow-sm">
                  <Mail className="pointer-events-none absolute top-3 left-3.5 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl border border-gray-200 py-3 pr-4 pl-11 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans sm:text-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 font-sans">
                  Password
                </label>
                <div className="relative mt-1.5 rounded-md shadow-sm">
                  <Lock className="pointer-events-none absolute top-3 left-3.5 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border border-gray-200 py-3 pr-10 pl-11 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans sm:text-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-500 font-sans">
                    Remember me
                  </label>
                </div>

                <div className="text-xs">
                  <a href="#" className="font-semibold text-emerald-600 hover:text-emerald-500 font-sans">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Decorative Image Side */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950 via-emerald-800 to-green-950 flex flex-col justify-center px-16 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(16,185,129,0.1),transparent)]"></div>
          <div className="relative max-w-lg">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-300 mb-6">
              <Sparkles className="h-3 w-3" /> Supporting local growers since 2026
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight font-sans">
              Grow Your Business. Buy Locally.
            </h2>
            <p className="mt-4 text-emerald-100/70 font-sans">
              AgroMarket connects farmers directly with commercial retailers and retail consumers. Log in to manage listings, track orders, or purchase fresh agricultural produce.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
