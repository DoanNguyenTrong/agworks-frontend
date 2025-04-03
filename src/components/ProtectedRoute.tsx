
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps { 
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
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
  
  return <Outlet />;
};
