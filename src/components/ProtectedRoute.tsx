import { useAuth } from "@/contexts/AuthContext";
import { MAP_ROLE } from "@/lib/utils/role";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children?: React.ReactNode;
}

export const ProtectedRoute = ({
  allowedRoles,
  children,
}: ProtectedRouteProps) => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect based on role
    if (currentUser.role === MAP_ROLE.ADMIN) {
      return <Navigate to="/admin/dashboard" />;
    } else if (currentUser.role === MAP_ROLE.CUSTOIMER) {
      return <Navigate to="/customer/dashboard" />;
    } else if (currentUser.role === MAP_ROLE.SITE_MANAGER) {
      return <Navigate to="/manager/dashboard" />;
    } else {
      return <Navigate to="/worker/dashboard" />;
    }
  }

  // Return children if provided, otherwise fallback to Outlet
  return children ? <>{children}</> : <Outlet />;
};
