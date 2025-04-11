
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requireAdmin?: boolean;
};

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { user, isLoading, isAdmin } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Return a loading state while checking authentication
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="wirashna-loader"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    // Redirect to home if not an admin
    return <Navigate to="/" replace />;
  }

  // User is authenticated (and is admin if required)
  return <>{children}</>;
};

export default ProtectedRoute;
