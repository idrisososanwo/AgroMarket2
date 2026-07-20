import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { Leaf, Lock, Mail, User as UserIcon, Eye, EyeOff, Store, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

type UserRole = "buyer" | "seller";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("buyer");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          full_name: name,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    // Supabase returns a user session if email confirmation is disabled.
    // If confirmation is enabled, it sends an email.
    if (data.session) {
      toast.success(`Account created! Welcome, ${name}`);
      navigate(role === "seller" ? "/seller" : "/buyer", { replace: true });
    } else {
      toast.success("Registration successful! Please check your email to verify your account.");
      navigate("/login");
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
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-500 font-sans">
              Or{" "}
              <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-500">
                sign in to your existing account
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 font-sans">
                  Full Name / Farm Name
                </label>
                <div className="relative mt-1.5 rounded-md shadow-sm">
                  <UserIcon className="pointer-events-none absolute top-3 left-3.5 h-5 w-5 text-gray-400" />
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full rounded-xl border border-gray-200 py-3 pr-4 pl-11 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-sans sm:text-sm"
                    placeholder="John Doe or Sunny Farm"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 font-sans">
                  Email address
                </label>
                <div className="relative mt-1.5 rounded-md shadow-sm">
                  <Mail className="pointer-events-none absolute top-3 left-3.5 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
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
                    type={showPassword ? "text" : "password"}
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

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 font-sans mb-2">
                  Select Your Account Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setRole("buyer")}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all cursor-pointer ${
                      role === "buyer"
                        ? "border-emerald-500 bg-emerald-50/50 text-emerald-800 ring-2 ring-emerald-500/20"
                        : "border-gray-200 bg-white hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    <UserIcon className={`h-6 w-6 mb-1.5 ${role === "buyer" ? "text-emerald-600" : "text-gray-400"}`} />
                    <span className="text-sm font-bold font-sans">Buyer</span>
                    <span className="text-[10px] text-gray-400 font-sans mt-0.5 text-center leading-normal">
                      Purchase fresh goods
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("seller")}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all cursor-pointer ${
                      role === "seller"
                        ? "border-emerald-500 bg-emerald-50/50 text-emerald-800 ring-2 ring-emerald-500/20"
                        : "border-gray-200 bg-white hover:bg-gray-50 text-gray-600"
                    }`}
                  >
                    <Store className={`h-6 w-6 mb-1.5 ${role === "seller" ? "text-emerald-600" : "text-gray-400"}`} />
                    <span className="text-sm font-bold font-sans">Seller / Farmer</span>
                    <span className="text-[10px] text-gray-400 font-sans mt-0.5 text-center leading-normal">
                      Sell agricultural produce
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white shadow-md hover:bg-emerald-700 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {loading ? "Registering account..." : "Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Decorative Image Side */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-950 flex flex-col justify-center px-16 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(16,185,129,0.1),transparent)]"></div>
          <div className="relative max-w-lg">
            <h2 className="text-4xl font-extrabold tracking-tight font-sans">
              Join the Agricultural Revolution.
            </h2>
            <p className="mt-4 text-emerald-100/70 font-sans">
              Create an account to gain full access to transparent, direct trade. Set up shop or browse real-time crop yields from local suppliers.
            </p>
            <div className="mt-8 flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-300">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <p className="text-xs font-sans leading-normal">
                By signing up, you agree to our direct trade guidelines, ensuring fair treatment and quality standards for all parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
