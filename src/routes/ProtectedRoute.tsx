import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRole?: "buyer" | "seller" | "admin";
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  allowedRole,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { session, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-emerald-50/20">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-emerald-700 animate-pulse">Loading AgroMarket...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  if (allowedRole) {
    const userRole = user?.user_metadata?.role;
    if (userRole && userRole !== allowedRole) {
      if (userRole === "admin") {
        return <Navigate to="/admin" replace />;
      } else if (userRole === "seller") {
        return <Navigate to="/seller" replace />;
      } else {
        return <Navigate to="/buyer" replace />;
      }
    }
  }

  return children ? <>{children}</> : <Outlet />;
}

