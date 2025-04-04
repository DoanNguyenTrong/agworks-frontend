
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";

interface ProtectedRouteProps { 
  allowedRoles?: string[];
  children?: React.ReactNode;
}

export const ProtectedRoute = ({ allowedRoles, children }: ProtectedRouteProps) => {
  const { currentUser, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect based on role
    if (currentUser.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else if (currentUser.role === "customer") {
      return <Navigate to="/customer/dashboard" />;
    } else if (currentUser.role === "siteManager") {
      return <Navigate to="/manager/dashboard" />;
    } else {
      return <Navigate to="/worker/dashboard" />;
    }
  }
  
  // Return children if provided, otherwise fallback to Outlet
  return children ? <>{children}</> : <Outlet />;
};
