import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface PublicRouteProps {
  children?: React.ReactNode;
  redirectTo?: string;
}

export default function PublicRoute({ children, redirectTo = "/" }: PublicRouteProps) {
  const { session, loading } = useAuth();

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

  if (session) {
    return <Navigate to={redirectTo} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

