import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");

  if (!token) {
    // kalau tidak ada token → redirect ke login
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
