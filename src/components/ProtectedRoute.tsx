import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LoadingScreen } from "@/components/LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { loading, isAuthenticated, isAdmin } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If admin is required but user is not admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
