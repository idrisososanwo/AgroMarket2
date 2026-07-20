import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";
import { Users, BarChart3, Shield, Ban, Settings, Activity } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user } = useAuth();
  const email = user?.email || "admin@agromarket.com";

  const handleSystemMaintenance = () => {
    toast.info("Maintenance simulation activated. Platform services are running normally.");
  };

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest font-sans">
              System Admin
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-1 font-sans">
              Control Panel
            </h1>
            <p className="text-sm text-gray-500 font-sans mt-0.5">
              Monitor AgroMarket platform activity, inspect dispute logs, and review platform-wide sales volume.
            </p>
          </div>
          <button
            onClick={handleSystemMaintenance}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-emerald-700 transition-all font-sans cursor-pointer self-start"
          >
            <Settings className="h-4.5 w-4.5" />
            <span>Platform Settings</span>
          </button>
        </div>

        {/* Admin Dashboard Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          {[
            { label: "Total Platform Users", value: "328", icon: Users, color: "bg-blue-500" },
            { label: "Active Listings", value: "1,452", icon: BarChart3, color: "bg-emerald-500" },
            { label: "Pending Disputes", value: "0", icon: Shield, color: "bg-amber-500" },
            { label: "System Health", value: "100%", icon: Activity, color: "bg-indigo-500" },
          ].map((stat, idx) => (
            <div key={idx} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex items-center gap-4">
              <div className={`rounded-xl p-3 text-white ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-400 font-sans">{stat.label}</p>
                <h3 className="text-2xl font-extrabold text-gray-900 mt-0.5">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Administration Controls */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Platform Activity Panel */}
          <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-600" /> Platform Transaction Logs
            </h2>
            <div className="space-y-4">
              {[
                { log: "New seller 'Hillside Orchard' registration approved", time: "10 mins ago" },
                { log: "Escrow funds released for order #AG-101 ($94.50)", time: "2 hours ago" },
                { log: "Database index maintenance completed", time: "5 hours ago" },
                { log: "System warning resolved: Courier webhook API latency", time: "1 day ago" },
              ].map((activity, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-50 pb-3 last:border-b-0 last:pb-0">
                  <span className="text-gray-700 font-sans">{activity.log}</span>
                  <span className="text-xs text-gray-400 font-sans">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Profile */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-600" /> Security Officer
            </h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-lg font-bold">
                A
              </div>
              <div>
                <h3 className="font-bold text-gray-800 leading-none">AgroMarket Security</h3>
                <span className="text-xs text-gray-400 font-sans block mt-1">{email}</span>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => toast.success("Security token rotation simulation initialized.")}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
              >
                <span>Rotate Access Keys</span>
              </button>
              <button
                onClick={() => toast.error("Simulated block request sent.")}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-50 py-3 text-sm font-semibold text-red-700 hover:bg-red-100 transition-all cursor-pointer"
              >
                <Ban className="h-4 w-4" />
                <span>Deactivate Accounts</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
